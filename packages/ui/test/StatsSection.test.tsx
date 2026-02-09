import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatsSection } from "../src/StatsSection";

describe("StatsSection", () => {
  const stats = [
    { value: 10, label: "Photos" },
    { value: 5, label: "Albums" },
    { value: 100, label: "Views" },
  ];

  it("renders the correct number of stat cards", () => {
    render(<StatsSection stats={stats} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("renders all labels", () => {
    render(<StatsSection stats={stats} />);
    expect(screen.getByText("Photos")).toBeInTheDocument();
    expect(screen.getByText("Albums")).toBeInTheDocument();
    expect(screen.getByText("Views")).toBeInTheDocument();
  });

  it("has an aria-label on the section", () => {
    render(<StatsSection stats={stats} />);
    const section = screen.getByRole("region", {
      name: "Photo Gallery Statistics",
    });
    expect(section).toBeInTheDocument();
  });

  it("renders empty section when stats array is empty", () => {
    render(<StatsSection stats={[]} />);
    const section = screen.getByRole("region", {
      name: "Photo Gallery Statistics",
    });
    expect(section.children).toHaveLength(0);
  });
});
