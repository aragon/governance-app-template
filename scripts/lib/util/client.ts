import { Chain, createPublicClient, createWalletClient, http } from "viem";
import { deploymentAccount as account } from "./account";
import { getEnv } from "./env";
import { sepolia, holesky, mainnet, polygon, arbitrum, base } from "viem/chains";

const ALCHEMY_API_KEY = getEnv("DEPLOYMENT_ALCHEMY_API_KEY", true);
const WEB3_ENDPOINT = getEnv("DEPLOYMENT_WEB3_ENDPOINT", true);
const TARGET_CHAIN_ID = getEnv("DEPLOYMENT_TARGET_CHAIN_ID", true);

export const deploymentPublicClient = createPublicClient({
  chain: resolveNetwork(),
  transport: http(WEB3_ENDPOINT + ALCHEMY_API_KEY, {
    batch: true,
  }),
});

export const deploymentWalletClient = createWalletClient({
  account,
  chain: resolveNetwork(),
  transport: http(WEB3_ENDPOINT + ALCHEMY_API_KEY, {
    batch: true,
  }),
});

function resolveNetwork(): Chain {
  switch (TARGET_CHAIN_ID) {
    case "sepolia":
      return sepolia;
    case "holesky":
      return holesky;
    case "mainnet":
      return mainnet;
    case "polygon":
      return polygon;
    case "arbitrum":
      return arbitrum;
    case "base":
      return base;
  }
  throw new Error("Unsupported network");
}
