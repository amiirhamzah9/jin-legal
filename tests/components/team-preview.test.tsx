import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TeamPreview } from "@/components/homepage/team-preview";

describe("TeamPreview", () => {
  it("renders three featured partners", () => {
    render(<TeamPreview />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Ryan Tampubolon")).toBeInTheDocument();
    expect(screen.getByText("Abi Rafdi")).toBeInTheDocument();
  });

  it("renders view-all CTA link to /team", () => {
    render(<TeamPreview />);
    const link = screen.getByRole("link", { name: /view all partners/i });
    expect(link).toHaveAttribute("href", "/team");
  });
});
