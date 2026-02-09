/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export function useFormDebug(hookform: any) {
  useEffect(() => {
    console.info("Valores do formulário => ", hookform.getValues());
    console.info("Errors no formulário => ", hookform.formState.errors);
  }, [hookform, hookform.formState.errors]);
}
