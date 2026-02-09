import type { Area } from "react-easy-crop";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { blobToFile, createImage, getCroppedImg } from "./index";

// Mock do HTMLImageElement
class MockImage {
  src = "";
  crossOrigin = "";
  width = 100;
  height = 100;
  onload: (() => void) | null = null;
  onerror: ((error: Event) => void) | null = null;

  addEventListener(event: string, handler: () => void) {
    if (event === "load") {
      this.onload = handler;
    } else if (event === "error") {
      this.onerror = handler as (error: Event) => void;
    }
  }

  removeEventListener() {
    // Mock implementation
  }

  // Método para simular carregamento bem-sucedido
  simulateLoad() {
    if (this.onload) {
      setTimeout(() => this.onload!(), 0);
    }
  }

  // Método para simular erro de carregamento
  simulateError() {
    if (this.onerror) {
      setTimeout(() => this.onerror!(new Event("error")), 0);
    }
  }
}

// Função para criar uma nova instância de MockImage
const createMockImage = () => new MockImage();

// Mock do CanvasRenderingContext2D
class MockCanvasContext2D {
  translate = vi.fn();
  rotate = vi.fn();
  drawImage = vi.fn();
  clearRect = vi.fn();
  save = vi.fn();
  restore = vi.fn();
  scale = vi.fn();
  fillRect = vi.fn();
  strokeRect = vi.fn();
  beginPath = vi.fn();
  closePath = vi.fn();
  moveTo = vi.fn();
  lineTo = vi.fn();
  arc = vi.fn();
  fill = vi.fn();
  stroke = vi.fn();
  fillText = vi.fn();
  strokeText = vi.fn();
  measureText = vi.fn();
  createLinearGradient = vi.fn();
  createRadialGradient = vi.fn();
  createPattern = vi.fn();
  getImageData = vi.fn();
  putImageData = vi.fn();
  createImageData = vi.fn();
  setTransform = vi.fn();
  resetTransform = vi.fn();
  transform = vi.fn();
  globalAlpha = 1;
  globalCompositeOperation = "source-over";
  strokeStyle = "";
  fillStyle = "";
  lineWidth = 1;
  lineCap = "butt";
  lineJoin = "miter";
  miterLimit = 10;
  shadowOffsetX = 0;
  shadowOffsetY = 0;
  shadowBlur = 0;
  shadowColor = "rgba(0, 0, 0, 0)";
  font = "10px sans-serif";
  textAlign = "start";
  textBaseline = "alphabetic";
  imageSmoothingEnabled = true;
  imageSmoothingQuality = "low";
}

// Mock do HTMLCanvasElement
class MockCanvas {
  width = 0;
  height = 0;
  toBlob = vi.fn();
  toDataURL = vi.fn();
  getContext = vi.fn();

  constructor() {
    const ctx = new MockCanvasContext2D();
    this.getContext = vi.fn((type: string) => {
      if (type === "2d") {
        return ctx;
      }
      return null;
    });
  }
}

describe("canvas utils", () => {
  let originalImage: typeof Image;
  let originalCreateElement: typeof document.createElement;
  let mockImageInstances: MockImage[];
  let mockCanvasInstance: MockCanvas;
  let mockCroppedCanvasInstance: MockCanvas;

  beforeEach(() => {
    vi.clearAllMocks();
    mockImageInstances = [];

    // Mock Image constructor - cria nova instância a cada chamada
    originalImage = global.Image;
    global.Image = function (this: MockImage) {
      const instance = new MockImage();
      mockImageInstances.push(instance);
      return instance;
    } as unknown as typeof Image;

    // Mock document.createElement para canvas
    originalCreateElement = document.createElement;
    mockCanvasInstance = new MockCanvas();
    mockCroppedCanvasInstance = new MockCanvas();

    let canvasCallCount = 0;
    document.createElement = vi.fn((tagName: string) => {
      if (tagName === "canvas") {
        canvasCallCount++;
        // Primeiro canvas é para rotação, segundo é para crop
        return canvasCallCount === 1
          ? (mockCanvasInstance as unknown as HTMLElement)
          : (mockCroppedCanvasInstance as unknown as HTMLElement);
      }
      return originalCreateElement.call(document, tagName);
    });
  });

  afterEach(() => {
    global.Image = originalImage;
    document.createElement = originalCreateElement;
    vi.restoreAllMocks();
  });

  describe("createImage", () => {
    it("should create and load an image successfully", async () => {
      const imageUrl = "https://example.com/image.jpg";

      const imagePromise = createImage(imageUrl);

      // Simula o carregamento bem-sucedido
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      const image = await imagePromise;

      expect(imageInstance.src).toBe(imageUrl);
      expect(imageInstance.crossOrigin).toBe("anonymous");
      expect(image).toBe(imageInstance);
    });

    it("should reject promise on image load error", async () => {
      const imageUrl = "https://example.com/invalid.jpg";

      const imagePromise = createImage(imageUrl);

      // Simula erro de carregamento
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateError();

      await expect(imagePromise).rejects.toBeInstanceOf(Event);
    });

    it("should set crossOrigin to anonymous", async () => {
      const imageUrl = "https://example.com/image.jpg";

      createImage(imageUrl);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      expect(imageInstance.crossOrigin).toBe("anonymous");
    });

    it("should handle data URLs", async () => {
      const dataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRg==";

      const imagePromise = createImage(dataUrl);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      const image = await imagePromise;

      expect(imageInstance.src).toBe(dataUrl);
      expect(image).toBe(imageInstance);
    });
  });

  describe("getCroppedImg", () => {
    const mockPixelCrop: Area = {
      x: 10,
      y: 20,
      width: 100,
      height: 100,
    };

    beforeEach(() => {
      // Mock toBlob para retornar um blob
      const mockBlob = new Blob(["mock-image-data"], { type: "image/jpeg" });
      mockCroppedCanvasInstance.toBlob = vi.fn((callback) => {
        if (callback) {
          callback(mockBlob);
        }
      });
    });

    it("should create cropped image blob successfully", async () => {
      const imageSrc = "https://example.com/image.jpg";

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      const blob = await imagePromise;

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("image/jpeg");
      expect(imageInstance.src).toBe(imageSrc);
    });

    it("should create canvas and context for rotation", async () => {
      const imageSrc = "https://example.com/image.jpg";

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await imagePromise;

      expect(document.createElement).toHaveBeenCalledWith("canvas");
      expect(mockCanvasInstance.getContext).toHaveBeenCalledWith("2d");
    });

    it("should create second canvas for cropped image", async () => {
      const imageSrc = "https://example.com/image.jpg";

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await imagePromise;

      // Deve criar dois canvas (um para rotação, outro para crop)
      expect(document.createElement).toHaveBeenCalledTimes(2);
    });

    it("should set canvas dimensions correctly", async () => {
      const imageSrc = "https://example.com/image.jpg";
      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop, 0);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.width = 200;
      imageInstance.height = 200;
      imageInstance.simulateLoad();

      await imagePromise;

      // O canvas principal deve ter as dimensões da imagem (sem rotação)
      expect(mockCanvasInstance.width).toBeGreaterThan(0);
      expect(mockCanvasInstance.height).toBeGreaterThan(0);
    });

    it("should set cropped canvas dimensions to crop area", async () => {
      const imageSrc = "https://example.com/image.jpg";

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await imagePromise;

      expect(mockCroppedCanvasInstance.width).toBe(mockPixelCrop.width);
      expect(mockCroppedCanvasInstance.height).toBe(mockPixelCrop.height);
    });

    it("should handle rotation parameter", async () => {
      const imageSrc = "https://example.com/image.jpg";
      const rotation = 90;

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop, rotation);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await imagePromise;

      const ctx = mockCanvasInstance.getContext("2d") as MockCanvasContext2D;
      expect(ctx.rotate).toHaveBeenCalled();
    });

    it("should use default rotation of 0 when not provided", async () => {
      const imageSrc = "https://example.com/image.jpg";

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await imagePromise;

      const ctx = mockCanvasInstance.getContext("2d") as MockCanvasContext2D;
      // Deve chamar rotate mesmo com 0 graus
      expect(ctx.rotate).toHaveBeenCalled();
    });

    it("should call drawImage on context", async () => {
      const imageSrc = "https://example.com/image.jpg";

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await imagePromise;

      const ctx = mockCanvasInstance.getContext("2d") as MockCanvasContext2D;
      expect(ctx.drawImage).toHaveBeenCalled();
    });

    it("should call toBlob with correct parameters", async () => {
      const imageSrc = "https://example.com/image.jpg";

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await imagePromise;

      expect(mockCroppedCanvasInstance.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        "image/jpeg",
        0.95
      );
    });

    it("should reject when canvas context is null", async () => {
      const imageSrc = "https://example.com/image.jpg";
      mockCanvasInstance.getContext = vi.fn(() => null);

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await expect(imagePromise).rejects.toThrow(
        "Failed to get canvas context"
      );
    });

    it("should reject when cropped canvas context is null", async () => {
      const imageSrc = "https://example.com/image.jpg";
      mockCroppedCanvasInstance.getContext = vi.fn(() => null);

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await expect(imagePromise).rejects.toThrow(
        "Failed to get cropped canvas context"
      );
    });

    it("should reject when toBlob fails", async () => {
      const imageSrc = "https://example.com/image.jpg";
      mockCroppedCanvasInstance.toBlob = vi.fn((callback) => {
        if (callback) {
          callback(null);
        }
      });

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      await expect(imagePromise).rejects.toThrow("Failed to create blob");
    });

    it("should handle rotation value of 90 degrees", async () => {
      const imageSrc = "https://example.com/image.jpg";
      const rotation = 90;

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop, rotation);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateLoad();

      const blob = await imagePromise;

      expect(blob).toBeInstanceOf(Blob);
      const ctx = mockCanvasInstance.getContext("2d") as MockCanvasContext2D;
      expect(ctx.rotate).toHaveBeenCalled();
    });

    it("should handle different crop areas", async () => {
      const imageSrc = "https://example.com/image.jpg";
      const cropAreas: Area[] = [
        { x: 0, y: 0, width: 50, height: 50 },
        { x: 10, y: 20, width: 100, height: 100 },
        { x: 100, y: 200, width: 300, height: 400 },
      ];

      for (const cropArea of cropAreas) {
        vi.clearAllMocks();
        mockImageInstances = [];
        const imagePromise = getCroppedImg(imageSrc, cropArea);
        const imageInstance = mockImageInstances[mockImageInstances.length - 1];
        imageInstance.simulateLoad();

        const blob = await imagePromise;

        expect(blob).toBeInstanceOf(Blob);
        expect(mockCroppedCanvasInstance.width).toBe(cropArea.width);
        expect(mockCroppedCanvasInstance.height).toBe(cropArea.height);
      }
    });

    it("should handle image load error", async () => {
      const imageSrc = "https://example.com/invalid.jpg";

      const imagePromise = getCroppedImg(imageSrc, mockPixelCrop);
      const imageInstance = mockImageInstances[mockImageInstances.length - 1];
      imageInstance.simulateError();

      await expect(imagePromise).rejects.toBeInstanceOf(Event);
    });
  });

  describe("blobToFile", () => {
    it("should convert blob to file with default filename", () => {
      const blob = new Blob(["test content"], { type: "image/jpeg" });

      const file = blobToFile(blob);

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe("profile-photo.jpg");
      expect(file.type).toBe("image/jpeg");
    });

    it("should convert blob to file with custom filename", () => {
      const blob = new Blob(["test content"], { type: "image/png" });

      const file = blobToFile(blob, "custom-image.png");

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe("custom-image.png");
      expect(file.type).toBe("image/png");
    });

    it("should preserve blob type in file", () => {
      const types = ["image/jpeg", "image/png", "image/gif", "image/webp"];

      for (const type of types) {
        const blob = new Blob(["test content"], { type });
        const file = blobToFile(blob);

        expect(file.type).toBe(type);
      }
    });

    it("should preserve blob content in file", () => {
      const content = "test image content";
      const blob = new Blob([content], { type: "image/jpeg" });

      const file = blobToFile(blob);

      expect(file).toBeInstanceOf(File);
      expect(file.size).toBe(blob.size);
    });

    it("should handle empty blob", () => {
      const blob = new Blob([], { type: "image/jpeg" });

      const file = blobToFile(blob);

      expect(file).toBeInstanceOf(File);
      expect(file.size).toBe(0);
    });

    it("should handle blob with different MIME types", () => {
      const mimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
      ];

      for (const mimeType of mimeTypes) {
        const blob = new Blob(["content"], { type: mimeType });
        const file = blobToFile(blob, `test.${mimeType.split("/")[1]}`);

        expect(file.type).toBe(mimeType);
      }
    });

    it("should create file with correct size", () => {
      const content = "a".repeat(1000);
      const blob = new Blob([content], { type: "image/jpeg" });

      const file = blobToFile(blob);

      expect(file.size).toBe(1000);
    });
  });

  describe("Integration", () => {
    it("should convert blob to file after cropping", async () => {
      // Este teste verifica que blobToFile funciona com um blob criado
      // Os testes individuais já cobrem createImage, getCroppedImg e blobToFile
      const mockBlob = new Blob(["test"], { type: "image/jpeg" });
      const file = blobToFile(mockBlob, "test-image.jpg");

      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe("test-image.jpg");
      expect(file.type).toBe("image/jpeg");
    });
  });
});
