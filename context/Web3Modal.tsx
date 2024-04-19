import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { walletConnect, coinbaseWallet } from "wagmi/connectors";
import {
  PUB_APP_DESCRIPTION,
  PUB_APP_NAME,
  PUB_CHAIN,
  PUB_PROJECT_URL,
  PUB_WALLET_CONNECT_PROJECT_ID,
  PUB_WALLET_ICON,
  PUB_WEB3_ENDPOINT,
} from "@/constants";
import { mainnet } from "viem/chains";

// wagmi config
const metadata = {
  name: PUB_APP_NAME,
  description: PUB_APP_DESCRIPTION,
  url: PUB_PROJECT_URL,
  icons: [PUB_WALLET_ICON],
};

export const config = createConfig({
  chains: [PUB_CHAIN, mainnet],
  ssr: true,
  transports: {
    [PUB_CHAIN.id]: http(PUB_WEB3_ENDPOINT, { batch: true }),
    [mainnet.id]: http(PUB_WEB3_ENDPOINT, { batch: true }),
  },
  connectors: [
    walletConnect({
      projectId: PUB_WALLET_CONNECT_PROJECT_ID,
      metadata,
      showQrModal: false,
    }),
    // coinbaseWallet({ appName: metadata.name, appLogoUrl: metadata.icons[0] }),
  ],
});
