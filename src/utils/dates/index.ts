import moment from "moment/min/moment-with-locales";

import { capitalize } from "../text";

export function getLastMonthsLabels(
  amountBefore: number,
  currentDate = moment(),
  addCurrentMonth = false
): string[] {
  moment.locale("pt-br"); // Define o idioma para português
  currentDate.locale("pt-br"); // Define o idioma para português

  const labels: string[] = [];

  if (addCurrentMonth) {
    const currentMonth = currentDate.format("MMM");
    labels.push(capitalize(currentMonth)); // Meses em português
  }
  const amountBeforeAdjusted = addCurrentMonth
    ? amountBefore - 1
    : amountBefore;
  for (let i = 0; i < amountBeforeAdjusted; i++) {
    const month = currentDate.subtract(1, "months").format("MMM");
    labels.push(capitalize(month)); // Meses em português
  }
  return labels.reverse();
}
export function getNextMonthsLabels(
  amountNext: number,
  addCurrentMonth = false,
  currentDate = moment()
): string[] {
  moment.locale("pt-br"); // Define o idioma para português
  currentDate.locale("pt-br"); // Define o idioma para português

  const labels: string[] = [];

  if (addCurrentMonth) {
    const currentMonth = currentDate.format("MMM");
    labels.push(capitalize(currentMonth)); // Meses em português
  }
  const amountNextAdjusted = addCurrentMonth ? amountNext - 1 : amountNext;

  for (let i = 0; i < amountNextAdjusted; i++) {
    const month = currentDate.add(1, "months").format("MMM");
    labels.push(capitalize(month)); // Meses em português
  }
  return labels;
}

export function getLastWeeksLabels(
  amountBefore: number,
  format: "long" | "short" = "short",
  currentDate = moment()
): string[] {
  moment.locale("pt-br"); // Define o idioma para português
  currentDate.locale("pt-br"); // Define o idioma para português

  const labels: string[] = [];
  for (let i = 0; i < amountBefore; i++) {
    const endOfWeek = currentDate.clone().endOf("week");
    const startOfWeek = currentDate.clone().startOf("week");

    let weekLabel: string;
    if (format === "long") {
      weekLabel = `${startOfWeek.format("D [de] MMMM")} a ${endOfWeek.format("D [de] MMMM")}`;
    } else {
      weekLabel = `${startOfWeek.format("DD/MM")} - ${endOfWeek.format("DD/MM")}`;
    }

    labels.push(capitalize(weekLabel)); // Semanas em português
    currentDate.subtract(1, "weeks");
  }
  return labels.reverse();
}

export function getLastYearsLabels(
  amountBefore: number,
  currentDate = moment()
): string[] {
  moment.locale("pt-br"); // Define o idioma para português
  currentDate.locale("pt-br"); // Define o idioma para português

  const labels: string[] = [];
  for (let i = 0; i < amountBefore; i++) {
    const year = currentDate.subtract(1, "years").format("YYYY");
    labels.push(year); // Anos em português
  }
  return labels.reverse();
}

export function getMonthByNumber(month: number): string {
  moment.locale("pt-br");
  const monthName = moment()
    .month(month - 1)
    .format("MMMM");
  return capitalize(monthName);
}
