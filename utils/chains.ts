import {
  polygon,
  mainnet,
  sepolia,
  arbitrum,
  arbitrumSepolia,
  polygonMumbai,
  Chain,
  optimismSepolia,
} from "@wagmi/core/chains";

const chainNames = [
  "mainnet",
  "polygon",
  "sepolia",
  "mumbai",
  "arbitrum",
  "arbitrumSepolia",
  "optimismSepolia",
] as const;
export type ChainName = (typeof chainNames)[number];

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
    default:
      throw new Error("Unknown chain");
  }
}

export const isTestnet = (chainName: ChainName) => testnets.includes(chainName);
