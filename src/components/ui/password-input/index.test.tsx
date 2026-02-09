import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PasswordInput } from "./index";

describe("PasswordInput", () => {
  it("renders the PasswordInput component", () => {
    render(<PasswordInput data-testid="password-input" />);
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("disables the toggle button when input is empty or undefined", () => {
    render(<PasswordInput value="" />);
    const toggleButton = screen.getByRole("button", { name: /show password/i });
    expect(toggleButton).toBeDisabled();
  });

  it("renders the loading skeleton when loading is true", () => {
    const { container } = render(<PasswordInput loading />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toBeInTheDocument();
  });

  it("applies additional class names to the input", () => {
    render(<PasswordInput data-testid="textbox" className="custom-class" />);
    const input = screen.getByTestId("textbox");
    expect(input).toHaveClass("custom-class");
  });

  it("forwards refs to the input element", () => {
    const ref = vi.fn();
    render(<PasswordInput ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });
});
