package main

import (
	"strings"
	"testing"
)

func TestRenderD2(t *testing.T) {
	svg, err := renderD2("x -> y: hello")
	if err != nil {
		t.Fatalf("RenderD2 returned error: %v", err)
	}
	if !strings.Contains(svg, "<svg") {
		t.Fatalf("expected SVG output, got: %.80s", svg)
	}
}

func TestRenderD2Error(t *testing.T) {
	if _, err := renderD2("a -> b {"); err == nil {
		t.Fatal("expected error for invalid D2 source, got nil")
	}
}
