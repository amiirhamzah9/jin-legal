import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InsightCard } from "@/components/insights/insight-card";

const FAKE_POST = {
  id: "test-id",
  title: "Sample Article Title",
  slug: "sample-article",
  excerpt: "A short excerpt.",
  content: "Body text here.",
  cover_image_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900",
  category: "Corporate Law",
  author_id: null,
  published_at: "2025-05-08T00:00:00Z",
  is_published: true,
  created_at: "2025-05-08T00:00:00Z",
      title_id: null,
      excerpt_id: null,
      content_id: null,
      category_indo: null,
};

describe("InsightCard", () => {
  it("renders title, category, and date", () => {
    render(<InsightCard post={FAKE_POST} />);
    expect(screen.getByText("Sample Article Title")).toBeInTheDocument();
    expect(screen.getByText("Corporate Law")).toBeInTheDocument();
    expect(screen.getByText(/May 8, 2025/i)).toBeInTheDocument();
  });

  it("links to the post detail page", () => {
    render(<InsightCard post={FAKE_POST} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/insights/sample-article");
  });

  it("uses larger heading variant when featured=true", () => {
    render(<InsightCard post={FAKE_POST} featured />);
    const heading = screen.getByRole("heading", { name: /sample article title/i });
    expect(heading.className).toContain("text-[26px]");
  });
});
