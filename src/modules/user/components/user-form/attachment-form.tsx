import { useFormContext } from "react-hook-form";

import { Clipboard } from "lucide-react";

import { CardForm } from "@/components/shared/form/card/card-form";
import { FileForm } from "@/components/shared/form/file/file-form";
import { useDeleteAttachment } from "@/modules/user/http/mutations/use-delete-attachment.ts";
import type { TUpdateUserSchema } from "@/modules/user/update/schema";

export function AttachmentsForm() {
  const form = useFormContext<TUpdateUserSchema>();
  const deleteAttachmentMutation = useDeleteAttachment();

  const handleDeleteExistingFile = async (id: string) => {
    await deleteAttachmentMutation.mutateAsync(id);
    // Remove o ID do array existing_attachments
    const currentExistingAttachments =
      form.getValues("existing_attachments") || [];
    const updatedAttachments = currentExistingAttachments.filter(
      (attachmentId: string) => attachmentId !== id
    );
    form.setValue("existing_attachments", updatedAttachments);
  };

  return (
    <CardForm
      title="Anexos"
      description="Anexos do usuário"
      icon={<Clipboard />}
    >
      <div className="col-span-12 space-y-6">
        <FileForm
          label="Documento"
          name="identity_docs"
          onDeleteExistingFile={handleDeleteExistingFile}
        />
        <FileForm
          label="Comprovante de residência"
          name="residence_docs"
          onDeleteExistingFile={handleDeleteExistingFile}
        />
        <FileForm
          label="Outros"
          name="other_attachments"
          onDeleteExistingFile={handleDeleteExistingFile}
        />
      </div>
    </CardForm>
  );
}
