import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./index";

describe("Badge Component", () => {
  it("renders with default variant", () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    expect(container.firstChild).toHaveClass(
      "bg-primary text-primary-foreground"
    );
  });

  it("renders with secondary variant", () => {
    const { container } = render(
      <Badge variant="secondary">Secondary Badge</Badge>
    );
    expect(container.firstChild).toHaveClass(
      "bg-secondary text-secondary-foreground"
    );
  });

  it("renders with destructive variant", () => {
    const { container } = render(
      <Badge variant="destructive">Destructive Badge</Badge>
    );
    expect(container.firstChild).toHaveClass(
      "bg-destructive text-destructive-foreground"
    );
  });

  it("renders with outline variant", () => {
    const { container } = render(
      <Badge variant="outline">Outline Badge</Badge>
    );
    expect(container.firstChild).toHaveClass("text-foreground");
  });

  it("applies additional class names", () => {
    const { container } = render(
      <Badge className="custom-class">Custom Badge</Badge>
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders children correctly", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });
});
