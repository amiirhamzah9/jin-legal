import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Insights } from "@/components/homepage/insights";

describe("Insights", () => {
  it("renders section heading", () => {
    render(<Insights />);
    expect(screen.getByRole("heading", { name: /legal perspectives/i })).toBeInTheDocument();
  });

  it("renders all 3 sample articles", () => {
    render(<Insights />);
    expect(screen.getByText(/Indonesia's New Company Law/i)).toBeInTheDocument();
    expect(screen.getByText(/FinTech Licensing/i)).toBeInTheDocument();
    expect(screen.getByText(/Omnibus Law/i)).toBeInTheDocument();
  });

  it("renders all-articles link", () => {
    render(<Insights />);
    expect(screen.getByRole("link", { name: /all articles/i })).toHaveAttribute("href", "/insights");
  });
});
