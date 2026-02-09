import { handleReq } from "@/lib/axios/handle";

const url = "/public/auth";

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
