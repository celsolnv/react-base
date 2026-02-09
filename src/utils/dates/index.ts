import {
  addMonths,
  endOfWeek,
  format,
  startOfWeek,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { capitalize } from "../text";

export function getLastMonthsLabels(
  amountBefore: number,
  currentDate = new Date(),
  addCurrentMonth = false
): string[] {
  const labels: string[] = [];
  let workingDate = new Date(currentDate);

  if (addCurrentMonth) {
    const currentMonth = format(workingDate, "MMM", { locale: ptBR });
    labels.push(capitalize(currentMonth));
  }

  const amountBeforeAdjusted = addCurrentMonth
    ? amountBefore - 1
    : amountBefore;

  for (let i = 0; i < amountBeforeAdjusted; i++) {
    workingDate = subMonths(workingDate, 1);
    const month = format(workingDate, "MMM", { locale: ptBR });
    labels.push(capitalize(month));
  }

  return labels.reverse();
}

export function getNextMonthsLabels(
  amountNext: number,
  addCurrentMonth = false,
  currentDate = new Date()
): string[] {
  const labels: string[] = [];
  let workingDate = new Date(currentDate);

  if (addCurrentMonth) {
    const currentMonth = format(workingDate, "MMM", { locale: ptBR });
    labels.push(capitalize(currentMonth));
  }

  const amountNextAdjusted = addCurrentMonth ? amountNext - 1 : amountNext;

  for (let i = 0; i < amountNextAdjusted; i++) {
    workingDate = addMonths(workingDate, 1);
    const month = format(workingDate, "MMM", { locale: ptBR });
    labels.push(capitalize(month));
  }

  return labels;
}

export function getLastWeeksLabels(
  amountBefore: number,
  formatType: "long" | "short" = "short",
  currentDate = new Date()
): string[] {
  const labels: string[] = [];
  let workingDate = new Date(currentDate);

  for (let i = 0; i < amountBefore; i++) {
    const endOfWeekDate = endOfWeek(workingDate, { locale: ptBR });
    const startOfWeekDate = startOfWeek(workingDate, { locale: ptBR });

    let weekLabel: string;
    if (formatType === "long") {
      weekLabel = `${format(startOfWeekDate, "d 'de' MMMM", { locale: ptBR })} a ${format(endOfWeekDate, "d 'de' MMMM", { locale: ptBR })}`;
    } else {
      weekLabel = `${format(startOfWeekDate, "dd/MM", { locale: ptBR })} - ${format(endOfWeekDate, "dd/MM", { locale: ptBR })}`;
    }

    labels.push(capitalize(weekLabel));
    workingDate = subWeeks(workingDate, 1);
  }

  return labels.reverse();
}

export function getLastYearsLabels(
  amountBefore: number,
  currentDate = new Date()
): string[] {
  const labels: string[] = [];
  let workingDate = new Date(currentDate);

  for (let i = 0; i < amountBefore; i++) {
    workingDate = subYears(workingDate, 1);
    const year = format(workingDate, "yyyy");
    labels.push(year);
  }

  return labels.reverse();
}

export function getMonthByNumber(month: number): string {
  const date = new Date();
  date.setMonth(month - 1);
  const monthName = format(date, "MMMM", { locale: ptBR });
  return capitalize(monthName);
}
