import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { useConfirmStore } from "@/hooks/use-confirm-store";

import { ConfirmDialog } from "./confirm-dialog";

describe("ConfirmDialog", () => {
  it("não deve renderizar quando fechado", () => {
    render(<ConfirmDialog />);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("deve renderizar com título e mensagem quando aberto", async () => {
    render(<ConfirmDialog />);

    act(() => {
      void useConfirmStore
        .getState()
        .confirm({ title: "Título Teste", message: "Mensagem Teste" });
    });

    expect(await screen.findByText("Título Teste")).toBeInTheDocument();
    expect(screen.getByText("Mensagem Teste")).toBeInTheDocument();
  });

  it("deve chamar handleConfirm ao clicar em Confirmar", async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.spyOn(useConfirmStore.getState(), "handleConfirm");

    render(<ConfirmDialog />);

    act(() => {
      void useConfirmStore
        .getState()
        .confirm({ title: "Título", message: "Mensagem" });
    });

    const confirmButton = await screen.findByText("Confirmar");
    await user.click(confirmButton);

    expect(handleConfirm).toHaveBeenCalled();
  });

  it("deve chamar handleCancel ao clicar em Cancelar", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.spyOn(useConfirmStore.getState(), "handleCancel");

    render(<ConfirmDialog />);

    act(() => {
      void useConfirmStore
        .getState()
        .confirm({ title: "Título", message: "Mensagem" });
    });

    const cancelButton = await screen.findByText("Cancelar");
    await user.click(cancelButton);

    expect(handleCancel).toHaveBeenCalled();
  });

  it("deve aplicar classe destructive quando variant é destructive", async () => {
    render(<ConfirmDialog />);

    act(() => {
      void useConfirmStore.getState().confirm({
        title: "Excluir",
        message: "Tem certeza?",
        textConfirm: "Confirmar",
        variant: "destructive",
      });
    });

    const confirmButton = await screen.findByText("Confirmar");

    expect(confirmButton).toHaveClass("bg-destructive");
  });

  it("não deve aplicar classe destructive quando variant é default", async () => {
    render(<ConfirmDialog />);

    act(() => {
      void useConfirmStore.getState().confirm({
        title: "Salvar",
        message: "Confirma?",
        textConfirm: "Confirmar",
        variant: "default",
      });
    });

    const confirmButton = await screen.findByText("Confirmar");

    expect(confirmButton).not.toHaveClass("bg-destructive");
  });
});
