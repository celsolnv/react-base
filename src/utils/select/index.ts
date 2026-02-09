/* eslint-disable @typescript-eslint/no-explicit-any */

type TValue = string | boolean | number;
export interface IConfigFields {
  label: string;
  key: string;
  required: boolean;
  options:
    | {
        value: TValue;
        label: string;
      }[]
    | null;
}
export const findSelect = (
  value?: TValue,
  option?: { value: TValue; label: string }[]
) => {
  return (
    option?.find((item) => item.value === value) || {
      label: "Não encontrado",
      value: "",
    }
  );
};
export const findSelectNullable = (
  value: TValue,
  option: { value: TValue; label: string }[]
) => {
  return option.find((item) => item.value === value) || null;
};

export const arrayToObject = (array: IConfigFields[]) => {
  return array.reduce((mapa: { [key: string]: IConfigFields }, obj) => {
    return { ...mapa, [obj.key]: obj };
  }, {});
};

export function filterUniqueProperty(arr: Array<any>, prop: string): string[] {
  const uniqueValues: string[] = [];

  arr.forEach((obj) => {
    if (!uniqueValues.includes(obj[prop])) {
      uniqueValues.push(obj[prop]);
    }
  });

  return uniqueValues;
}
