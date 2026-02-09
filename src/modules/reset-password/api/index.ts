import { v4 as uuidv4 } from "uuid";

import { handleReq } from "@/lib/axios/handle";

const url = "/public/auth";

export interface IRedefineParams {
  password: string;
  password_confirm: string;
}

export const reset = async (body: IRedefineParams, code: string) =>
  handleReq({
    config: {
      headers: {
        "x-device": uuidv4(),
      },
    },
    method: "post",
    url: `${url}/reset/${code}`,
    body,
    checkStatus: false,
    showSuccess: true,
    successMessage: "Senha redefinida com sucesso",
  });

export const verifyResetCode = async (code: string) =>
  handleReq({
    config: {
      headers: {
        "x-device": uuidv4(),
      },
    },
    method: "post",
    url: `${url}/validate/${code}`,
    checkStatus: false,
    showSuccess: false,
    hideError: true,
  });
