import { useCallback, useEffect, useState } from "react";

import { CropperDialog } from "./cropper-dialog";
import { PhotoDropzone } from "./photo-dropzone";
import { PhotoPreview } from "./photo-preview";
import type { ProfilePhotoCropperProps } from "./types";

function getPreviewUrl(value?: string | File | null) {
  if (typeof value === "string") {
    return value;
  } else if (value instanceof File) {
    const url = URL.createObjectURL(value);
    return url;
  }
  return null;
}

export function ProfilePhotoCropper({
  value,
  onChange,
  initials = "U",
  minZoom = 1,
  maxZoom = 3,
}: ProfilePhotoCropperProps) {
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    getPreviewUrl(value)
  );

  useEffect(() => {
    setPreviewUrl(getPreviewUrl(value));
  }, [value]);
  // Drag state
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle file selection (from input or drop)
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsDialogOpen(true);
    };
    reader.readAsDataURL(file);
  }, []);

  // Drag handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  // Save handler - receives cropped file from dialog
  const handleSave = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(file);
      setIsDialogOpen(false);
      setImageSrc(null);
    },
    [onChange]
  );

  // Close dialog handler
  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setImageSrc(null);
  }, []);

  // Edit existing photo
  const handleEdit = useCallback(() => {
    if (previewUrl) {
      setImageSrc(previewUrl);
      setIsDialogOpen(true);
    }
  }, [previewUrl]);

  // Remove photo
  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    onChange(null);
  }, [onChange]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview or Dropzone */}
      {previewUrl ? (
        <PhotoPreview
          previewUrl={previewUrl}
          initials={initials}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      ) : (
        <PhotoDropzone
          onFileSelect={handleFileSelect}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      )}

      {/* Cropping Dialog */}
      {imageSrc && (
        <CropperDialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSave}
          imageSrc={imageSrc}
          minZoom={minZoom}
          maxZoom={maxZoom}
        />
      )}
    </div>
  );
}

// Re-export types for external usage
export type { ProfilePhotoCropperProps } from "./types";
