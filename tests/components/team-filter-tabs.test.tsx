import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeamPageBody } from "@/components/team/team-filter-tabs";

const SAMPLE = [
  { id: "1", name: "Muhammad Subuh Rezki", credentials: "S.H.", role: "Managing Partner", bio: null, photo_url: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=600", practice_areas: [], slug: "muhammad-subuh-rezki", practice_group: "corporate-business", display_order: 1, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "2", name: "Ryan Tampubolon", credentials: "S.H.", role: "Partner", bio: null, photo_url: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=600", practice_areas: [], slug: "ryan-tampubolon", practice_group: "litigation", display_order: 2, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  { id: "3", name: "Aditya Muriza", credentials: "S.H.", role: "Partner", bio: null, photo_url: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=600", practice_areas: [], slug: "aditya-muriza", practice_group: "specialties", display_order: 3, is_active: true, created_at: "2025-01-01T00:00:00Z" },
];

describe("TeamPageBody (with filter tabs)", () => {
  it("renders all four filter tabs", () => {
    render(<TeamPageBody partners={SAMPLE} />);
    expect(screen.getByRole("button", { name: /all partners/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /corporate & business/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^litigation$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /specialties/i })).toBeInTheDocument();
  });

  it("shows all 3 partners on first render", () => {
    render(<TeamPageBody partners={SAMPLE} />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Aditya Muriza")).toBeInTheDocument();
  });

  it("filters partners when Litigation tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TeamPageBody partners={SAMPLE} />);
    await user.click(screen.getByRole("button", { name: /^litigation$/i }));
    expect(screen.getByText("Ryan Tampubolon")).toBeInTheDocument();
    expect(screen.queryByText("Muhammad Subuh Rezki")).not.toBeInTheDocument();
  });
});
