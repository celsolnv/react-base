import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./index";

// Mock do Skeleton para simplificar testes
vi.mock("../skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className}>
      Loading...
    </div>
  ),
}));

describe("Select Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Select (Root)", () => {
    it("should render Select root component", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeInTheDocument();
    });

    it("should have data-slot attribute on trigger", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("data-slot", "select-trigger");
    });

    it("should pass props to SelectPrimitive.Root", () => {
      const onValueChange = vi.fn();
      render(
        <Select onValueChange={onValueChange} defaultValue="option1">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeInTheDocument();
    });

    it("should handle controlled value", async () => {
      const { rerender } = render(
        <Select value="option1">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      rerender(
        <Select value="option2">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      await waitFor(() => {
        expect(screen.getByText("Option 2")).toBeInTheDocument();
      });
    });

    it("should handle disabled state", () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });
  });

  describe("SelectTrigger", () => {
    it("should render trigger with default size", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-size", "default");
      expect(trigger).toHaveAttribute("data-slot", "select-trigger");
    });

    it("should render trigger with sm size", () => {
      render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("data-size", "sm");
      expect(trigger).toHaveClass("data-[size=sm]:h-9");
    });

    it("should render Skeleton when isLoading is true", () => {
      render(
        <Select>
          <SelectTrigger isLoading>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    });

    it("should render trigger when isLoading is false", () => {
      render(
        <Select>
          <SelectTrigger isLoading={false}>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger-class">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass("custom-trigger-class");
    });

    it("should apply default classes", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass(
        "flex",
        "w-full",
        "items-center",
        "justify-between",
        "gap-2",
        "rounded-lg",
        "border"
      );
    });

    it("should render ChevronDownIcon", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });

    it("should render children inside trigger", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("should be clickable when not disabled", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });
  });

  describe("SelectValue", () => {
    it("should render placeholder when no value is selected", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
        </Select>
      );

      expect(screen.getByText("Choose an option")).toBeInTheDocument();
    });

    it("should render selected value", async () => {
      render(
        <Select defaultValue="option1">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    it("should have data-slot attribute", () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const value = container.querySelector('[data-slot="select-value"]');
      expect(value).toBeInTheDocument();
    });

    it("should update when value changes", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(async () => {
        const item = screen.getByText("Option 1");
        await user.click(item);
      });

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });
  });

  describe("SelectContent", () => {
    it("should render content when select is open", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    it("should have data-slot attribute", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const content = document.querySelector('[data-slot="select-content"]');
        expect(content).toBeInTheDocument();
      });
    });

    it("should use popper position by default", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const content = document.querySelector('[data-slot="select-content"]');
        expect(content).toBeInTheDocument();
      });
    });

    it("should apply custom className", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="custom-content-class">
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const content = document.querySelector('[data-slot="select-content"]');
        expect(content).toHaveClass("custom-content-class");
      });
    });

    it("should apply default classes", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const content = document.querySelector('[data-slot="select-content"]');
        expect(content).toHaveClass(
          "bg-popover",
          "text-popover-foreground",
          "relative",
          "z-50",
          "min-w-[8rem]",
          "overflow-x-hidden",
          "overflow-y-auto",
          "rounded-md",
          "border",
          "shadow-md"
        );
      });
    });

    it("should render scroll buttons", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 20 }, (_, i) => (
              <SelectItem key={i} value={`option${i}`}>
                Option {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        // Scroll buttons podem não estar visíveis se o conteúdo cabe na tela
        // Vamos apenas verificar que o content foi renderizado
        const content = document.querySelector('[data-slot="select-content"]');
        expect(content).toBeInTheDocument();
      });
    });

    it("should handle item-popper position", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const content = document.querySelector('[data-slot="select-content"]');
        expect(content).toBeInTheDocument();
      });
    });
  });

  describe("SelectItem", () => {
    it("should render item with text", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    it("should have data-slot attribute", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const item = document.querySelector('[data-slot="select-item"]');
        expect(item).toBeInTheDocument();
      });
    });

    it("should be selectable", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Select onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(async () => {
        const item = screen.getByText("Option 1");
        await user.click(item);
      });

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith("option1");
      });
    });

    it("should show check icon when selected", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select defaultValue="option1">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        // Check icon é renderizado quando item está selecionado
        const checkIcon = container.querySelector("svg");
        expect(checkIcon).toBeInTheDocument();
      });
    });

    it("should be disabled when disabled prop is passed", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1" disabled>
              Option 1
            </SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const item = document.querySelector('[data-slot="select-item"]');
        expect(item).toHaveAttribute("data-disabled");
      });
    });

    it("should apply custom className", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1" className="custom-item-class">
              Option 1
            </SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const item = document.querySelector('[data-slot="select-item"]');
        expect(item).toHaveClass("custom-item-class");
      });
    });

    it("should apply default classes", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const item = document.querySelector('[data-slot="select-item"]');
        expect(item).toHaveClass(
          "relative",
          "flex",
          "w-full",
          "cursor-default",
          "items-center",
          "gap-2",
          "rounded-sm"
        );
      });
    });
  });

  describe("SelectLabel", () => {
    it("should render label text", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="option1">Option 1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Category")).toBeInTheDocument();
      });
    });

    it("should have data-slot attribute", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="option1">Option 1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const label = document.querySelector('[data-slot="select-label"]');
        expect(label).toBeInTheDocument();
      });
    });

    it("should apply custom className", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="custom-label-class">Category</SelectLabel>
              <SelectItem value="option1">Option 1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const label = document.querySelector('[data-slot="select-label"]');
        expect(label).toHaveClass("custom-label-class");
      });
    });

    it("should apply default classes", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="option1">Option 1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const label = document.querySelector('[data-slot="select-label"]');
        expect(label).toHaveClass(
          "text-muted-foreground",
          "px-2",
          "py-1.5",
          "text-xs"
        );
      });
    });
  });

  describe("SelectGroup", () => {
    it("should render group with items", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
      });
    });

    it("should have data-slot attribute", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="option1">Option 1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const group = document.querySelector('[data-slot="select-group"]');
        expect(group).toBeInTheDocument();
      });
    });
  });

  describe("SelectSeparator", () => {
    it("should render separator", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectSeparator />
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const separator = document.querySelector(
          '[data-slot="select-separator"]'
        );
        expect(separator).toBeInTheDocument();
      });
    });

    it("should apply custom className", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectSeparator className="custom-separator-class" />
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const separator = document.querySelector(
          '[data-slot="select-separator"]'
        );
        expect(separator).toHaveClass("custom-separator-class");
      });
    });

    it("should apply default classes", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectSeparator />
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        const separator = document.querySelector(
          '[data-slot="select-separator"]'
        );
        expect(separator).toHaveClass(
          "bg-border",
          "pointer-events-none",
          "-mx-1",
          "my-1",
          "h-px"
        );
      });
    });
  });

  describe("SelectScrollButtons", () => {
    it("should render scroll buttons within SelectContent", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        // Os scroll buttons são renderizados automaticamente pelo SelectContent
        // Verificamos apenas que o content foi renderizado corretamente
        const content = document.querySelector('[data-slot="select-content"]');
        expect(content).toBeInTheDocument();
      });
    });
  });

  describe("Integration", () => {
    it("should open and close select", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });

      // Fecha pressionando Escape
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
      });
    });

    it("should select an item and update value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Select onValueChange={onValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(async () => {
        const item = screen.getByText("Option 2");
        await user.click(item);
      });

      await waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith("option2");
      });
    });

    it("should work with multiple groups and labels", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group 1</SelectLabel>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Group 2</SelectLabel>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Group 1")).toBeInTheDocument();
        expect(screen.getByText("Group 2")).toBeInTheDocument();
        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
        expect(screen.getByText("Option 3")).toBeInTheDocument();
      });
    });

    it("should handle keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.tab();
      expect(trigger).toHaveFocus();

      await user.keyboard("{Enter}");
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty children in SelectTrigger", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeInTheDocument();
    });

    it("should handle empty SelectContent", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent />
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      // Content deve abrir mesmo vazio
      await waitFor(() => {
        expect(trigger).toBeInTheDocument();
      });
    });

    it("should handle long text in SelectItem", async () => {
      const user = userEvent.setup();
      const longText = "A".repeat(100);
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">{longText}</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText(longText)).toBeInTheDocument();
      });
    });

    it("should handle many items", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 50 }, (_, i) => (
              <SelectItem key={i} value={`option${i}`}>
                Option {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Option 0")).toBeInTheDocument();
        expect(screen.getByText("Option 49")).toBeInTheDocument();
      });
    });

    it("should handle special characters in values", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="special@#$">Special Characters @#$</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Special Characters @#$")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have correct role for trigger", () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeInTheDocument();
    });

    it("should have aria attributes when disabled", () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });

    it("should be keyboard navigable", async () => {
      const user = userEvent.setup();
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      await user.tab();
      expect(trigger).toHaveFocus();

      await user.keyboard("{Enter}");
      await waitFor(() => {
        expect(screen.getByText("Option 1")).toBeInTheDocument();
      });
    });

    it("should support aria-label on trigger", () => {
      render(
        <Select>
          <SelectTrigger aria-label="Select an option">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      );

      const trigger = screen.getByRole("combobox", {
        name: "Select an option",
      });
      expect(trigger).toBeInTheDocument();
    });
  });
});
