import { toast } from "sonner";

import { getToken } from "@/hooks/token";

export const downloadFile = async (path: string, filename: string) => {
  const response = await fetch(path, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    toast.error("Erro ao baixar o arquivo");
    throw new Error("Network response was not ok");
  }

  const blob = await response.blob();
  const buttonDownload = document.createElement("a");
  const url = window.URL.createObjectURL(blob);
  buttonDownload.href = url;
  buttonDownload.download = filename;
  buttonDownload.click();
  // Limpa o objeto URL após o download
  window.URL.revokeObjectURL(url);
};
