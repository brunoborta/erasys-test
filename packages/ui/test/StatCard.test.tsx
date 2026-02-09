import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatCard } from "../src/StatCard";

describe("StatCard", () => {
  it("renders the value", () => {
    render(<StatCard value={42} label="Photos" />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders the label", () => {
    render(<StatCard value={42} label="Photos" />);
    expect(screen.getByText("Photos")).toBeInTheDocument();
  });

  it("renders value as a number, not string", () => {
    render(<StatCard value={0} label="Empty" />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
