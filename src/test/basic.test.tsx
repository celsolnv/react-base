import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Basic Test", () => {
  it("should work", () => {
    render(<div>Test Component</div>);
    expect(screen.getByText("Test Component")).toBeInTheDocument();
  });
});
