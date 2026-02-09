import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./index";

describe("Input Component", () => {
  it("renders correctly with default props", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("h-10", "w-full");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLInputElement>;
    render(<Input ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current instanceof HTMLInputElement).toBe(true);
  });

  it("accepts and updates value", async () => {
    const onChange = vi.fn();
    render(<Input value="test" onChange={onChange} />);

    const input = screen.getByDisplayValue("test");
    await userEvent.clear(input);
    await userEvent.type(input, "new value");

    expect(onChange).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");

    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:cursor-not-allowed");
  });

  it("accepts custom className", () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("custom-class");
  });

  it("passes additional props to the input element", () => {
    render(<Input data-testid="test-input" />);

    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });
});
