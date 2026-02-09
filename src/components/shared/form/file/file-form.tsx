import { useRef } from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Download,
  File,
  FileText,
  Image as ImageIcon,
  Sheet,
  Trash2,
  Upload,
} from "lucide-react";

import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn";

interface IFileAttachment {
  id: string;
  file_name: string;
  size_bytes: number;
  mime_type: string;
  createdAt?: string;
  url?: string;
}

interface IFileFormProps<T extends FieldValues> {
  control?: Control<T>;
  name: FieldPath<T>;
  label: string;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

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
  return <File className="h-5 w-5" />;
};

export function FileForm<T extends FieldValues>({
  name,
  label,
  required,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.csv",
  multiple = true,
  className,
}: IFileFormProps<T>) {
  const form = useFormContext<T>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentValue: IFileAttachment[],
    onChange: (value: IFileAttachment[]) => void
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: IFileAttachment[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file_name: file.name,
      size_bytes: file.size,
      mime_type: file.type || "application/octet-stream",
      createdAt: new Date().toISOString(),
      url: URL.createObjectURL(file),
    }));

    onChange([...currentValue, ...newAttachments]);
    e.target.value = "";
  };

  const handleDownload = (attachment: IFileAttachment) => {
    if (attachment.url) {
      const link = document.createElement("a");
      link.href = attachment.url;
      link.download = attachment.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDelete = (
    id: string,
    currentValue: IFileAttachment[],
    onChange: (value: IFileAttachment[]) => void
  ) => {
    const newAttachments = currentValue.filter((item) => item.id !== id);
    onChange(newAttachments);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const items = field.value || [];

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
                    ({items.length})
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
                  Anexar
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

              {items.length === 0 ? (
                <p className="text-muted-foreground bg-secondary/20 border-border rounded border border-dashed px-3 py-2 text-xs">
                  Nenhum arquivo anexado
                </p>
              ) : (
                <div className="space-y-2">
                  {items.map((attachment: IFileAttachment) => (
                    <div
                      key={attachment.id}
                      className="bg-secondary/20 border-border/30 hover:bg-secondary/30 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                    >
                      <div className="bg-secondary/50 border-border/50 text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
                        {getFileIcon(attachment.mime_type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground truncate text-sm font-medium">
                          {attachment.file_name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {formatFileSize(attachment.size_bytes)} •{" "}
                          {format(
                            new Date(attachment.createdAt || ""),
                            "dd/MM/yyyy",
                            {
                              locale: ptBR,
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground h-8 w-8"
                          onClick={() => handleDownload(attachment)}
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
                            handleDelete(attachment.id, items, field.onChange)
                          }
                          aria-label="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
