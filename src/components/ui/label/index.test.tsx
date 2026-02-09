import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Label } from "./index";

describe("Label Component", () => {
  it("renders correctly with default props", () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Label className="custom-class">Test Label</Label>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("handles ref forwarding", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Test Label</Label>);
    expect(ref.current).not.toBeNull();
  });

  it("applies disabled styles when peer-disabled is present", () => {
    const { container } = render(
      <div className="peer-disabled">
        <Label>Test Label</Label>
      </div>
    );
    expect(container.firstChild?.firstChild).toHaveClass(
      "peer-disabled:cursor-not-allowed"
    );
    expect(container.firstChild?.firstChild).toHaveClass(
      "peer-disabled:opacity-70"
    );
  });
});
