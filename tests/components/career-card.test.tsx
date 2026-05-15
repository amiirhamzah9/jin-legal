import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareerCard } from "@/components/careers/career-card";

const FAKE_CAREER = {
  id: "c1",
  title: "Senior Associate — Corporate Law",
  slug: "senior-associate-corporate-law",
  description: "We're seeking a Senior Associate with 5+ years of experience.",
  type: "Full-time",
  location: "Jakarta, Indonesia",
  is_active: true,
  created_at: "2025-05-01T00:00:00Z",
      title_id: null,
      description_id: null,
};

describe("CareerCard", () => {
  it("renders title, type, and location", () => {
    render(<CareerCard career={FAKE_CAREER} />);
    expect(screen.getByText("Senior Associate — Corporate Law")).toBeInTheDocument();
    expect(screen.getByText("Full-time")).toBeInTheDocument();
    expect(screen.getByText("Jakarta, Indonesia")).toBeInTheDocument();
  });

  it("renders details + apply CTA link to job detail page", () => {
    render(<CareerCard career={FAKE_CAREER} />);
    const link = screen.getByRole("link", { name: /view details/i });
    expect(link).toHaveAttribute("href", "/careers/senior-associate-corporate-law");
  });
});
