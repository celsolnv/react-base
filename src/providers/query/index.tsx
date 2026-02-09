"use client";

//React-query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface IProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: IProviderProps) => {
  const client = new QueryClient();

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
