import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeAreaForm } from "@/components/admin/practice-area-form";

vi.mock("@/app/admin/practice-areas/actions", () => ({
  updatePracticeArea: vi.fn(),
}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    useFormState: (_action: unknown, initial: unknown) => [initial, () => {}],
    useFormStatus: () => ({ pending: false }),
  };
});

const AREA = {
  id: "1",
  title: "Business & Corporate Law",
  slug: "business-corporate-law",
  description: "Corporate transactions and M&A",
  full_content: "We advise corporations across the full lifecycle of corporate matters.",
  services: ["M&A", "Restructuring"],
  icon_name: "briefcase",
  display_order: 1,
  created_at: "2025-01-01T00:00:00Z",
};

describe("PracticeAreaForm", () => {
  it("renders title, description, content fields with values from area", () => {
    render(<PracticeAreaForm area={AREA} />);
    expect(screen.getByDisplayValue(AREA.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(AREA.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(AREA.full_content)).toBeInTheDocument();
  });

  it("shows slug as read-only", () => {
    render(<PracticeAreaForm area={AREA} />);
    expect(screen.getByText(AREA.slug)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^slug$/i)).toBeNull(); // no editable slug input
  });

  it("renders services as newline-joined textarea content", () => {
    render(<PracticeAreaForm area={AREA} />);
    const textarea = screen.getByLabelText(/services/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe("M&A\nRestructuring");
  });
});
