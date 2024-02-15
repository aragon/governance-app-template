import { Address } from "viem";
import { checkDependencies } from "./deploy/0-checks.js";
import { deployTokenContracts } from "./deploy/1-governance-erc20-token.js";
import { ensurePluginRepo as ensureTokenVoting } from "./deploy/2-token-voting.js";
import { deployContract as deployDelegates } from "./deploy/3-delegate-announcer.js";
import { deployPlugin as deployDualGovernance } from "./deploy/4-dual-governance.js";
import { deployDao } from "./deploy/5-dao.js";

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
    console.log("Token contracts");
    const { daoToken, governanceErc20Base, governanceWrappedErc20Base } =
      await deployTokenContracts();

    console.log("\nPlugins and helpers");
    tokenVotingPluginRepo = await ensureTokenVoting();
    delegationAnnouncerAddress = await deployDelegates();
    dualGovernancePluginRepo = await deployDualGovernance(
      governanceErc20Base,
      governanceWrappedErc20Base
    );

    daoAddress = await deployDao(
      daoToken,
      tokenVotingPluginRepo,
      dualGovernancePluginRepo
    );
    console.log("\nDeployed DAO:", daoAddress);

    console.log(
      "\nPlease, update the environment files to make use of the deployed contracts"
    );
    console.log("Deployment successful");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
