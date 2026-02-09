import { useAuthStore } from "@/modules/auth/store/auth-store";

export const getToken = () => {
  const local_token = useAuthStore.getState().accessToken;
  return local_token;
};

export const setToken = async (token: string) => {
  useAuthStore.getState().setAccessToken(token);
};
