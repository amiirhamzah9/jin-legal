import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamForm } from "@/components/admin/team-form";

vi.mock("@/app/admin/team/actions", () => ({
  createTeamMember: vi.fn().mockResolvedValue({ status: "idle" }),
  updateTeamMember: vi.fn(),
}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    useFormState: (_action: unknown, initial: unknown) => [initial, () => {}],
    useFormStatus: () => ({ pending: false }),
  };
});

describe("TeamForm", () => {
  it("renders all team fields", () => {
    render(<TeamForm mode="create" />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/credentials/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^slug$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/photo url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/practice group/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/practice area slugs/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display order/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
  });

  it("pre-fills fields in edit mode", () => {
    const member = {
      id: "1",
      name: "Muhammad Subuh Rezki",
      credentials: "S.H.",
      role: "Managing Partner",
      bio: "Leads the firm.",
      photo_url: "https://example.com/photo.jpg",
      practice_areas: ["business-corporate-law"],
      slug: "muhammad-subuh-rezki",
      practice_group: "corporate-business",
      display_order: 1,
      is_active: true,
      created_at: "2025-01-01T00:00:00Z",
    };
    render(<TeamForm mode="edit" member={member} />);
    expect(screen.getByDisplayValue("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Managing Partner")).toBeInTheDocument();
    expect(screen.getByDisplayValue("muhammad-subuh-rezki")).toBeInTheDocument();
  });
});
