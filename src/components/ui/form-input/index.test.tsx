import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FormInput } from "./index";

describe("FormInput Component", () => {
  it("renders with required props", () => {
    render(<FormInput label="Username" />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders different input types", () => {
    render(<FormInput label="Password" type="password" />);

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("shows placeholder text", () => {
    render(<FormInput label="Email" placeholder="your@email.com" />);

    expect(screen.getByPlaceholderText("your@email.com")).toBeInTheDocument();
  });

  it("handles value changes", async () => {
    const handleChange = vi.fn();
    render(<FormInput label="Name" onChange={handleChange} />);

    const input = screen.getByLabelText("Name");
    await userEvent.type(input, "John Doe");

    expect(handleChange).toHaveBeenCalled();
  });

  it("displays error message when provided", () => {
    render(<FormInput label="Email" error="Invalid email format" />);

    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("border-red-500");
  });

  it("marks input as required when specified", () => {
    render(<FormInput label="Username" required />);

    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("required");
  });

  it("applies correct id attribute", () => {
    render(<FormInput label="Custom Field" id="custom-id" />);

    const input = screen.getByLabelText("Custom Field");
    expect(input).toHaveAttribute("id", "custom-id");
  });

  it("uses default value when provided", () => {
    render(<FormInput label="Username" defaultValue="admin" />);

    expect(screen.getByDisplayValue("admin")).toBeInTheDocument();
  });
});
