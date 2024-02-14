import { contracts } from "@aragon/osx-commons-configs";
import { Address, decodeEventLog } from "viem";
import {
  ADDRESS_ZERO,
  DEPLOYMENT_TARGET_CHAIN_ID,
  DUAL_GOVERNANCE_ENS_SUBDOMAIN,
} from "./constants";
import { publicClient, walletClient } from "../util/client";
import { ABI as PluginRepoFactoryABI } from "../artifacts/plugin-repo-factory";
import { ABI as PluginRepoRegistryABI } from "../artifacts/plugin-repo-registry";
import {
  ABI as DualGovernancePluginSetupABI,
  BYTECODE as DualGovernancePluginSetupBytecode,
} from "../artifacts/dual-governance-plugin-setup";
import {
  ABI as GovernanceErc20ABI,
  BYTECODE as GovernanceErc20Bytecode,
} from "../artifacts/governance-erc20";
import {
  ABI as GovernanceWrappedErc20ABI,
  BYTECODE as GovernanceWrappedErc20Bytecode,
} from "../artifacts/governance-wrapped-erc20";
import { account } from "../util/account";

export async function deployPlugin(): Promise<Address> {
  console.log("\nDual governance plugin");

  // Plugin setup base
  const dualGovernancePluginSetupBase =
    await deployDualGovernancePluginSetupBase();

  // Plugin repo with first version
  const pluginRepo = await publishPluginVersion(dualGovernancePluginSetupBase);

  return pluginRepo;
}

// Helpers

async function deployDualGovernancePluginSetupBase(): Promise<Address> {
  // Base contracts deploy
  const governanceErc20Base = await deployGovernanceErc20Base();
  const governanceWrappedErc20Base = await deployGovernanceWrappedErc20Base();

  // Plugin setup deploy
  console.log("- Deploying the Dual Governance Plugin Setup (implementation)");
  const hash = await walletClient.deployContract({
    abi: DualGovernancePluginSetupABI,
    account,
    bytecode: DualGovernancePluginSetupBytecode,
    args: [governanceErc20Base, governanceWrappedErc20Base],
  });
  console.log("  - Waiting for transaction (" + hash + ")");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error(
      "The Dual Governance plugin setup contract could not be deployed"
    );
  }
  console.log("  - Dual Governance Plugin Setup:", receipt.contractAddress);
  console.log();

  return receipt.contractAddress;
}

async function deployGovernanceErc20Base(): Promise<Address> {
  console.log(
    "- Deploying GovernanceErc20 (implementation for dual governance plugin setup)"
  );
  const hash = await walletClient.deployContract({
    abi: GovernanceErc20ABI,
    account,
    bytecode: GovernanceErc20Bytecode,
    args: [ADDRESS_ZERO, "", "", { amounts: [], receivers: [] }],
  });
  console.log("  - Waiting for transaction (" + hash + ")");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error(
      "The base contract for GovernanceErc20 could not be deployed"
    );
  }
  console.log("  - GovernanceErc20:", receipt.contractAddress);

  return receipt.contractAddress;
}

async function deployGovernanceWrappedErc20Base(): Promise<Address> {
  console.log(
    "- Deploying GovernanceWrappedErc20 (implementation for dual governance plugin setup)"
  );
  const hash = await walletClient.deployContract({
    abi: GovernanceWrappedErc20ABI,
    account,
    bytecode: GovernanceWrappedErc20Bytecode,
    args: [ADDRESS_ZERO, "", ""],
  });
  console.log("  - Waiting for transaction (" + hash + ")");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error(
      "The base contract for GovernanceWrappedErc20 could not be deployed"
    );
  }
  console.log("  - GovernanceWrappedErc20:", receipt.contractAddress);

  return receipt.contractAddress;
}

async function publishPluginVersion(
  dualGovernancePluginSetupBase: Address
): Promise<Address> {
  // Plugin repo factory
  const pluginRepoFactoryAddr = getPluginRepoFactoryAddress();

  // New repo with version
  console.log("- Creating Dual Governance version");
  const { request } = await publicClient.simulateContract({
    address: pluginRepoFactoryAddr,
    abi: PluginRepoFactoryABI,
    functionName: "createPluginRepoWithFirstVersion",
    args: [
      DUAL_GOVERNANCE_ENS_SUBDOMAIN,
      dualGovernancePluginSetupBase,
      account.address,
      "0x12",
      "0x34",
    ],
    account,
  });
  const hash = await walletClient.writeContract(request);

  console.log("  - Waiting for transaction (" + hash + ")");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt) {
    throw new Error(
      "The Dual Governance plugin repository could not be created"
    );
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
    } catch (err) {}
  }

  // Search for PluginRepoRegistered(subdomain, pluginRepo)
  const creationEvent = decodedEvents.find(
    (e) => e.eventName === "PluginRepoRegistered"
  );
  if (!creationEvent) {
    throw new Error("The Dual Governance plugin repo couldn't be created");
  }
  console.log(
    "  - Dual Governance plugin repository:",
    (creationEvent.args as any).pluginRepo
  );
  console.log(
    "  - Repo ENS:",
    (creationEvent.args as any).subdomain + ".plugin.dao.eth"
  );

  return (creationEvent.args as any).pluginRepo as Address;
}

function getPluginRepoFactoryAddress(): Address {
  if (!contracts[DEPLOYMENT_TARGET_CHAIN_ID]) {
    throw new Error(
      "The DAO Factory address is not available for " +
        DEPLOYMENT_TARGET_CHAIN_ID
    );
  }

  const pluginRepoFactory =
    contracts[DEPLOYMENT_TARGET_CHAIN_ID]["v1.3.0"]?.PluginRepoFactory.address;
  if (!pluginRepoFactory) {
    throw new Error(
      "The DAO Factory address is not available for " +
        DEPLOYMENT_TARGET_CHAIN_ID
    );
  }

  return pluginRepoFactory as Address;
}
