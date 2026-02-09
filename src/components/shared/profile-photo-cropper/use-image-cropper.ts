import { useCallback, useState } from "react";
import type { Area, Point } from "react-easy-crop";

import { blobToFile, getCroppedImg } from "@/utils/canvas";

interface IUseImageCropperOptions {
  initialZoom?: number;
  initialRotation?: number;
  minZoom?: number;
  maxZoom?: number;
  onSaveComplete?: (file: File) => void;
  onError?: (error: Error) => void;
}

interface IUseImageCropperReturn {
  // State
  crop: Point;
  zoom: number;
  rotation: number;
  croppedAreaPixels: Area | null;
  isProcessing: boolean;

  // Setters
  setCrop: (crop: Point) => void;
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;

  // Handlers
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  handleSave: (imageSrc: string) => Promise<File | null>;
  reset: () => void;
}

/**
 * Custom hook to manage image cropping state and operations
 */
export function useImageCropper(
  options: IUseImageCropperOptions = {}
): IUseImageCropperReturn {
  const {
    initialZoom = 1,
    initialRotation = 0,
    minZoom = 1,
    maxZoom = 3,
    onSaveComplete,
    onError,
  } = options;

  // Crop position state
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });

  // Zoom level state
  const [zoom, setZoom] = useState<number>(initialZoom);

  // Rotation state (optional feature)
  const [rotation, setRotation] = useState<number>(initialRotation);

  // Cropped area in pixels (set by react-easy-crop)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Processing state for async operations
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  /**
   * Handler called by react-easy-crop when crop is complete
   */
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  /**
   * Validates and clamps zoom value within bounds
   */
  const handleSetZoom = useCallback(
    (newZoom: number) => {
      const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);
      setZoom(clampedZoom);
    },
    [minZoom, maxZoom]
  );

  /**
   * Processes the crop and returns a File object
   * Heavy canvas operations happen here asynchronously
   */
  const handleSave = useCallback(
    async (imageSrc: string): Promise<File | null> => {
      if (!croppedAreaPixels) {
        const error = new Error("No crop area defined");
        onError?.(error);
        return null;
      }

      setIsProcessing(true);

      try {
        // Perform heavy canvas operations asynchronously
        const croppedBlob = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          rotation
        );

        // Convert blob to file
        const croppedFile = blobToFile(croppedBlob);

        // Notify parent component
        onSaveComplete?.(croppedFile);

        return croppedFile;
      } catch (error) {
        const err =
          error instanceof Error ? error : new Error("Failed to crop image");
        onError?.(err);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [croppedAreaPixels, rotation, onSaveComplete, onError]
  );

  /**
   * Resets all state to initial values
   */
  const reset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(initialZoom);
    setRotation(initialRotation);
    setCroppedAreaPixels(null);
    setIsProcessing(false);
  }, [initialZoom, initialRotation]);

  return {
    // State
    crop,
    zoom,
    rotation,
    croppedAreaPixels,
    isProcessing,

    // Setters
    setCrop,
    setZoom: handleSetZoom,
    setRotation,

    // Handlers
    onCropComplete,
    handleSave,
    reset,
  };
}
