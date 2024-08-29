import { Address } from "viem";
import { DEPLOYMENT_TARGET_CHAIN_ID } from "./deploy/priv-constants.js";
import { deploymentPublicClient as publicClient } from "./lib/util/client";
import { checkDependencies } from "./deploy/0-checks.js";
import { deployTokenContracts } from "./deploy/1-gov-erc20-token.js";
import { ensurePluginRepo as ensureTokenVoting } from "./deploy/2-token-voting.js";
import { deployPlugin as deployDualGovernance } from "./deploy/4-dual-governance.js";
import { deployDao } from "./deploy/5-dao.js";

async function main() {
  let tokenVotingPluginRepo: Address;
  let dualGovernancePluginRepo: Address;

  try {
    // Wallet checks
    console.log("Checking the deployment wallet");
    await checkDependencies();

    // Deployment
    console.log("Token contracts");
    const { daoToken, governanceErc20Base, governanceWrappedErc20Base } = await deployTokenContracts();

    console.log("\nPlugins and helpers");
    tokenVotingPluginRepo = await ensureTokenVoting();
    dualGovernancePluginRepo = await deployDualGovernance(governanceErc20Base, governanceWrappedErc20Base);

    const { daoAddress, subdomain, installedPlugins } = await deployDao(
      daoToken,
      tokenVotingPluginRepo,
      dualGovernancePluginRepo
    );

    const currentBlock = await publicClient.getBlockNumber();

    const summary = `

Your DAO has been deployed successfully:
- DAO address:  ${daoAddress}
- DAO ENS:      ${subdomain}.dao.eth

Please, update your .env file to use the newly deployed DAO

# General
NEXT_PUBLIC_DAO_ADDRESS=${daoAddress}
NEXT_PUBLIC_TOKEN_ADDRESS=${daoToken}
NEXT_PUBLIC_DELEGATION_ANNOUNCEMENTS_START_BLOCK=${currentBlock}

# Plugin addresses
NEXT_PUBLIC_TOKEN_VOTING_PLUGIN_ADDRESS=${installedPlugins[0]} 
NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS=${installedPlugins[1]}

# Network and services
NEXT_PUBLIC_CHAIN_NAME=${DEPLOYMENT_TARGET_CHAIN_ID}
NEXT_PUBLIC_WEB3_URL_PREFIX=https://eth-${DEPLOYMENT_TARGET_CHAIN_ID}.g.alchemy.com/v2/

NEXT_PUBLIC_ALCHEMY_API_KEY=<YOUR KEY GOES HERE>
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<YOUR KEY GOES HERE>
NEXT_PUBLIC_IPFS_ENDPOINT=<YOUR IPFS API URL GOES HERE>
NEXT_PUBLIC_IPFS_API_KEY=<YOUR IPFS API KEY GOES HERE>
NEXT_PUBLIC_ETHERSCAN_API_KEY=<YOUR API KEY GOES HERE>
`;
    console.log(summary);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
