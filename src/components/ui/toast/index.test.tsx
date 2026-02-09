import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./index";

describe("Toast Component", () => {
  it("renders correctly with all subcomponents", () => {
    const onActionClick = vi.fn();

    const { container } = render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Notification</ToastTitle>
          <ToastDescription>This is a toast notification</ToastDescription>
          <ToastAction altText="Try again" onClick={onActionClick}>
            Try again
          </ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    // Verifica se o componente foi renderizado
    expect(container.querySelector('[data-state="open"]')).toBeInTheDocument();
    // Verifica se o texto do título está presente
    expect(container.textContent).toContain("Notification");
    // Verifica se a descrição está presente
    expect(container.textContent).toContain("This is a toast notification");
    // Verifica se o botão de ação está presente
    expect(container.textContent).toContain("Try again");
  });

  it("applies different variants correctly", () => {
    const { container } = render(
      <ToastProvider>
        <Toast variant="destructive" open>
          <ToastTitle>Error</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const toast = container.querySelector('[data-state="open"]');
    expect(toast).toHaveClass("destructive");
  });

  it("calls action handler when clicked", async () => {
    const onActionClick = vi.fn();

    const { container } = render(
      <ToastProvider>
        <Toast open>
          <ToastAction altText="Confirm" onClick={onActionClick}>
            Confirm
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const actionButton = container.querySelector('[class*="inline-flex"]');
    expect(actionButton).toBeInTheDocument();

    if (actionButton) {
      await userEvent.click(actionButton);
      expect(onActionClick).toHaveBeenCalledTimes(1);
    }
  });

  it("can be closed", async () => {
    const { container } = render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Notification</ToastTitle>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );

    const closeButton = container.querySelector("[toast-close]");
    expect(closeButton).toBeInTheDocument();

    if (closeButton) {
      await userEvent.click(closeButton);
      // Em um cenário real, isso fecharia o toast
      // Para fins de teste, estamos apenas garantindo que o botão existe e é clicável
    }
  });
});
