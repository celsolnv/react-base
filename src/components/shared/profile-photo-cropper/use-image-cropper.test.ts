import type { Area, Point } from "react-easy-crop";

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useImageCropper } from "./use-image-cropper";

// Mock das funções de canvas
const mockGetCroppedImg = vi.fn();
const mockBlobToFile = vi.fn();

vi.mock("@/utils/canvas", () => ({
  getCroppedImg: (...args: unknown[]) => mockGetCroppedImg(...args),
  blobToFile: (...args: unknown[]) => mockBlobToFile(...args),
}));

// Helper para criar um mock de Blob
const createMockBlob = (): Blob => {
  return new Blob(["mock-image-data"], { type: "image/jpeg" });
};

// Helper para criar um mock de File
const createMockFile = (): File => {
  const blob = createMockBlob();
  return new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
};

// Helper para criar uma área de crop mock
const createMockArea = (): Area => ({
  x: 10,
  y: 20,
  width: 100,
  height: 100,
});

describe("useImageCropper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCroppedImg.mockResolvedValue(createMockBlob());
    mockBlobToFile.mockReturnValue(createMockFile());
  });

  describe("Initial State", () => {
    it("should return default initial values", () => {
      const { result } = renderHook(() => useImageCropper());

      expect(result.current.crop).toEqual({ x: 0, y: 0 });
      expect(result.current.zoom).toBe(1);
      expect(result.current.rotation).toBe(0);
      expect(result.current.croppedAreaPixels).toBeNull();
      expect(result.current.isProcessing).toBe(false);
    });

    it("should use custom initialZoom", () => {
      const { result } = renderHook(() => useImageCropper({ initialZoom: 2 }));

      expect(result.current.zoom).toBe(2);
    });

    it("should use custom initialRotation", () => {
      const { result } = renderHook(() =>
        useImageCropper({ initialRotation: 90 })
      );

      expect(result.current.rotation).toBe(90);
    });

    it("should use custom minZoom and maxZoom", () => {
      const { result } = renderHook(() =>
        useImageCropper({ minZoom: 0.5, maxZoom: 5 })
      );

      // O zoom inicial ainda é 1 (ou initialZoom se fornecido)
      expect(result.current.zoom).toBe(1);
    });
  });

  describe("State Setters", () => {
    it("should update crop position", () => {
      const { result } = renderHook(() => useImageCropper());

      act(() => {
        result.current.setCrop({ x: 50, y: 100 });
      });

      expect(result.current.crop).toEqual({ x: 50, y: 100 });
    });

    it("should update zoom within bounds", () => {
      const { result } = renderHook(() =>
        useImageCropper({ minZoom: 1, maxZoom: 3 })
      );

      act(() => {
        result.current.setZoom(2);
      });

      expect(result.current.zoom).toBe(2);
    });

    it("should clamp zoom to minZoom when value is too low", () => {
      const { result } = renderHook(() =>
        useImageCropper({ minZoom: 1, maxZoom: 3 })
      );

      act(() => {
        result.current.setZoom(0.5);
      });

      expect(result.current.zoom).toBe(1);
    });

    it("should clamp zoom to maxZoom when value is too high", () => {
      const { result } = renderHook(() =>
        useImageCropper({ minZoom: 1, maxZoom: 3 })
      );

      act(() => {
        result.current.setZoom(5);
      });

      expect(result.current.zoom).toBe(3);
    });

    it("should update rotation", () => {
      const { result } = renderHook(() => useImageCropper());

      act(() => {
        result.current.setRotation(45);
      });

      expect(result.current.rotation).toBe(45);
    });

    it("should handle negative rotation", () => {
      const { result } = renderHook(() => useImageCropper());

      act(() => {
        result.current.setRotation(-90);
      });

      expect(result.current.rotation).toBe(-90);
    });
  });

  describe("onCropComplete", () => {
    it("should update croppedAreaPixels when crop is complete", () => {
      const { result } = renderHook(() => useImageCropper());
      const mockArea = createMockArea();
      const mockPixels: Area = {
        x: 20,
        y: 30,
        width: 200,
        height: 200,
      };

      act(() => {
        result.current.onCropComplete(mockArea, mockPixels);
      });

      expect(result.current.croppedAreaPixels).toEqual(mockPixels);
    });

    it("should update croppedAreaPixels multiple times", () => {
      const { result } = renderHook(() => useImageCropper());
      const mockArea = createMockArea();
      const firstPixels: Area = { x: 10, y: 10, width: 100, height: 100 };
      const secondPixels: Area = { x: 20, y: 20, width: 150, height: 150 };

      act(() => {
        result.current.onCropComplete(mockArea, firstPixels);
      });

      expect(result.current.croppedAreaPixels).toEqual(firstPixels);

      act(() => {
        result.current.onCropComplete(mockArea, secondPixels);
      });

      expect(result.current.croppedAreaPixels).toEqual(secondPixels);
    });
  });

  describe("handleSave", () => {
    it("should return null when croppedAreaPixels is not set", async () => {
      const { result } = renderHook(() => useImageCropper());

      let savedFile: File | null = null;
      await act(async () => {
        savedFile = await result.current.handleSave("image-src");
      });

      expect(savedFile).toBeNull();
      expect(mockGetCroppedImg).not.toHaveBeenCalled();
    });

    it("should call onError when croppedAreaPixels is not set", async () => {
      const onError = vi.fn();
      const { result } = renderHook(() => useImageCropper({ onError }));

      await act(async () => {
        await result.current.handleSave("image-src");
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "No crop area defined",
        })
      );
    });

    it("should process crop and return file when croppedAreaPixels is set", async () => {
      const { result } = renderHook(() => useImageCropper());
      const mockPixels = createMockArea();
      const mockFile = createMockFile();

      // Primeiro define a área de crop
      act(() => {
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      // Depois processa o save
      let savedFile: File | null = null;
      await act(async () => {
        savedFile = await result.current.handleSave("image-src-url");
      });

      expect(mockGetCroppedImg).toHaveBeenCalledWith(
        "image-src-url",
        mockPixels,
        0 // rotation padrão
      );
      expect(mockBlobToFile).toHaveBeenCalled();
      expect(savedFile).toBeInstanceOf(File);
    });

    it("should set isProcessing to true during save", async () => {
      const { result } = renderHook(() => useImageCropper());
      const mockPixels = createMockArea();

      // Cria uma promise que não resolve imediatamente
      let resolvePromise: (value: Blob) => void;
      const pendingPromise = new Promise<Blob>((resolve) => {
        resolvePromise = resolve;
      });

      mockGetCroppedImg.mockReturnValue(pendingPromise);

      act(() => {
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      // Inicia o save
      act(() => {
        result.current.handleSave("image-src-url");
      });

      // Verifica que está processando
      await waitFor(() => {
        expect(result.current.isProcessing).toBe(true);
      });

      // Resolve a promise
      await act(async () => {
        resolvePromise!(createMockBlob());
        await pendingPromise;
      });

      // Aguarda o processamento terminar
      await waitFor(() => {
        expect(result.current.isProcessing).toBe(false);
      });
    });

    it("should set isProcessing to false after save completes", async () => {
      const { result } = renderHook(() => useImageCropper());
      const mockPixels = createMockArea();

      act(() => {
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      await act(async () => {
        await result.current.handleSave("image-src-url");
      });

      expect(result.current.isProcessing).toBe(false);
    });

    it("should call onSaveComplete callback when save succeeds", async () => {
      const onSaveComplete = vi.fn();
      const { result } = renderHook(() => useImageCropper({ onSaveComplete }));
      const mockPixels = createMockArea();
      const mockFile = createMockFile();

      act(() => {
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      await act(async () => {
        await result.current.handleSave("image-src-url");
      });

      expect(onSaveComplete).toHaveBeenCalledWith(mockFile);
    });

    it("should handle errors during crop processing", async () => {
      const onError = vi.fn();
      const { result } = renderHook(() => useImageCropper({ onError }));
      const mockPixels = createMockArea();
      const error = new Error("Canvas processing failed");

      mockGetCroppedImg.mockRejectedValue(error);

      act(() => {
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      let savedFile: File | null = null;
      await act(async () => {
        savedFile = await result.current.handleSave("image-src-url");
      });

      expect(savedFile).toBeNull();
      expect(onError).toHaveBeenCalledWith(error);
      expect(result.current.isProcessing).toBe(false);
    });

    it("should handle non-Error exceptions", async () => {
      const onError = vi.fn();
      const { result } = renderHook(() => useImageCropper({ onError }));
      const mockPixels = createMockArea();

      mockGetCroppedImg.mockRejectedValue("String error");

      act(() => {
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      await act(async () => {
        await result.current.handleSave("image-src-url");
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Failed to crop image",
        })
      );
    });

    it("should use rotation value when processing crop", async () => {
      const { result } = renderHook(() => useImageCropper());
      const mockPixels = createMockArea();

      act(() => {
        result.current.setRotation(90);
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      await act(async () => {
        await result.current.handleSave("image-src-url");
      });

      expect(mockGetCroppedImg).toHaveBeenCalledWith(
        "image-src-url",
        mockPixels,
        90
      );
    });
  });

  describe("reset", () => {
    it("should reset all state to initial values", () => {
      const { result } = renderHook(() =>
        useImageCropper({ initialZoom: 2, initialRotation: 45 })
      );

      // Modifica os estados
      act(() => {
        result.current.setCrop({ x: 50, y: 100 });
        result.current.setZoom(3);
        result.current.setRotation(90);
        result.current.onCropComplete(createMockArea(), createMockArea());
      });

      // Reseta
      act(() => {
        result.current.reset();
      });

      expect(result.current.crop).toEqual({ x: 0, y: 0 });
      expect(result.current.zoom).toBe(2); // initialZoom
      expect(result.current.rotation).toBe(45); // initialRotation
      expect(result.current.croppedAreaPixels).toBeNull();
      expect(result.current.isProcessing).toBe(false);
    });

    it("should reset to default values when no initial values provided", () => {
      const { result } = renderHook(() => useImageCropper());

      // Modifica os estados
      act(() => {
        result.current.setCrop({ x: 50, y: 100 });
        result.current.setZoom(2);
        result.current.setRotation(45);
        result.current.onCropComplete(createMockArea(), createMockArea());
      });

      // Reseta
      act(() => {
        result.current.reset();
      });

      expect(result.current.crop).toEqual({ x: 0, y: 0 });
      expect(result.current.zoom).toBe(1); // default
      expect(result.current.rotation).toBe(0); // default
      expect(result.current.croppedAreaPixels).toBeNull();
      expect(result.current.isProcessing).toBe(false);
    });

    it("should reset isProcessing even if it was true", async () => {
      const { result } = renderHook(() => useImageCropper());
      const mockPixels = createMockArea();

      // Cria uma promise que não resolve imediatamente
      let resolvePromise: (value: Blob) => void;
      const pendingPromise = new Promise<Blob>((resolve) => {
        resolvePromise = resolve;
      });

      mockGetCroppedImg.mockReturnValue(pendingPromise);

      act(() => {
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      // Inicia o save (isProcessing será true)
      act(() => {
        result.current.handleSave("image-src-url");
      });

      await waitFor(() => {
        expect(result.current.isProcessing).toBe(true);
      });

      // Reseta durante o processamento
      act(() => {
        result.current.reset();
      });

      expect(result.current.isProcessing).toBe(false);

      // Resolve a promise para limpar
      await act(async () => {
        resolvePromise!(createMockBlob());
        await pendingPromise;
      });
    });
  });

  describe("Zoom Clamping", () => {
    it("should clamp zoom at minimum boundary", () => {
      const { result } = renderHook(() =>
        useImageCropper({ minZoom: 0.5, maxZoom: 3 })
      );

      act(() => {
        result.current.setZoom(0.1);
      });

      expect(result.current.zoom).toBe(0.5);
    });

    it("should clamp zoom at maximum boundary", () => {
      const { result } = renderHook(() =>
        useImageCropper({ minZoom: 0.5, maxZoom: 3 })
      );

      act(() => {
        result.current.setZoom(10);
      });

      expect(result.current.zoom).toBe(3);
    });

    it("should allow zoom at boundaries", () => {
      const { result } = renderHook(() =>
        useImageCropper({ minZoom: 0.5, maxZoom: 3 })
      );

      act(() => {
        result.current.setZoom(0.5);
      });
      expect(result.current.zoom).toBe(0.5);

      act(() => {
        result.current.setZoom(3);
      });
      expect(result.current.zoom).toBe(3);
    });

    it("should allow zoom between boundaries", () => {
      const { result } = renderHook(() =>
        useImageCropper({ minZoom: 0.5, maxZoom: 3 })
      );

      act(() => {
        result.current.setZoom(1.5);
      });
      expect(result.current.zoom).toBe(1.5);
    });
  });

  describe("Edge Cases", () => {
    it("should handle multiple rapid zoom changes", () => {
      const { result } = renderHook(() =>
        useImageCropper({ minZoom: 1, maxZoom: 3 })
      );

      act(() => {
        result.current.setZoom(1.5);
        result.current.setZoom(2);
        result.current.setZoom(2.5);
        result.current.setZoom(3);
      });

      expect(result.current.zoom).toBe(3);
    });

    it("should handle multiple rapid crop changes", () => {
      const { result } = renderHook(() => useImageCropper());

      act(() => {
        result.current.setCrop({ x: 10, y: 20 });
        result.current.setCrop({ x: 30, y: 40 });
        result.current.setCrop({ x: 50, y: 60 });
      });

      expect(result.current.crop).toEqual({ x: 50, y: 60 });
    });

    it("should handle save with zero rotation", async () => {
      const { result } = renderHook(() => useImageCropper());
      const mockPixels = createMockArea();

      act(() => {
        result.current.setRotation(0);
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      await act(async () => {
        await result.current.handleSave("image-src-url");
      });

      expect(mockGetCroppedImg).toHaveBeenCalledWith(
        "image-src-url",
        mockPixels,
        0
      );
    });

    it("should handle save with negative rotation", async () => {
      const { result } = renderHook(() => useImageCropper());
      const mockPixels = createMockArea();

      act(() => {
        result.current.setRotation(-45);
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      await act(async () => {
        await result.current.handleSave("image-src-url");
      });

      expect(mockGetCroppedImg).toHaveBeenCalledWith(
        "image-src-url",
        mockPixels,
        -45
      );
    });

    it("should handle save with large rotation values", async () => {
      const { result } = renderHook(() => useImageCropper());
      const mockPixels = createMockArea();

      act(() => {
        result.current.setRotation(360);
        result.current.onCropComplete(createMockArea(), mockPixels);
      });

      await act(async () => {
        await result.current.handleSave("image-src-url");
      });

      expect(mockGetCroppedImg).toHaveBeenCalledWith(
        "image-src-url",
        mockPixels,
        360
      );
    });

    it("should handle crop area with zero dimensions", () => {
      const { result } = renderHook(() => useImageCropper());
      const zeroArea: Area = { x: 0, y: 0, width: 0, height: 0 };

      act(() => {
        result.current.onCropComplete(createMockArea(), zeroArea);
      });

      expect(result.current.croppedAreaPixels).toEqual(zeroArea);
    });

    it("should handle crop area with negative coordinates", () => {
      const { result } = renderHook(() => useImageCropper());
      const negativeArea: Area = { x: -10, y: -20, width: 100, height: 100 };

      act(() => {
        result.current.onCropComplete(createMockArea(), negativeArea);
      });

      expect(result.current.croppedAreaPixels).toEqual(negativeArea);
    });
  });

  describe("Callback Dependencies", () => {
    it("should use latest croppedAreaPixels when handleSave is called", async () => {
      const { result } = renderHook(() => useImageCropper());
      const firstPixels: Area = { x: 10, y: 10, width: 100, height: 100 };
      const secondPixels: Area = { x: 20, y: 20, width: 150, height: 150 };

      act(() => {
        result.current.onCropComplete(createMockArea(), firstPixels);
      });

      // Muda a área antes de salvar
      act(() => {
        result.current.onCropComplete(createMockArea(), secondPixels);
      });

      await act(async () => {
        await result.current.handleSave("image-src-url");
      });

      expect(mockGetCroppedImg).toHaveBeenCalledWith(
        "image-src-url",
        secondPixels,
        0
      );
    });

    it("should use latest rotation when handleSave is called", async () => {
      const { result } = renderHook(() => useImageCropper());
      const mockPixels = createMockArea();

      act(() => {
        result.current.onCropComplete(createMockArea(), mockPixels);
        result.current.setRotation(45);
      });

      // Muda a rotação antes de salvar
      act(() => {
        result.current.setRotation(90);
      });

      await act(async () => {
        await result.current.handleSave("image-src-url");
      });

      expect(mockGetCroppedImg).toHaveBeenCalledWith(
        "image-src-url",
        mockPixels,
        90
      );
    });
  });
});
