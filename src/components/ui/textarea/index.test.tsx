import * as React from "react";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Textarea } from "./index";

describe("Textarea Component", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render textarea element", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("should have data-slot attribute", () => {
      const { container } = render(<Textarea />);

      const textarea = container.querySelector('[data-slot="textarea"]');
      expect(textarea).toBeInTheDocument();
    });

    it("should apply default classes", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass(
        "min-h-16",
        "w-full",
        "rounded-lg",
        "border",
        "px-4",
        "py-3",
        "text-sm"
      );
    });

    it("should apply custom className", () => {
      render(<Textarea className="custom-textarea-class" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("custom-textarea-class");
    });

    it("should render with placeholder", () => {
      render(<Textarea placeholder="Enter your message" />);

      const textarea = screen.getByPlaceholderText("Enter your message");
      expect(textarea).toBeInTheDocument();
    });

    it("should render with default value", () => {
      render(<Textarea defaultValue="Initial text" />);

      const textarea = screen.getByDisplayValue("Initial text");
      expect(textarea).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("should render Skeleton when loading is true", () => {
      const { container } = render(<Textarea loading />);

      const skeleton = container.querySelector('[data-slot="skeleton"]');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass("min-h-16");

      const textarea = screen.queryByRole("textbox");
      expect(textarea).not.toBeInTheDocument();
    });

    it("should render textarea when loading is false", () => {
      render(<Textarea loading={false} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
    });

    it("should render textarea when loading prop is not provided", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
    });

    it("should not render textarea when loading is true", () => {
      render(<Textarea loading />);

      const textarea = screen.queryByRole("textbox");
      expect(textarea).not.toBeInTheDocument();
    });
  });

  describe("Ref Forwarding", () => {
    it("should forward ref to textarea element", () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} />);

      expect(ref.current).not.toBeNull();
      expect(ref.current instanceof HTMLTextAreaElement).toBe(true);
    });

    it("should not forward ref when loading is true", () => {
      const ref = React.createRef<HTMLTextAreaElement>();
      render(<Textarea ref={ref} loading />);

      // Quando loading é true, o Skeleton é renderizado, então o ref não é aplicado ao textarea
      expect(ref.current).toBeNull();
    });
  });

  describe("User Interaction", () => {
    it("should handle user input", async () => {
      const user = userEvent.setup();
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Hello, world!");

      expect(textarea).toHaveValue("Hello, world!");
    });

    it("should handle onChange event", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Textarea onChange={onChange} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "test");

      expect(onChange).toHaveBeenCalled();
    });

    it("should handle controlled value", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Textarea value="initial" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("initial");

      rerender(<Textarea value="updated" />);
      expect(textarea).toHaveValue("updated");
    });

    it("should handle clear action", async () => {
      const user = userEvent.setup();
      render(<Textarea defaultValue="Some text" />);

      const textarea = screen.getByRole("textbox");
      await user.clear(textarea);

      expect(textarea).toHaveValue("");
    });

    it("should handle multiline input", async () => {
      const user = userEvent.setup();
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "Line 1");
      await user.keyboard("{Enter}");
      await user.type(textarea, "Line 2");
      await user.keyboard("{Enter}");
      await user.type(textarea, "Line 3");

      expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
    });
  });

  describe("Disabled State", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
    });

    it("should have disabled classes when disabled", () => {
      render(<Textarea disabled />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass(
        "disabled:cursor-not-allowed",
        "disabled:opacity-50"
      );
    });

    it("should not be disabled when disabled prop is false", () => {
      render(<Textarea disabled={false} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).not.toBeDisabled();
    });

    it("should not accept input when disabled", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Textarea disabled onChange={onChange} />);

      const textarea = screen.getByRole("textbox");
      await user.type(textarea, "test");

      // onChange não deve ser chamado quando disabled
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Props Forwarding", () => {
    it("should forward data-testid prop", () => {
      render(<Textarea data-testid="test-textarea" />);

      expect(screen.getByTestId("test-textarea")).toBeInTheDocument();
    });

    it("should forward id prop", () => {
      render(<Textarea id="textarea-id" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("id", "textarea-id");
    });

    it("should forward name prop", () => {
      render(<Textarea name="message" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("name", "message");
    });

    it("should forward rows prop", () => {
      render(<Textarea rows={5} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "5");
    });

    it("should forward cols prop", () => {
      render(<Textarea cols={50} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("cols", "50");
    });

    it("should forward maxLength prop", () => {
      render(<Textarea maxLength={100} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("maxLength", "100");
    });

    it("should forward required prop", () => {
      render(<Textarea required />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeRequired();
    });

    it("should forward readOnly prop", () => {
      render(<Textarea readOnly />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("readOnly");
    });

    it("should forward aria-label prop", () => {
      render(<Textarea aria-label="Message input" />);

      const textarea = screen.getByRole("textbox", { name: "Message input" });
      expect(textarea).toBeInTheDocument();
    });

    it("should forward aria-invalid prop", () => {
      render(<Textarea aria-invalid="true" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string value", () => {
      render(<Textarea value="" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");
    });

    it("should handle very long text", () => {
      const longText = "A".repeat(1000);

      render(<Textarea />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: longText } });

      expect(textarea).toHaveValue(longText);
    });

    it("should handle special characters", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      const specialText = "Special: !@#$%^&*()_+-=[]{}|;':\",./<>?";
      fireEvent.change(textarea, { target: { value: specialText } });

      expect(textarea).toHaveValue(specialText);
    });

    it("should handle newlines", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      fireEvent.change(textarea, { target: { value: "Line 1\n\nLine 3" } });

      expect(textarea).toHaveValue("Line 1\n\nLine 3");
    });

    it("should handle undefined className", () => {
      render(<Textarea className={undefined} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
    });

    it("should handle null value", () => {
      render(<Textarea value={null as unknown as string} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");
    });
  });

  describe("Accessibility", () => {
    it("should have correct role", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
    });

    it("should be accessible with aria-label", () => {
      render(<Textarea aria-label="Message textarea" />);

      const textarea = screen.getByRole("textbox", {
        name: "Message textarea",
      });
      expect(textarea).toBeInTheDocument();
    });

    it("should be accessible with aria-labelledby", () => {
      render(
        <div>
          <label id="textarea-label">Message</label>
          <Textarea aria-labelledby="textarea-label" />
        </div>
      );

      const textarea = screen.getByRole("textbox", { name: "Message" });
      expect(textarea).toBeInTheDocument();
    });

    it("should support aria-describedby", () => {
      render(
        <div>
          <Textarea aria-describedby="help-text" />
          <span id="help-text">Enter your message here</span>
        </div>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-describedby", "help-text");
    });

    it("should support aria-required", () => {
      render(<Textarea aria-required="true" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-required", "true");
    });

    it("should support aria-invalid for error states", () => {
      render(<Textarea aria-invalid="true" />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("aria-invalid", "true");
      expect(textarea).toHaveClass("aria-invalid:border-destructive");
    });
  });

  describe("Form Integration", () => {
    it("should work with form submission", () => {
      const onSubmit = vi.fn((e) => e.preventDefault());
      render(
        <form onSubmit={onSubmit}>
          <Textarea name="message" defaultValue="Test message" />
          <button type="submit">Submit</button>
        </form>
      );

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("name", "message");
      expect(textarea).toHaveValue("Test message");
    });

    it("should respect maxLength constraint", async () => {
      const user = userEvent.setup();
      render(<Textarea maxLength={10} />);

      const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
      await user.type(textarea, "This is a very long text");

      // O valor deve ser limitado pelo maxLength
      expect(textarea.value.length).toBeLessThanOrEqual(10);
    });

    it("should respect minLength constraint", () => {
      render(<Textarea minLength={5} />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("minLength", "5");
    });
  });

  describe("Styling", () => {
    it("should have focus-visible styles", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass(
        "focus-visible:border-foreground",
        "focus-visible:ring-foreground/30",
        "focus-visible:shadow-glow",
        "focus-visible:bg-background",
        "focus-visible:ring-1"
      );
    });

    it("should have hover styles", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass(
        "hover:bg-background/70",
        "hover:border-foreground/20"
      );
    });

    it("should have transition styles", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("transition-all");
    });

    it("should have field-sizing-content class", () => {
      render(<Textarea />);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("field-sizing-content");
    });
  });
});
