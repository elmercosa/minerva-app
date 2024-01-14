"use client";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export function Provider({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>;
    </QueryClientProvider>
  );
}
