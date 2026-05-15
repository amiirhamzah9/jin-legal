import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareersList } from "@/components/careers/careers-list";

const SAMPLE = [
  {
    id: "c1",
    title: "Senior Associate",
    slug: "senior-associate",
    description: "Corporate law role",
    type: "Full-time",
    location: "Jakarta",
    is_active: true,
    created_at: "2025-05-01T00:00:00Z",
  },
  {
    id: "c2",
    title: "Legal Intern",
    slug: "legal-intern",
    description: "Summer program",
    type: "Internship",
    location: "Jakarta",
    is_active: true,
    created_at: "2025-04-15T00:00:00Z",
  },
];

describe("CareersList", () => {
  it("renders all provided careers", () => {
    render(<CareersList careers={SAMPLE} />);
    expect(screen.getByText("Senior Associate")).toBeInTheDocument();
    expect(screen.getByText("Legal Intern")).toBeInTheDocument();
  });

  it("renders empty state when no careers", () => {
    render(<CareersList careers={[]} />);
    expect(screen.getByText(/no openings/i)).toBeInTheDocument();
  });
});
