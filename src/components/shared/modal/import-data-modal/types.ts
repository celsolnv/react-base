export type TImportStep = "IDLE" | "UPLOADING" | "RESULT";

export interface IImportError {
  row: number;
  message: string;
}

export interface IImportResult {
  message: string;
  successCount: number;
  errors: IImportError[];
}

export type TCustomImportUpload = (file: File) => Promise<IImportResult>;

export interface IImportDataModalProps {
  readonly title: string;
  readonly templateRoute: string;
  readonly endpoint?: string;
  readonly customUpload?: TCustomImportUpload;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}
