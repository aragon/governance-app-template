import { contracts } from "@aragon/osx-commons-configs";
import {
  ADDRESS_ZERO,
  DEPLOYMENT_DAO_DESCRIPTION,
  DEPLOYMENT_DAO_NAME,
  DEPLOYMENT_ENS_SUBDOMAIN,
  DEPLOYMENT_TARGET_CHAIN_ID,
  DEPLOYMENT_TOKEN_RECEIVERS,
} from "./priv-constants";
import { type Address, type Hex, type Log, decodeEventLog, toHex } from "viem";
import { deploymentPublicClient as publicClient, deploymentWalletClient as walletClient } from "../lib/util/client";
import { deploymentAccount as account } from "../lib/util/account";
import { ABI as DaoFactoryABI } from "../lib/artifacts/dao-factory";
import { ABI as DaoRegistryABI } from "../lib/artifacts/dao-registry";
import { ABI as PluginSetupProcessorABI } from "../lib/artifacts/plugin-setup-processor";
import { PREPARE_INSTALLATION_ABI as TokenVotingPrepareInstallationAbi } from "../lib/artifacts/token-voting-plugin-setup";
import { PREPARE_INSTALLATION_ABI as OptimisticTokenVotingPrepareInstallationAbi } from "../lib/artifacts/optimistic-token-voting-plugin-setup";
import { encodeAbiParameters } from "viem";

const EXPECTED_PLUGIN_COUNT = 2;

const PINATA_JWT_API_KEY = process.env.DEPLOYMENT_PINATA_JWT_API_KEY || "";

export async function deployDao(
  daoToken: Address,
  tokenVotingPluginRepo: Address,
  optimisticTokenVotingPluginRepo: Address
) {
  const daoFactoryAddr = getDaoFactoryAddress();

  console.log("\nUsing the DAO factory at", daoFactoryAddr);

  const daoSettings: DaoSettings = {
    metadata: await pinDaoMetadata(),
    daoURI: "",
    subdomain: DEPLOYMENT_ENS_SUBDOMAIN,
    trustedForwarder: ADDRESS_ZERO,
  };
  const pluginSettings: PluginInstallSettings[] = [
    getTokenVotingInstallSettings(daoToken, tokenVotingPluginRepo),
    getOptimisticTokenVotingInstallSettings(daoToken, optimisticTokenVotingPluginRepo),
  ];

  console.log("- Deploying the DAO");
  const { request } = await publicClient.simulateContract({
    address: daoFactoryAddr,
    abi: DaoFactoryABI,
    functionName: "createDao",
    args: [daoSettings, pluginSettings],
    account,
  });
  const hash = await walletClient.writeContract(request);

  console.log(`  - Waiting for transaction (${hash})`);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt) {
    throw new Error("The Dual Governance plugin repository could not be created");
  }

  const { daoAddress, subdomain } = resolveDaoRegisteredEvent(receipt.logs);
  const installedPlugins = resolveInstallationAppliedEvent(receipt.logs);

  return { daoAddress, subdomain, installedPlugins };
}

async function pinDaoMetadata(): Promise<Hex> {
  // Add additional metadata fields if needed
  const daoMetadata = {
    name: DEPLOYMENT_DAO_NAME,
    description: DEPLOYMENT_DAO_DESCRIPTION,
    // avatar: "",
    // links: [
    //   {
    //     name: "Web site",
    //     url: "https://...",
    //   },
    // ],
  };
  return uploadToIPFS(JSON.stringify(daoMetadata))
    .then((res) => toHex(res))
    .catch((err) => {
      console.log(err);
      console.warn("Warning: Could not pin the DAO metadata on IPFS");
      return "0x";
    });
}

async function uploadToIPFS(metadata: JSON) {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + PINATA_JWT_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataOptions: {
        cidVersion: 0,
      },
      pinataContent: metadata,
    }),
  });

  const c = await res.json();

  console.log(`Uploaded to IPFS with cid ${c.IpfsHash.toString()}`);
  return c.IpfsHash.toString();
}

function getTokenVotingInstallSettings(daoToken: Address, tokenVotingPluginRepo: Address): PluginInstallSettings {
  // Encode prepareInstallation(_, data)
  const encodedPrepareInstallationData = encodeAbiParameters(TokenVotingPrepareInstallationAbi, [
    {
      minDuration: BigInt(60 * 60 * 24 * 3),
      minParticipation: 100_000, // 10%
      minProposerVotingPower: BigInt(0), // 0 tokens
      supportThreshold: 500_000, // 50%
      votingMode: 1, // Standard, EarlyExecution, VoteReplacement
    },
    {
      name: "",
      symbol: "",
      token: daoToken,
    },
    {
      amounts: [],
      receivers: [],
    },
  ]);

  return {
    data: encodedPrepareInstallationData,
    pluginSetupRef: {
      pluginSetupRepo: tokenVotingPluginRepo,
      versionTag: {
        release: 1,
        build: 2,
      },
    },
  };
}

function getOptimisticTokenVotingInstallSettings(
  daoToken: Address,
  optimisticTokenVotingPluginRepo: Address
): PluginInstallSettings {
  const creatorAddresses = DEPLOYMENT_TOKEN_RECEIVERS;

  const encodedPrepareInstallationData = encodeAbiParameters(OptimisticTokenVotingPrepareInstallationAbi, [
    {
      minVetoRatio: 200_000,
      minDuration: BigInt(60 * 60 * 24 * 6),
      minProposerVotingPower: BigInt(0),
    },
    { token: daoToken, name: "", symbol: "" },
    { receivers: [], amounts: [] },
    creatorAddresses,
  ]);

  return {
    data: encodedPrepareInstallationData,
    pluginSetupRef: {
      pluginSetupRepo: optimisticTokenVotingPluginRepo,
      versionTag: {
        release: 1,
        build: 1,
      },
    },
  };
}

function getDaoFactoryAddress(): Address {
  if (!contracts[DEPLOYMENT_TARGET_CHAIN_ID]) {
    throw new Error(`The DAO Factory address is not available for ${DEPLOYMENT_TARGET_CHAIN_ID}`);
  }

  const result = contracts[DEPLOYMENT_TARGET_CHAIN_ID]["v1.3.0"]?.DAOFactory.address;
  if (!result) {
    throw new Error(`The DAO Factory address is not available for ${DEPLOYMENT_TARGET_CHAIN_ID}`);
  }
  return result as Address;
}

function resolveDaoRegisteredEvent(logs: Log<bigint, number, false>[]) {
  const decodedEvents = [];
  for (const item of logs) {
    try {
      decodedEvents.push(
        decodeEventLog({
          abi: DaoRegistryABI,
          data: item.data,
          // eventName: "DAORegistered",
          topics: item.topics,
          strict: false,
        })
      );
    } catch (err) {
      /* empty */
    }
  }

  // Search for DAORegistered(dao, creator, subdomain)
  const creationEvent = decodedEvents.find((e) => e.eventName === "DAORegistered");
  if (!creationEvent) {
    throw new Error("The DAO couldn't be deployed");
  }

  return {
    daoAddress: (creationEvent.args as any).dao as Address,
    subdomain: (creationEvent.args as any).subdomain as Address,
  };
}

function resolveInstallationAppliedEvent(logs: Log<bigint, number, false>[]) {
  const decodedEvents = [];
  for (const item of logs) {
    try {
      decodedEvents.push(
        decodeEventLog({
          abi: PluginSetupProcessorABI,
          data: item.data,
          // eventName: "InstallationApplied",
          topics: item.topics,
          strict: false,
        })
      );
    } catch (err) {
      /* empty */
    }
  }

  // Search for InstallationApplied(dao, plugin, setupId, appliedSetupId)
  const installEvents = decodedEvents.filter((e) => e.eventName === "InstallationApplied");
  if (installEvents.length !== EXPECTED_PLUGIN_COUNT) {
    throw new Error("The DAO plugins couldn't be installed");
  }

  return installEvents.map((item) => (item.args as any).plugin as Address);
}

// TYPES

type DaoSettings = {
  trustedForwarder: Address;
  daoURI: string;
  subdomain: string;
  metadata: Hex;
};
type PluginSetupRef = {
  versionTag: {
    release: number;
    build: number;
  };
  pluginSetupRepo: Address;
};
type PluginInstallSettings = {
  pluginSetupRef: PluginSetupRef;
  data: Hex;
};
