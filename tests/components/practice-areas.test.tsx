import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeAreas } from "@/components/homepage/practice-areas";

describe("PracticeAreas", () => {
  it("renders all 11 practice area titles", () => {
    render(<PracticeAreas />);
    expect(screen.getByText("Business & Corporate Law")).toBeInTheDocument();
    expect(screen.getByText("Banking, Finance & FinTech")).toBeInTheDocument();
    expect(screen.getByText("Sport & Entertainment")).toBeInTheDocument();
    expect(screen.getByText("Intellectual Property")).toBeInTheDocument();
  });

  it("renders view-all CTA card", () => {
    render(<PracticeAreas />);
    expect(screen.getByText(/all practice areas/i)).toBeInTheDocument();
  });

  it("renders section heading", () => {
    render(<PracticeAreas />);
    expect(screen.getByRole("heading", { name: /our practice areas/i })).toBeInTheDocument();
  });
});
