import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./index";

describe("Checkbox Component", () => {
  it("renders correctly", () => {
    render(<Checkbox />);

    // Radix UI's Checkbox is a button with role="checkbox"
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("can be checked and unchecked", async () => {
    render(<Checkbox id="test-checkbox" />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("can be disabled", () => {
    render(<Checkbox disabled />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeDisabled();
  });

  it("accepts a default checked state", () => {
    render(<Checkbox defaultChecked />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("can have a custom className", () => {
    render(<Checkbox className="custom-checkbox" />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveClass("custom-checkbox");
  });

  it("calls onCheckedChange when clicked", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole("checkbox");
    await userEvent.click(checkbox);

    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});
