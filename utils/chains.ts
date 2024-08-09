import { polygon, mainnet, sepolia, arbitrum, polygonMumbai, darwinia, crab, koi, Chain } from "@wagmi/core/chains";

const chainNames = ["mainnet", "polygon", "sepolia", "mumbai", "arbitrum", "darwinia", "crab", "koi"] as const;
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
    case "crab":
      return crab;
    case "koi":
      return koi;
    default:
      throw new Error("Unknown chain");
  }
}
