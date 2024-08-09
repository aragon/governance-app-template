import { SupportedNetworks } from "@aragon/osx-commons-configs";
import { deploymentAccount as account } from "../lib/util/account";
import { getEnv } from "../lib/util/env";
import { parseEther } from "viem";

// NETWORK
export const DEPLOYMENT_TARGET_CHAIN_ID = (getEnv("DEPLOYMENT_TARGET_CHAIN_ID", true) ??
  "sepolia") as SupportedNetworks;

export const DEPLOYMENT_OPTIMISTIC_TOKEN_VOTING = getEnv("DEPLOYMENT_OPTIMISTIC_TOKEN_VOTING", true);

// DAO
export const DEPLOYMENT_DAO_NAME = "Aragonette DAO";
export const DEPLOYMENT_DAO_DESCRIPTION = "This is a very flexible DAO";

// NOTE:
// Enter a value in order to request a new dao.eth subdomain (where available)
// Be sure to define a name when the full setup is validated.
// Once a dao.eth subdomain is assigned it cannot be transferred.
export const DEPLOYMENT_ENS_SUBDOMAIN = "aragonette-dao-test-" + Math.random().toString().slice(2);

// PLUGINS

// TOKEN
export const DEPLOYMENT_TOKEN_NAME = "Aragonette DAO Coin";
export const DEPLOYMENT_TOKEN_SYMBOL = "ADC";
export const DEPLOYMENT_TOKEN_RECEIVERS = [account.address, "0x0f14341A7f464320319025540E8Fe48Ad0fe5aec"] as const;
export const DEPLOYMENT_TOKEN_AMOUNTS = [parseEther("1000"), parseEther("1000")];

// DUAL GOVERNANCE
export const DUAL_GOVERNANCE_ENS_SUBDOMAIN = "dual-governance-test-" + Math.random().toString().slice(2);

// OTHER
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
