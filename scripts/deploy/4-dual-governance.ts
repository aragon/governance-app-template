import { contracts } from "@aragon/osx-commons-configs";
import { type Address, decodeEventLog } from "viem";
import { DEPLOYMENT_TARGET_CHAIN_ID, DUAL_GOVERNANCE_ENS_SUBDOMAIN } from "./priv-constants";
import { deploymentPublicClient as publicClient, deploymentWalletClient as walletClient } from "../lib/util/client";
import { deploymentAccount as account } from "../lib/util/account";
import { ABI as PluginRepoFactoryABI } from "../lib/artifacts/plugin-repo-factory";
import { ABI as PluginRepoRegistryABI } from "../lib/artifacts/plugin-repo-registry";
import {
  ABI as DualGovernancePluginSetupABI,
  BYTECODE as DualGovernancePluginSetupBytecode,
} from "../lib/artifacts/dual-governance-plugin-setup";

export async function deployPlugin(
  governanceErc20Base: Address,
  governanceWrappedErc20Base: Address
): Promise<Address> {
  console.log("\nDual governance plugin");

  // Plugin setup base
  const dualGovernancePluginSetupBase = await deployDualGovernancePluginSetupBase(
    governanceErc20Base,
    governanceWrappedErc20Base
  );

  // Plugin repo with first version
  const pluginRepo = await publishPluginVersion(dualGovernancePluginSetupBase);

  return pluginRepo;
}

// Helpers

async function deployDualGovernancePluginSetupBase(
  governanceErc20Base: Address,
  governanceWrappedErc20Base: Address
): Promise<Address> {
  // Plugin setup deploy
  console.log("- Deploying the Dual Governance Plugin Setup (base implementation)");
  const hash = await walletClient.deployContract({
    abi: DualGovernancePluginSetupABI,
    account,
    bytecode: DualGovernancePluginSetupBytecode,
    args: [governanceErc20Base, governanceWrappedErc20Base],
  });
  console.log(`  - Waiting for transaction (${hash})`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error("The Dual Governance plugin setup contract could not be deployed");
  }
  console.log("  - Dual Governance Plugin Setup:", receipt.contractAddress);
  console.log();

  return receipt.contractAddress;
}

async function publishPluginVersion(dualGovernancePluginSetupBase: Address): Promise<Address> {
  // Plugin repo factory
  const pluginRepoFactoryAddr = getPluginRepoFactoryAddress();

  // New repo with version
  console.log("- Publishing Dual Governance version 1.1");
  const { request } = await publicClient.simulateContract({
    address: pluginRepoFactoryAddr,
    abi: PluginRepoFactoryABI,
    functionName: "createPluginRepoWithFirstVersion",
    args: [DUAL_GOVERNANCE_ENS_SUBDOMAIN, dualGovernancePluginSetupBase, account.address, "0x12", "0x34"],
    account,
  });
  const hash = await walletClient.writeContract(request);

  console.log(`  - Waiting for transaction (${hash})`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt) {
    throw new Error("The Dual Governance plugin repository could not be created");
  }

  const decodedEvents = [];
  for (const item of receipt.logs) {
    try {
      decodedEvents.push(
        decodeEventLog({
          abi: PluginRepoRegistryABI,
          data: item.data,
          // eventName: "PluginRepoRegistered",
          topics: item.topics,
          strict: false,
        })
      );
    } catch (err) {
      /* empty */
    }
  }

  // Search for PluginRepoRegistered(subdomain, pluginRepo)
  const creationEvent = decodedEvents.find((e) => e.eventName === "PluginRepoRegistered");
  if (!creationEvent) {
    throw new Error("The Dual Governance plugin repo couldn't be created");
  }
  console.log("  - Dual Governance plugin repository:", (creationEvent.args as any).pluginRepo);
  console.log("  - Repo ENS:", `${(creationEvent.args as any).subdomain}.plugin.dao.eth`);

  return (creationEvent.args as any).pluginRepo as Address;
}

function getPluginRepoFactoryAddress(): Address {
  if (!contracts[DEPLOYMENT_TARGET_CHAIN_ID]) {
    throw new Error(`The DAO Factory address is not available for ${DEPLOYMENT_TARGET_CHAIN_ID}`);
  }

  const pluginRepoFactory = contracts[DEPLOYMENT_TARGET_CHAIN_ID]["v1.3.0"]?.PluginRepoFactory.address;
  if (!pluginRepoFactory) {
    throw new Error(`The DAO Factory address is not available for ${DEPLOYMENT_TARGET_CHAIN_ID}`);
  }

  return pluginRepoFactory as Address;
}
