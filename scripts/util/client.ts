import { createPublicClient, createWalletClient, http } from "viem";
import { goerli } from "viem/chains";
import { getEnv } from "./env";
import { account } from "./account";

const ALCHEMY_KEY = getEnv("DEPLOYMENT_ALCHEMY_KEY", true);

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http("https://eth-goerli.g.alchemy.com/v2/" + ALCHEMY_KEY, {
    batch: true,
  }),
});

export const walletClient = createWalletClient({
  account,
  chain: goerli,
  transport: http("https://eth-goerli.g.alchemy.com/v2/" + ALCHEMY_KEY, {
    batch: true,
  }),
});
