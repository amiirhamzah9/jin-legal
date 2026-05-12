import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsBar } from "@/components/homepage/stats-bar";

describe("StatsBar", () => {
  it("renders all four stats", () => {
    render(<StatsBar />);
    expect(screen.getByText("Practice Areas")).toBeInTheDocument();
    expect(screen.getByText("Senior Partners")).toBeInTheDocument();
    expect(screen.getByText("Clients Served")).toBeInTheDocument();
    expect(screen.getByText("Years of Excellence")).toBeInTheDocument();
  });
});
