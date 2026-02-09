/**
 * Type definitions for ProfilePhotoCropper components
 */

export interface ProfilePhotoCropperProps {
  /** Current file or URL value */
  value?: File | string | null;
  /** Callback when a cropped file is saved */
  onChange: (file: File | null) => void;
  /** Fallback initials for avatar */
  initials?: string;
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
}

export interface CropperDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (file: File) => void;
  imageSrc: string;
  minZoom?: number;
  maxZoom?: number;
}

export interface PhotoDropzoneProps {
  onFileSelect: (file: File) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export interface PhotoPreviewProps {
  previewUrl: string;
  initials: string;
  onEdit: () => void;
  onRemove: () => void;
}
