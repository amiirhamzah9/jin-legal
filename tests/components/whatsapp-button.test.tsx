import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("WhatsAppButton", () => {
  it("renders a link to wa.me with correct phone number", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("wa.me/6281187800078"));
  });

  it("opens in a new tab", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("includes a default greeting message", () => {
    render(<WhatsAppButton />);
    const link = screen.getByRole("link", { name: /whatsapp/i });
    const href = link.getAttribute("href") ?? "";
    expect(href).toContain("text=");
  });
});
