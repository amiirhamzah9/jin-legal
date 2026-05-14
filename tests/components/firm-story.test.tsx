import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FirmStory } from "@/components/about/firm-story";

describe("FirmStory", () => {
  it("renders the firm story heading", () => {
    render(<FirmStory />);
    expect(screen.getByRole("heading", { name: /our story/i })).toBeInTheDocument();
  });

  it("renders the four firm values", () => {
    render(<FirmStory />);
    expect(screen.getByText("Integrity")).toBeInTheDocument();
    expect(screen.getByText("Precision")).toBeInTheDocument();
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  it("mentions the full legal name", () => {
    render(<FirmStory />);
    expect(screen.getByText(/JIN Legal Counsel/i)).toBeInTheDocument();
  });
});
