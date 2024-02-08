import { http, createConfig } from "wagmi";
import { polygon } from "@wagmi/core/chains";
import { injected } from 'wagmi/connectors'
import { coinbaseWallet } from 'wagmi/connectors'
import { walletConnect } from 'wagmi/connectors'


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

// const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
export const config = createConfig({
  chains: [polygon],
  transports: {
    [polygon.id]: http('https://polygon-mainnet.g.alchemy.com/v2/' + alchemyKey, {batch: true}),
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0]
    })
  ],
  // ssr: false,
})



