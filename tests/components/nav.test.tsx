import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/layout/nav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Nav", () => {
  it("renders all navigation links", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /practice areas/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /our team/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /insights/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /careers/i })).toBeInTheDocument();
  });

  it("renders Consult With Us CTA", () => {
    render(<Nav />);
    expect(screen.getByRole("link", { name: /consult with us/i })).toBeInTheDocument();
  });

  it("renders JIN logo image", () => {
    render(<Nav />);
    const logo = screen.getByAltText(/jin legal/i);
    expect(logo).toBeInTheDocument();
  });
});
