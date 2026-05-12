import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminNavLink } from "@/components/admin/admin-nav-link";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/blog",
}));

describe("AdminNavLink", () => {
  it("renders the label and href", () => {
    render(<AdminNavLink href="/admin/blog" label="Blog Posts" />);
    const link = screen.getByRole("link", { name: /blog posts/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/admin/blog");
  });

  it("applies active styling when pathname matches", () => {
    render(<AdminNavLink href="/admin/blog" label="Blog Posts" />);
    const link = screen.getByRole("link", { name: /blog posts/i });
    expect(link.className).toContain("text-gold");
  });

  it("applies inactive styling when pathname does not match", () => {
    render(<AdminNavLink href="/admin/leads" label="Leads" />);
    const link = screen.getByRole("link", { name: /leads/i });
    expect(link.className).not.toContain("text-gold");
  });
});
