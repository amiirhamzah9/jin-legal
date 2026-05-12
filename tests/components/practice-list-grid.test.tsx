import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeListGrid } from "@/components/practice-areas/practice-list-grid";

describe("PracticeListGrid", () => {
  it("renders all 11 practice area titles", () => {
    render(<PracticeListGrid />);
    expect(screen.getByText("Business & Corporate Law")).toBeInTheDocument();
    expect(screen.getByText("Litigation & Dispute Resolution")).toBeInTheDocument();
    expect(screen.getByText("Banking, Finance & FinTech")).toBeInTheDocument();
    expect(screen.getByText("Sport & Entertainment")).toBeInTheDocument();
  });

  it("renders descriptions for each card", () => {
    render(<PracticeListGrid />);
    expect(screen.getByText(/Corporate transactions, M&A/i)).toBeInTheDocument();
  });

  it("links each card to its detail page", () => {
    render(<PracticeListGrid />);
    const link = screen.getByRole("link", { name: /business & corporate law/i });
    expect(link).toHaveAttribute("href", "/practice-areas/business-corporate-law");
  });
});
