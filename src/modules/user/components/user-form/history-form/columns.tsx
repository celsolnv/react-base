import { formatDate } from "@/utils/formatters/date";

import type { IPromotionHistory } from "./types";

// Colunas para Histórico de Promoções
export const promotionColumns = [
  { header: "DATA", accessor: "date", width: "w-[15%]" },
  { header: "SALÁRIO ANTERIOR", accessor: "last_salary", width: "w-[20%]" },
  { header: "NOVO SALÁRIO", accessor: "new_salary", width: "w-[20%]" },
  {
    header: "AUMENTO",
    accessor: "increase",
    width: "w-[15%]",
    render: (_value: string, row: IPromotionHistory) => {
      const oldValue = parseFloat(
        row.last_salary.replace(/\./g, "").replace(",", ".")
      );
      const newValue = parseFloat(
        row.new_salary.replace(/\./g, "").replace(",", ".")
      );
      const diff = newValue - oldValue;
      const percentage =
        oldValue > 0 ? ((diff / oldValue) * 100).toFixed(1) : "0.0";
      return <span className="font-medium text-green-600">+{percentage}%</span>;
    },
  },
  { header: "DESCRIÇÃO", accessor: "note", width: "w-[30%]" },
];

// Colunas para Histórico de Comissão/PLR
export const commissionColumns = [
  { header: "DATA", accessor: "date", width: "w-[15%]" },
  { header: "VALOR ANTERIOR", accessor: "last_commission", width: "w-[20%]" },
  { header: "NOVO VALOR", accessor: "new_commission", width: "w-[20%]" },
  { header: "DESCRIÇÃO", accessor: "note", width: "w-[45%]" },
];

// Colunas para Histórico de Férias
export const vacationColumns = [
  { header: "INÍCIO", accessor: "start_date", width: "w-[15%]" },
  { header: "FIM", accessor: "end_date", width: "w-[15%]" },
  { header: "DIAS", accessor: "days", width: "w-[10%]" },
  { header: "DESCRIÇÃO", accessor: "note", width: "w-[60%]" },
];

// Colunas para Histórico Profissional
export const professionalColumns = [
  { header: "EMPRESA", accessor: "company_name", width: "w-[25%]" },
  { header: "CARGO", accessor: "role", width: "w-[20%]" },
  { header: "INÍCIO", accessor: "start_date", width: "w-[12%]" },
  {
    header: "FIM",
    accessor: "end_date",
    width: "w-[12%]",
    render: (value: string) => formatDate(value) || "Atual",
  },
  { header: "OBSERVAÇÕES", accessor: "note", width: "w-[31%]" },
];
