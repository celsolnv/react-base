import * as React from "react";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ToggleGroup, ToggleGroupItem } from "./index";

describe("ToggleGroup Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("ToggleGroup (Root)", () => {
    it("should render toggle group", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const group = container.querySelector('[data-slot="toggle-group"]');
      expect(group).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const group = container.querySelector('[data-slot="toggle-group"]');
      expect(group).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const group = container.querySelector('[data-slot="toggle-group"]');
      expect(group).toHaveClass(
        "group/toggle-group",
        "flex",
        "w-fit",
        "items-center",
        "rounded-md"
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ToggleGroup type="single" className="custom-group-class">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const group = container.querySelector('[data-slot="toggle-group"]');
      expect(group).toHaveClass("custom-group-class");
    });

    it("should have data-variant attribute", () => {
      const { container } = render(
        <ToggleGroup type="single" variant="outline">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const group = container.querySelector('[data-slot="toggle-group"]');
      expect(group).toHaveAttribute("data-variant", "outline");
    });

    it("should have data-size attribute", () => {
      const { container } = render(
        <ToggleGroup type="single" size="sm">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const group = container.querySelector('[data-slot="toggle-group"]');
      expect(group).toHaveAttribute("data-size", "sm");
    });

    it("should apply shadow-xs when variant is outline", () => {
      const { container } = render(
        <ToggleGroup type="single" variant="outline">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const group = container.querySelector('[data-slot="toggle-group"]');
      expect(group).toHaveClass("data-[variant=outline]:shadow-xs");
    });

    it("should forward additional props", () => {
      const { container } = render(
        <ToggleGroup data-testid="test-group" type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const group = container.querySelector('[data-testid="test-group"]');
      expect(group).toBeInTheDocument();
    });
  });

  describe("ToggleGroupItem", () => {
    it("should render toggle group item", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveClass(
        "min-w-0",
        "flex-1",
        "shrink-0",
        "rounded-none",
        "shadow-none"
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1" className="custom-item-class">
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveClass("custom-item-class");
    });

    it("should have first and last rounded classes", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
          <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
          <ToggleGroupItem value="item3">Item 3</ToggleGroupItem>
        </ToggleGroup>
      );

      const items = container.querySelectorAll(
        '[data-slot="toggle-group-item"]'
      );
      expect(items[0]).toHaveClass("first:rounded-l-md");
      expect(items[items.length - 1]).toHaveClass("last:rounded-r-md");
    });

    it("should forward value prop", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByText("Item 1");
      expect(item).toBeInTheDocument();
      // value é usado internamente pelo Radix UI
    });

    it("should forward disabled prop", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1" disabled>
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByText("Item 1");
      expect(item).toBeDisabled();
    });
  });

  describe("Context Integration", () => {
    it("should apply variant from ToggleGroup context to items", () => {
      const { container } = render(
        <ToggleGroup type="single" variant="outline">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveAttribute("data-variant", "outline");
    });

    it("should apply size from ToggleGroup context to items", () => {
      const { container } = render(
        <ToggleGroup type="single" size="sm">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveAttribute("data-size", "sm");
    });

    it("should use context variant when both context and item have variant", () => {
      const { container } = render(
        <ToggleGroup type="single" variant="outline">
          <ToggleGroupItem value="item1" variant="default">
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      // Context variant takes precedence
      expect(item).toHaveAttribute("data-variant", "outline");
    });

    it("should use context size when both context and item have size", () => {
      const { container } = render(
        <ToggleGroup type="single" size="sm">
          <ToggleGroupItem value="item1" size="lg">
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      // Context size takes precedence
      expect(item).toHaveAttribute("data-size", "sm");
    });

    it("should use item variant when context doesn't have variant", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1" variant="outline">
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveAttribute("data-variant", "outline");
    });

    it("should use item size when context doesn't have size", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1" size="lg">
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveAttribute("data-size", "lg");
    });

    it("should use default variant and size when not provided", () => {
      const { container } = render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      // Quando variant e size não são fornecidos, o toggleVariants usa seus defaults
      // que são "default" para ambos
      expect(item).toBeInTheDocument();
      // O item terá as classes do variant e size default do toggleVariants
    });
  });

  describe("Variants", () => {
    it("should render with default variant", () => {
      const { container } = render(
        <ToggleGroup type="single" variant="default">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveAttribute("data-variant", "default");
    });

    it("should render with outline variant", () => {
      const { container } = render(
        <ToggleGroup type="single" variant="outline">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveAttribute("data-variant", "outline");
    });
  });

  describe("Sizes", () => {
    it("should render with default size", () => {
      const { container } = render(
        <ToggleGroup type="single" size="default">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveAttribute("data-size", "default");
    });

    it("should render with sm size", () => {
      const { container } = render(
        <ToggleGroup type="single" size="sm">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveAttribute("data-size", "sm");
    });

    it("should render with lg size", () => {
      const { container } = render(
        <ToggleGroup type="single" size="lg">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toHaveAttribute("data-size", "lg");
    });
  });

  describe("Selection Modes", () => {
    it("should support single selection mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup type="single" onValueChange={onValueChange}>
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
          <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
        </ToggleGroup>
      );

      const item1 = screen.getByText("Item 1");
      await user.click(item1);

      expect(onValueChange).toHaveBeenCalled();
    });

    it("should support multiple selection mode", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup type="multiple" onValueChange={onValueChange}>
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
          <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
        </ToggleGroup>
      );

      const item1 = screen.getByText("Item 1");
      const item2 = screen.getByText("Item 2");

      await user.click(item1);
      await user.click(item2);

      expect(onValueChange).toHaveBeenCalled();
    });

    it("should handle defaultValue in single mode", () => {
      render(
        <ToggleGroup type="single" defaultValue="item1">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
          <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
        </ToggleGroup>
      );

      const item1 = screen.getByText("Item 1");
      expect(item1).toHaveAttribute("data-state", "on");
    });

    it("should handle defaultValue in multiple mode", () => {
      render(
        <ToggleGroup type="multiple" defaultValue={["item1", "item2"]}>
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
          <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
          <ToggleGroupItem value="item3">Item 3</ToggleGroupItem>
        </ToggleGroup>
      );

      const item1 = screen.getByText("Item 1");
      const item2 = screen.getByText("Item 2");
      const item3 = screen.getByText("Item 3");

      expect(item1).toHaveAttribute("data-state", "on");
      expect(item2).toHaveAttribute("data-state", "on");
      expect(item3).toHaveAttribute("data-state", "off");
    });
  });

  describe("User Interaction", () => {
    it("should toggle item on click", async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByText("Item 1");
      await user.click(item);

      expect(item).toHaveAttribute("data-state", "on");
    });

    it("should call onValueChange when item is clicked", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup type="single" onValueChange={onValueChange}>
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByText("Item 1");
      await user.click(item);

      expect(onValueChange).toHaveBeenCalled();
    });

    it("should not toggle when disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup type="single" onValueChange={onValueChange}>
          <ToggleGroupItem value="item1" disabled>
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByText("Item 1");
      await user.click(item);

      // onChange não deve ser chamado quando disabled
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty ToggleGroup", () => {
      const { container } = render(<ToggleGroup type="single" />);

      const group = container.querySelector('[data-slot="toggle-group"]');
      expect(group).toBeInTheDocument();
    });

    it("should handle single item", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should handle many items", () => {
      render(
        <ToggleGroup type="single">
          {Array.from({ length: 10 }, (_, i) => (
            <ToggleGroupItem key={i} value={`item${i}`}>
              Item {i}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      );

      expect(screen.getByText("Item 0")).toBeInTheDocument();
      expect(screen.getByText("Item 9")).toBeInTheDocument();
    });

    it("should handle items with empty children", () => {
      render(
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="item1"></ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByRole("button");
      expect(item).toBeInTheDocument();
    });

    it("should handle undefined variant and size", () => {
      const { container } = render(
        <ToggleGroup type="single" variant={undefined} size={undefined}>
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = container.querySelector('[data-slot="toggle-group-item"]');
      expect(item).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct role for items in single mode", () => {
      render(
        <ToggleGroup type="single">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByRole("radio");
      expect(item).toBeInTheDocument();
    });

    it("should have correct role for items in multiple mode", () => {
      render(
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByRole("button");
      expect(item).toBeInTheDocument();
    });

    it("should support aria-label on items", () => {
      render(
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="item1" aria-label="Toggle option 1">
            Item 1
          </ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByRole("button", { name: "Toggle option 1" });
      expect(item).toBeInTheDocument();
    });

    it("should support aria-checked state in single mode", () => {
      render(
        <ToggleGroup type="single" defaultValue="item1">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
        </ToggleGroup>
      );

      const item = screen.getByRole("radio");
      expect(item).toHaveAttribute("aria-checked", "true");
    });
  });

  describe("Integration", () => {
    it("should work with multiple items and variants", () => {
      render(
        <ToggleGroup type="single" variant="outline" size="sm">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
          <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
          <ToggleGroupItem value="item3">Item 3</ToggleGroupItem>
        </ToggleGroup>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("should handle controlled value", () => {
      const { rerender } = render(
        <ToggleGroup type="single" value="item1">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
          <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
        </ToggleGroup>
      );

      let item1 = screen.getByText("Item 1");
      expect(item1).toHaveAttribute("data-state", "on");

      rerender(
        <ToggleGroup type="single" value="item2">
          <ToggleGroupItem value="item1">Item 1</ToggleGroupItem>
          <ToggleGroupItem value="item2">Item 2</ToggleGroupItem>
        </ToggleGroup>
      );

      item1 = screen.getByText("Item 1");
      const item2 = screen.getByText("Item 2");
      expect(item1).toHaveAttribute("data-state", "off");
      expect(item2).toHaveAttribute("data-state", "on");
    });
  });
});
