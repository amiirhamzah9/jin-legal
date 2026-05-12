import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CtaBanner } from "@/components/homepage/cta-banner";

describe("CtaBanner", () => {
  it("renders headline and contact link", () => {
    render(<CtaBanner />);
    expect(screen.getByText(/Ready to work/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute("href", "/contact");
  });
});
