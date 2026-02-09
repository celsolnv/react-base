import * as React from "react";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Toggle } from "./index";

describe("Toggle Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render toggle button", () => {
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveTextContent("Toggle");
    });

    it("should have data-slot attribute", () => {
      const { container } = render(<Toggle>Toggle</Toggle>);

      const toggle = container.querySelector('[data-slot="toggle"]');
      expect(toggle).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass(
        "inline-flex",
        "items-center",
        "justify-center",
        "gap-2",
        "rounded-md",
        "text-sm",
        "font-medium"
      );
    });

    it("should apply custom className", () => {
      render(<Toggle className="custom-toggle-class">Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass("custom-toggle-class");
    });

    it("should render with children", () => {
      render(<Toggle>Click me</Toggle>);

      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("should render without children", () => {
      render(<Toggle />);

      const toggle = screen.getByRole("button");
      expect(toggle).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render with default variant", () => {
      render(<Toggle variant="default">Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass("bg-transparent");
    });

    it("should render with outline variant", () => {
      render(<Toggle variant="outline">Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass(
        "border",
        "border-input",
        "bg-transparent",
        "shadow-xs"
      );
    });

    it("should use default variant when not provided", () => {
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass("bg-transparent");
    });
  });

  describe("Sizes", () => {
    it("should render with default size", () => {
      render(<Toggle size="default">Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass("h-9", "px-2", "min-w-9");
    });

    it("should render with sm size", () => {
      render(<Toggle size="sm">Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass("h-8", "px-1.5", "min-w-8");
    });

    it("should render with lg size", () => {
      render(<Toggle size="lg">Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass("h-10", "px-2.5", "min-w-10");
    });

    it("should use default size when not provided", () => {
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass("h-9", "px-2", "min-w-9");
    });
  });

  describe("Toggle State", () => {
    it("should be off by default", () => {
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("data-state", "off");
    });

    it("should be on when pressed is true", () => {
      render(<Toggle pressed>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("data-state", "on");
    });

    it("should be off when pressed is false", () => {
      render(<Toggle pressed={false}>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("data-state", "off");
    });

    it("should toggle on click", async () => {
      const user = userEvent.setup();
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("data-state", "off");

      await user.click(toggle);
      expect(toggle).toHaveAttribute("data-state", "on");

      await user.click(toggle);
      expect(toggle).toHaveAttribute("data-state", "off");
    });

    it("should have on state classes when pressed", () => {
      render(<Toggle pressed>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass(
        "data-[state=on]:bg-accent",
        "data-[state=on]:text-accent-foreground"
      );
    });
  });

  describe("Callbacks", () => {
    it("should call onPressedChange when clicked", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(<Toggle onPressedChange={onPressedChange}>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      await user.click(toggle);

      expect(onPressedChange).toHaveBeenCalledTimes(1);
      expect(onPressedChange).toHaveBeenCalledWith(true);
    });

    it("should call onPressedChange with false when toggled off", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(
        <Toggle pressed onPressedChange={onPressedChange}>
          Toggle
        </Toggle>
      );

      const toggle = screen.getByRole("button");
      await user.click(toggle);

      expect(onPressedChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Disabled State", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Toggle disabled>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toBeDisabled();
    });

    it("should not be disabled when disabled prop is false", () => {
      render(<Toggle disabled={false}>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).not.toBeDisabled();
    });

    it("should have disabled classes when disabled", () => {
      render(<Toggle disabled>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass(
        "disabled:pointer-events-none",
        "disabled:opacity-50"
      );
    });

    it("should not call onPressedChange when disabled", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(
        <Toggle disabled onPressedChange={onPressedChange}>
          Toggle
        </Toggle>
      );

      const toggle = screen.getByRole("button");
      await user.click(toggle);

      expect(onPressedChange).not.toHaveBeenCalled();
    });
  });

  describe("Props Forwarding", () => {
    it("should forward data-testid prop", () => {
      render(<Toggle data-testid="test-toggle">Toggle</Toggle>);

      expect(screen.getByTestId("test-toggle")).toBeInTheDocument();
    });

    it("should forward id prop", () => {
      render(<Toggle id="toggle-id">Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("id", "toggle-id");
    });

    it("should forward aria-label prop", () => {
      render(<Toggle aria-label="Toggle button">Toggle</Toggle>);

      const toggle = screen.getByRole("button", { name: "Toggle button" });
      expect(toggle).toBeInTheDocument();
    });

    it("should forward aria-pressed prop", () => {
      render(<Toggle aria-pressed="true">Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("aria-pressed", "true");
    });

    it("should forward onClick prop", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Toggle onClick={onClick}>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      await user.click(toggle);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Styling", () => {
    it("should have hover styles", () => {
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass(
        "hover:bg-muted",
        "hover:text-muted-foreground"
      );
    });

    it("should have focus-visible styles", () => {
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass(
        "focus-visible:border-ring",
        "focus-visible:ring-ring/50",
        "focus-visible:ring-[3px]"
      );
    });

    it("should have transition styles", () => {
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass("transition-[color,box-shadow]");
    });

    it("should have outline variant hover styles", () => {
      render(<Toggle variant="outline">Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass(
        "hover:bg-accent",
        "hover:text-accent-foreground"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children", () => {
      render(<Toggle></Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toBeInTheDocument();
    });

    it("should handle long text content", () => {
      const longText = "A".repeat(1000);
      render(<Toggle>{longText}</Toggle>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle special characters in children", () => {
      render(<Toggle>Special: !@#$%^&*()</Toggle>);

      expect(screen.getByText(/Special:/)).toBeInTheDocument();
    });

    it("should handle ReactNode children", () => {
      render(
        <Toggle>
          <span>Icon</span> Text
        </Toggle>
      );

      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("should handle undefined variant and size", () => {
      render(
        <Toggle variant={undefined} size={undefined}>
          Toggle
        </Toggle>
      );

      const toggle = screen.getByRole("button");
      expect(toggle).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct role", () => {
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toBeInTheDocument();
    });

    it("should support aria-label", () => {
      render(<Toggle aria-label="Toggle option">Toggle</Toggle>);

      const toggle = screen.getByRole("button", { name: "Toggle option" });
      expect(toggle).toBeInTheDocument();
    });

    it("should support aria-pressed for accessibility", () => {
      render(
        <Toggle pressed aria-pressed="true">
          Toggle
        </Toggle>
      );

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("aria-pressed", "true");
    });

    it("should support aria-disabled", () => {
      render(
        <Toggle disabled aria-disabled="true">
          Toggle
        </Toggle>
      );

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("aria-disabled", "true");
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<Toggle>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      await user.tab();
      expect(toggle).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(toggle).toHaveAttribute("data-state", "on");
    });
  });

  describe("Integration", () => {
    it("should work with controlled state", () => {
      const { rerender } = render(<Toggle pressed={false}>Toggle</Toggle>);

      let toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("data-state", "off");

      rerender(<Toggle pressed={true}>Toggle</Toggle>);

      toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("data-state", "on");
    });

    it("should work with uncontrolled state", async () => {
      const user = userEvent.setup();
      render(<Toggle defaultPressed={false}>Toggle</Toggle>);

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveAttribute("data-state", "off");

      await user.click(toggle);
      expect(toggle).toHaveAttribute("data-state", "on");
    });

    it("should combine variant and size correctly", () => {
      render(
        <Toggle variant="outline" size="sm">
          Toggle
        </Toggle>
      );

      const toggle = screen.getByRole("button");
      expect(toggle).toHaveClass("border", "border-input", "h-8", "px-1.5");
    });

    it("should work with all variant and size combinations", () => {
      const variants = ["default", "outline"] as const;
      const sizes = ["default", "sm", "lg"] as const;

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { unmount } = render(
            <Toggle variant={variant} size={size}>
              Toggle
            </Toggle>
          );

          const toggle = screen.getByRole("button");
          expect(toggle).toBeInTheDocument();
          unmount();
        });
      });
    });
  });
});
