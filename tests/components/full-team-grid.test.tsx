import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FullTeamGrid } from "@/components/team/full-team-grid";
import { PARTNERS } from "@/lib/constants";

describe("FullTeamGrid", () => {
  it("renders all 6 partner names by default (no filter)", () => {
    render(<FullTeamGrid filter="all" />);
    for (const partner of PARTNERS) {
      expect(screen.getByText(partner.name)).toBeInTheDocument();
    }
  });

  it("filters to corporate-business group", () => {
    render(<FullTeamGrid filter="corporate-business" />);
    expect(screen.getByText("Muhammad Subuh Rezki")).toBeInTheDocument();
    expect(screen.getByText("Achmad Firmansyah")).toBeInTheDocument();
    expect(screen.queryByText("Ryan Tampubolon")).not.toBeInTheDocument();
  });

  it("filters to litigation group", () => {
    render(<FullTeamGrid filter="litigation" />);
    expect(screen.getByText("Ryan Tampubolon")).toBeInTheDocument();
    expect(screen.getByText("Amir Hamzah")).toBeInTheDocument();
    expect(screen.queryByText("Abi Rafdi")).not.toBeInTheDocument();
  });

  it("filters to specialties group", () => {
    render(<FullTeamGrid filter="specialties" />);
    expect(screen.getByText("Abi Rafdi")).toBeInTheDocument();
    expect(screen.getByText("Aditya Muriza")).toBeInTheDocument();
    expect(screen.queryByText("Muhammad Subuh Rezki")).not.toBeInTheDocument();
  });
});
