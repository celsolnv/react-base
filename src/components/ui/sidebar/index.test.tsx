import * as React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./index";

// Mock useIsMobile
vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: vi.fn(() => false),
}));

import { useIsMobile } from "@/hooks/use-mobile";

const mockUseIsMobile = useIsMobile as ReturnType<typeof vi.fn>;

describe("Sidebar Components", () => {
  beforeEach(() => {
    // Reset cookies
    document.cookie = "";
    // Reset window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    mockUseIsMobile.mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("SidebarProvider", () => {
    it("should render children correctly", () => {
      render(
        <SidebarProvider>
          <div>Test content</div>
        </SidebarProvider>
      );

      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should use defaultOpen prop", () => {
      render(
        <SidebarProvider defaultOpen={true}>
          <Sidebar>
            <div>Sidebar content</div>
          </Sidebar>
        </SidebarProvider>
      );

      const sidebar = screen
        .getByText("Sidebar content")
        .closest('[data-slot="sidebar"]');
      expect(sidebar).toBeInTheDocument();
    });

    it("should use controlled open state", () => {
      const TestComponent = () => {
        const [open, setOpen] = React.useState(false);
        return (
          <SidebarProvider open={open} onOpenChange={setOpen}>
            <Sidebar>
              <div>Sidebar content</div>
            </Sidebar>
          </SidebarProvider>
        );
      };

      render(<TestComponent />);
      const sidebar = screen
        .getByText("Sidebar content")
        .closest('[data-slot="sidebar"]');
      expect(sidebar).toBeInTheDocument();
    });

    it("should set cookie when sidebar state changes", async () => {
      const TestComponent = () => {
        const { setOpen } = useSidebar();
        return (
          <div>
            <button onClick={() => setOpen(true)}>Open</button>
            <Sidebar>
              <div>Content</div>
            </Sidebar>
          </div>
        );
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      const button = screen.getByText("Open");
      await userEvent.click(button);

      await waitFor(() => {
        expect(document.cookie).toContain("sidebar_state=true");
      });
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider className="custom-class">
          <div>Content</div>
        </SidebarProvider>
      );

      const wrapper = container.querySelector('[data-slot="sidebar-wrapper"]');
      expect(wrapper).toHaveClass("custom-class");
    });

    it("should accept custom style", () => {
      const { container } = render(
        <SidebarProvider
          style={{ "--custom-var": "10px" } as React.CSSProperties}
        >
          <div>Content</div>
        </SidebarProvider>
      );

      const wrapper = container.querySelector('[data-slot="sidebar-wrapper"]');
      expect(wrapper).toHaveStyle({ "--custom-var": "10px" });
    });
  });

  describe("useSidebar", () => {
    it("should throw error when used outside SidebarProvider", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const TestComponent = () => {
        useSidebar();
        return <div>Test</div>;
      };

      expect(() => {
        render(<TestComponent />);
      }).toThrow("useSidebar must be used within a SidebarProvider");

      consoleSpy.mockRestore();
    });

    it("should return sidebar context when used inside SidebarProvider", () => {
      const TestComponent = () => {
        const { state, open, isMobile } = useSidebar();
        return (
          <div>
            <span data-testid="state">{state}</span>
            <span data-testid="open">{String(open)}</span>
            <span data-testid="isMobile">{String(isMobile)}</span>
          </div>
        );
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(screen.getByTestId("state")).toHaveTextContent("collapsed");
      expect(screen.getByTestId("open")).toHaveTextContent("false");
      expect(screen.getByTestId("isMobile")).toHaveTextContent("false");
    });
  });

  describe("Sidebar", () => {
    it("should render with default props", () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <div>Sidebar content</div>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByText("Sidebar content")).toBeInTheDocument();
    });

    it("should render as Sheet on mobile", async () => {
      mockUseIsMobile.mockReturnValue(true);

      const TestComponent = () => {
        const { setOpenMobile } = useSidebar();
        return (
          <div>
            <button onClick={() => setOpenMobile(true)}>Open</button>
            <Sidebar>
              <div>Mobile sidebar</div>
            </Sidebar>
          </div>
        );
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      // Open the mobile sidebar
      const button = screen.getByText("Open");
      await userEvent.click(button);

      // Wait for Sheet to open and content to be visible
      await waitFor(() => {
        expect(screen.getByText("Mobile sidebar")).toBeInTheDocument();
      });
    });

    it("should render with collapsible='none'", () => {
      render(
        <SidebarProvider>
          <Sidebar collapsible="none">
            <div>Non-collapsible sidebar</div>
          </Sidebar>
        </SidebarProvider>
      );

      const sidebar = screen.getByText("Non-collapsible sidebar");
      expect(sidebar).toBeInTheDocument();
    });

    it("should render with different sides", () => {
      const { container: leftContainer } = render(
        <SidebarProvider>
          <Sidebar side="left">
            <div>Left sidebar</div>
          </Sidebar>
        </SidebarProvider>
      );

      const leftSidebar = leftContainer.querySelector('[data-side="left"]');
      expect(leftSidebar).toBeInTheDocument();

      const { container: rightContainer } = render(
        <SidebarProvider>
          <Sidebar side="right">
            <div>Right sidebar</div>
          </Sidebar>
        </SidebarProvider>
      );

      const rightSidebar = rightContainer.querySelector('[data-side="right"]');
      expect(rightSidebar).toBeInTheDocument();
    });

    it("should render with different variants", () => {
      const variants = ["sidebar", "floating", "inset"] as const;

      variants.forEach((variant) => {
        const { container } = render(
          <SidebarProvider>
            <Sidebar variant={variant}>
              <div>{variant} sidebar</div>
            </Sidebar>
          </SidebarProvider>
        );

        const sidebar = container.querySelector(`[data-variant="${variant}"]`);
        expect(sidebar).toBeInTheDocument();
      });
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar className="custom-sidebar">
            <div>Content</div>
          </Sidebar>
        </SidebarProvider>
      );

      const sidebar = container.querySelector(
        '[data-slot="sidebar-container"]'
      );
      expect(sidebar).toHaveClass("custom-sidebar");
    });
  });

  describe("SidebarTrigger", () => {
    it("should render trigger button", () => {
      render(
        <SidebarProvider>
          <SidebarTrigger />
        </SidebarProvider>
      );

      const trigger = screen.getByRole("button", { name: /toggle sidebar/i });
      expect(trigger).toBeInTheDocument();
    });

    it("should toggle sidebar when clicked", async () => {
      const TestComponent = () => {
        const { open } = useSidebar();
        return (
          <div>
            <SidebarTrigger />
            <span data-testid="state">{String(open)}</span>
          </div>
        );
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      const trigger = screen.getByRole("button", { name: /toggle sidebar/i });
      expect(screen.getByTestId("state")).toHaveTextContent("false");

      await userEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId("state")).toHaveTextContent("true");
      });
    });

    it("should call custom onClick handler", async () => {
      const onClick = vi.fn();

      render(
        <SidebarProvider>
          <SidebarTrigger onClick={onClick} />
        </SidebarProvider>
      );

      const trigger = screen.getByRole("button", { name: /toggle sidebar/i });
      await userEvent.click(trigger);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("should show ChevronsLeft when open", () => {
      render(
        <SidebarProvider defaultOpen={true}>
          <SidebarTrigger />
        </SidebarProvider>
      );

      const trigger = screen.getByRole("button", { name: /toggle sidebar/i });
      // ChevronsLeft should be present
      expect(trigger.querySelector("svg")).toBeInTheDocument();
    });

    it("should show ChevronsRight when closed", () => {
      render(
        <SidebarProvider defaultOpen={false}>
          <SidebarTrigger />
        </SidebarProvider>
      );

      const trigger = screen.getByRole("button", { name: /toggle sidebar/i });
      // ChevronsRight should be present
      expect(trigger.querySelector("svg")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(
        <SidebarProvider>
          <SidebarTrigger className="custom-trigger" />
        </SidebarProvider>
      );

      const trigger = screen.getByRole("button", { name: /toggle sidebar/i });
      expect(trigger).toHaveClass("custom-trigger");
    });
  });

  describe("SidebarRail", () => {
    it("should render rail button", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarRail />
          </Sidebar>
        </SidebarProvider>
      );

      const rail = container.querySelector('[data-slot="sidebar-rail"]');
      expect(rail).toBeInTheDocument();
    });

    it("should toggle sidebar when clicked", async () => {
      const TestComponent = () => {
        const { open } = useSidebar();
        return (
          <div>
            <Sidebar>
              <SidebarRail />
            </Sidebar>
            <span data-testid="state">{String(open)}</span>
          </div>
        );
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      const rail = screen.getByTitle("Toggle Sidebar");
      expect(screen.getByTestId("state")).toHaveTextContent("false");

      await userEvent.click(rail);

      await waitFor(() => {
        expect(screen.getByTestId("state")).toHaveTextContent("true");
      });
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <Sidebar>
            <SidebarRail className="custom-rail" />
          </Sidebar>
        </SidebarProvider>
      );

      const rail = container.querySelector('[data-slot="sidebar-rail"]');
      expect(rail).toHaveClass("custom-rail");
    });
  });

  describe("SidebarInset", () => {
    it("should render main element", () => {
      render(
        <SidebarProvider>
          <SidebarInset>
            <div>Inset content</div>
          </SidebarInset>
        </SidebarProvider>
      );

      expect(screen.getByText("Inset content")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarInset className="custom-inset">
            <div>Content</div>
          </SidebarInset>
        </SidebarProvider>
      );

      const inset = container.querySelector('[data-slot="sidebar-inset"]');
      expect(inset).toHaveClass("custom-inset");
    });
  });

  describe("SidebarInput", () => {
    it("should render input element", () => {
      render(
        <SidebarProvider>
          <SidebarInput placeholder="Search..." />
        </SidebarProvider>
      );

      const input = screen.getByPlaceholderText("Search...");
      expect(input).toBeInTheDocument();
    });

    it("should accept input props", async () => {
      const onChange = vi.fn();

      render(
        <SidebarProvider>
          <SidebarInput onChange={onChange} data-testid="sidebar-input" />
        </SidebarProvider>
      );

      const input = screen.getByTestId("sidebar-input");
      await userEvent.type(input, "test");

      expect(onChange).toHaveBeenCalled();
    });

    it("should accept custom className", () => {
      render(
        <SidebarProvider>
          <SidebarInput className="custom-input" data-testid="input" />
        </SidebarProvider>
      );

      const input = screen.getByTestId("input");
      expect(input).toHaveClass("custom-input");
    });
  });

  describe("SidebarHeader", () => {
    it("should render header div", () => {
      render(
        <SidebarProvider>
          <SidebarHeader>
            <div>Header content</div>
          </SidebarHeader>
        </SidebarProvider>
      );

      expect(screen.getByText("Header content")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarHeader className="custom-header">
            <div>Content</div>
          </SidebarHeader>
        </SidebarProvider>
      );

      const header = container.querySelector('[data-slot="sidebar-header"]');
      expect(header).toHaveClass("custom-header");
    });
  });

  describe("SidebarFooter", () => {
    it("should render footer div", () => {
      render(
        <SidebarProvider>
          <SidebarFooter>
            <div>Footer content</div>
          </SidebarFooter>
        </SidebarProvider>
      );

      expect(screen.getByText("Footer content")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarFooter className="custom-footer">
            <div>Content</div>
          </SidebarFooter>
        </SidebarProvider>
      );

      const footer = container.querySelector('[data-slot="sidebar-footer"]');
      expect(footer).toHaveClass("custom-footer");
    });
  });

  describe("SidebarContent", () => {
    it("should render content div", () => {
      render(
        <SidebarProvider>
          <SidebarContent>
            <div>Content</div>
          </SidebarContent>
        </SidebarProvider>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarContent className="custom-content">
            <div>Content</div>
          </SidebarContent>
        </SidebarProvider>
      );

      const content = container.querySelector('[data-slot="sidebar-content"]');
      expect(content).toHaveClass("custom-content");
    });
  });

  describe("SidebarSeparator", () => {
    it("should render separator", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarSeparator />
        </SidebarProvider>
      );

      const separator = container.querySelector(
        '[data-slot="sidebar-separator"]'
      );
      expect(separator).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarSeparator className="custom-separator" />
        </SidebarProvider>
      );

      const separator = container.querySelector(
        '[data-slot="sidebar-separator"]'
      );
      expect(separator).toHaveClass("custom-separator");
    });
  });

  describe("SidebarGroup", () => {
    it("should render group div", () => {
      render(
        <SidebarProvider>
          <SidebarGroup>
            <div>Group content</div>
          </SidebarGroup>
        </SidebarProvider>
      );

      expect(screen.getByText("Group content")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarGroup className="custom-group">
            <div>Content</div>
          </SidebarGroup>
        </SidebarProvider>
      );

      const group = container.querySelector('[data-slot="sidebar-group"]');
      expect(group).toHaveClass("custom-group");
    });
  });

  describe("SidebarGroupLabel", () => {
    it("should render label as div by default", () => {
      render(
        <SidebarProvider>
          <SidebarGroupLabel>Label</SidebarGroupLabel>
        </SidebarProvider>
      );

      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("should render as Slot when asChild is true", () => {
      render(
        <SidebarProvider>
          <SidebarGroupLabel asChild>
            <span>Label</span>
          </SidebarGroupLabel>
        </SidebarProvider>
      );

      expect(screen.getByText("Label")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarGroupLabel className="custom-label">Label</SidebarGroupLabel>
        </SidebarProvider>
      );

      const label = container.querySelector(
        '[data-slot="sidebar-group-label"]'
      );
      expect(label).toHaveClass("custom-label");
    });
  });

  describe("SidebarGroupAction", () => {
    it("should render action button", () => {
      render(
        <SidebarProvider>
          <SidebarGroupAction>Action</SidebarGroupAction>
        </SidebarProvider>
      );

      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should render as Slot when asChild is true", () => {
      render(
        <SidebarProvider>
          <SidebarGroupAction asChild>
            <span>Action</span>
          </SidebarGroupAction>
        </SidebarProvider>
      );

      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(
        <SidebarProvider>
          <SidebarGroupAction className="custom-action">
            Action
          </SidebarGroupAction>
        </SidebarProvider>
      );

      const action = screen.getByText("Action");
      expect(action).toHaveClass("custom-action");
    });
  });

  describe("SidebarGroupContent", () => {
    it("should render content div", () => {
      render(
        <SidebarProvider>
          <SidebarGroupContent>
            <div>Content</div>
          </SidebarGroupContent>
        </SidebarProvider>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarGroupContent className="custom-content">
            <div>Content</div>
          </SidebarGroupContent>
        </SidebarProvider>
      );

      const content = container.querySelector(
        '[data-slot="sidebar-group-content"]'
      );
      expect(content).toHaveClass("custom-content");
    });
  });

  describe("SidebarMenu", () => {
    it("should render menu ul", () => {
      render(
        <SidebarProvider>
          <SidebarMenu>
            <li>Item</li>
          </SidebarMenu>
        </SidebarProvider>
      );

      expect(screen.getByText("Item")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarMenu className="custom-menu">
            <li>Item</li>
          </SidebarMenu>
        </SidebarProvider>
      );

      const menu = container.querySelector('[data-slot="sidebar-menu"]');
      expect(menu).toHaveClass("custom-menu");
    });
  });

  describe("SidebarMenuItem", () => {
    it("should render menu item li", () => {
      render(
        <SidebarProvider>
          <SidebarMenu>
            <SidebarMenuItem>Item</SidebarMenuItem>
          </SidebarMenu>
        </SidebarProvider>
      );

      expect(screen.getByText("Item")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarMenu>
            <SidebarMenuItem className="custom-item">Item</SidebarMenuItem>
          </SidebarMenu>
        </SidebarProvider>
      );

      const item = container.querySelector('[data-slot="sidebar-menu-item"]');
      expect(item).toHaveClass("custom-item");
    });
  });

  describe("SidebarMenuButton", () => {
    it("should render menu button", () => {
      render(
        <SidebarProvider>
          <SidebarMenuButton>Button</SidebarMenuButton>
        </SidebarProvider>
      );

      expect(screen.getByText("Button")).toBeInTheDocument();
    });

    it("should render with tooltip when collapsed", () => {
      render(
        <SidebarProvider defaultOpen={false}>
          <SidebarMenuButton tooltip="Tooltip text">Button</SidebarMenuButton>
        </SidebarProvider>
      );

      // Tooltip should be present
      const button = screen.getByText("Button");
      expect(button).toBeInTheDocument();
    });

    it("should render with isActive prop", () => {
      render(
        <SidebarProvider>
          <SidebarMenuButton isActive>Active Button</SidebarMenuButton>
        </SidebarProvider>
      );

      const button = screen.getByText("Active Button");
      expect(button).toHaveAttribute("data-active", "true");
    });

    it("should render with different variants", () => {
      const variants = ["default", "outline"] as const;

      variants.forEach((variant) => {
        const { container } = render(
          <SidebarProvider>
            <SidebarMenuButton variant={variant}>
              {variant} Button
            </SidebarMenuButton>
          </SidebarProvider>
        );

        const button = container.querySelector(
          '[data-slot="sidebar-menu-button"]'
        );
        expect(button).toBeInTheDocument();
      });
    });

    it("should render with different sizes", () => {
      const sizes = ["default", "sm", "lg"] as const;

      sizes.forEach((size) => {
        const { container } = render(
          <SidebarProvider>
            <SidebarMenuButton size={size}>{size} Button</SidebarMenuButton>
          </SidebarProvider>
        );

        const button = container.querySelector(`[data-size="${size}"]`);
        expect(button).toBeInTheDocument();
      });
    });

    it("should render as Slot when asChild is true", () => {
      render(
        <SidebarProvider>
          <SidebarMenuButton asChild>
            <span>Button</span>
          </SidebarMenuButton>
        </SidebarProvider>
      );

      expect(screen.getByText("Button")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(
        <SidebarProvider>
          <SidebarMenuButton className="custom-button">
            Button
          </SidebarMenuButton>
        </SidebarProvider>
      );

      const button = screen.getByText("Button");
      expect(button).toHaveClass("custom-button");
    });
  });

  describe("SidebarMenuAction", () => {
    it("should render action button", () => {
      render(
        <SidebarProvider>
          <SidebarMenuAction>Action</SidebarMenuAction>
        </SidebarProvider>
      );

      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should render as Slot when asChild is true", () => {
      render(
        <SidebarProvider>
          <SidebarMenuAction asChild>
            <span>Action</span>
          </SidebarMenuAction>
        </SidebarProvider>
      );

      expect(screen.getByText("Action")).toBeInTheDocument();
    });

    it("should accept showOnHover prop", () => {
      render(
        <SidebarProvider>
          <SidebarMenuAction showOnHover>Action</SidebarMenuAction>
        </SidebarProvider>
      );

      const action = screen.getByText("Action");
      expect(action).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(
        <SidebarProvider>
          <SidebarMenuAction className="custom-action">
            Action
          </SidebarMenuAction>
        </SidebarProvider>
      );

      const action = screen.getByText("Action");
      expect(action).toHaveClass("custom-action");
    });
  });

  describe("SidebarMenuBadge", () => {
    it("should render badge div", () => {
      render(
        <SidebarProvider>
          <SidebarMenuBadge>5</SidebarMenuBadge>
        </SidebarProvider>
      );

      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarMenuBadge className="custom-badge">5</SidebarMenuBadge>
        </SidebarProvider>
      );

      const badge = container.querySelector('[data-slot="sidebar-menu-badge"]');
      expect(badge).toHaveClass("custom-badge");
    });
  });

  describe("SidebarMenuSkeleton", () => {
    it("should render skeleton", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarMenuSkeleton />
        </SidebarProvider>
      );

      const skeleton = container.querySelector(
        '[data-slot="sidebar-menu-skeleton"]'
      );
      expect(skeleton).toBeInTheDocument();
    });

    it("should render with icon when showIcon is true", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarMenuSkeleton showIcon />
        </SidebarProvider>
      );

      const icon = container.querySelector(
        '[data-sidebar="menu-skeleton-icon"]'
      );
      expect(icon).toBeInTheDocument();
    });

    it("should not render icon when showIcon is false", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarMenuSkeleton showIcon={false} />
        </SidebarProvider>
      );

      const icon = container.querySelector(
        '[data-sidebar="menu-skeleton-icon"]'
      );
      expect(icon).not.toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarMenuSkeleton className="custom-skeleton" />
        </SidebarProvider>
      );

      const skeleton = container.querySelector(
        '[data-slot="sidebar-menu-skeleton"]'
      );
      expect(skeleton).toHaveClass("custom-skeleton");
    });
  });

  describe("SidebarMenuSub", () => {
    it("should render sub menu ul", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSub>
            <li>Sub item</li>
          </SidebarMenuSub>
        </SidebarProvider>
      );

      expect(screen.getByText("Sub item")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarMenuSub className="custom-sub">
            <li>Item</li>
          </SidebarMenuSub>
        </SidebarProvider>
      );

      const sub = container.querySelector('[data-slot="sidebar-menu-sub"]');
      expect(sub).toHaveClass("custom-sub");
    });
  });

  describe("SidebarMenuSubItem", () => {
    it("should render sub item li", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSub>
            <SidebarMenuSubItem>Sub item</SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarProvider>
      );

      expect(screen.getByText("Sub item")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarMenuSub>
            <SidebarMenuSubItem className="custom-sub-item">
              Item
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </SidebarProvider>
      );

      const item = container.querySelector(
        '[data-slot="sidebar-menu-sub-item"]'
      );
      expect(item).toHaveClass("custom-sub-item");
    });
  });

  describe("SidebarMenuSubButton", () => {
    it("should render sub button", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSubButton>Sub Button</SidebarMenuSubButton>
        </SidebarProvider>
      );

      expect(screen.getByText("Sub Button")).toBeInTheDocument();
    });

    it("should render with isActive prop", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSubButton isActive>
            Active Sub Button
          </SidebarMenuSubButton>
        </SidebarProvider>
      );

      const button = screen.getByText("Active Sub Button");
      expect(button).toHaveAttribute("data-active", "true");
    });

    it("should render with different sizes", () => {
      const sizes = ["sm", "md"] as const;

      sizes.forEach((size) => {
        const { container } = render(
          <SidebarProvider>
            <SidebarMenuSubButton size={size}>
              {size} Button
            </SidebarMenuSubButton>
          </SidebarProvider>
        );

        const button = container.querySelector(`[data-size="${size}"]`);
        expect(button).toBeInTheDocument();
      });
    });

    it("should render as Slot when asChild is true", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSubButton asChild>
            <span>Button</span>
          </SidebarMenuSubButton>
        </SidebarProvider>
      );

      expect(screen.getByText("Button")).toBeInTheDocument();
    });

    it("should accept custom className", () => {
      render(
        <SidebarProvider>
          <SidebarMenuSubButton className="custom-sub-button">
            Button
          </SidebarMenuSubButton>
        </SidebarProvider>
      );

      const button = screen.getByText("Button");
      expect(button).toHaveClass("custom-sub-button");
    });
  });

  describe("Keyboard Shortcut", () => {
    it("should toggle sidebar with Cmd+B (Mac)", async () => {
      const TestComponent = () => {
        const { open } = useSidebar();
        return (
          <div>
            <span data-testid="state">{String(open)}</span>
          </div>
        );
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(screen.getByTestId("state")).toHaveTextContent("false");

      const event = new KeyboardEvent("keydown", {
        key: "b",
        metaKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByTestId("state")).toHaveTextContent("true");
      });
    });

    it("should toggle sidebar with Ctrl+B (Windows/Linux)", async () => {
      const TestComponent = () => {
        const { open } = useSidebar();
        return (
          <div>
            <span data-testid="state">{String(open)}</span>
          </div>
        );
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(screen.getByTestId("state")).toHaveTextContent("false");

      const event = new KeyboardEvent("keydown", {
        key: "b",
        ctrlKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);

      await waitFor(() => {
        expect(screen.getByTestId("state")).toHaveTextContent("true");
      });
    });

    it("should not toggle sidebar with other keys", () => {
      const TestComponent = () => {
        const { open } = useSidebar();
        return (
          <div>
            <span data-testid="state">{String(open)}</span>
          </div>
        );
      };

      render(
        <SidebarProvider>
          <TestComponent />
        </SidebarProvider>
      );

      expect(screen.getByTestId("state")).toHaveTextContent("false");

      const event = new KeyboardEvent("keydown", {
        key: "a",
        metaKey: true,
        bubbles: true,
      });
      window.dispatchEvent(event);

      // State should remain false
      expect(screen.getByTestId("state")).toHaveTextContent("false");
    });
  });
});
