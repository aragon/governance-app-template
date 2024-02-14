import { publicClient, walletClient } from "../util/client";
import { ABI, BYTECODE } from "../artifacts/delegate-announcer";
import { account } from "../util/account";

export async function deployContract(): Promise<string> {
  console.log("\nDelegation announcer contract");

  const hash = await walletClient.deployContract({
    abi: ABI,
    account,
    bytecode: BYTECODE,
  });
  console.log("- Waiting for transaction:", hash)

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error("The delegation announcer contract could not be deployed");
  }

  console.log("- Address:", receipt.contractAddress);

  return receipt.contractAddress;
}
