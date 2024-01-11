"use client";

import { WagmiConfig } from "wagmi";
import { AlertProvider } from "./AlertContext";
import Alerts from "../containers/alerts";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { wagmiConfig } from "./Web3Modal";

const queryClient = new QueryClient();

export function RootContextProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          {children}
          <Alerts />
        </AlertProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
