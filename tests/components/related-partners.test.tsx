import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RelatedPartners } from "@/components/practice-areas/related-partners";

const { mockQuery } = vi.hoisted(() => ({ mockQuery: vi.fn() }));

vi.mock("@/lib/data/queries", () => ({
  getTeamMembersForPracticeArea: mockQuery,
}));

const PARTNER = (overrides: Partial<{ id: string; name: string; slug: string; practice_areas: string[] }>) => ({
  id: overrides.id ?? "1",
  name: overrides.name ?? "Partner",
  credentials: "S.H.",
  role: "Partner",
  bio: null,
  photo_url: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?w=600",
  practice_areas: overrides.practice_areas ?? [],
  slug: overrides.slug ?? "partner",
  practice_group: "corporate-business",
  display_order: 1,
  is_active: true,
  created_at: "2025-01-01T00:00:00Z",
});

describe("RelatedPartners", () => {
  it("renders only partners returned by the query", async () => {
    mockQuery.mockResolvedValueOnce([
      PARTNER({ id: "4", name: "Achmad Firmansyah", slug: "achmad-firmansyah" }),
    ]);
    const ui = await RelatedPartners({ practiceSlug: "banking-finance-fintech" });
    render(ui);
    expect(screen.getByText("Achmad Firmansyah")).toBeInTheDocument();
  });

  it("renders multiple partners for areas with multiple specialists", async () => {
    mockQuery.mockResolvedValueOnce([
      PARTNER({ id: "1", name: "Muhammad Subuh Rezki", slug: "muhammad-subuh-rezki" }),
      PARTNER({ id: "4", name: "Achmad Firmansyah", slug: "achmad-firmansyah" }),
    ]);
    const ui = await RelatedPartners({ practiceSlug: "business-corporate-law" });
    render(ui);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Achmad Firmansyah")).toBeInTheDocument();
  });

  it("renders nothing if no partners match", async () => {
    mockQuery.mockResolvedValueOnce([]);
    const ui = await RelatedPartners({ practiceSlug: "nonexistent-slug" });
    const { container } = render(ui);
    expect(container.firstChild).toBeNull();
  });
});
