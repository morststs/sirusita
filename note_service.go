package main

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/adrg/frontmatter"
	"github.com/google/uuid"
)

// sirusitaFormatVersion は front matter に埋め込む「sirusita 形式」識別子の値。
// この値が front matter に存在する場合、インポート時にタイトル・タグ・作成/更新日時を
// そのまま信頼して取り込む（[parseMarkdownImport] 参照）。将来の形式変更に備えて
// バージョン番号（文字列）にしている。
const sirusitaFormatVersion = "1"

type NoteMeta struct {
	ID       string   `json:"id" yaml:"-"`
	Title    string   `json:"title" yaml:"title"`
	Tags     []string `json:"tags" yaml:"tags"`
	Created  string   `json:"created" yaml:"created"`
	Modified string   `json:"modified" yaml:"modified"`
}

type Note struct {
	NoteMeta
	Body string `json:"body" yaml:"-"`
}

type NoteService struct {
	notesDir string
}

func NewNoteService(notesDir string) *NoteService {
	os.MkdirAll(notesDir, 0755)
	return &NoteService{notesDir: notesDir}
}

func (s *NoteService) CreateNote(title, body string, tags []string) (Note, error) {
	return s.CreateImported(title, body, tags, "", "")
}

// CreateImported は作成/更新日時を指定して新規メモを作成する（インポート用）。
// created / modified が空文字の場合は現在時刻を使う。sirusita 形式のマークダウンを
// 取り込むときに、元ファイルの作成/更新日時をそのまま保持するために使用する。
func (s *NoteService) CreateImported(title, body string, tags []string, created, modified string) (Note, error) {
	id := uuid.New().String()
	now := time.Now().Format(time.RFC3339)
	if strings.TrimSpace(created) == "" {
		created = now
	}
	if strings.TrimSpace(modified) == "" {
		modified = now
	}
	tags = normalizeTags(tags)
	meta := NoteMeta{ID: id, Title: title, Tags: tags, Created: created, Modified: modified}
	note := Note{NoteMeta: meta, Body: body}
	if err := s.writeNote(note); err != nil {
		return Note{}, fmt.Errorf("failed to write note: %w", err)
	}
	return note, nil
}

// NormalizeTag は階層タグ（"親/子"）を正規化する。
// "/" で区切った各セグメントの前後空白を除き、空セグメントを捨てて再結合する。
func NormalizeTag(tag string) string {
	var segs []string
	for _, seg := range strings.Split(tag, "/") {
		if seg = strings.TrimSpace(seg); seg != "" {
			segs = append(segs, seg)
		}
	}
	return strings.Join(segs, "/")
}

// normalizeTags は各タグを正規化し、空タグと重複を除く（出現順は保持）。
func normalizeTags(tags []string) []string {
	out := []string{}
	seen := make(map[string]bool)
	for _, tag := range tags {
		tag = NormalizeTag(tag)
		if tag == "" || seen[tag] {
			continue
		}
		seen[tag] = true
		out = append(out, tag)
	}
	return out
}

func (s *NoteService) writeNote(note Note) error {
	var content string
	content += "---\n"
	content += fmt.Sprintf("title: %q\n", note.Title)
	content += "tags:\n"
	for _, tag := range note.Tags {
		content += fmt.Sprintf("  - %q\n", tag)
	}
	content += fmt.Sprintf("created: %s\n", note.Created)
	content += fmt.Sprintf("modified: %s\n", note.Modified)
	content += fmt.Sprintf("sirusita: %q\n", sirusitaFormatVersion)
	content += "---\n\n"
	content += note.Body
	path := filepath.Join(s.notesDir, note.ID+".md")
	return os.WriteFile(path, []byte(content), 0644)
}

func isValidNoteID(id string) bool {
	if len(id) != 36 {
		return false
	}
	for _, c := range id {
		if !((c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || c == '-') {
			return false
		}
	}
	return true
}

func (s *NoteService) GetNote(id string) (Note, error) {
	if !isValidNoteID(id) {
		return Note{}, fmt.Errorf("invalid note ID: %s", id)
	}
	path := filepath.Join(s.notesDir, id+".md")
	data, err := os.ReadFile(path)
	if err != nil {
		return Note{}, fmt.Errorf("note not found: %s", id)
	}
	var meta NoteMeta
	body, err := frontmatter.Parse(bytes.NewReader(data), &meta)
	if err != nil {
		return Note{}, fmt.Errorf("failed to parse front matter: %w", err)
	}
	meta.ID = id
	meta.Tags = normalizeTags(meta.Tags)
	return Note{NoteMeta: meta, Body: strings.TrimSpace(string(body))}, nil
}

func (s *NoteService) ListNotes() ([]NoteMeta, error) {
	entries, err := os.ReadDir(s.notesDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read notes dir: %w", err)
	}
	var notes []NoteMeta
	for _, entry := range entries {
		if entry.IsDir() || filepath.Ext(entry.Name()) != ".md" {
			continue
		}
		id := strings.TrimSuffix(entry.Name(), ".md")
		note, err := s.GetNote(id)
		if err != nil {
			continue
		}
		notes = append(notes, note.NoteMeta)
	}
	sort.Slice(notes, func(i, j int) bool { return notes[i].Modified > notes[j].Modified })
	return notes, nil
}

func (s *NoteService) UpdateNote(id, title, body string, tags []string) (Note, error) {
	if !isValidNoteID(id) {
		return Note{}, fmt.Errorf("invalid note ID: %s", id)
	}
	existing, err := s.GetNote(id)
	if err != nil {
		return Note{}, err
	}
	now := time.Now().Format(time.RFC3339)
	note := Note{
		NoteMeta: NoteMeta{ID: id, Title: title, Tags: normalizeTags(tags), Created: existing.Created, Modified: now},
		Body:     body,
	}
	if err := s.writeNote(note); err != nil {
		return Note{}, fmt.Errorf("failed to update note: %w", err)
	}
	return note, nil
}

func (s *NoteService) DeleteNote(id string) error {
	if !isValidNoteID(id) {
		return fmt.Errorf("invalid note ID: %s", id)
	}
	path := filepath.Join(s.notesDir, id+".md")
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return fmt.Errorf("note not found: %s", id)
	}
	return os.Remove(path)
}

func (s *NoteService) ListTags() ([]string, error) {
	notes, err := s.ListNotes()
	if err != nil {
		return nil, err
	}
	tagSet := make(map[string]bool)
	for _, note := range notes {
		for _, tag := range note.Tags {
			tagSet[tag] = true
		}
	}
	var tags []string
	for tag := range tagSet {
		tags = append(tags, tag)
	}
	sort.Strings(tags)
	return tags, nil
}

// renameTagPath は tag が oldTag 自身または配下なら newTag 側へ付け替えた値を返す。
// "ab" は "a" の配下ではない（"/" 境界で判定）。
func renameTagPath(tag, oldTag, newTag string) string {
	if tag == oldTag {
		return newTag
	}
	if strings.HasPrefix(tag, oldTag+"/") {
		return newTag + tag[len(oldTag):]
	}
	return tag
}

// RenameTag は oldTag とその配下のタグを newTag へ付け替え、更新したメモ件数を返す。
// 既存タグと重なった場合は統合（重複除去）する。作成/更新日時は保持する。
func (s *NoteService) RenameTag(oldTag, newTag string) (int, error) {
	oldTag, newTag = NormalizeTag(oldTag), NormalizeTag(newTag)
	if oldTag == "" || newTag == "" {
		return 0, fmt.Errorf("tag must not be empty")
	}
	if oldTag == newTag {
		return 0, nil
	}
	metas, err := s.ListNotes()
	if err != nil {
		return 0, err
	}
	count := 0
	for _, meta := range metas {
		renamed := make([]string, len(meta.Tags))
		changed := false
		for i, tag := range meta.Tags {
			renamed[i] = renameTagPath(tag, oldTag, newTag)
			if renamed[i] != tag {
				changed = true
			}
		}
		if !changed {
			continue
		}
		note, err := s.GetNote(meta.ID)
		if err != nil {
			return count, err
		}
		note.Tags = normalizeTags(renamed)
		if err := s.writeNote(note); err != nil {
			return count, fmt.Errorf("failed to rename tag: %w", err)
		}
		count++
	}
	return count, nil
}

func (s *NoteService) SearchNotes(query string) ([]NoteMeta, error) {
	entries, err := os.ReadDir(s.notesDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read notes dir: %w", err)
	}
	query = strings.ToLower(query)
	var results []NoteMeta
	for _, entry := range entries {
		if entry.IsDir() || filepath.Ext(entry.Name()) != ".md" {
			continue
		}
		id := strings.TrimSuffix(entry.Name(), ".md")
		note, err := s.GetNote(id)
		if err != nil {
			continue
		}
		if strings.Contains(strings.ToLower(note.Title), query) || strings.Contains(strings.ToLower(note.Body), query) {
			results = append(results, note.NoteMeta)
		}
	}
	sort.Slice(results, func(i, j int) bool { return results[i].Modified > results[j].Modified })
	return results, nil
}
