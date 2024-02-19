import { AlertProvider } from "./AlertContext";
import Alerts from "@/components/alert/alerts";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { config } from "@/context/Web3Modal";
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { State, WagmiProvider } from 'wagmi'
import { PUB_WALLET_CONNECT_PROJECT_ID } from "@/constants";

const queryClient = new QueryClient();

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId: PUB_WALLET_CONNECT_PROJECT_ID,
  enableAnalytics: false // Optional - defaults to your Cloud configuration
})

export function RootContextProvider({ children, initialState }: { children: ReactNode,   initialState?: State }) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          {children}
          <Alerts />
        </AlertProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
