import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";

interface IModalProps {
  /**
   * Controla se o modal está aberto ou fechado
   */
  readonly open: boolean;
  /**
   * Callback chamado quando o modal deve ser fechado
   */
  readonly onOpenChange: (open: boolean) => void;
  /**
   * Título do modal
   */
  readonly title: string;
  /**
   * Descrição opcional do modal
   */
  readonly description?: string;
  /**
   * Conteúdo principal do modal
   */
  readonly children: React.ReactNode;
  /**
   * Conteúdo opcional do footer (botões de ação)
   */
  readonly footer?: React.ReactNode;
  /**
   * Largura máxima do modal
   * @default "lg" (32rem)
   */
  readonly maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /**
   * Se deve mostrar o botão de fechar (X)
   * @default true
   */
  readonly showCloseButton?: boolean;
  /**
   * Classe CSS adicional para o conteúdo do modal
   */
  readonly className?: string;
}

const maxWidthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  full: "sm:max-w-full",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  maxWidth = "lg",
  showCloseButton = true,
  className,
}: Readonly<IModalProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${maxWidthClasses[maxWidth]} ${className || ""}`}
        showCloseButton={showCloseButton}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="py-4">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
