import { useRef } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";

import {
  Download,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  Sheet,
  Trash2,
  Upload,
} from "lucide-react";

import { useConfirmStore } from "@/hooks/use-confirm-store";
import { Button } from "@/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

// Tipo para arquivo existente vindo do backend
interface IExistingFile {
  id: string;
  file_name: string;
  size_bytes: number;
  mime_type: string;
  url: string;
  key?: string;
  type?: string;
  createdAt?: string;
}

// Tipo união: pode ser File nativo OU metadados do backend
export type TFileItem = File | IExistingFile;

interface IFileFormProps<T extends FieldValues> {
  control?: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onDeleteExistingFile?: (id: string) => Promise<void>;
}

// Type guard para identificar se é File nativo
const isNativeFile = (item: TFileItem): item is File => {
  return item instanceof File;
};

// Type guard para identificar se é arquivo existente
const isExistingFile = (item: TFileItem): item is IExistingFile => {
  return !isNativeFile(item) && "url" in item;
};

// Helper: Formata tamanho de arquivo
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

// Helper: Retorna ícone baseado no mimeType
const getFileIcon = (mimeType: string) => {
  if (mimeType?.startsWith("image/")) {
    return <ImageIcon className="h-5 w-5" />;
  }
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("document") ||
    mimeType.includes("text")
  ) {
    return <FileText className="h-5 w-5" />;
  }
  if (mimeType.includes("sheet") || mimeType.includes("csv")) {
    return <Sheet className="h-5 w-5" />;
  }
  return <FileIcon className="h-5 w-5" />;
};

export function FileForm<T extends FieldValues>({
  name,
  label,
  required,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.csv",
  multiple = true,
  className,
  onDeleteExistingFile,
}: Readonly<IFileFormProps<T>>) {
  const form = useFormContext<T>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const confirm = useConfirmStore((state) => state.confirm);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentValue: TFileItem[],
    onChange: (value: TFileItem[]) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    // Se multiple for false, substitui o arquivo existente ao invés de adicionar
    if (!multiple) {
      // Pega apenas o primeiro arquivo selecionado
      onChange([newFiles[0]]);
    } else {
      onChange([...currentValue, ...newFiles]);
    }

    e.target.value = "";
  };

  const handleDownload = (item: TFileItem) => {
    if (isNativeFile(item)) {
      // Arquivo local (File nativo)
      const url = URL.createObjectURL(item);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.name;
      link.click();
      URL.revokeObjectURL(url);
    } else if (isExistingFile(item)) {
      // Arquivo do backend
      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.file_name;
      link.target = "_blank";
      link.click();
    }
  };

  const handleDelete = async (
    index: number,
    currentValue: TFileItem[],
    onChange: (value: TFileItem[]) => void
  ) => {
    const item = currentValue[index];

    // Se for arquivo existente e tiver callback, mostrar confirmação
    if (isExistingFile(item) && onDeleteExistingFile) {
      const confirmed = await confirm({
        title: "Excluir anexo",
        message:
          "Tem certeza que deseja excluir este anexo? Esta ação não pode ser desfeita.",
        variant: "destructive",
      });

      if (confirmed) {
        try {
          await onDeleteExistingFile(item.id);
          // Remove o arquivo da lista após exclusão bem-sucedida
          const newFiles = currentValue.filter((_, i) => i !== index);
          onChange(newFiles);
        } catch (error) {
          // Erro já é tratado pela mutation/API (toast)
          // Mantém o arquivo na lista se a exclusão falhar
          console.error("Erro ao excluir arquivo:", error);
        }
      }
      return;
    }

    // Para arquivos locais ou se não houver callback, remover imediatamente
    const newFiles = currentValue.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  // Helper: Extrai nome do arquivo
  const getFileName = (item: TFileItem): string => {
    return isNativeFile(item) ? item.name : item.file_name;
  };

  // Helper: Extrai tamanho do arquivo
  const getFileSize = (item: TFileItem): number => {
    return isNativeFile(item) ? item.size : item.size_bytes;
  };

  // Helper: Extrai mime type
  const getMimeType = (item: TFileItem): string => {
    return isNativeFile(item) ? item.type : item.mime_type;
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const items: TFileItem[] = field.value || [];
        // Quando multiple for false, garante que apenas 1 arquivo seja exibido
        const displayItems = multiple ? items : items.slice(0, 1);

        return (
          <FormItem className={className}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="text-foreground flex items-center gap-2 text-sm font-medium">
                  {label}
                  {required && (
                    <span className="text-destructive text-xs">*</span>
                  )}
                  <span className="text-muted-foreground text-xs font-normal">
                    ({displayItems.length})
                  </span>
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8"
                >
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  {multiple
                    ? "Anexar"
                    : displayItems.length > 0
                      ? "Substituir"
                      : "Anexar"}
                </Button>
              </div>

              <FormControl>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={multiple}
                  onChange={(e) => handleFileSelect(e, items, field.onChange)}
                  className="hidden"
                  accept={accept}
                />
              </FormControl>

              {displayItems.length === 0 ? (
                <p className="text-muted-foreground bg-secondary/20 border-border rounded border border-dashed px-3 py-2 text-xs">
                  Nenhum arquivo anexado
                </p>
              ) : (
                <div className="space-y-2">
                  {displayItems.map((item, index) => {
                    const fileName = getFileName(item);
                    const fileSize = getFileSize(item);
                    const mimeType = getMimeType(item);
                    const key = isExistingFile(item)
                      ? item.id
                      : `${fileName}-${index}`;

                    return (
                      <div
                        key={key}
                        className="bg-secondary/20 border-border/30 hover:bg-secondary/30 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                      >
                        <div className="bg-secondary/50 border-border/50 text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                          {getFileIcon(mimeType)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">
                            {fileName}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatFileSize(fileSize)}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                            onClick={() => handleDownload(item)}
                            aria-label="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive h-8 w-8"
                            onClick={() =>
                              handleDelete(index, items, field.onChange)
                            }
                            aria-label="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
