import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeamPageBody } from "@/components/team/team-filter-tabs";

describe("TeamPageBody (with filter tabs)", () => {
  it("renders all four filter tabs", () => {
    render(<TeamPageBody />);
    expect(screen.getByRole("button", { name: /all partners/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /corporate & business/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /litigation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /specialties/i })).toBeInTheDocument();
  });

  it("shows all 6 partners on first render", () => {
    render(<TeamPageBody />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Aditya Muriza")).toBeInTheDocument();
  });

  it("filters partners when Litigation tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TeamPageBody />);
    await user.click(screen.getByRole("button", { name: /^litigation$/i }));
    expect(screen.getByText("Ryan Tampubolon")).toBeInTheDocument();
    expect(screen.queryByText("Muhammad Subuh Rezki")).not.toBeInTheDocument();
  });
});
