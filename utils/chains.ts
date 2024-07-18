import {
  polygon,
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  polygonMumbai,
  Chain,
  optimismSepolia,
  zkSync,
  zkSyncSepoliaTestnet,
} from "@wagmi/core/chains";

const chainNames = [
  "mainnet",
  "polygon",
  "sepolia",
  "mumbai",
  "arbitrum",
  "arbitrumSepolia",
  "optimismSepolia",
  "zkSync",
  "zkSyncSepolia",
] as const;
export type ChainName = (typeof chainNames)[number];

export function readableChainName(chainName: ChainName): string {
  switch (chainName) {
    case "mainnet":
      return "Ethereum";
    case "polygon":
      return "Polygon";
    case "sepolia":
      return "Sepolia";
    case "mumbai":
      return "Polygon Mumbai";
    case "arbitrum":
      return "Arbitrum One";
    case "arbitrumSepolia":
      return "Arbitrum Sepolia";
    case "optimismSepolia":
      return "Optimism Sepolia";
    case "zkSync":
      return "ZkSync Era";
    case "zkSyncSepolia":
      return "ZkSync Sepolia";
    default:
      throw new Error("Unknown chain");
  }
}

// as const prevents using includes check
const testnets = ["sepolia", "mumbai", "arbitrumSepolia", "optimismSepolia"];

export function getChain(chainName: ChainName): Chain {
  switch (chainName) {
    case "mainnet":
      return mainnet;
    case "polygon":
      return polygon;
    case "arbitrum":
      return arbitrum;
    case "sepolia":
      return sepolia;
    case "arbitrumSepolia":
      return arbitrumSepolia;
    case "mumbai":
      return polygonMumbai;
    case "optimismSepolia":
      return optimismSepolia;
    case "zkSync":
      return zkSync;
    case "zkSyncSepolia":
      return zkSyncSepoliaTestnet;
    default:
      throw new Error("Unknown chain");
  }
}

export const isTestnet = (chainName: ChainName) => testnets.includes(chainName);
