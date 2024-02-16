import { http, createConfig } from "wagmi";
import { polygon, mainnet, sepolia, goerli } from "@wagmi/core/chains";
import { injected } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'

// 1. Get projectId
const WALLET_CONNECT_PROJECT_ID: string = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";
const ALCHEMY_KEY: string = process.env.NEXT_PUBLIC_ALCHEMY || "";

// 2. Create wagmiConfig
const metadata = {
  name: "Aragonette",
  description: "Simplified UI for Aragon",
  url: "https://aragon.org",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const config = createConfig({
  chains: [goerli, mainnet],
  transports: {
    [goerli.id]: http('https://eth-goerli.g.alchemy.com/v2/' + ALCHEMY_KEY, {batch: true}),
    // [polygon.id]: http('https://polygon-mainnet.g.alchemy.com/v2/' + ALCHEMY_KEY, {batch: true}),
    [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/' + ALCHEMY_KEY, {batch: true}),
    // [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/' + ALCHEMY_KEY, {batch: true})
  },
  connectors: [
    walletConnect({ projectId: WALLET_CONNECT_PROJECT_ID, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    // coinbaseWallet({ appName: metadata.name, appLogoUrl: metadata.icons[0] }),
  ],
  // ssr: false,
})



