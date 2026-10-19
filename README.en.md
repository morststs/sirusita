# Sirusita

**Local-first Markdown notes and cheat sheets for developers** (free and open source)

[日本語](./README.md) ・ [Try the web version](https://sirusita.e17.click/) ・ [Microsoft Store](https://apps.microsoft.com/detail/9PPT0S6GKBLW)

> The user interface and the bundled sample notes are currently in **Japanese only**.

- **Your notes are plain Markdown files** — The desktop app stores each note as a `.md` file under `~/.sirusita/notes/`. No cloud service, no account.
- **Cheat sheets out of the box** — A bundled sample collection covers the syntax of Go, Rust, Python, TypeScript and more, commands for Docker, Git, bash and sed, regular expressions, and Mermaid / D2 / PlantUML diagrams. Pick the ones you want and add them as notes.
- **Hierarchical tags** — Separate tag segments with `/` (e.g. `Programming/Go`, `Commands/docker`). Selecting a parent tag also shows the notes tagged with its children.

## Get it

- **Web:** Open <https://sirusita.e17.click/> — nothing to install. Notes are saved in your browser (IndexedDB) and never sent to a server. Clearing the browser's site data deletes them, so export notes you want to keep (exports do not include tags or created/modified dates).
- **Windows 11:** Install from the [Microsoft Store](https://apps.microsoft.com/detail/9PPT0S6GKBLW) (free, updates automatically).
  An unsigned `sirusita.exe` is also available from [GitHub Releases](https://github.com/morststs/sirusita/releases/latest).

## Features

- **Markdown editing and preview** — Monaco-based editor, rendered preview with math (KaTeX), diagrams (Mermaid / D2 / PlantUML) and syntax highlighting. Switch between tabs or show both side by side with synchronized scrolling.
- **Hierarchical tags** — Tag tree in the sidebar with note counts. Rename a tag (and everything under it) in one step, or merge it into an existing tag. Change the tags of several notes at once.
- **Sample collection** — Add bundled cheat sheets from the sidebar. The same notes are attached to each release as `sirusita-contents.zip`.
- **Import / export** — Import Markdown files or ZIP archives (drag and drop works too). Export the open note as Markdown (title and body only; tags and dates are not included).
- **Offline and private** — The app does not talk to any server. See [`PRIVACY.md`](./PRIVACY.md).

## Note format

Each note is Markdown with YAML front matter:

```markdown
---
title: "Note title"
tags:
  - "Programming/Go"
created: 2026-06-13T10:00:00+09:00
modified: 2026-06-13T12:00:00+09:00
sirusita: "1"
---

Body (Markdown)
```

`sirusita: "1"` marks a file written by Sirusita. When it is present, importing keeps the original created / modified times.

## Tech stack

- Backend: Go 1.23 + [Wails](https://wails.io) v2.12 (D2 rendering and import parsing are also compiled to WebAssembly for the web version)
- Frontend: Svelte 5 + Vite 7, Flowbite Svelte + Tailwind CSS 4

## Building

Everything builds inside Docker; nothing needs to be installed on the host except Docker.

```bash
docker build -t wails-dev .

# Windows exe (output: build/bin/sirusita.exe)
docker run --rm -v "$PWD":/app -w /app wails-dev wails build -platform windows/amd64

# Web version (output: frontend/dist-web)
docker run --rm -v "$PWD":/app -w /app/frontend wails-dev npm run build:web
```

See [`CLAUDE.md`](./CLAUDE.md) (Japanese) for more commands.

## Feedback

Bug reports and feature requests are welcome on [GitHub Issues](https://github.com/morststs/sirusita/issues) (English or Japanese).

## License

MIT License (copyright holder: morststs). See [`LICENSE`](./LICENSE) and [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md).
