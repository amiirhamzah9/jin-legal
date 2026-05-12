import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeListGrid } from "@/components/practice-areas/practice-list-grid";

const AREAS = [
  {
    id: "1",
    title: "Business & Corporate Law",
    slug: "business-corporate-law",
    description: "Corporate transactions, M&A, governance, and commercial contracts.",
    full_content: null,
    services: null,
    icon_name: "briefcase",
    display_order: 1,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Banking, Finance & FinTech",
    slug: "banking-finance-fintech",
    description: "Banking regulation and FinTech licensing.",
    full_content: null,
    services: null,
    icon_name: "bank",
    display_order: 11,
    created_at: "2025-01-01T00:00:00Z",
  },
];

describe("PracticeListGrid", () => {
  it("renders provided area titles", () => {
    render(<PracticeListGrid areas={AREAS} />);
    expect(screen.getByText("Business & Corporate Law")).toBeInTheDocument();
    expect(screen.getByText("Banking, Finance & FinTech")).toBeInTheDocument();
  });

  it("renders descriptions for each card", () => {
    render(<PracticeListGrid areas={AREAS} />);
    expect(screen.getByText(/Corporate transactions, M&A/i)).toBeInTheDocument();
  });

  it("links each card to its detail page", () => {
    render(<PracticeListGrid areas={AREAS} />);
    const link = screen.getByRole("link", { name: /business & corporate law/i });
    expect(link).toHaveAttribute("href", "/practice-areas/business-corporate-law");
  });
});
