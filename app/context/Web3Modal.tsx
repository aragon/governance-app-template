"use client";

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { createConfig, configureChains } from 'wagmi'
import { mainnet, polygon, optimism } from '@wagmi/core/chains'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAlertContext, AlertProvider, AlertContextProps } from './AlertContext';
import { useContext, useEffect } from 'react';
import Alert from '../components/alert';
import { IAlert } from '@/utils/types';
import Alerts from '../containers/alerts';


// 1. Get projectId
const projectId: string = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "";
const alchemyKey: string = process.env.NEXT_PUBLIC_ALCHEMY || "";

// 2. Create wagmiConfig
const metadata = {
  name: 'Aragonette',
  description: 'Simplified UI for Aragon',
  url: 'https://aragon.org',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [alchemyProvider({ apiKey: alchemyKey })],
)

// const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new CoinbaseWalletConnector({ chains, options: { appName: metadata.name } }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        metadata,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

// 3. Create modal
createWeb3Modal({ 
  wagmiConfig, 
  projectId, 
  chains,
  themeVariables: {
    // '--w3m-color-mix': '#00BB7F',
    '--w3m-accent': '#3164FA',
    '--w3m-color-mix': '#3164FA',
    '--w3m-color-mix-strength': 30,
    '--w3m-border-radius-master': '12px'
  }
})

const queryClient = new QueryClient();


export function Web3Modal({ children }: any) {

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
