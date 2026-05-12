import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BlogForm } from "@/components/admin/blog-form";

vi.mock("@/app/admin/blog/actions", () => ({
  createPost: vi.fn().mockResolvedValue({ status: "idle" }),
  updatePost: vi.fn(),
}));

vi.mock("@/components/insights/markdown-content", () => ({
  MarkdownContent: ({ source }: { source: string }) => (
    <div data-testid="md-preview">{source}</div>
  ),
}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    useFormState: (_action: unknown, initial: unknown) => [initial, () => {}],
    useFormStatus: () => ({ pending: false }),
  };
});

describe("BlogForm", () => {
  it("renders all blog fields", () => {
    render(<BlogForm mode="create" />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/excerpt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/published/i)).toBeInTheDocument();
  });

  it("pre-fills fields in edit mode", () => {
    const post = {
      id: "p1",
      title: "Existing Title",
      slug: "existing",
      excerpt: "Excerpt",
      content: "Body",
      cover_image_url: null,
      category: "Corporate Law",
      author_id: null,
      published_at: null,
      is_published: false,
      created_at: "2025-01-01T00:00:00Z",
    };
    render(<BlogForm mode="edit" post={post} />);
    expect(screen.getByDisplayValue("Existing Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("existing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Corporate Law")).toBeInTheDocument();
  });
});
