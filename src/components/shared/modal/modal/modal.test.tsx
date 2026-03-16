import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "./modal";

describe("Modal", () => {
  it("deve renderizar o modal quando open é true", () => {
    render(
      <Modal
        open={true}
        onOpenChange={() => {}}
        title="Título do Modal"
        description="Descrição do modal"
      >
        <div>Conteúdo do modal</div>
      </Modal>
    );

    expect(screen.getByText("Título do Modal")).toBeInTheDocument();
    expect(screen.getByText("Descrição do modal")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo do modal")).toBeInTheDocument();
  });

  it("não deve renderizar quando open é false", () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="Título do Modal">
        <div>Conteúdo do modal</div>
      </Modal>
    );

    expect(screen.queryByText("Título do Modal")).not.toBeInTheDocument();
  });

  it("deve chamar onOpenChange quando fechar", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal
        open={true}
        onOpenChange={handleOpenChange}
        title="Título do Modal"
      >
        <div>Conteúdo</div>
      </Modal>
    );

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("deve renderizar footer quando fornecido", () => {
    render(
      <Modal
        open={true}
        onOpenChange={() => {}}
        title="Título"
        footer={<button type="button">Confirmar</button>}
      >
        <div>Conteúdo</div>
      </Modal>
    );

    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });

  it("deve renderizar sem descrição quando não fornecida", () => {
    render(
      <Modal open={true} onOpenChange={() => {}} title="Apenas Título">
        <div>Conteúdo</div>
      </Modal>
    );

    expect(screen.getByText("Apenas Título")).toBeInTheDocument();
    // Não deve haver descrição no documento
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("deve aplicar classe CSS customizada", () => {
    render(
      <Modal
        open={true}
        onOpenChange={() => {}}
        title="Título"
        className="custom-class"
      >
        <div>Conteúdo</div>
      </Modal>
    );

    // O DialogContent é renderizado dentro de um portal, então precisamos buscar no documento completo
    const dialogContent = document.querySelector(
      "[data-slot='dialog-content']"
    );
    expect(dialogContent).toBeInTheDocument();
    expect(dialogContent).toHaveClass("custom-class");
  });

  it("deve permitir controlar o botão de fechar", () => {
    const { rerender } = render(
      <Modal
        open={true}
        onOpenChange={() => {}}
        title="Com botão fechar"
        showCloseButton={true}
      >
        <div>Conteúdo</div>
      </Modal>
    );

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();

    rerender(
      <Modal
        open={true}
        onOpenChange={() => {}}
        title="Sem botão fechar"
        showCloseButton={false}
      >
        <div>Conteúdo</div>
      </Modal>
    );

    expect(
      screen.queryByRole("button", { name: /close/i })
    ).not.toBeInTheDocument();
  });
});
