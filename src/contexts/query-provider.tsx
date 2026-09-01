"use client";

import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client"; // Sesuaikan alias path Anda

export const QueryProvider = ({ children }: PropsWithChildren) => {
  // Memanggil fungsi eksternal yang sudah kita buat tadi
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
