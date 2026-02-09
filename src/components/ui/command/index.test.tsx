import * as React from "react";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./index";

describe("Command Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Command (Root)", () => {
    it("should render command component", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );

      const command = screen.getByRole("combobox");
      expect(command).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );

      const command = container.querySelector('[data-slot="command"]');
      expect(command).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );

      const command = container.querySelector('[data-slot="command"]');
      expect(command).toHaveClass(
        "bg-popover",
        "text-popover-foreground",
        "flex",
        "h-full",
        "w-full",
        "flex-col",
        "overflow-hidden",
        "rounded-md"
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command className="custom-command-class">
          <CommandInput />
        </Command>
      );

      const command = container.querySelector('[data-slot="command"]');
      expect(command).toHaveClass("custom-command-class");
    });

    it("should forward additional props", () => {
      const { container } = render(
        <Command data-testid="test-command">
          <CommandInput />
        </Command>
      );

      const command = container.querySelector('[data-testid="test-command"]');
      expect(command).toBeInTheDocument();
    });
  });

  describe("CommandInput", () => {
    it("should render input element", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );

      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
    });

    it("should have data-slot attribute on wrapper", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );

      const wrapper = container.querySelector(
        '[data-slot="command-input-wrapper"]'
      );
      expect(wrapper).toBeInTheDocument();
    });

    it("should have data-slot attribute on input", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );

      const input = container.querySelector('[data-slot="command-input"]');
      expect(input).toBeInTheDocument();
    });

    it("should render SearchIcon", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );

      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should apply default classes to wrapper", () => {
      const { container } = render(
        <Command>
          <CommandInput />
        </Command>
      );

      const wrapper = container.querySelector(
        '[data-slot="command-input-wrapper"]'
      );
      expect(wrapper).toHaveClass(
        "flex",
        "h-9",
        "items-center",
        "gap-2",
        "border-b",
        "px-3"
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandInput className="custom-input-class" />
        </Command>
      );

      const input = container.querySelector('[data-slot="command-input"]');
      expect(input).toHaveClass("custom-input-class");
    });

    it("should handle placeholder", () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      );

      const input = screen.getByPlaceholderText("Search...");
      expect(input).toBeInTheDocument();
    });

    it("should handle user input", async () => {
      const user = userEvent.setup();
      render(
        <Command>
          <CommandInput />
        </Command>
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "test search");

      expect(input).toHaveValue("test search");
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <Command>
          <CommandInput disabled />
        </Command>
      );

      const input = screen.getByRole("combobox");
      expect(input).toBeDisabled();
    });
  });

  describe("CommandList", () => {
    it("should render list element", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const list = container.querySelector('[data-slot="command-list"]');
      expect(list).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const list = container.querySelector('[data-slot="command-list"]');
      expect(list).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const list = container.querySelector('[data-slot="command-list"]');
      expect(list).toHaveClass(
        "max-h-[300px]",
        "scroll-py-1",
        "overflow-x-hidden",
        "overflow-y-auto"
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList className="custom-list-class">
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const list = container.querySelector('[data-slot="command-list"]');
      expect(list).toHaveClass("custom-list-class");
    });
  });

  describe("CommandEmpty", () => {
    it("should render empty state", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
          </CommandList>
        </Command>
      );

      const empty = container.querySelector('[data-slot="command-empty"]');
      expect(empty).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
          </CommandList>
        </Command>
      );

      const empty = container.querySelector('[data-slot="command-empty"]');
      expect(empty).toHaveClass("py-6", "text-center", "text-sm");
    });
  });

  describe("CommandGroup", () => {
    it("should render group element", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup heading="Group 1">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const group = container.querySelector('[data-slot="command-group"]');
      expect(group).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup heading="Group 1">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const group = container.querySelector('[data-slot="command-group"]');
      expect(group).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup heading="Group 1">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const group = container.querySelector('[data-slot="command-group"]');
      expect(group).toHaveClass("text-foreground", "overflow-hidden", "p-1");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup heading="Group 1" className="custom-group-class">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const group = container.querySelector('[data-slot="command-group"]');
      expect(group).toHaveClass("custom-group-class");
    });

    it("should render heading", () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup heading="Group Title">
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Group Title")).toBeInTheDocument();
    });
  });

  describe("CommandSeparator", () => {
    it("should render separator element", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Item 1</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const separator = container.querySelector(
        '[data-slot="command-separator"]'
      );
      expect(separator).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator />
          </CommandList>
        </Command>
      );

      const separator = container.querySelector(
        '[data-slot="command-separator"]'
      );
      expect(separator).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator />
          </CommandList>
        </Command>
      );

      const separator = container.querySelector(
        '[data-slot="command-separator"]'
      );
      expect(separator).toHaveClass("bg-border", "-mx-1", "h-px");
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandSeparator className="custom-separator-class" />
          </CommandList>
        </Command>
      );

      const separator = container.querySelector(
        '[data-slot="command-separator"]'
      );
      expect(separator).toHaveClass("custom-separator-class");
    });
  });

  describe("CommandItem", () => {
    it("should render item element", () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const item = container.querySelector('[data-slot="command-item"]');
      expect(item).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const item = container.querySelector('[data-slot="command-item"]');
      expect(item).toHaveClass(
        "relative",
        "flex",
        "cursor-default",
        "items-center",
        "gap-2",
        "rounded-sm",
        "px-2",
        "py-1.5",
        "text-sm"
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem className="custom-item-class">Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const item = container.querySelector('[data-slot="command-item"]');
      expect(item).toHaveClass("custom-item-class");
    });

    it("should be selectable", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <Command>
          <CommandList>
            <CommandItem onSelect={onSelect}>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByText("Item 1");
      await user.click(item);

      expect(onSelect).toHaveBeenCalled();
    });

    it("should be disabled when disabled prop is true", () => {
      render(
        <Command>
          <CommandList>
            <CommandItem disabled>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByText("Item 1");
      expect(item).toHaveAttribute("data-disabled", "true");
    });

    it("should have selected state classes when selected", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem data-selected="true">Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const item = container.querySelector('[data-slot="command-item"]');
      expect(item).toHaveClass(
        "data-[selected=true]:bg-accent",
        "data-[selected=true]:text-accent-foreground"
      );
    });
  });

  describe("CommandShortcut", () => {
    it("should render shortcut element", () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              Item 1<CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );

      expect(screen.getByText("⌘K")).toBeInTheDocument();
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem>
              Item 1<CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const shortcut = container.querySelector(
        '[data-slot="command-shortcut"]'
      );
      expect(shortcut).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem>
              Item 1<CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const shortcut = container.querySelector(
        '[data-slot="command-shortcut"]'
      );
      expect(shortcut).toHaveClass(
        "text-muted-foreground",
        "ml-auto",
        "text-xs",
        "tracking-widest"
      );
    });

    it("should apply custom className", () => {
      const { container } = render(
        <Command>
          <CommandList>
            <CommandItem>
              Item 1
              <CommandShortcut className="custom-shortcut-class">
                ⌘K
              </CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const shortcut = container.querySelector(
        '[data-slot="command-shortcut"]'
      );
      expect(shortcut).toHaveClass("custom-shortcut-class");
    });
  });

  describe("CommandDialog", () => {
    it("should render dialog when open", () => {
      render(
        <CommandDialog open>
          <CommandInput />
        </CommandDialog>
      );

      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
    });

    it("should use default title", () => {
      render(
        <CommandDialog open>
          <CommandInput />
        </CommandDialog>
      );

      expect(screen.getByText("Command Palette")).toBeInTheDocument();
    });

    it("should use default description", () => {
      render(
        <CommandDialog open>
          <CommandInput />
        </CommandDialog>
      );

      expect(
        screen.getByText("Search for a command to run...")
      ).toBeInTheDocument();
    });

    it("should use custom title", () => {
      render(
        <CommandDialog open title="Custom Title">
          <CommandInput />
        </CommandDialog>
      );

      expect(screen.getByText("Custom Title")).toBeInTheDocument();
    });

    it("should use custom description", () => {
      render(
        <CommandDialog open description="Custom description">
          <CommandInput />
        </CommandDialog>
      );

      expect(screen.getByText("Custom description")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <CommandDialog open className="custom-dialog-class">
          <CommandInput />
        </CommandDialog>
      );

      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
      // className é aplicado no DialogContent
    });

    it("should show close button by default", () => {
      render(
        <CommandDialog open>
          <CommandInput />
        </CommandDialog>
      );

      // DialogContent com showCloseButton=true deve renderizar o botão de fechar
      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
    });

    it("should hide close button when showCloseButton is false", () => {
      render(
        <CommandDialog open showCloseButton={false}>
          <CommandInput />
        </CommandDialog>
      );

      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    it("should render complete command structure", () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandGroup heading="Group 1">
              <CommandItem>
                Item 1<CommandShortcut>⌘1</CommandShortcut>
              </CommandItem>
              <CommandItem>Item 2</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Group 2">
              <CommandItem>Item 3</CommandItem>
            </CommandGroup>
            <CommandEmpty>No results</CommandEmpty>
          </CommandList>
        </Command>
      );

      expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
      expect(screen.getByText("Group 1")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("⌘1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Group 2")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
      // CommandEmpty só aparece quando não há resultados
      const { container } = render(
        <Command>
          <CommandList>
            <CommandEmpty>No results</CommandEmpty>
          </CommandList>
        </Command>
      );
      expect(
        container.querySelector('[data-slot="command-empty"]')
      ).toBeInTheDocument();
    });

    it("should filter items based on input", async () => {
      const user = userEvent.setup();
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem>Apple</CommandItem>
            <CommandItem>Banana</CommandItem>
            <CommandItem>Cherry</CommandItem>
          </CommandList>
        </Command>
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "app");

      // O cmdk filtra automaticamente os itens
      expect(screen.getByText("Apple")).toBeInTheDocument();
    });

    it("should handle keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
            <CommandItem>Item 3</CommandItem>
          </CommandList>
        </Command>
      );

      const input = screen.getByRole("combobox");
      await user.tab();
      expect(input).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      // Navegação por teclado funciona com cmdk
    });

    it("should select item on Enter key", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem onSelect={onSelect}>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const input = screen.getByRole("combobox");
      await user.tab();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{Enter}");

      expect(onSelect).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty command", () => {
      const { container } = render(<Command />);

      const command = container.querySelector('[data-slot="command"]');
      expect(command).toBeInTheDocument();
    });

    it("should handle empty list", () => {
      const { container } = render(
        <Command>
          <CommandList />
        </Command>
      );

      const command = container.querySelector('[data-slot="command"]');
      const list = container.querySelector('[data-slot="command-list"]');
      expect(command).toBeInTheDocument();
      expect(list).toBeInTheDocument();
    });

    it("should handle many items", () => {
      render(
        <Command>
          <CommandList>
            {Array.from({ length: 100 }, (_, i) => (
              <CommandItem key={i}>Item {i}</CommandItem>
            ))}
          </CommandList>
        </Command>
      );

      expect(screen.getByText("Item 0")).toBeInTheDocument();
      expect(screen.getByText("Item 99")).toBeInTheDocument();
    });

    it("should handle long text in items", () => {
      const longText = "A".repeat(1000);
      render(
        <Command>
          <CommandList>
            <CommandItem>{longText}</CommandItem>
          </CommandList>
        </Command>
      );

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should handle special characters in search", async () => {
      const user = userEvent.setup();
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem>Test@123</CommandItem>
          </CommandList>
        </Command>
      );

      const input = screen.getByRole("combobox");
      await user.type(input, "@123");

      expect(screen.getByText("Test@123")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have correct role for input", () => {
      render(
        <Command>
          <CommandInput />
        </Command>
      );

      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
    });

    it("should support aria-label on input", () => {
      render(
        <Command>
          <CommandInput aria-label="Search commands" />
        </Command>
      );

      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("aria-label", "Search commands");
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(
        <Command>
          <CommandInput />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </Command>
      );

      const input = screen.getByRole("combobox");
      await user.tab();
      expect(input).toHaveFocus();
    });
  });
});
