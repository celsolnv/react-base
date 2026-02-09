/* eslint-disable @typescript-eslint/no-explicit-any */
export function getMessageError(name: string, error: any) {
  const b = name.split(".");
  if (b.length === 1) return "";
  const key = b[0];
  const index = Number(b[1]);
  const field = b[2];

  if (error[key]?.message) return error[key]?.message;
  if (!error[key]) return "";
  if (!error[key][index]) return "";
  return error[key][index][field]?.message;
}
