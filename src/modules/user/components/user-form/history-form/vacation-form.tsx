import { useEffect } from "react";

import { X } from "lucide-react";

import { Button, Input, Label, Textarea } from "@/components/shadcn";

import type { TVacationForm } from "./types";

interface IVacationFormProps {
  form: TVacationForm;
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onChange: (field: keyof TVacationForm, value: string | number) => void;
}

export function VacationForm({
  form,
  isEditing,
  onSave,
  onCancel,
  onChange,
}: Readonly<IVacationFormProps>) {
  // Calcula automaticamente os dias quando as datas mudam
  useEffect(() => {
    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia final
      onChange("days", diffDays);
    }
  }, [form.start_date, form.end_date]);

  return (
    <div className="border-border bg-muted/30 space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-foreground font-medium">
          {isEditing ? "Editar Férias" : "Novas Férias"}
        </h4>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 sm:col-span-4">
          <Label htmlFor="vacation-start-date">Data Início</Label>
          <Input
            id="vacation-start-date"
            type="date"
            value={form.start_date}
            onChange={(e) => onChange("start_date", e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="col-span-12 sm:col-span-4">
          <Label htmlFor="vacation-end-date">Data Fim</Label>
          <Input
            id="vacation-end-date"
            type="date"
            value={form.end_date}
            onChange={(e) => onChange("end_date", e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="col-span-12 sm:col-span-4">
          <Label htmlFor="vacation-days">Dias</Label>
          <Input
            id="vacation-days"
            type="number"
            value={form.days}
            onChange={(e) => onChange("days", parseInt(e.target.value) || 0)}
            className="mt-2"
            readOnly
          />
        </div>

        <div className="col-span-12">
          <Label htmlFor="vacation-description">Descrição</Label>
          <Textarea
            id="vacation-description"
            value={form.note}
            onChange={(e) => onChange("note", e.target.value)}
            placeholder="Observações sobre as férias..."
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
