import { X } from "lucide-react";

import { Button, Label, Textarea } from "@/components/shadcn";

import { Fieldset } from "../../fieldset";
import type { TProfessionalForm } from "./types";

interface IProfessionalFormProps {
  form: TProfessionalForm;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof TProfessionalForm, value: string) => void;
}

export function ProfessionalForm({
  form,
  isEditing,
  onSave,
  onCancel,
  onChange,
}: Readonly<IProfessionalFormProps>) {
  return (
    <div className="border-border bg-muted/30 space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-foreground font-medium">
          {isEditing ? "Editar Experiência" : "Nova Experiência"}
        </h4>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Fieldset
          label="Empresa"
          id="professional-company"
          type="text"
          value={form.company_name}
          onChange={(e) => onChange("company_name", e.target.value)}
          placeholder="Nome da empresa"
          required={true}
        />

        <Fieldset
          label="Cargo"
          id="professional-position"
          type="text"
          value={form.role}
          onChange={(e) => onChange("role", e.target.value)}
          placeholder="Cargo ocupado"
          required={true}
        />

        <Fieldset
          label="Data Início"
          id="professional-start-date"
          type="date"
          value={form.start_date}
          onChange={(e) => onChange("start_date", e.target.value)}
          placeholder="Data de início"
          required={true}
        />

        <Fieldset
          label="Data Fim"
          id="professional-end-date"
          type="date"
          value={form.end_date}
          onChange={(e) => onChange("end_date", e.target.value)}
          placeholder="Deixe em branco se ainda trabalha"
          required={false}
        />

        <div className="col-span-12">
          <Label htmlFor="professional-observations">Observações</Label>
          <Textarea
            id="professional-observations"
            value={form.note}
            onChange={(e) => onChange("note", e.target.value)}
            placeholder="Informações adicionais sobre a experiência profissional..."
            className="mt-2"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="button" onClick={onSave}>
          {isEditing ? "Atualizar" : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
