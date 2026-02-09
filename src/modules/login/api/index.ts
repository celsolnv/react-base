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
