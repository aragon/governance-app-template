import { createWeb3Modal } from "@web3modal/wagmi/react";
// import { WagmiConfig } from "wagmi";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { mainnet, polygon, optimism } from "@wagmi/core/chains";
// import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ReactNode } from "react";
import { publicProvider } from "wagmi/providers/public";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";

// 1. Get projectId
const projectId: string = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "";
const alchemyKey: string = process.env.NEXT_PUBLIC_ALCHEMY || "";

// 2. Create wagmiConfig
const metadata = {
  name: "Aragonette",
  description: "Simplified UI for Aragon",
  url: "https://aragon.org",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [
    alchemyProvider({ apiKey: alchemyKey }),
  ]
);

// const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: { projectId, showQrModal: false, metadata },
    }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: metadata.name },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeVariables: {
    // '--w3m-color-mix': '#00BB7F',
    "--w3m-accent": "#3164FA",
    "--w3m-color-mix": "#3164FA",
    "--w3m-color-mix-strength": 30,
    "--w3m-border-radius-master": "12px",
  },
});

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
