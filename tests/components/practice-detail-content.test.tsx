import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeDetailContent } from "@/components/practice-areas/practice-detail-content";

const AREA = {
  id: "1",
  title: "Business & Corporate Law",
  slug: "business-corporate-law",
  description: "Corporate transactions, M&A, governance, and commercial contracts.",
  full_content: "We advise corporations across the full lifecycle of corporate matters from entity structuring to mergers and acquisitions.",
  services: ["Mergers & Acquisitions", "Corporate Restructuring", "Shareholder Agreements"],
  icon_name: "briefcase",
  display_order: 1,
  created_at: "2025-01-01T00:00:00Z",
};

describe("PracticeDetailContent", () => {
  it("renders the full content paragraph", () => {
    render(<PracticeDetailContent area={AREA} />);
    expect(screen.getByText(AREA.full_content)).toBeInTheDocument();
  });

  it("renders all services for the area", () => {
    render(<PracticeDetailContent area={AREA} />);
    for (const svc of AREA.services) {
      expect(screen.getByText(svc)).toBeInTheDocument();
    }
  });

  it("renders 'How We Help' section heading", () => {
    render(<PracticeDetailContent area={AREA} />);
    expect(screen.getByRole("heading", { name: /how we help/i })).toBeInTheDocument();
  });
});
