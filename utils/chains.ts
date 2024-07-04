import { polygon, mainnet, sepolia, arbitrum, arbitrumSepolia, polygonMumbai, Chain } from "@wagmi/core/chains";

const chainNames = ["mainnet", "polygon", "sepolia", "mumbai", "arbitrum", "arbitrumSepolia"] as const;
export type ChainName = (typeof chainNames)[number];

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
    default:
      throw new Error("Unknown chain");
  }
}
