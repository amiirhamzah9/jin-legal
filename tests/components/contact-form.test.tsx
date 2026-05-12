import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactForm } from "@/components/contact/contact-form";

vi.mock("@/app/contact/actions", () => ({
  submitContactForm: vi.fn().mockResolvedValue({ status: "idle" }),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("react-dom", async () => {
  const actual = await vi.importActual<typeof import("react-dom")>("react-dom");
  return {
    ...actual,
    useFormState: (_action: unknown, initial: unknown) => [initial, () => {}],
    useFormStatus: () => ({ pending: false }),
  };
});

const PRACTICE_OPTIONS = [
  { slug: "business-corporate-law", title: "Business & Corporate Law" },
  { slug: "litigation-dispute-resolution", title: "Litigation & Dispute Resolution" },
];

describe("ContactForm", () => {
  it("renders all required form fields", () => {
    render(<ContactForm practiceAreaOptions={PRACTICE_OPTIONS} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<ContactForm practiceAreaOptions={PRACTICE_OPTIONS} />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("renders subject dropdown with practice areas + general inquiry", () => {
    render(<ContactForm practiceAreaOptions={PRACTICE_OPTIONS} />);
    const subjectSelect = screen.getByLabelText(/subject/i) as HTMLSelectElement;
    const optionTexts = Array.from(subjectSelect.options).map((o) => o.textContent);
    expect(optionTexts).toContain("General Inquiry");
    expect(optionTexts).toContain("Business & Corporate Law");
  });
});
