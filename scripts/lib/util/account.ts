import { Address, privateKeyToAccount } from "viem/accounts";
import { getEnv } from "./env";

const PRIVATE_KEY = getEnv("DEPLOYMENT_WALLET_PRIVATE_KEY", true) as Address;

export const deploymentAccount = privateKeyToAccount(PRIVATE_KEY);
