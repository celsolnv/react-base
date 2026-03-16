import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { CustomError, handleReq } from "@/lib/axios/handle";

import type {
  IImportDataModalProps,
  IImportResult,
  TImportStep,
} from "./types";

type TUseImportDataModal = Pick<
  IImportDataModalProps,
  "endpoint" | "customUpload" | "onClose" | "onSuccess"
>;

export function useImportDataModal({
  endpoint,
  customUpload,
  onClose,
  onSuccess,
}: TUseImportDataModal) {
  const [step, setStep] = useState<TImportStep>("IDLE");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<IImportResult | null>(null);

  // ─── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setStep("IDLE");
    setSelectedFile(null);
    setResult(null);
    setProgress(0);
  }, []);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    if (step === "UPLOADING") return;
    reset();
    onClose();
  }, [step, reset, onClose]);

  const handleRetry = useCallback(() => {
    reset();
  }, [reset]);

  const handleUpload = useCallback(
    async (file: File) => {
      setStep("UPLOADING");
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 300);

      try {
        if (customUpload) {
          const importResult = await customUpload(file);
          clearInterval(interval);
          setProgress(100);
          setResult(importResult);
          setStep("RESULT");
          onSuccess?.();
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await handleReq({
          url: endpoint!,
          method: "post",
          body: formData,
          hideError: true,
          formatResponse: false,
          config: { headers: { "Content-Type": "multipart/form-data" } },
        });

        clearInterval(interval);
        setProgress(100);

        const data = response?.data?.data ?? response?.data ?? {};

        setResult({
          message: response?.data?.message ?? "Importação concluída!",
          successCount: data?.success ?? 0,
          errors: data?.errors ?? [],
        });
        setStep("RESULT");
        onSuccess?.();
      } catch (err) {
        clearInterval(interval);
        setProgress(100);

        if (err instanceof CustomError) {
          const data = err.data?.data ?? err.data ?? {};
          setResult({
            message: err.message ?? "Erro ao processar o arquivo.",
            successCount: data?.success ?? 0,
            errors: data?.errors ?? [],
          });
          setStep("RESULT");
        } else {
          reset();
        }
      }
    },
    [endpoint, customUpload, onSuccess, reset]
  );

  // ─── Dropzone ──────────────────────────────────────────────────────────────

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setSelectedFile(file);
      handleUpload(file);
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    disabled: step !== "IDLE",
  });

  // ─── Derived ───────────────────────────────────────────────────────────────

  const hasErrors = (result?.errors?.length ?? 0) > 0;
  const isSuccess = step === "RESULT" && !hasErrors;

  return {
    step,
    progress,
    selectedFile,
    result,
    hasErrors,
    isSuccess,
    handleClose,
    handleRetry,
    getRootProps,
    getInputProps,
    isDragActive,
  };
}
