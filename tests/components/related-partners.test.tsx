import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RelatedPartners } from "@/components/practice-areas/related-partners";

describe("RelatedPartners", () => {
  it("renders only partners associated with the given slug", () => {
    render(<RelatedPartners practiceSlug="banking-finance-fintech" />);
    expect(screen.getByText("Achmad Firmansyah")).toBeInTheDocument();
    expect(screen.queryByText("Ryan Tampubolon")).not.toBeInTheDocument();
  });

  it("renders multiple partners for areas with multiple specialists", () => {
    render(<RelatedPartners practiceSlug="business-corporate-law" />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Achmad Firmansyah")).toBeInTheDocument();
  });

  it("renders nothing if no partners match", () => {
    const { container } = render(<RelatedPartners practiceSlug="nonexistent-slug" />);
    expect(container.firstChild).toBeNull();
  });
});
