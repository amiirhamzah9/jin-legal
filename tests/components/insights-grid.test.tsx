import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InsightsGrid } from "@/components/insights/insights-grid";

const POSTS = [
  {
    id: "1",
    title: "First Post",
    slug: "first-post",
    excerpt: "Excerpt one",
    content: "Body",
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
  },
  {
    id: "2",
    title: "Second Post",
    slug: "second-post",
    excerpt: "Excerpt two",
    content: "Body",
    cover_image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500",
    category: "FinTech",
    author_id: null,
    published_at: "2025-04-24T00:00:00Z",
    is_published: true,
    created_at: "2025-04-24T00:00:00Z",
      title_id: null,
      excerpt_id: null,
      content_id: null,
      category_indo: null,
  },
  {
    id: "3",
    title: "Third Post",
    slug: "third-post",
    excerpt: "Excerpt three",
    content: "Body",
    cover_image_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500",
    category: "Employment",
    author_id: null,
    published_at: "2025-04-10T00:00:00Z",
    is_published: true,
    created_at: "2025-04-10T00:00:00Z",
      title_id: null,
      excerpt_id: null,
      content_id: null,
      category_indo: null,
  },
];

describe("InsightsGrid", () => {
  it("renders all provided posts", () => {
    render(<InsightsGrid posts={POSTS} />);
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("Second Post")).toBeInTheDocument();
    expect(screen.getByText("Third Post")).toBeInTheDocument();
  });

  it("renders empty state when no posts", () => {
    render(<InsightsGrid posts={[]} />);
    expect(screen.getByText(/no insights published yet/i)).toBeInTheDocument();
  });

  it("uses featured layout (2fr 1fr 1fr) when 3+ posts present", () => {
    const { container } = render(<InsightsGrid posts={POSTS} />);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("grid-cols-[2fr_1fr_1fr]");
  });
});
