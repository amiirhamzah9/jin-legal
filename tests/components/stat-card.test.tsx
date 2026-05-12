import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/admin/stat-card";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Total Posts" value={42} />);
    expect(screen.getByText("Total Posts")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    render(<StatCard label="Leads" value={5} helper="3 unread" />);
    expect(screen.getByText("3 unread")).toBeInTheDocument();
  });
});
