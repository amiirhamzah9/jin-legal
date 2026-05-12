import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeDetailHero } from "@/components/practice-areas/practice-detail-hero";
import { PRACTICE_AREAS } from "@/lib/constants";

describe("PracticeDetailHero", () => {
  it("renders the area title and number", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailHero area={area} />);
    expect(screen.getByRole("heading", { name: area.title })).toBeInTheDocument();
    expect(screen.getByText(area.num)).toBeInTheDocument();
  });

  it("renders breadcrumb link back to listing", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailHero area={area} />);
    expect(screen.getByRole("link", { name: /practice areas/i })).toHaveAttribute(
      "href",
      "/practice-areas"
    );
  });

  it("renders the area description", () => {
    const area = PRACTICE_AREAS[5];
    render(<PracticeDetailHero area={area} />);
    expect(screen.getByText(area.description)).toBeInTheDocument();
  });
});
