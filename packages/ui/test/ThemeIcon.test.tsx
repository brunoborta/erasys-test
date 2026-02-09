import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ThemeIcon } from "../src/ThemeIcon";

describe("ThemeIcon", () => {
  it('renders moon path for "light" theme', () => {
    const { container } = render(<ThemeIcon theme="light" />);
    const path = container.querySelector("path")!;
    expect(path.getAttribute("d")).toContain("M20.354 15.354");
  });

  it('renders sun path for "dark" theme', () => {
    const { container } = render(<ThemeIcon theme="dark" />);
    const path = container.querySelector("path")!;
    expect(path.getAttribute("d")).toContain("M12 3v1m0 16v1");
  });

  it("renders an SVG with aria-hidden", () => {
    const { container } = render(<ThemeIcon theme="light" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
