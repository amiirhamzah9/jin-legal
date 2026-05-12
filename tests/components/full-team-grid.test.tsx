import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FullTeamGrid } from "@/components/team/full-team-grid";

const SAMPLE_PARTNERS = [
  {
    id: "1",
    name: "Muhammad Subuh Rezki",
    credentials: "S.H.",
    role: "Managing Partner",
    bio: null,
    photo_url: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=600",
    practice_areas: ["business-corporate-law"],
    slug: "muhammad-subuh-rezki",
    practice_group: "corporate-business",
    display_order: 1,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Ryan Tampubolon",
    credentials: "S.H.",
    role: "Partner",
    bio: null,
    photo_url: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=600",
    practice_areas: ["litigation-dispute-resolution"],
    slug: "ryan-tampubolon",
    practice_group: "litigation",
    display_order: 2,
    is_active: true,
    created_at: "2025-01-01T00:00:00Z",
  },
];

describe("FullTeamGrid", () => {
  it("renders all provided partner names", () => {
    render(<FullTeamGrid partners={SAMPLE_PARTNERS} />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Ryan Tampubolon")).toBeInTheDocument();
  });

  it("renders nothing when empty array provided", () => {
    const { container } = render(<FullTeamGrid partners={[]} />);
    expect(container.querySelector(".group")).toBeNull();
  });
});
