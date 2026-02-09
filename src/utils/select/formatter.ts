import type { IOptionSelect } from "@/types/Common";

interface IResponseParams {
  id: string;
  name: string;
}
export function formatSelectDefault(
  response: IResponseParams[],
  nameWithId = false
): IOptionSelect[] {
  return response.map((item) => ({
    value: item.id,
    label: nameWithId ? `${item.id} - ${item.name}` : item.name,
  }));
}
