import { Address, BaseError, ContractFunctionRevertedError, Hex, PublicClient, keccak256, parseAbi, toHex } from "viem";
import { PUB_CHAIN } from "@/constants";

const proxyAbi = parseAbi([
  "function implementation() external view returns (address)",
  "function proxiableUUID() external view returns (bytes32)",
]);
const STORAGE_SLOTS = [
  toEip1967Hash("eip1967.proxy.implementation"),
  toFallbackEip1967Hash("org.zeppelinos.proxy.implementation"),
];

export function isProxyContract(publicClient: PublicClient, contractAddress: Address) {
  return publicClient
    .simulateContract({
      address: contractAddress,
      abi: proxyAbi,
      functionName: "implementation",
      args: [],
      chain: PUB_CHAIN,
    })
    .then(() => true)
    .catch((e: any) => {
      if (!(e instanceof BaseError)) return false;
      else if (!(e.cause instanceof ContractFunctionRevertedError)) return false;
      return true;
    });
}

export async function getImplementation(publicClient: PublicClient, proxyAddress: Address): Promise<Address> {
  for (const slot of STORAGE_SLOTS) {
    const res = await publicClient.getStorageAt({
      address: proxyAddress,
      slot: slot as Hex,
    });

    if (!res) continue;
    return ("0x" + res.replace(/^0x000000000000000000000000/, "")) as Address;
  }
  throw new Error("The contract does not appear to be a proxy");
}

// Helpers

function toEip1967Hash(label: string): string {
  const hash = keccak256(toHex(label));
  const bigNumber = BigInt(hash) - BigInt(1);
  let hexResult = bigNumber.toString(16);
  if (hexResult.length < 64) {
    hexResult = "0".repeat(64 - hexResult.length) + hexResult;
  }
  return "0x" + hexResult;
}

function toFallbackEip1967Hash(label: string): string {
  return keccak256(toHex(label));
}
