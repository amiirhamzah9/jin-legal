import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AboutStrip } from "@/components/homepage/about-strip";

describe("AboutStrip", () => {
  it("renders all four value cards", () => {
    render(<AboutStrip />);
    expect(screen.getByText("Integrity")).toBeInTheDocument();
    expect(screen.getByText("Precision")).toBeInTheDocument();
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  it("renders learn more link", () => {
    render(<AboutStrip />);
    expect(screen.getByRole("link", { name: /learn more about us/i })).toBeInTheDocument();
  });
});
