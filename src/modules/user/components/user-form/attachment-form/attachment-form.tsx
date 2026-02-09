import { Clipboard } from "lucide-react";

import { CardForm, FileForm } from "@/components/shared";

export function AttachmentForm() {
  return (
    <CardForm
      title="Anexos"
      description="Anexos do usuário"
      icon={<Clipboard />}
    >
      <div className="col-span-12 space-y-6">
        <FileForm label="Documento" name="identity_docs" />
        <FileForm label="Comprovante de residência" name="residence_docs" />
        <FileForm label="Outros" name="other_attachments" />
      </div>
    </CardForm>
  );
}
