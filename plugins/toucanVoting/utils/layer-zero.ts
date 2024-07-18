import { ChainName } from "@/utils/chains";
import { Chain, EndpointId } from "@layerzerolabs/lz-definitions";
import { Options, hexZeroPadTo32 } from "@layerzerolabs/lz-v2-utilities";
import { Address, zeroAddress } from "viem";

// double check these against the layer zero docs - trust me.
export function getEid(chainName: ChainName): EndpointId {
  switch (chainName) {
    case "mainnet":
      return EndpointId.ETHEREUM_V2_MAINNET;
    case "polygon":
      return EndpointId.POLYGON_V2_MAINNET;
    case "arbitrum":
      return EndpointId.ARBITRUM_V2_MAINNET;
    case "sepolia":
      return EndpointId.SEPOLIA_V2_TESTNET;
    case "arbitrumSepolia":
      return EndpointId.ARBSEP_V2_TESTNET;
    case "mumbai":
      // this is still mumbai not amoy according to docs
      return EndpointId.POLYGON_V2_TESTNET;
    case "optimismSepolia":
      return EndpointId.OPTSEP_V2_TESTNET;
    case "zkSync":
      return EndpointId.ZKSYNC_V2_MAINNET;
    // wont work tho
    case "zkSyncSepolia":
      return EndpointId.ZKSYNCSEP_V2_TESTNET;
    default:
      throw new Error("Unknown chain");
  }
}

export const getLzOptions = (gasLimit: bigint) =>
  Options.newOptions().addExecutorLzReceiveOption(gasLimit, 0).toHex().toString() as `0x${string}`;

export const hexPadAddress = (address: string | undefined) => hexZeroPadTo32(address ?? zeroAddress) as `0x${string}`;

export type MessagingReceipt = {
  guid: string;
  nonce: number;
  fee: MessagingFee;
};

export type MessagingFee = {
  nativeFee: bigint;
  lzTokenFee: bigint;
};

const CROSS_CHAIN_TRANSACTIONS = ["BRIDGE_OFT", "DISPATCH_VOTES", "RELAY_ACTIONS"] as const;

export type CROSS_CHAIN_TRANSACTION = (typeof CROSS_CHAIN_TRANSACTIONS)[number];

type CrossChainGas = {
  [k in ChainName]+?: {
    [v in CROSS_CHAIN_TRANSACTION]+?: number;
  };
};

// private: use the getter below
const CROSS_CHAIN_GAS_DEFAULTS: CrossChainGas = {
  ["optimismSepolia"]: {
    BRIDGE_OFT: 250_000,
    DISPATCH_VOTES: 250_000,
  },
  ["arbitrumSepolia"]: {
    BRIDGE_OFT: 250_000,
    RELAY_ACTIONS: 250_000,
  },
  ["arbitrum"]: {
    BRIDGE_OFT: 250_000,
    RELAY_ACTIONS: 250_000,
  },
  ["zkSync"]: {
    BRIDGE_OFT: 250_000,
    DISPATCH_VOTES: 250_000,
  },
};

export function getGasForCrossChainOperation(chainName: ChainName, operation: CROSS_CHAIN_TRANSACTION): bigint {
  const chain = CROSS_CHAIN_GAS_DEFAULTS[chainName];
  if (!chain) {
    throw new Error(`Chain ${chainName} not configured for crosschain`);
  }

  const gas = chain[operation];
  if (!gas) {
    throw new Error(`Operation ${operation} not configured for chain ${chainName}`);
  }

  return BigInt(gas);
}

export type OFTBridgeConfig = {
  address: Address;
  chainName: ChainName;
  gasLimit: bigint;
  dstEid: number;
};
