import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Credentials } from "@/components/about/credentials";

describe("Credentials", () => {
  it("renders section heading", () => {
    render(<Credentials />);
    expect(screen.getByRole("heading", { name: /credentials/i })).toBeInTheDocument();
  });

  it("lists all four credential items", () => {
    render(<Credentials />);
    expect(screen.getByText(/Business Identification Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Tax Registration/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard Certificate/i)).toBeInTheDocument();
    expect(screen.getByText(/Registered Practice/i)).toBeInTheDocument();
  });
});
