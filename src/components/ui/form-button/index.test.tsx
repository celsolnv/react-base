import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FormButton } from "./index";

describe("FormButton Component", () => {
  it("renders with default props", () => {
    render(<FormButton>Submit</FormButton>);

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("w-full");
  });

  it("renders with secondary variant", () => {
    render(<FormButton variant="secondary">Cancel</FormButton>);

    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button).toHaveClass("bg-stone-200");
  });

  it("renders with outline variant", () => {
    render(<FormButton variant="outline">Back</FormButton>);

    const button = screen.getByRole("button", { name: "Back" });
    expect(button).toHaveClass("border-stone-200");
  });

  it("respects fullWidth prop", () => {
    render(<FormButton fullWidth={false}>Submit</FormButton>);

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).not.toHaveClass("w-full");
  });

  it("applies custom className", () => {
    render(<FormButton className="custom-button">Submit</FormButton>);

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveClass("custom-button");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    render(<FormButton onClick={handleClick}>Click Me</FormButton>);

    const button = screen.getByRole("button", { name: "Click Me" });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<FormButton disabled>Submit</FormButton>);

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toBeDisabled();
  });
});
