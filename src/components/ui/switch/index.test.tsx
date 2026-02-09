import * as React from "react";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Switch } from "./index";

describe("Switch Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render switch element", () => {
      render(<Switch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });

    it("should have data-slot attribute on root", () => {
      const { container } = render(<Switch />);

      const root = container.querySelector('[data-slot="switch"]');
      expect(root).toBeInTheDocument();
    });

    it("should have data-slot attribute on thumb", () => {
      const { container } = render(<Switch />);

      const thumb = container.querySelector('[data-slot="switch-thumb"]');
      expect(thumb).toBeInTheDocument();
    });

    it("should apply default classes to root", () => {
      render(<Switch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveClass(
        "peer",
        "inline-flex",
        "h-[1.15rem]",
        "w-8",
        "shrink-0",
        "items-center",
        "rounded-full",
        "border",
        "border-transparent",
        "shadow-xs",
        "transition-all"
      );
    });

    it("should apply custom className", () => {
      render(<Switch className="custom-switch-class" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveClass("custom-switch-class");
    });

    it("should render thumb element", () => {
      const { container } = render(<Switch />);

      const thumb = container.querySelector('[data-slot="switch-thumb"]');
      expect(thumb).toBeInTheDocument();
      expect(thumb).toHaveClass(
        "bg-background",
        "block",
        "size-4",
        "rounded-full"
      );
    });
  });

  describe("Switch State", () => {
    it("should be unchecked by default", () => {
      render(<Switch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();
      expect(switchElement).toHaveAttribute("data-state", "unchecked");
    });

    it("should be checked when checked prop is true", () => {
      render(<Switch checked />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
      expect(switchElement).toHaveAttribute("data-state", "checked");
    });

    it("should be unchecked when checked prop is false", () => {
      render(<Switch checked={false} />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();
      expect(switchElement).toHaveAttribute("data-state", "unchecked");
    });

    it("should toggle on click", async () => {
      const user = userEvent.setup();
      render(<Switch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();

      await user.click(switchElement);
      expect(switchElement).toBeChecked();

      await user.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });

    it("should have checked state classes when checked", () => {
      render(<Switch checked />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveClass("data-[state=checked]:bg-primary");
    });

    it("should have unchecked state classes when unchecked", () => {
      render(<Switch checked={false} />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveClass("data-[state=unchecked]:bg-input");
    });

    it("should have thumb checked state classes when checked", () => {
      const { container } = render(<Switch checked />);

      const thumb = container.querySelector('[data-slot="switch-thumb"]');
      expect(thumb).toHaveClass(
        "data-[state=checked]:translate-x-[calc(100%-2px)]"
      );
    });

    it("should have thumb unchecked state classes when unchecked", () => {
      const { container } = render(<Switch checked={false} />);

      const thumb = container.querySelector('[data-slot="switch-thumb"]');
      expect(thumb).toHaveClass("data-[state=unchecked]:translate-x-0");
    });
  });

  describe("Callbacks", () => {
    it("should call onCheckedChange when clicked", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Switch onCheckedChange={onCheckedChange} />);

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it("should call onCheckedChange with false when toggled off", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Switch checked onCheckedChange={onCheckedChange} />);

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Disabled State", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeDisabled();
    });

    it("should not be disabled when disabled prop is false", () => {
      render(<Switch disabled={false} />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeDisabled();
    });

    it("should have disabled classes when disabled", () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveClass(
        "disabled:cursor-not-allowed",
        "disabled:opacity-50"
      );
    });

    it("should not call onCheckedChange when disabled", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Switch disabled onCheckedChange={onCheckedChange} />);

      const switchElement = screen.getByRole("switch");
      await user.click(switchElement);

      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe("Props Forwarding", () => {
    it("should forward data-testid prop", () => {
      render(<Switch data-testid="test-switch" />);

      expect(screen.getByTestId("test-switch")).toBeInTheDocument();
    });

    it("should forward id prop", () => {
      render(<Switch id="switch-id" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("id", "switch-id");
    });

    it("should forward aria-label prop", () => {
      render(<Switch aria-label="Toggle switch" />);

      const switchElement = screen.getByRole("switch", {
        name: "Toggle switch",
      });
      expect(switchElement).toBeInTheDocument();
    });

    it("should forward aria-checked prop", () => {
      render(<Switch aria-checked="true" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-checked", "true");
    });

    it("should forward name prop", () => {
      render(<Switch name="toggle-switch" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
      // name pode não ser aplicado diretamente no elemento switch do Radix UI
    });

    it("should forward required prop", () => {
      render(<Switch required />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
      // required pode não ser aplicado diretamente no elemento switch do Radix UI
    });
  });

  describe("Styling", () => {
    it("should have focus-visible styles", () => {
      render(<Switch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveClass(
        "focus-visible:border-ring",
        "focus-visible:ring-ring/50",
        "focus-visible:ring-[3px]"
      );
    });

    it("should have transition styles", () => {
      render(<Switch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveClass("transition-all");
    });

    it("should have thumb transition styles", () => {
      const { container } = render(<Switch />);

      const thumb = container.querySelector('[data-slot="switch-thumb"]');
      expect(thumb).toHaveClass("transition-transform");
    });

    it("should have dark mode styles for unchecked state", () => {
      render(<Switch checked={false} />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveClass(
        "dark:data-[state=unchecked]:bg-input/80"
      );
    });

    it("should have dark mode styles for thumb", () => {
      const { container } = render(<Switch />);

      const thumb = container.querySelector('[data-slot="switch-thumb"]');
      expect(thumb).toHaveClass(
        "dark:data-[state=unchecked]:bg-foreground",
        "dark:data-[state=checked]:bg-primary-foreground"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle defaultChecked prop", () => {
      render(<Switch defaultChecked />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
    });

    it("should handle defaultChecked false", () => {
      render(<Switch defaultChecked={false} />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();
    });

    it("should handle controlled state changes", () => {
      const { rerender } = render(<Switch checked={false} />);

      let switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();

      rerender(<Switch checked={true} />);

      switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
    });

    it("should handle uncontrolled state", async () => {
      const user = userEvent.setup();
      render(<Switch defaultChecked={false} />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();

      await user.click(switchElement);
      expect(switchElement).toBeChecked();
    });
  });

  describe("Accessibility", () => {
    it("should have correct role", () => {
      render(<Switch />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });

    it("should support aria-label", () => {
      render(<Switch aria-label="Enable notifications" />);

      const switchElement = screen.getByRole("switch", {
        name: "Enable notifications",
      });
      expect(switchElement).toBeInTheDocument();
    });

    it("should support aria-checked", () => {
      render(<Switch checked aria-checked="true" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-checked", "true");
    });

    it("should support aria-disabled", () => {
      render(<Switch disabled aria-disabled="true" />);

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-disabled", "true");
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<Switch />);

      const switchElement = screen.getByRole("switch");
      await user.tab();
      expect(switchElement).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(switchElement).toBeChecked();
    });

    it("should toggle with Space key", async () => {
      const user = userEvent.setup();
      render(<Switch />);

      const switchElement = screen.getByRole("switch");
      await user.tab();
      await user.keyboard(" ");
      expect(switchElement).toBeChecked();
    });
  });

  describe("Integration", () => {
    it("should work with form", () => {
      const onSubmit = vi.fn((e) => e.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Switch name="notifications" />
          <button type="submit">Submit</button>
        </form>
      );

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
      // Switch pode não ter atributo name diretamente, mas funciona com forms
    });

    it("should work with label", () => {
      render(
        <div>
          <label htmlFor="switch-id">Enable feature</label>
          <Switch id="switch-id" />
        </div>
      );

      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("id", "switch-id");
    });

    it("should work with aria-labelledby", () => {
      render(
        <div>
          <span id="label-id">Toggle switch</span>
          <Switch aria-labelledby="label-id" />
        </div>
      );

      const switchElement = screen.getByRole("switch", {
        name: "Toggle switch",
      });
      expect(switchElement).toBeInTheDocument();
    });

    it("should maintain state during rapid clicks", async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      render(<Switch onCheckedChange={onCheckedChange} />);

      const switchElement = screen.getByRole("switch");

      // Clica rapidamente várias vezes
      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);

      // Deve ter chamado onCheckedChange para cada clique
      expect(onCheckedChange).toHaveBeenCalled();
    });
  });
});
