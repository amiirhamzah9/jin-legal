import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHero } from "@/components/ui/page-hero";

describe("PageHero", () => {
  it("renders eyebrow and title", () => {
    render(<PageHero eyebrow="About the Firm" title="A Modern Legal Partner" />);
    expect(screen.getByText("About the Firm")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /a modern legal partner/i })).toBeInTheDocument();
  });

  it("renders optional subtitle when provided", () => {
    render(
      <PageHero
        eyebrow="Our People"
        title="Meet the Partners"
        subtitle="Six dedicated professionals committed to delivering strategic counsel."
      />
    );
    expect(screen.getByText(/six dedicated professionals/i)).toBeInTheDocument();
  });

  it("omits subtitle when not provided", () => {
    const { container } = render(<PageHero eyebrow="X" title="Y" />);
    expect(container.querySelector("p")).toBeNull();
  });
});
