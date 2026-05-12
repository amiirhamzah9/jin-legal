import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/homepage/hero";

describe("Hero", () => {
  it("renders the tagline", () => {
    render(<Hero />);
    expect(screen.getByText(/Legal Excellence/i)).toBeInTheDocument();
    expect(screen.getByText(/Strategic Results/i)).toBeInTheDocument();
  });

  it("renders eyebrow with firm legal name", () => {
    render(<Hero />);
    expect(screen.getByText(/PT Juris International Network/i)).toBeInTheDocument();
  });

  it("renders both CTAs", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /consult with us/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore practice areas/i })).toBeInTheDocument();
  });

  it("renders practice areas stat badge", () => {
    render(<Hero />);
    expect(screen.getByText("11")).toBeInTheDocument();
  });
});
