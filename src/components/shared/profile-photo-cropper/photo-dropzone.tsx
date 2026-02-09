import { memo, useCallback } from "react";

import { Upload } from "lucide-react";

import type { PhotoDropzoneProps } from "./types";

export const PhotoDropzone = memo(function PhotoDropzone({
  onFileSelect,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
}: PhotoDropzoneProps) {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
      event.target.value = "";
    },
    [onFileSelect]
  );

  return (
    <label
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`relative flex h-40 w-40 cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed transition-colors ${
        isDragOver
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/50"
      } `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Selecione uma foto para o perfil"
      />
      <Upload
        className="text-muted-foreground mb-2 h-8 w-8"
        aria-hidden="true"
      />
      <span className="text-muted-foreground px-4 text-center text-sm">
        Enviar foto
      </span>
      <span className="text-muted-foreground/70 mt-1 text-xs">
        ou arraste e solte
      </span>
    </label>
  );
});
