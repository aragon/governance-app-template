import { contracts } from "@aragon/osx-commons-configs";
import {
  ADDRESS_ZERO,
  DEPLOYMENT_DAO_DESCRIPTION,
  DEPLOYMENT_DAO_NAME,
  DEPLOYMENT_ENS_SUBDOMAIN,
  DEPLOYMENT_TARGET_CHAIN_ID,
} from "./constants";
import { Address, Hex, decodeEventLog, toHex } from "viem";
import { publicClient, walletClient } from "../util/client";
import { account } from "../util/account";
import { uploadToIPFS } from "@/utils/ipfs";
import { ABI as DaoFactoryABI } from "../artifacts/dao-factory";
import { ABI as DaoRegistryABI } from "../artifacts/dao-registry";
import { PREPARE_INSTALLATION_ABI as TokenVotingPrepareInstallationAbi } from "../artifacts/token-voting-plugin-setup";
import { PREPARE_INSTALLATION_ABI as DualGovernancePrepareInstallationAbi } from "../artifacts/dual-governance-plugin-setup";
import { ipfsClient } from "../util/ipfs";
import { encodeAbiParameters } from "viem";

export async function deployDao(
  daoToken: Address,
  tokenVotingPluginRepo: Address,
  dualGovernancePluginRepo: Address
): Promise<Address> {
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
    await getDualGovernanceInstallSettings(daoToken, dualGovernancePluginRepo),
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
          abi: DaoRegistryABI,
          data: item.data,
          // eventName: "DAORegistered",
          topics: item.topics,
          strict: false,
        })
      );
    } catch (err) {}
  }

  // Search for DAORegistered(dao, creator, subdomain)
  const creationEvent = decodedEvents.find(
    (e) => e.eventName === "DAORegistered"
  );
  if (!creationEvent) {
    throw new Error("The Dual Governance plugin repo couldn't be created");
  }
  console.log("  - DAO address:", (creationEvent.args as any).dao);
  console.log(
    "  - DAO ENS:",
    (creationEvent.args as any).subdomain + ".dao.eth"
  );

  return (creationEvent.args as any).dao as Address;
}

function pinDaoMetadata() {
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
  const blob = new Blob([JSON.stringify(daoMetadata)], {
    type: "application/json",
  });

  return uploadToIPFS(ipfsClient, blob).then((res) => toHex(res));
}

function getTokenVotingInstallSettings(
  daoToken: Address,
  tokenVotingPluginRepo: Address
): PluginInstallSettings {
  // Encode prepareInstallation(_, data)
  const encodedPrepareInstallationData = encodeAbiParameters(
    TokenVotingPrepareInstallationAbi,
    [
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
    ]
  );

  return {
    data: encodedPrepareInstallationData,
    pluginSetupRef: {
      pluginSetupRepo: tokenVotingPluginRepo,
      versionTag: {
        release: 1,
        build: 1,
      },
    },
  };
}

async function getDualGovernanceInstallSettings(
  daoToken: Address,
  dualGovernancePluginRepo: Address
): Promise<PluginInstallSettings> {
  const encodedPrepareInstallationData = encodeAbiParameters(
    DualGovernancePrepareInstallationAbi,
    [
      {
        minDuration: BigInt(60 * 60 * 24 * 6),
        minProposerVotingPower: BigInt(0),
        minVetoRatio: 200_000,
      },
      { token: daoToken, name: "", symbol: "" },
      { receivers: [], amounts: [] },
      [account.address],
    ]
  );

  return {
    data: encodedPrepareInstallationData,
    pluginSetupRef: {
      pluginSetupRepo: dualGovernancePluginRepo,
      versionTag: {
        release: 1,
        build: 1,
      },
    },
  };
}

function getDaoFactoryAddress(): Address {
  if (!contracts[DEPLOYMENT_TARGET_CHAIN_ID]) {
    throw new Error(
      "The DAO Factory address is not available for " +
        DEPLOYMENT_TARGET_CHAIN_ID
    );
  }

  const result =
    contracts[DEPLOYMENT_TARGET_CHAIN_ID]["v1.3.0"]?.DAOFactory.address;
  if (!result) {
    throw new Error(
      "The DAO Factory address is not available for " +
        DEPLOYMENT_TARGET_CHAIN_ID
    );
  }
  return result as Address;
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
