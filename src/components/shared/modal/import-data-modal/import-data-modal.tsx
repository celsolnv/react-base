import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  XCircle,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { Modal } from "../modal/modal";
import type { IImportDataModalProps } from "./types";
import { useImportDataModal } from "./use-import-data-modal";

export function ImportDataModal({
  title,
  templateRoute,
  endpoint,
  customUpload,
  isOpen,
  onClose,
  onSuccess,
}: IImportDataModalProps) {
  const {
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
  } = useImportDataModal({ endpoint, customUpload, onClose, onSuccess });

  // ─── Footer ────────────────────────────────────────────────────────────────

  const renderFooter = () => {
    if (step === "IDLE") {
      return (
        <Button variant="outline" onClick={handleClose}>
          Cancelar
        </Button>
      );
    }

    if (step === "UPLOADING") {
      return (
        <Button variant="outline" disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processando...
        </Button>
      );
    }

    return (
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-2">
          {result && result.successCount > 0 && (
            <Badge variant="success">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              {result.successCount}{" "}
              {result.successCount === 1 ? "sucesso" : "sucessos"}
            </Badge>
          )}
          {hasErrors && (
            <Badge variant="error">
              <XCircle className="mr-1 h-3 w-3" />
              {result!.errors.length}{" "}
              {result!.errors.length === 1 ? "erro" : "erros"}
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          {hasErrors && (
            <Button variant="outline" onClick={handleRetry}>
              Tentar novamente
            </Button>
          )}
          <Button onClick={handleClose}>
            {isSuccess ? "Concluir" : "Fechar"}
          </Button>
        </div>
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const footer = renderFooter();

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title={title}
      description="Importe múltiplos registros de uma vez usando um arquivo CSV ou Excel."
      maxWidth="lg"
      showCloseButton={step !== "UPLOADING"}
      footer={footer}
    >
      <div className="space-y-4">
        {/* Template Download Card */}
        <div className="bg-muted/40 border-border flex items-start gap-3 rounded-lg border p-4">
          <div className="bg-background border-border flex h-10 w-10 shrink-0 items-center justify-center rounded-md border">
            <FileSpreadsheet className="text-muted-foreground h-5 w-5" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-sm font-medium">Modelo de importação</p>
            <p className="text-muted-foreground text-xs">
              Baixe o modelo para preencher com os dados.
            </p>
          </div>
          <a href={`${import.meta.env.VITE_API}${templateRoute}`} download>
            <Button variant="outline" size="sm" className="shrink-0">
              <Download className="mr-2 h-4 w-4" />
              Baixar modelo
            </Button>
          </a>
        </div>

        {/* IDLE — Dropzone */}
        {step === "IDLE" && (
          <div
            {...getRootProps()}
            className={cn(
              "border-border hover:border-primary/60 hover:bg-muted/30 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 transition-colors",
              isDragActive && "border-primary bg-primary/5"
            )}
          >
            <input {...getInputProps()} />
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
              <Upload className="text-muted-foreground h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Solte o arquivo aqui..."
                  : "Clique para selecionar ou arraste o arquivo"}
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Apenas arquivos .CSV, .XLS e .XLSX
              </p>
            </div>
          </div>
        )}

        {/* UPLOADING — Progress */}
        {step === "UPLOADING" && (
          <div className="space-y-3 py-4">
            <div className="flex items-center gap-2">
              <Loader2 className="text-primary h-4 w-4 animate-spin" />
              <p className="text-sm font-medium">Processando arquivo...</p>
            </div>
            {selectedFile && (
              <p className="text-muted-foreground text-xs">
                {selectedFile.name}
              </p>
            )}
            <Progress value={progress} className="h-2" />
            <p className="text-muted-foreground text-xs">
              {progress}% concluído
            </p>
          </div>
        )}

        {/* RESULT */}
        {step === "RESULT" && result && (
          <div className="space-y-4">
            <Alert variant={isSuccess ? "default" : "destructive"}>
              {isSuccess ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle>
                {isSuccess ? "Importação realizada!" : "Atenção"}
              </AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>

            {hasErrors && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Linhas com erro</p>
                <ScrollArea className="h-70 rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Linha</TableHead>
                        <TableHead>Mensagem</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.errors.map((error) => (
                        <TableRow key={`${error.row}-${error.message}`}>
                          <TableCell className="font-mono text-xs">
                            #{error.row}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {error.message}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            )}
          </div>
        )}

        {/* Info Banner */}
        {step === "IDLE" && (
          <div className="bg-muted/30 border-border flex items-start gap-2 rounded-lg border p-3">
            <div className="bg-primary/15 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
              <span className="text-primary text-[10px] font-bold">i</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Os registros importados serão criados com status{" "}
              <span className="text-foreground font-semibold">Ativo</span> e
              receberão um e-mail com instruções para definir sua senha.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
