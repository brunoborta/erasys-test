import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProfileHeader } from "../src/ProfileHeader";

describe("ProfileHeader", () => {
  it("renders the name as an h1", () => {
    render(<ProfileHeader name="John Doe" profileId="abc123" />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("John Doe");
  });

  it("renders the headline when provided", () => {
    render(<ProfileHeader name="John Doe" headline="Software Engineer" profileId="abc123" />);
    const headline = screen.getByRole("heading", { level: 2 });
    expect(headline).toHaveTextContent("Software Engineer");
  });

  it("does not render headline when omitted", () => {
    render(<ProfileHeader name="John Doe" profileId="abc123" />);
    const headline = screen.queryByRole("heading", { level: 2 });
    expect(headline).not.toBeInTheDocument();
  });

  it("renders the profile ID", () => {
    render(<ProfileHeader name="John Doe" profileId="abc123" />);
    expect(screen.getByText(/abc123/)).toBeInTheDocument();
  });

  it("has a sr-only label for Profile ID", () => {
    render(<ProfileHeader name="John Doe" profileId="abc123" />);
    const dt = screen.getByText("Profile ID", { selector: "dt" });
    expect(dt).toHaveClass("sr-only");
  });
});
