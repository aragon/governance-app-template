import { polygon, mainnet, sepolia, goerli, Chain } from "@wagmi/core/chains";

const chainNames = ["mainnet", "polygon", "sepolia", "goerli"] as const;
export type ChainName = (typeof chainNames)[number];

export function getChain(chainName: ChainName): Chain {
  switch (chainName) {
    case "mainnet":
      return mainnet;
    case "polygon":
      return polygon;
    case "sepolia":
      return sepolia;
    case "goerli":
      return goerli;
    default:
      throw new Error("Unknown chain");
  }
}
