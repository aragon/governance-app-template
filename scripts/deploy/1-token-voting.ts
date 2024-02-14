import { contracts } from "@aragon/osx-commons-configs";
import { DEPLOYMENT_TARGET_CHAIN_ID } from "./constants";

export async function ensurePluginRepo(): Promise<string> {
  const pluginRepo =
    contracts[DEPLOYMENT_TARGET_CHAIN_ID]["v1.3.0"]?.TokenVotingRepoProxy
      .address;

  if (!pluginRepo) {
    throw new Error(
      "There is no plugin repo available for the Token Voting plugin on " +
        DEPLOYMENT_TARGET_CHAIN_ID
    );
  }

  console.log(`\nToken voting plugin (${DEPLOYMENT_TARGET_CHAIN_ID})`);
  console.log("- Plugin repo at", pluginRepo);
  console.log("  (No action needed)");

  return pluginRepo;
}
