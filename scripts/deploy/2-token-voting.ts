import { contracts } from "@aragon/osx-commons-configs";
import { DEPLOYMENT_TARGET_CHAIN_ID, DEPLOYMENT_OPTIMISTIC_TOKEN_VOTING } from "./priv-constants";
import { Address } from "viem";

export function ensurePluginRepo() {
  if (!contracts[DEPLOYMENT_TARGET_CHAIN_ID]) {
    throw new Error("The DAO Factory address is not available for " + DEPLOYMENT_TARGET_CHAIN_ID);
  }

  const pluginRepo = contracts[DEPLOYMENT_TARGET_CHAIN_ID]["v1.3.0"]?.TokenVotingRepoProxy.address;

  if (!pluginRepo || !DEPLOYMENT_OPTIMISTIC_TOKEN_VOTING) {
    throw new Error(
      "There is no plugin repo available for the (Optimistic) Token Voting plugin on " + DEPLOYMENT_TARGET_CHAIN_ID
    );
  }

  console.log(`\nToken voting plugin (${DEPLOYMENT_TARGET_CHAIN_ID})`);
  console.log("- Plugin repo at", pluginRepo);

  return [pluginRepo as Address, DEPLOYMENT_OPTIMISTIC_TOKEN_VOTING as Address];
}
