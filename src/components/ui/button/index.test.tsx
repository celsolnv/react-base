import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from ".";

describe("Button", () => {
  it("should render correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render correctly with custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByText("Click me")).toHaveClass("custom-class");
  });

  it("should render correctly with custom disabled className", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText("Click me")).toHaveClass(
      "disabled:cursor-not-allowed"
    );
  });
});
