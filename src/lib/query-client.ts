// src/lib/query-client.ts
import { QueryClient } from "@tanstack/react-query";

export const makeQueryClient = () => {
  return new QueryClient();
};

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Sisi Server: Selalu buat instansi baru untuk setiap request (mencegah kebocoran data antar user)
    return makeQueryClient();
  } else {
    // Sisi Client: Gunakan kembali instansi yang sudah ada (Singleton pattern)
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
};
