import { useFormContext } from "react-hook-form";

import { Image as ImageIcon, Loader2, Upload, Video, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

import { useMediaUpload } from "./use-media-upload";

interface IMediaUploadFormProps {
  name: string;
  label: string;
  type: "image" | "video";
  previewUrl?: string;
  onRemove?: () => void;
  required?: boolean;
  disabled?: boolean;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

interface IMediaPreviewProps {
  type: "image" | "video";
  preview: string;
  disabled: boolean;
  onRemove: () => void;
}

function MediaPreview({
  type,
  preview,
  disabled,
  onRemove,
}: Readonly<IMediaPreviewProps>) {
  return (
    <div className="border-border bg-secondary/30 relative overflow-hidden rounded-lg border">
      {type === "image" ? (
        <img src={preview} alt="Preview" className="h-48 w-full object-cover" />
      ) : (
        <video
          src={preview}
          controls
          className="h-48 w-full bg-black object-contain"
        >
          <track kind="captions" />
        </video>
      )}
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          aria-label="Remover"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface IMediaDropZoneProps {
  type: "image" | "video";
  uploading: boolean;
  disabled: boolean;
  maxSizeMB: number;
  onTrigger: () => void;
}

function MediaDropZone({
  type,
  uploading,
  disabled,
  maxSizeMB,
  onTrigger,
}: Readonly<IMediaDropZoneProps>) {
  const Icon = type === "image" ? ImageIcon : Video;

  return (
    <button
      type="button"
      disabled={disabled || uploading}
      onClick={onTrigger}
      className={cn(
        "border-border bg-secondary/20 flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
        !disabled && "hover:border-primary/50 hover:bg-secondary/40",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {uploading ? (
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      ) : (
        <>
          <Icon className="text-muted-foreground mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">
            Clique para enviar {type === "image" ? "uma imagem" : "um vídeo"}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Máximo {maxSizeMB}MB
          </p>
        </>
      )}
    </button>
  );
}

export function MediaUploadForm({
  name,
  label,
  type,
  previewUrl,
  onRemove,
  required = false,
  disabled = false,
  maxSizeMB = type === "image" ? 5 : 50,
  accept = type === "image"
    ? "image/jpeg,image/png,image/webp"
    : "video/mp4,video/webm",
  className,
}: Readonly<IMediaUploadFormProps>) {
  const form = useFormContext();

  const {
    fileInputRef,
    uploadedPreview,
    uploading,
    error,
    handleFileSelect,
    handleRemove,
    handleClick,
  } = useMediaUpload({ type, accept, maxSizeMB, disabled });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const preview = uploadedPreview || previewUrl;

        return (
          <FormItem className={cn("space-y-3", className)}>
            <FormLabel className="text-foreground text-sm font-medium">
              {label}
              {required && (
                <span className="text-destructive ml-1 text-xs">*</span>
              )}
            </FormLabel>

            <FormControl>
              <div className="space-y-3">
                {preview ? (
                  <MediaPreview
                    type={type}
                    preview={preview}
                    disabled={disabled}
                    onRemove={() => {
                      handleRemove(field.onChange);
                      onRemove?.();
                    }}
                  />
                ) : (
                  <MediaDropZone
                    type={type}
                    uploading={uploading}
                    disabled={disabled}
                    maxSizeMB={maxSizeMB}
                    onTrigger={handleClick}
                  />
                )}

                {error && <p className="text-destructive text-xs">{error}</p>}

                {preview && !disabled && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClick}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar {type === "image" ? "imagem" : "vídeo"}
                  </Button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileSelect(e, field.onChange)}
                  className="hidden"
                  disabled={disabled || uploading}
                />
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
