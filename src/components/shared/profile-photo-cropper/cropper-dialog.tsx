import { useCallback } from "react";
import Cropper from "react-easy-crop";

import { Check, Loader2, X, ZoomIn, ZoomOut } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Slider,
} from "@/components/shadcn";

import type { CropperDialogProps } from "./types";
import { useImageCropper } from "./use-image-cropper";

export function CropperDialog({
  open,
  onClose,
  onSave,
  imageSrc,
  minZoom = 1,
  maxZoom = 3,
}: CropperDialogProps) {
  const {
    crop,
    zoom,
    isProcessing,
    setCrop,
    setZoom,
    onCropComplete,
    handleSave,
    reset,
  } = useImageCropper({ minZoom, maxZoom });

  const handleConfirm = useCallback(async () => {
    const file = await handleSave(imageSrc);
    if (file) {
      onSave(file);
      reset();
    }
  }, [handleSave, imageSrc, onSave, reset]);

  const handleCancel = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Crop Profile Photo
          </DialogTitle>
        </DialogHeader>

        {/* Cropper Area */}
        <div className="bg-background relative h-72 w-full overflow-hidden rounded-lg">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{
              containerClassName: "rounded-lg",
            }}
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-3 px-2">
          <ZoomOut
            className="text-muted-foreground h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <Slider
            value={[zoom]}
            min={minZoom}
            max={maxZoom}
            step={0.1}
            onValueChange={(values) => setZoom(values[0])}
            className="flex-1"
            aria-label="Zoom level"
          />
          <ZoomIn
            className="text-muted-foreground h-4 w-4 shrink-0"
            aria-hidden="true"
          />
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
            className="flex-1 sm:flex-none"
          >
            <X className="mr-2 h-4 w-4" aria-hidden="true" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 sm:flex-none"
          >
            {isProcessing ? (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {isProcessing ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
