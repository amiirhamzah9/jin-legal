import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PracticeDetailContent } from "@/components/practice-areas/practice-detail-content";
import { PRACTICE_AREAS } from "@/lib/constants";

describe("PracticeDetailContent", () => {
  it("renders the full content paragraph", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailContent area={area} />);
    expect(screen.getByText(area.fullContent)).toBeInTheDocument();
  });

  it("renders all services for the area", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailContent area={area} />);
    for (const svc of area.services) {
      expect(screen.getByText(svc)).toBeInTheDocument();
    }
  });

  it("renders 'How We Help' section heading", () => {
    const area = PRACTICE_AREAS[0];
    render(<PracticeDetailContent area={area} />);
    expect(screen.getByRole("heading", { name: /how we help/i })).toBeInTheDocument();
  });
});
