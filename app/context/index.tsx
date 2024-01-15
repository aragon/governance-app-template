"use client";

import { AlertProvider } from "./AlertContext";
import Alerts from "../containers/alerts";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Web3ModalProvider } from "./Web3Modal";

const queryClient = new QueryClient();

export function RootContextProvider({ children }: { children: ReactNode }) {
  return (
    <Web3ModalProvider>
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          {children}
          <Alerts />
        </AlertProvider>
      </QueryClientProvider>
    </Web3ModalProvider>
  );
}
