import { deploymentPublicClient as publicClient, deploymentWalletClient as walletClient } from "../lib/util/client";
import { deploymentAccount as account } from "../lib/util/account";
import { ABI as GovernanceErc20ABI, BYTECODE as GovernanceErc20Bytecode } from "../lib/artifacts/governance-erc20";
import {
  ABI as GovernanceWrappedErc20ABI,
  BYTECODE as GovernanceWrappedErc20Bytecode,
} from "../lib/artifacts/governance-wrapped-erc20";
import { Address } from "viem";
import {
  ADDRESS_ZERO,
  DEPLOYMENT_TOKEN_AMOUNTS,
  DEPLOYMENT_TOKEN_NAME,
  DEPLOYMENT_TOKEN_RECEIVERS,
  DEPLOYMENT_TOKEN_SYMBOL,
} from "./priv-constants";

export async function deployTokenContracts() {
  const daoToken = await deployGovernanceErc20Token();
  const governanceErc20Base = await deployGovernanceErc20Base();
  const governanceWrappedErc20Base = await deployGovernanceWrappedErc20Base();

  return { daoToken, governanceErc20Base, governanceWrappedErc20Base };
}

async function deployGovernanceErc20Token(): Promise<Address> {
  console.log("- Deploying the DAO's token (GovernanceERC20)");
  const hash = await walletClient.deployContract({
    abi: GovernanceErc20ABI,
    account,
    bytecode: GovernanceErc20Bytecode,
    args: [
      ADDRESS_ZERO,
      DEPLOYMENT_TOKEN_NAME,
      DEPLOYMENT_TOKEN_SYMBOL,
      {
        receivers: DEPLOYMENT_TOKEN_RECEIVERS,
        amounts: DEPLOYMENT_TOKEN_AMOUNTS,
      },
    ],
  });
  console.log("  - Waiting for transaction (" + hash + ")");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error("The ERC20 token could not be deployed");
  }
  console.log("  - ERC20 token:", receipt.contractAddress);

  return receipt.contractAddress;
}

async function deployGovernanceErc20Base(): Promise<Address> {
  console.log("- Deploying GovernanceErc20 (base implementation)");

  const hash = await walletClient.deployContract({
    abi: GovernanceErc20ABI,
    account,
    bytecode: GovernanceErc20Bytecode,
    args: [ADDRESS_ZERO, "", "", { amounts: [], receivers: [] }],
  });
  console.log("  - Waiting for transaction (" + hash + ")");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error("The base contract for GovernanceErc20 could not be deployed");
  }
  console.log("  - GovernanceErc20:", receipt.contractAddress);

  return receipt.contractAddress;
}

async function deployGovernanceWrappedErc20Base(): Promise<Address> {
  console.log("- Deploying GovernanceWrappedErc20 (base implementation)");

  const hash = await walletClient.deployContract({
    abi: GovernanceWrappedErc20ABI,
    account,
    bytecode: GovernanceWrappedErc20Bytecode,
    args: [ADDRESS_ZERO, "", ""],
  });
  console.log("  - Waiting for transaction (" + hash + ")");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error("The base contract for GovernanceWrappedErc20 could not be deployed");
  }
  console.log("  - GovernanceWrappedErc20:", receipt.contractAddress);

  return receipt.contractAddress;
}
