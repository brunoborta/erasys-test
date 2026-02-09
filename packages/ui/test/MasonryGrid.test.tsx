import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MasonryGrid } from "../src/MasonryGrid";

describe("MasonryGrid", () => {
  it("renders children", () => {
    render(
      <MasonryGrid>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </MasonryGrid>
    );
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <MasonryGrid className="my-custom-class">
        <div>Child</div>
      </MasonryGrid>
    );
    expect(container.firstChild).toHaveClass("my-custom-class");
  });

  it("works without custom className", () => {
    const { container } = render(
      <MasonryGrid>
        <div>Child</div>
      </MasonryGrid>
    );
    expect(container.firstChild).toHaveClass("columns-1");
  });
});
