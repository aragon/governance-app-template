import { createPublicClient, createWalletClient, http } from "viem";
import { deploymentAccount as account } from "./account";
import { getEnv } from "./env";
import { goerli } from "viem/chains";

const ALCHEMY_API_KEY = getEnv("DEPLOYMENT_ALCHEMY_API_KEY", true);
const WEB3_ENDPOINT = getEnv("DEPLOYMENT_WEB3_ENDPOINT", true);

export const deploymentPublicClient = createPublicClient({
  chain: goerli,
  transport: http(WEB3_ENDPOINT + ALCHEMY_API_KEY, {
    batch: true,
  }),
});

export const deploymentWalletClient = createWalletClient({
  account,
  chain: goerli,
  transport: http(WEB3_ENDPOINT + ALCHEMY_API_KEY, {
    batch: true,
  }),
});
