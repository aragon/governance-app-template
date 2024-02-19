import { createPublicClient, createWalletClient, http } from "viem";
import { deploymentAccount as account } from "./account";
import { getEnv } from "./env";
import { goerli } from "viem/chains";

const ALCHEMY_KEY = getEnv("DEPLOYMENT_ALCHEMY_API_KEY", true);

export const deploymentPublicClient = createPublicClient({
  chain: goerli,
  transport: http("https://eth-goerli.g.alchemy.com/v2/" + ALCHEMY_KEY, {
    batch: true,
  }),
});

export const deploymentWalletClient = createWalletClient({
  account,
  chain: goerli,
  transport: http("https://eth-goerli.g.alchemy.com/v2/" + ALCHEMY_KEY, {
    batch: true,
  }),
});
