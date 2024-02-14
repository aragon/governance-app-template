import { Address } from "viem";
import { checkDependencies } from "./deploy/0-checks.js";
import { ensurePluginRepo as ensureTokenVoting } from "./deploy/1-token-voting.js";
import { deployContract as deployDelegates } from "./deploy/2-delegate-announcer.js";
import { deployPlugin as deployDualGovernance } from "./deploy/3-dual-governance.js";
import { deployDao } from "./deploy/4-dao.js";

async function main() {
  let tokenVotingPluginRepo: Address;
  let delegationAnnouncerAddress: Address;
  let dualGovernancePluginRepo: Address;
  let daoAddress: Address;

  try {
    // Wallet checks
    console.log("Checking the deployment wallet");
    await checkDependencies();

    // Deployment
    console.log("Plugins and helpers");

    tokenVotingPluginRepo = await ensureTokenVoting();
    // console.log("Deployed Delegates repo:", tokenVotingPluginRepo);

    delegationAnnouncerAddress = await deployDelegates();
    // console.log("Delegate announcer:", delegationAnnouncerAddress);

    dualGovernancePluginRepo = await deployDualGovernance();
    console.log("Deployed DualGovernance repo:", dualGovernancePluginRepo);

    daoAddress = await deployDao(
      tokenVotingPluginRepo,
      dualGovernancePluginRepo
    );
    console.log("Deployed DAO:", daoAddress);

    console.log("Deployment successful");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
