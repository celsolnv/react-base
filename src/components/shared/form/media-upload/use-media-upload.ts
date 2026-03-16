import { useCallback, useRef, useState } from "react";

interface IUseMediaUploadProps {
  type: "image" | "video";
  accept: string;
  maxSizeMB: number;
  disabled: boolean;
}

interface IUseMediaUploadReturn {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  uploadedPreview: string | null;
  uploading: boolean;
  error: string | null;
  handleFileSelect: (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File | null) => void
  ) => void;
  handleRemove: (onChange: (file: File | null) => void) => void;
  handleClick: () => void;
}

export function useMediaUpload({
  type,
  accept,
  maxSizeMB,
  disabled,
}: IUseMediaUploadProps): IUseMediaUploadReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      onChange: (file: File | null) => void
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const validTypes = accept.split(",");
      if (!validTypes.some((t) => file.type === t.trim())) {
        setError(`Formato inválido. Use ${accept.replace(/,/g, ", ")}.`);
        return;
      }

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSizeMB) {
        setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB.`);
        return;
      }

      setError(null);
      setUploading(true);

      if (type === "image") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedPreview(reader.result as string);
          setUploading(false);
          onChange(file);
        };
        reader.onerror = () => {
          setError("Erro ao ler o arquivo.");
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } else {
        const url = URL.createObjectURL(file);
        setUploadedPreview(url);
        setUploading(false);
        onChange(file);
      }
    },
    [accept, maxSizeMB, type]
  );

  const handleRemove = useCallback(
    (onChange: (file: File | null) => void) => {
      if (uploadedPreview && type === "video") {
        URL.revokeObjectURL(uploadedPreview);
      }
      setUploadedPreview(null);
      setError(null);
      onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [type, uploadedPreview]
  );

  const handleClick = useCallback(() => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, uploading]);

  return {
    fileInputRef,
    uploadedPreview,
    uploading,
    error,
    handleFileSelect,
    handleRemove,
    handleClick,
  };
}
