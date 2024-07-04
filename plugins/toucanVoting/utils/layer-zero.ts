import { ChainName } from "@/utils/chains";
import { EndpointId } from "@layerzerolabs/lz-definitions";
import { Options } from "@layerzerolabs/lz-v2-utilities";

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
    default:
      throw new Error("Unknown chain");
  }
}

export const getLzOptions = (gasLimit: bigint) =>
  Options.newOptions().addExecutorLzReceiveOption(gasLimit, 0).toHex().toString() as `0x${string}`;
