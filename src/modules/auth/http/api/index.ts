import { v4 as uuidv4 } from "uuid";

import { handleReq } from "@/lib/axios/handle";
import type { IUser } from "@/types/IUser";

const url = "/public/auth";

interface ILoginParams {
  email: string;
  password: string;
}

export const auth = async (body: ILoginParams): Promise<IUser> => {
  const deviceId = uuidv4();
  return handleReq({
    config: {
      headers: {
        "x-device": deviceId,
      },
    },
    method: "post",
    url: `${url}/login`,
    body,
    showSuccess: false,
    hideError: true,
    checkStatus: false,
  });
};

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

export interface IForgotPasswordParams {
  email: string;
}

export const forgotPassword = async (body: IForgotPasswordParams) =>
  handleReq({
    method: "post",
    url: `${url}/recovery`,
    body,
    showSuccess: true,
    successMessage: "E-mail de recuperação de senha enviado com sucesso",
    checkStatus: false,
  });

export interface IFirstAccessParams {
  password: string;
  password_confirm: string;
  code: string;
}

export const firstAccess = async (body: IFirstAccessParams) =>
  handleReq({
    config: {
      headers: {
        "x-device": uuidv4(),
      },
    },
    method: "post",
    url: `${url}/first_access`,
    body,
  });
