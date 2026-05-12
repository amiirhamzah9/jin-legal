import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownContent } from "@/components/insights/markdown-content";

describe("MarkdownContent", () => {
  it("renders h2 headings from markdown", () => {
    render(<MarkdownContent source={"## Overview\n\nSome text."} />);
    expect(screen.getByRole("heading", { level: 2, name: /overview/i })).toBeInTheDocument();
  });

  it("renders paragraphs", () => {
    render(<MarkdownContent source={"First paragraph.\n\nSecond paragraph."} />);
    expect(screen.getByText(/first paragraph/i)).toBeInTheDocument();
    expect(screen.getByText(/second paragraph/i)).toBeInTheDocument();
  });

  it("renders unordered lists", () => {
    render(<MarkdownContent source={"- Item one\n- Item two\n- Item three"} />);
    expect(screen.getByText("Item one")).toBeInTheDocument();
    expect(screen.getByText("Item three")).toBeInTheDocument();
  });
});
