import { deploymentPublicClient as publicClient, deploymentWalletClient as walletClient } from "../lib/util/client";
import { deploymentAccount as account } from "../lib/util/account";
import { ABI, BYTECODE } from "../lib/artifacts/delegate-announcer";
import { Address } from "viem";

export async function deployContract(): Promise<Address> {
  console.log("\nDelegation announcer contract");

  const hash = await walletClient.deployContract({
    abi: ABI,
    account,
    bytecode: BYTECODE,
  });
  console.log("- Waiting for transaction (" + hash + ")");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error("The delegation announcer contract could not be deployed");
  }

  console.log("- Address:", receipt.contractAddress);

  return receipt.contractAddress;
}
