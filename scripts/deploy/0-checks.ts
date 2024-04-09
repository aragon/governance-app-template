import { deploymentPublicClient as publicClient, deploymentWalletClient as walletClient } from "../lib/util/client";

export async function checkDependencies() {
  const [address] = await walletClient.getAddresses();
  if (!address) throw new Error("The wallet account is not connected");

  const balance = await publicClient.getBalance({ address });
  if (balance === BigInt(0)) {
    throw new Error("The wallet account has no balance");
  }

  console.log("Deploying from", address, "\n");
}
