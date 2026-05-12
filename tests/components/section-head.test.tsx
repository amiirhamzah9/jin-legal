import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHead } from "@/components/ui/section-head";

describe("SectionHead", () => {
  it("renders eyebrow + title", () => {
    render(<SectionHead eyebrow="What We Do" title="Our Practice Areas" />);
    expect(screen.getByText("What We Do")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Our Practice Areas" })).toBeInTheDocument();
  });

  it("renders view-all link when provided", () => {
    render(<SectionHead eyebrow="People" title="Team" viewAllHref="/team" viewAllLabel="View All Partners" />);
    expect(screen.getByRole("link", { name: /view all partners/i })).toHaveAttribute("href", "/team");
  });
});
