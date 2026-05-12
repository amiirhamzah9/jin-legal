import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Insights } from "@/components/homepage/insights";

vi.mock("@/lib/data/queries", () => ({
  getRecentBlogPosts: vi.fn().mockResolvedValue([]),
}));

describe("Insights (homepage section)", () => {
  it("renders section heading", async () => {
    const ui = await Insights();
    render(ui);
    expect(screen.getByRole("heading", { name: /legal perspectives/i })).toBeInTheDocument();
  });

  it("renders 'All Articles' view-all link to /insights", async () => {
    const ui = await Insights();
    render(ui);
    expect(screen.getByRole("link", { name: /all articles/i })).toHaveAttribute(
      "href",
      "/insights"
    );
  });

  it("renders empty state when no posts", async () => {
    const ui = await Insights();
    render(ui);
    expect(screen.getByText(/no insights published yet/i)).toBeInTheDocument();
  });
});
