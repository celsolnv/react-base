export function capitalize(value?: string) {
  if (!value) return "";
  return String(value[0]).toUpperCase() + String(value).toLowerCase().slice(1);
}

export function sanitize(value?: string) {
  if (!value) return "";
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export const getUserInitials = (name: string): string => {
  return name
    ?.split(" ")
    ?.map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
