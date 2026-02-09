import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert, AlertDescription, AlertTitle } from "./index";

describe("Alert Component", () => {
  it("renders the Alert component with default variant", () => {
    render(<Alert>Default Alert</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Default Alert");
    expect(alert).toHaveClass("bg-background text-foreground");
  });

  it("renders the Alert component with destructive variant", () => {
    render(<Alert variant="destructive">Destructive Alert</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Destructive Alert");
    expect(alert).toHaveClass("text-destructive");
  });

  it("applies additional class names to the Alert component", () => {
    render(<Alert className="custom-class">Custom Alert</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("custom-class");
  });
});

describe("AlertTitle Component", () => {
  it("renders the AlertTitle component", () => {
    render(<AlertTitle>Alert Title</AlertTitle>);
    const title = screen.getByText("Alert Title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("mb-1 font-medium leading-none tracking-tight");
  });

  it("applies additional class names to the AlertTitle component", () => {
    render(
      <AlertTitle className="custom-title-class">Custom Title</AlertTitle>
    );
    const title = screen.getByText("Custom Title");
    expect(title).toHaveClass("custom-title-class");
  });
});

describe("AlertDescription Component", () => {
  it("renders the AlertDescription component", () => {
    render(<AlertDescription>Alert Description</AlertDescription>);
    const description = screen.getByText("Alert Description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-sm [&_p]:leading-relaxed");
  });

  it("applies additional class names to the AlertDescription component", () => {
    render(
      <AlertDescription className="custom-description-class">
        Custom Description
      </AlertDescription>
    );
    const description = screen.getByText("Custom Description");
    expect(description).toHaveClass("custom-description-class");
  });
});
