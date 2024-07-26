import { polygon, mainnet, sepolia, arbitrum, polygonMumbai, darwinia, Chain } from "@wagmi/core/chains";

const chainNames = ["mainnet", "polygon", "sepolia", "mumbai", "arbitrum", "darwinia"] as const;
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
    case "mumbai":
      return polygonMumbai;
    case "darwinia":
      return darwinia;
    default:
      throw new Error("Unknown chain");
  }
}
