import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Overlay } from "../src/Overlay";

describe("Overlay", () => {
  it("renders title when provided", () => {
    render(<Overlay title="My Title" />);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<Overlay subtitle="My Subtitle" />);
    expect(screen.getByText("My Subtitle")).toBeInTheDocument();
  });

  it("renders both title and subtitle", () => {
    render(<Overlay title="Title" subtitle="Subtitle" />);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });

  it("does not render title element when title is omitted", () => {
    const { container } = render(<Overlay subtitle="Sub" />);
    const children = container.firstChild!.childNodes;
    expect(children).toHaveLength(1);
    expect(screen.getByText("Sub")).toBeInTheDocument();
  });

  it("does not render subtitle element when subtitle is omitted", () => {
    const { container } = render(<Overlay title="Title" />);
    const children = container.firstChild!.childNodes;
    expect(children).toHaveLength(1);
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("renders empty overlay when no props provided", () => {
    const { container } = render(<Overlay />);
    expect(container.firstChild!.childNodes).toHaveLength(0);
  });
});
