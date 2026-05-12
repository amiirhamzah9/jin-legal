import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactInfo } from "@/components/contact/contact-info";

describe("ContactInfo", () => {
  it("renders office address", () => {
    render(<ContactInfo />);
    expect(screen.getByText(/Jakarta/i)).toBeInTheDocument();
  });

  it("renders email and phone", () => {
    render(<ContactInfo />);
    expect(screen.getByText(/hamzah@jin-legal\.com/i)).toBeInTheDocument();
    expect(screen.getByText(/\+62/)).toBeInTheDocument();
  });

  it("renders working hours", () => {
    render(<ContactInfo />);
    expect(screen.getByText(/monday/i)).toBeInTheDocument();
  });
});
