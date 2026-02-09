import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { downloadFile } from "./index";

// Mock do hook de token
vi.mock("@/hooks/token", () => ({
  getToken: vi.fn(() => "mock-token"),
}));

// Mock do sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("file/index", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let mockCreateElement: ReturnType<typeof vi.fn>;
  let mockCreateObjectURL: ReturnType<typeof vi.fn>;
  let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
  let mockClick: ReturnType<typeof vi.fn>;
  let mockAnchorElement: {
    href: string;
    download: string;
    click: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock do fetch
    global.fetch = vi.fn();
    mockFetch = global.fetch as ReturnType<typeof vi.fn>;

    // Mock do document.createElement
    mockClick = vi.fn();
    mockAnchorElement = {
      href: "",
      download: "",
      click: mockClick,
    };
    mockCreateElement = vi.fn(() => mockAnchorElement);
    document.createElement = mockCreateElement;

    // Mock do window.URL
    mockCreateObjectURL = vi.fn(() => "blob:http://localhost/test-url");
    mockRevokeObjectURL = vi.fn();
    global.URL = {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    } as unknown as typeof URL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("downloadFile", () => {
    it("should download file successfully", async () => {
      const mockBlob = new Blob(["file content"], { type: "text/plain" });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await downloadFile("/api/file.pdf", "document.pdf");

      expect(mockFetch).toHaveBeenCalledWith("/api/file.pdf", {
        method: "GET",
        headers: {
          Authorization: "Bearer mock-token",
        },
      });

      expect(mockResponse.blob).toHaveBeenCalled();
      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockCreateElement).toHaveBeenCalledWith("a");
      expect(mockAnchorElement.href).toBe("blob:http://localhost/test-url");
      expect(mockAnchorElement.download).toBe("document.pdf");
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith(
        "blob:http://localhost/test-url"
      );
    });

    it("should include authorization header with token from hook", async () => {
      const { getToken } = await import("@/hooks/token");
      vi.mocked(getToken).mockReturnValue("custom-token-123");

      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await downloadFile("/api/file.pdf", "document.pdf");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer custom-token-123",
          },
        })
      );
    });

    it("should handle undefined token", async () => {
      const { getToken } = await import("@/hooks/token");
      vi.mocked(getToken).mockReturnValue(undefined);

      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await downloadFile("/api/file.pdf", "document.pdf");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer undefined",
          },
        })
      );
    });

    it("should show error toast and throw error when response is not ok", async () => {
      const toast = await import("sonner");
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(
        downloadFile("/api/file.pdf", "document.pdf")
      ).rejects.toThrow("Network response was not ok");

      expect(toast.toast.error).toHaveBeenCalledWith(
        "Erro ao baixar o arquivo"
      );
    });

    it("should show error toast and throw error when response status is 500", async () => {
      const toast = await import("sonner");
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(
        downloadFile("/api/file.pdf", "document.pdf")
      ).rejects.toThrow("Network response was not ok");

      expect(toast.toast.error).toHaveBeenCalledWith(
        "Erro ao baixar o arquivo"
      );
    });

    it("should handle different file types", async () => {
      const testCases = [
        { type: "application/pdf", filename: "document.pdf" },
        { type: "image/png", filename: "image.png" },
        { type: "text/plain", filename: "text.txt" },
        { type: "application/vnd.ms-excel", filename: "spreadsheet.xls" },
      ];

      for (const testCase of testCases) {
        vi.clearAllMocks();
        // Reset fetch mock default implementation/value for loop
        const { getToken } = await import("@/hooks/token");
        vi.mocked(getToken).mockReturnValue("mock-token");

        const mockBlob = new Blob(["content"], { type: testCase.type });
        const mockResponse = {
          ok: true,
          blob: vi.fn().mockResolvedValue(mockBlob),
        };

        mockFetch.mockResolvedValue(mockResponse as any);

        await downloadFile("/api/file", testCase.filename);

        expect(mockAnchorElement.download).toBe(testCase.filename);
      }
    });

    it("should handle different path formats", async () => {
      const paths = [
        "/api/file.pdf",
        "https://example.com/file.pdf",
        "/relative/path/file.pdf",
        "http://localhost:3000/api/files/document.pdf",
      ];

      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      for (const path of paths) {
        vi.clearAllMocks();
        // Reset fetch and token for loop
        const { getToken } = await import("@/hooks/token");
        vi.mocked(getToken).mockReturnValue("mock-token");

        mockFetch.mockResolvedValue(mockResponse as any);

        await downloadFile(path, "file.pdf");

        expect(mockFetch).toHaveBeenCalledWith(
          path,
          expect.objectContaining({
            method: "GET",
          })
        );
      }
    });

    it("should handle different filename formats", async () => {
      const filenames = [
        "simple.pdf",
        "file with spaces.pdf",
        "file-with-dashes.pdf",
        "file_with_underscores.pdf",
        "file.with.dots.pdf",
        "file123.pdf",
        "UPPERCASE.PDF",
        "MiXeDcAsE.PdF",
      ];

      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      for (const filename of filenames) {
        vi.clearAllMocks();
        // Reset fetch and token for loop
        const { getToken } = await import("@/hooks/token");
        vi.mocked(getToken).mockReturnValue("mock-token");

        mockFetch.mockResolvedValue(mockResponse as any);

        await downloadFile("/api/file", filename);

        expect(mockAnchorElement.download).toBe(filename);
      }
    });

    it("should handle empty filename", async () => {
      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await downloadFile("/api/file", "");

      expect(mockAnchorElement.download).toBe("");
    });

    it("should handle empty path", async () => {
      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await downloadFile("", "file.pdf");

      expect(mockFetch).toHaveBeenCalledWith("", expect.any(Object));
    });

    it("should create blob URL and revoke it after download", async () => {
      const mockBlob = new Blob(["file content"], { type: "application/pdf" });
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);
      const blobUrl = "blob:http://localhost/unique-url";
      mockCreateObjectURL.mockReturnValue(blobUrl);

      await downloadFile("/api/file.pdf", "document.pdf");

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockAnchorElement.href).toBe(blobUrl);
      expect(mockRevokeObjectURL).toHaveBeenCalledWith(blobUrl);
    });

    it("should handle fetch network error", async () => {
      const networkError = new Error("Network error");
      mockFetch.mockRejectedValue(networkError);

      await expect(
        downloadFile("/api/file.pdf", "document.pdf")
      ).rejects.toThrow("Network error");
    });

    it("should handle blob conversion error", async () => {
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockRejectedValue(new Error("Blob conversion failed")),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(
        downloadFile("/api/file.pdf", "document.pdf")
      ).rejects.toThrow("Blob conversion failed");
    });

    it("should call click on anchor element", async () => {
      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await downloadFile("/api/file.pdf", "document.pdf");

      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it("should set correct attributes on anchor element", async () => {
      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);
      const blobUrl = "blob:http://localhost/test";
      mockCreateObjectURL.mockReturnValue(blobUrl);

      await downloadFile("/api/file.pdf", "my-document.pdf");

      expect(mockAnchorElement.href).toBe(blobUrl);
      expect(mockAnchorElement.download).toBe("my-document.pdf");
    });

    it("should handle very long filenames", async () => {
      const longFilename = "a".repeat(255) + ".pdf";
      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await downloadFile("/api/file", longFilename);

      expect(mockAnchorElement.download).toBe(longFilename);
    });

    it("should handle very long paths", async () => {
      const longPath = "/api/" + "a".repeat(1000) + "/file.pdf";
      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await downloadFile(longPath, "file.pdf");

      expect(mockFetch).toHaveBeenCalledWith(longPath, expect.any(Object));
    });

    it("should use GET method for fetch", async () => {
      const mockBlob = new Blob(["content"]);
      const mockResponse = {
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await downloadFile("/api/file.pdf", "document.pdf");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "GET",
        })
      );
    });
  });
});
