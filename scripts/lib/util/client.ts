import { Chain, createPublicClient, createWalletClient, http } from "viem";
import { deploymentAccount as account } from "./account";
import { getEnv } from "./env";
import { sepolia, mainnet, polygon, arbitrum, base, darwinia, koi, crab } from "viem/chains";

const WEB3_ENDPOINT = getEnv("DEPLOYMENT_WEB3_ENDPOINT", true);
const TARGET_CHAIN_ID = getEnv("DEPLOYMENT_TARGET_CHAIN_ID", true);

export const deploymentPublicClient = createPublicClient({
  chain: resolveNetwork(),
  transport: http(WEB3_ENDPOINT, {
    batch: true,
  }),
});

export const deploymentWalletClient = createWalletClient({
  account,
  chain: resolveNetwork(),
  transport: http(WEB3_ENDPOINT, {
    batch: true,
  }),
});

function resolveNetwork(): Chain {
  switch (TARGET_CHAIN_ID) {
    case "sepolia":
      return sepolia;
    case "mainnet":
      return mainnet;
    case "polygon":
      return polygon;
    case "arbitrum":
      return arbitrum;
    case "base":
      return base;
    case "darwinia":
      return darwinia;
    case "crab":
      return crab;
    case "koi":
      return koi;
  }
  throw new Error("Unsupported network");
}
