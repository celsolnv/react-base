import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HeaderList } from "./index";

// Mock do TanStack Router Link
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

describe("HeaderList", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render title and description", () => {
      render(
        <HeaderList
          title="Lista de Usuários"
          description="Gerencie os usuários do sistema"
        />
      );

      expect(screen.getByText("Lista de Usuários")).toBeInTheDocument();
      expect(
        screen.getByText("Gerencie os usuários do sistema")
      ).toBeInTheDocument();
    });

    it("should render with all props including button", () => {
      render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonText="Criar Novo"
          buttonLink="/criar"
        />
      );

      expect(screen.getByText("Título")).toBeInTheDocument();
      expect(screen.getByText("Descrição")).toBeInTheDocument();
      expect(screen.getByText("Criar Novo")).toBeInTheDocument();
      expect(screen.getByRole("link")).toHaveAttribute("href", "/criar");
    });

    it("should render with default button text when buttonLink is provided", () => {
      render(
        <HeaderList title="Título" description="Descrição" buttonLink="/novo" />
      );

      expect(screen.getByText("Novo")).toBeInTheDocument();
    });

    it("should render with default icon when buttonLink is provided", () => {
      const { container } = render(
        <HeaderList title="Título" description="Descrição" buttonLink="/novo" />
      );

      // Verifica se o ícone ShieldPlus está presente (lucide-react renderiza como SVG)
      const icon = container.querySelector(".lucide-shield-plus");
      expect(icon).toBeInTheDocument();
    });

    it("should render with custom button text", () => {
      render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonText="Adicionar Item"
          buttonLink="/adicionar"
        />
      );

      expect(screen.getByText("Adicionar Item")).toBeInTheDocument();
    });

    it("should render with custom button icon", () => {
      const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;

      render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonIcon={<CustomIcon />}
          buttonLink="/novo"
        />
      );

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("Conditional Rendering", () => {
    it("should not render button when buttonLink is not provided", () => {
      render(<HeaderList title="Título" description="Descrição" />);

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("should not render button when buttonLink is undefined", () => {
      render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonLink={undefined}
        />
      );

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("should not render button when buttonLink is empty string", () => {
      render(
        <HeaderList title="Título" description="Descrição" buttonLink="" />
      );

      // Empty string é falsy, então não deve renderizar
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("should render button when buttonLink is provided", () => {
      render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonLink="/criar"
        />
      );

      expect(screen.getByRole("link")).toBeInTheDocument();
    });
  });

  describe("Props and Defaults", () => {
    it("should use default buttonText when not provided", () => {
      render(
        <HeaderList title="Título" description="Descrição" buttonLink="/novo" />
      );

      expect(screen.getByText("Novo")).toBeInTheDocument();
    });

    it("should use default buttonIcon when not provided", () => {
      const { container } = render(
        <HeaderList title="Título" description="Descrição" buttonLink="/novo" />
      );

      const icon = container.querySelector(".lucide-shield-plus");
      expect(icon).toBeInTheDocument();
    });

    it("should override default buttonText when provided", () => {
      render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonText="Custom Text"
          buttonLink="/novo"
        />
      );

      expect(screen.getByText("Custom Text")).toBeInTheDocument();
      expect(screen.queryByText("Novo")).not.toBeInTheDocument();
    });

    it("should override default buttonIcon when provided", () => {
      const CustomIcon = () => <span data-testid="custom-icon">Custom</span>;

      render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonIcon={<CustomIcon />}
          buttonLink="/novo"
        />
      );

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });
  });

  describe("Link Integration", () => {
    it("should render Link with correct href", () => {
      const { unmount } = render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonLink="/usuarios/criar"
        />
      );

      const link = screen.getByRole("link", { name: /Novo/i });
      expect(link).toHaveAttribute("href", "/usuarios/criar");
      unmount();
    });

    it("should render Link with button text and icon", () => {
      const { unmount } = render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonText="Criar"
          buttonLink="/criar"
        />
      );

      const link = screen.getByRole("link", { name: /Criar/i });
      expect(link).toHaveTextContent("Criar");
      unmount();
    });

    it("should handle different route paths", () => {
      const routes = ["/usuarios", "/produtos", "/pedidos/criar"];

      routes.forEach((route) => {
        const { unmount } = render(
          <HeaderList
            title="Título"
            description="Descrição"
            buttonLink={route}
          />
        );

        const link = screen.getByRole("link", { name: /Novo/i });
        expect(link).toHaveAttribute("href", route);
        unmount();
      });
    });
  });

  describe("Styling and Layout", () => {
    it("should apply correct layout classes", () => {
      const { container } = render(
        <HeaderList title="Título" description="Descrição" />
      );

      const headerDiv = container.firstChild as HTMLElement;
      expect(headerDiv).toHaveClass(
        "mb-6",
        "flex",
        "shrink-0",
        "flex-col",
        "gap-4"
      );
    });

    it("should apply responsive classes", () => {
      const { container } = render(
        <HeaderList title="Título" description="Descrição" />
      );

      const headerDiv = container.firstChild as HTMLElement;
      expect(headerDiv).toHaveClass(
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-between"
      );
    });

    it("should render title with correct styling", () => {
      render(<HeaderList title="Título Teste" description="Descrição" />);

      const title = screen.getByText("Título Teste");
      expect(title).toHaveClass("text-2xl", "font-bold", "tracking-tight");
    });

    it("should render description with correct styling", () => {
      render(<HeaderList title="Título" description="Descrição Teste" />);

      const description = screen.getByText("Descrição Teste");
      expect(description).toHaveClass(
        "text-muted-foreground",
        "mt-1",
        "text-sm"
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty title string", () => {
      render(<HeaderList title="" description="Descrição" />);

      const titleElement = screen.getByRole("heading", { level: 1 });
      expect(titleElement).toHaveTextContent("");
    });

    it("should handle empty description string", () => {
      const { container } = render(
        <HeaderList title="Título" description="" />
      );

      const description = container.querySelector("p.text-muted-foreground");
      expect(description).toBeInTheDocument();
      expect(description?.textContent).toBe("");
    });

    it("should handle very long title", () => {
      const longTitle = "A".repeat(200);

      render(<HeaderList title={longTitle} description="Descrição" />);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it("should handle very long description", () => {
      const longDescription = "B".repeat(500);

      render(<HeaderList title="Título" description={longDescription} />);

      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it("should handle special characters in title", () => {
      const specialTitle = "Título com @#$% & *()";

      render(<HeaderList title={specialTitle} description="Descrição" />);

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it("should handle special characters in description", () => {
      const specialDescription = "Descrição com <>&\"'";

      render(<HeaderList title="Título" description={specialDescription} />);

      expect(screen.getByText(specialDescription)).toBeInTheDocument();
    });

    it("should handle null buttonIcon gracefully", () => {
      const { unmount } = render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonIcon={null}
          buttonLink="/novo"
        />
      );

      const link = screen.getByRole("link", { name: /Novo/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("Novo");
      unmount();
    });

    it("should handle undefined buttonIcon by using default", () => {
      const { container } = render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonIcon={undefined}
          buttonLink="/novo"
        />
      );

      const icon = container.querySelector(".lucide-shield-plus");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper heading structure", () => {
      render(<HeaderList title="Título Principal" description="Descrição" />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Título Principal");
    });

    it("should have accessible link when button is rendered", () => {
      render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonLink="/criar"
          buttonText="Criar Novo"
        />
      );

      const link = screen.getByRole("link", { name: /Criar Novo/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/criar");
    });

    it("should have accessible button text", () => {
      const { unmount } = render(
        <HeaderList
          title="Título"
          description="Descrição"
          buttonLink="/novo"
          buttonText="Adicionar"
        />
      );

      const link = screen.getByRole("link", { name: /Adicionar/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent("Adicionar");
      unmount();
    });
  });
});
