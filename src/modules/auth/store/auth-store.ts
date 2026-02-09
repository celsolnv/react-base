import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  // Actions
  setAccessToken: (token: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,

      setAccessToken: (token) => {
        if (!token) return;
        set({ accessToken: token });
      },

      clearSession: () => set({ accessToken: null }),
    }),
    {
      name: "auth-storage", // Nome da key no localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Helper para usar fora do React (Ex: no Axios)
export const getAccessToken = () => useAuthStore.getState().accessToken;
