import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";

describe("Footer", () => {
  it("renders firm legal name in brand and copyright", () => {
    render(<Footer />);
    const occurrences = screen.getAllByText(/PT Juris International Network/i);
    expect(occurrences).toHaveLength(2);
  });

  it("renders four column headings", () => {
    render(<Footer />);
    expect(screen.getByText(/practice areas/i)).toBeInTheDocument();
    expect(screen.getByText(/company/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it("renders copyright with current year", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument();
  });
});
