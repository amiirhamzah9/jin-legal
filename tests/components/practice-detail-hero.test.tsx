import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeDetailHero } from "@/components/practice-areas/practice-detail-hero";

const AREA = {
  id: "1",
  title: "Business & Corporate Law",
  slug: "business-corporate-law",
  description: "Corporate transactions, M&A, governance, and commercial contracts.",
  full_content: "We advise corporations across the full lifecycle of corporate matters.",
  services: ["M&A", "Restructuring"],
  icon_name: "briefcase",
  display_order: 1,
  created_at: "2025-01-01T00:00:00Z",
};

describe("PracticeDetailHero", () => {
  it("renders the area title and order number", () => {
    render(<PracticeDetailHero area={AREA} />);
    expect(screen.getByRole("heading", { name: AREA.title })).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("renders breadcrumb link back to listing", () => {
    render(<PracticeDetailHero area={AREA} />);
    expect(screen.getByRole("link", { name: /practice areas/i })).toHaveAttribute(
      "href",
      "/practice-areas"
    );
  });

  it("renders the area description", () => {
    render(<PracticeDetailHero area={AREA} />);
    expect(screen.getByText(AREA.description)).toBeInTheDocument();
  });
});
