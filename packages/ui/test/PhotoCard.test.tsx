import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PhotoCard } from "../src/PhotoCard";

describe("PhotoCard", () => {
  it("renders the image slot", () => {
    render(<PhotoCard imageSlot={<img alt="test" data-testid="image" />} aspectRatio={1.5} />);
    expect(screen.getByTestId("image")).toBeInTheDocument();
  });

  it("renders the overlay slot when provided", () => {
    render(
      <PhotoCard
        imageSlot={<img alt="test" />}
        overlaySlot={<div data-testid="overlay">Overlay</div>}
        aspectRatio={1.5}
      />
    );
    expect(screen.getByTestId("overlay")).toBeInTheDocument();
  });

  it("renders the caption slot when provided", () => {
    render(
      <PhotoCard
        imageSlot={<img alt="test" />}
        captionSlot={<p data-testid="caption">Caption</p>}
        aspectRatio={1.5}
      />
    );
    expect(screen.getByTestId("caption")).toBeInTheDocument();
  });

  it("applies aspect ratio style", () => {
    const { container } = render(<PhotoCard imageSlot={<img alt="test" />} aspectRatio={1.5} />);
    const aspectDiv = container.querySelector('[style*="aspect-ratio"]');
    expect(aspectDiv).toHaveStyle({ aspectRatio: "1.5" });
  });

  it("applies custom className", () => {
    const { container } = render(
      <PhotoCard imageSlot={<img alt="test" />} aspectRatio={1.5} className="custom-class" />
    );
    const card = container.querySelector(".custom-class");
    expect(card).toBeInTheDocument();
  });
});
