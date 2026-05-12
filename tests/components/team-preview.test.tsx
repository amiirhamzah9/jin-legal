import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamPreview } from "@/components/homepage/team-preview";

vi.mock("@/lib/data/queries", () => ({
  getActiveTeamMembers: vi.fn().mockResolvedValue([
    { id: "1", name: "Muhammad Subuh Rezki", credentials: "S.H.", role: "Managing Partner", bio: null, photo_url: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=600", practice_areas: [], slug: "muhammad-subuh-rezki", practice_group: "corporate-business", display_order: 1, is_active: true, created_at: "2025-01-01T00:00:00Z" },
    { id: "2", name: "Ryan Tampubolon", credentials: "S.H.", role: "Partner", bio: null, photo_url: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=600", practice_areas: [], slug: "ryan-tampubolon", practice_group: "litigation", display_order: 2, is_active: true, created_at: "2025-01-01T00:00:00Z" },
    { id: "3", name: "Abi Rafdi", credentials: "S.H.", role: "Partner", bio: null, photo_url: "https://images.unsplash.com/photo-1629425733761-caae3b5f2e50?w=600", practice_areas: [], slug: "abi-rafdi", practice_group: "specialties", display_order: 3, is_active: true, created_at: "2025-01-01T00:00:00Z" },
  ]),
}));

describe("TeamPreview", () => {
  it("renders featured partner names from Supabase", async () => {
    const ui = await TeamPreview();
    render(ui);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Ryan Tampubolon")).toBeInTheDocument();
    expect(screen.getByText("Abi Rafdi")).toBeInTheDocument();
  });

  it("renders view-all CTA link to /team", async () => {
    const ui = await TeamPreview();
    render(ui);
    expect(screen.getByRole("link", { name: /view all partners/i })).toHaveAttribute("href", "/team");
  });
});
