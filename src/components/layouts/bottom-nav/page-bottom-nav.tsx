import * as React from "react";

import type { BottomNavAction, BottomNavLeftAction } from "./types";
import { useBottomNav } from "./use-bottom-nav";

interface IPageBottomNavProps {
  // Ação primária (botão principal à direita)
  readonly onSubmit: () => void;
  readonly submitLabel: string;
  readonly submitIcon?: React.ReactNode;
  readonly isSubmitting?: boolean;

  // Ação de cancelamento/voltar
  readonly onCancel: () => void;
  readonly cancelLabel?: string;
  readonly showCancelButton?: boolean; // Se true, mostra botão "Cancelar" adicional
}

export function PageBottomNav({
  onSubmit,
  submitLabel,
  submitIcon,
  isSubmitting = false,
  onCancel,
  cancelLabel = "Voltar",
  showCancelButton = true,
}: Readonly<IPageBottomNavProps>) {
  const { setBottomNav } = useBottomNav();

  // Constrói as ações internamente de forma memoizada
  const leftAction = React.useMemo<BottomNavLeftAction>(
    () => ({
      label: cancelLabel,
      onClick: onCancel,
      disabled: isSubmitting,
    }),
    [cancelLabel, onCancel, isSubmitting]
  );

  const rightActions = React.useMemo<BottomNavAction[]>(() => {
    const actions: BottomNavAction[] = [];

    // Botão cancelar adicional (opcional)
    if (showCancelButton) {
      actions.push({
        label: "Cancelar",
        onClick: onCancel,
        variant: "outline",
        disabled: isSubmitting,
      });
    }

    // Botão de ação principal
    actions.push({
      label: submitLabel,
      onClick: onSubmit,
      variant: "default",
      icon: submitIcon,
      disabled: isSubmitting,
      loading: isSubmitting,
    });

    return actions;
  }, [
    showCancelButton,
    onCancel,
    submitLabel,
    onSubmit,
    submitIcon,
    isSubmitting,
  ]);

  React.useEffect(() => {
    setBottomNav({ leftAction, rightActions });

    return () => {
      setBottomNav(null);
    };
  }, [leftAction, rightActions, setBottomNav]);

  return null;
}
