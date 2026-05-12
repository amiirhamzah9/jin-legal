import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/layout/nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Nav", () => {
  it("renders all navigation links", () => {
    render(<Nav />);
    // Each link is rendered twice (once in desktop nav, once in mobile menu) — both should be present
    expect(screen.getAllByRole("link", { name: /about/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /practice areas/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /our team/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /insights/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /careers/i }).length).toBeGreaterThan(0);
  });

  it("renders Consult With Us CTA", () => {
    render(<Nav />);
    expect(screen.getAllByRole("link", { name: /consult with us/i }).length).toBeGreaterThan(0);
  });

  it("renders JIN logo image", () => {
    render(<Nav />);
    const logo = screen.getByAltText(/jin legal/i);
    expect(logo).toBeInTheDocument();
  });

  it("renders mobile hamburger button", () => {
    render(<Nav />);
    expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
  });
});
