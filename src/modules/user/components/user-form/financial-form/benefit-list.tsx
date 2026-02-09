import { Edit, Trash2 } from "lucide-react";

import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn";
import { Switch } from "@/components/ui/switch";
import { recurrenceOptions } from "@/constants/options";

import type { IBenefit } from "./types";

interface IBenefitListProps {
  benefits: IBenefit[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onToggleStatus: (index: number) => void;
}

export function BenefitList({
  benefits,
  onEdit,
  onRemove,
  onToggleStatus,
}: Readonly<IBenefitListProps>) {
  const getRecurrenceLabel = (value: string) => {
    const option = recurrenceOptions.find((opt) => opt.value === value);
    return option?.label || value;
  };

  if (benefits.length === 0) {
    return null;
  }

  return (
    <div className="border-border rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">BENEFÍCIO</TableHead>
            <TableHead className="w-[20%]">VALOR</TableHead>
            <TableHead className="w-[20%]">RECORRÊNCIA</TableHead>
            <TableHead className="w-[15%]">STATUS</TableHead>
            <TableHead className="w-[15%] text-right">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {benefits.map((benefit, index) => (
            <TableRow key={benefit.id || index}>
              <TableCell className="font-medium">{benefit.name}</TableCell>
              <TableCell>R$ {benefit.value}</TableCell>
              <TableCell>{getRecurrenceLabel(benefit.frequency)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={benefit.is_active}
                    onCheckedChange={() => onToggleStatus(index)}
                  />
                  <Badge
                    variant={benefit.is_active ? "default" : "secondary"}
                    className={
                      benefit.is_active
                        ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                        : ""
                    }
                  >
                    {benefit.is_active ? "ATIVO" : "INATIVO"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="text-destructive h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
