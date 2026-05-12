import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CareerForm } from "@/components/admin/career-form";

vi.mock("@/app/admin/careers/actions", () => ({
  createCareer: vi.fn().mockResolvedValue({ status: "idle" }),
  updateCareer: vi.fn(),
}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    useFormState: (_action: unknown, initial: unknown) => [initial, () => {}],
    useFormStatus: () => ({ pending: false }),
  };
});

describe("CareerForm", () => {
  it("renders all career fields", () => {
    render(<CareerForm mode="create" />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/active/i)).toBeInTheDocument();
  });

  it("pre-fills fields in edit mode", () => {
    const career = {
      id: "c1",
      title: "Senior Associate",
      description: "Five+ years of experience required",
      type: "Full-time",
      location: "Jakarta",
      is_active: true,
      created_at: "2025-01-01T00:00:00Z",
    };
    render(<CareerForm mode="edit" career={career} />);
    expect(screen.getByDisplayValue("Senior Associate")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jakarta")).toBeInTheDocument();
  });
});
