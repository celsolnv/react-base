/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

export function removeFalsyValuesFromObject<T extends object>(
  obj: T,
  removeEmptyArray = false
): Partial<T> {
  const cleanedObject: Partial<T> = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      const value = obj[key];
      if (
        // value !== null &&
        value !== undefined &&
        String(value)?.trim() !== ""
      ) {
        if (removeEmptyArray && Array.isArray(value) && value.length === 0) {
          continue;
        } else {
          cleanedObject[key] = value;
        }
      }
    }
  }

  return cleanedObject;
}

export function removeKeysFromObj<TFormData extends object>(
  keys: (keyof TFormData)[],
  params: TFormData
): Partial<TFormData> {
  const data = Object.keys(params).reduce((acc, k) => {
    const key = k as keyof TFormData;
    if (!keys.includes(key)) {
      acc[key] = params[key];
    }
    return acc;
  }, {} as Partial<TFormData>);

  return data;
}

export function removeItemByIndex<T>(array: T[], index: number): T[] {
  return array.filter((_, i) => i !== index);
}
