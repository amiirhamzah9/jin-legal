import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders gold variant with correct classes", () => {
    render(<Button variant="gold">Consult With Us</Button>);
    const btn = screen.getByRole("button", { name: /consult with us/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("bg-gold");
  });

  it("renders ghost variant with border", () => {
    render(<Button variant="ghost">Learn More</Button>);
    const btn = screen.getByRole("button", { name: /learn more/i });
    expect(btn.className).toContain("border");
  });

  it("renders as link when href provided", () => {
    render(<Button variant="gold" href="/contact">Get in Touch</Button>);
    expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute("href", "/contact");
  });
});
