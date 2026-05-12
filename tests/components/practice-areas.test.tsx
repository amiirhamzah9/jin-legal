import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeAreas } from "@/components/homepage/practice-areas";

vi.mock("@/lib/data/queries", () => ({
  getAllPracticeAreas: vi.fn().mockResolvedValue([
    { id: "1", title: "Business & Corporate Law", slug: "business-corporate-law", description: "x", full_content: null, services: null, icon_name: "briefcase", display_order: 1, created_at: "2025-01-01T00:00:00Z" },
    { id: "2", title: "Banking, Finance & FinTech", slug: "banking-finance-fintech", description: "x", full_content: null, services: null, icon_name: "bank", display_order: 11, created_at: "2025-01-01T00:00:00Z" },
    { id: "3", title: "Sport & Entertainment", slug: "sport-entertainment", description: "x", full_content: null, services: null, icon_name: "trophy", display_order: 10, created_at: "2025-01-01T00:00:00Z" },
    { id: "4", title: "Intellectual Property", slug: "intellectual-property", description: "x", full_content: null, services: null, icon_name: "lightbulb", display_order: 7, created_at: "2025-01-01T00:00:00Z" },
  ]),
}));

describe("PracticeAreas (homepage section)", () => {
  it("renders practice area titles from Supabase", async () => {
    const ui = await PracticeAreas();
    render(ui);
    expect(screen.getByText("Business & Corporate Law")).toBeInTheDocument();
    expect(screen.getByText("Banking, Finance & FinTech")).toBeInTheDocument();
    expect(screen.getByText("Sport & Entertainment")).toBeInTheDocument();
    expect(screen.getByText("Intellectual Property")).toBeInTheDocument();
  });

  it("renders view-all CTA card", async () => {
    const ui = await PracticeAreas();
    render(ui);
    expect(screen.getByText(/all practice areas/i)).toBeInTheDocument();
  });

  it("renders section heading", async () => {
    const ui = await PracticeAreas();
    render(ui);
    expect(screen.getByRole("heading", { name: /our practice areas/i })).toBeInTheDocument();
  });
});
