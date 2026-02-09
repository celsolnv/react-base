import axios from "axios";
import { toast } from "sonner";

import { getToken } from "@/hooks/token";

const API_URL = import.meta.env.VITE_API_URL;
const TIMEOUT = 60000; // 1 minute
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(
  async (config) => {
    const token = getToken();

    config.timeout = TIMEOUT;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    toast.error("Erro ao se conectar com o servidor");
    throw new Error(error);
  }
);

export default api;
