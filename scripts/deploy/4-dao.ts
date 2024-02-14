import { contracts } from "@aragon/osx-commons-configs";
import {
  ADDRESS_ZERO,
  DEPLOYMENT_DAO_DESCRIPTION,
  DEPLOYMENT_DAO_NAME,
  DEPLOYMENT_ENS_SUBDOMAIN,
  DEPLOYMENT_TARGET_CHAIN_ID,
} from "./constants";
import { Address, Hex, parseEther, toHex } from "viem";
import { publicClient, walletClient } from "../util/client";
import { account } from "../util/account";
import { uploadToIPFS } from "@/utils/ipfs";
import { ABI as DaoFactoryABI } from "../artifacts/dao-factory";
import { PREPARE_INSTALLATION_ABI as TokenVotingPrepareInstallationAbi } from "../artifacts/token-voting";
import { ipfsClient } from "../util/ipfs";
import { encodeAbiParameters } from "viem";

export async function deployDao(): Promise<string> {
  const daoFactoryAddr = getDaoFactoryAddress();

  console.log("Using the DAO factory at", daoFactoryAddr);

  const daoSettings: DaoSettings = {
    metadata: await pinDaoMetadata(),
    daoURI: "",
    subdomain: DEPLOYMENT_ENS_SUBDOMAIN,
    trustedForwarder: ADDRESS_ZERO,
  };
  const pluginSettings: PluginInstallSettings[] = [
    getTokenVotingInstallSettings(),
    getDualGovernanceInstallSettings(),
  ];

  const { request } = await publicClient.simulateContract({
    address: daoFactoryAddr,
    abi: DaoFactoryABI,
    functionName: "createDao",
    args: [daoSettings, pluginSettings],
    account,
  });
  const hash = await walletClient.writeContract(request);

  console.log("DAO:");
  console.log("- Address:");
  console.log("- ENS:");

  return "";
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

function getTokenVotingInstallSettings(): PluginInstallSettings {
  // prepareInstallation(_, data)
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
        name: "Aragonette DAO Coin",
        symbol: "ADC",
        token: ADDRESS_ZERO,
      },
      {
        amounts: [parseEther("1000")],
        receivers: [account.address],
      },
    ]
  );

  return {
    data: encodedPrepareInstallationData,
    pluginSetupRef: {
      pluginSetupRepo: getTokenVotingPluginRepoAddress(),
      versionTag: {
        release: 1,
        build: 1,
      },
    },
  };
}

function getDualGovernanceInstallSettings(): PluginInstallSettings {
  return {
    data: "",
    pluginSetupRef: {
      pluginSetupRepo: "",
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

function getTokenVotingPluginRepoAddress(): Address {
  if (!contracts[DEPLOYMENT_TARGET_CHAIN_ID]) {
    throw new Error(
      "The DAO Factory address is not available for " +
        DEPLOYMENT_TARGET_CHAIN_ID
    );
  }

  const result =
    contracts[DEPLOYMENT_TARGET_CHAIN_ID]["v1.3.0"]?.TokenVotingRepoProxy
      .address;
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
