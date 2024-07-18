import {
  PUB_L2_CHAIN,
  PUB_MINTABLE_TOKEN_ADDRESS,
  PUB_PAYMASTER_ADDRESS,
  PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
  PUB_WEB3_ENDPOINT_L2,
} from "@/constants";
import { Button, Card, Heading, Spinner } from "@aragon/ods";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Address,
  TransactionReceipt,
  WriteContractParameters,
  createPublicClient,
  createWalletClient,
  custom,
  erc20Abi,
  formatEther,
  http,
} from "viem";
import { eip712WalletActions, getGeneralPaymasterInput } from "viem/zksync";
import { useAccount, useReadContract, useSwitchChain } from "wagmi";
import { useForceL2Chain } from "../../hooks/useForceChain";
import { MintableABI } from "../../artifacts/MintableERC20";
import { AlertContextProps, useAlerts } from "@/context/Alerts";
import { ToucanRelayAbi } from "../../artifacts/ToucanRelay.sol";
import { Tally } from "../../utils/types";

export function useMintableTokenBalance() {
  const { address, isConnected } = useAccount();

  const {
    data: balance,
    error,
    isError,
    isLoading,
    queryKey,
  } = useReadContract({
    address: PUB_MINTABLE_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address ?? "0x"],
    chainId: PUB_L2_CHAIN.id,
    query: { enabled: isConnected && !!address },
  });

  return {
    balance,
    status: {
      error,
      isLoading,
      isError,
    },
    queryKey,
  };
}

function handleErr(err: unknown, setError: (err: string) => void, setIsErr: (err: boolean) => void) {
  const castedErr = err as Error;
  setIsErr(true);
  if ("message" in castedErr) setError(castedErr.message);
  else setError("An unknown error occurred");
  console.error(err);
}

type ZkSyncWriteContractArgs = WriteContractParameters & {
  paymaster?: Address;
  paymasterInput?: string;
};

export function usePaymasterTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const { addAlert } = useAlerts() as AlertContextProps;
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const timeoutSeconds = 30;
  const pollRetriesRef = useRef(0);
  const { switchChainAsync } = useSwitchChain();

  const writeContract = useCallback(
    async (proposalRef: bigint, votingTally: Tally) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      setIsSuccess(false);
      setIsSubmitted(false);

      try {
        const [account] = await window.ethereum?.request({ method: "eth_requestAccounts" });
        if (!account) {
          throw new Error("Could not retrieve account");
        }

        await switchChainAsync({ chainId: PUB_L2_CHAIN.id });

        // define the wallet client with the signature extensions
        const walletClient = createWalletClient({
          account,
          chain: PUB_L2_CHAIN,
          transport: custom(window.ethereum),
        }).extend(eip712WalletActions());

        // for now we only support general paymaster (only ETH)
        const paymasterInput = getGeneralPaymasterInput({
          innerInput: "0x",
        });

        const txHash = await walletClient.writeContract({
          account,
          address: PUB_TOUCAN_VOTING_PLUGIN_L2_ADDRESS,
          abi: ToucanRelayAbi,
          functionName: "vote",
          args: [proposalRef, votingTally],
          chain: PUB_L2_CHAIN,
          paymaster: PUB_PAYMASTER_ADDRESS,
          paymasterInput,
        } as ZkSyncWriteContractArgs);
        setTxHash(txHash);
        setIsSubmitted(true);
        pollTx(txHash);
      } catch (err: unknown) {
        handleErr(err, setError, setIsError);
        setIsLoading(false);
      }
    },
    [PUB_L2_CHAIN]
  );

  async function pollTx(txHash: `0x${string}`) {
    const intervalId = setInterval(async () => {
      try {
        const publicClient = createPublicClient({
          chain: PUB_L2_CHAIN,
          transport: http(PUB_WEB3_ENDPOINT_L2),
        });
        let receipt: TransactionReceipt | null = null;
        try {
          receipt = await publicClient.getTransactionReceipt({ hash: txHash });
        } catch (err) {
          console.log({ err });
        }
        if (receipt) {
          setIsSuccess(receipt.status === "success");
          setIsLoading(false);
          clearInterval(intervalId);
        }
      } catch (err) {
        handleErr(err, setError, setIsError);
        setIsLoading(false);
        clearInterval(intervalId);
      } finally {
        pollRetriesRef.current++;
        if (pollRetriesRef.current > timeoutSeconds) {
          clearInterval(intervalId);
          setIsError(true);
          setIsLoading(false);
          setError(`Transaction timed out after ${timeoutSeconds} seconds`);
        }
      }
    }, 1000); // Poll every 1 seconds

    return () => clearInterval(intervalId);
  }

  useEffect(() => {
    if (isError) {
      if (error?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
          type: "error",
        });
        return;
      } else {
        addAlert("An error occurred while Voting", {
          type: "error",
          timeout: 4 * 1000,
        });
        return;
      }
    }

    if (isSuccess) {
      addAlert("Vote Cast successfully", {
        type: "success",
        timeout: 4 * 1000,
        txHash: txHash ?? "",
      });
      return;
    }

    if (isSubmitted) {
      addAlert("Voting for free via the paymaster", {
        timeout: 4 * 1000,
      });
      return;
    }
  }, [isLoading, isSuccess, isError, txHash, isSubmitted]);

  return {
    writeContract,
    isLoading,
    isSuccess,
    txHash,
    isSubmitted,
    isError,
    error,
  };
}

export default function SponsoredMint() {
  const queryClient = useQueryClient();
  const { address } = useAccount();
  const { balance, queryKey } = useMintableTokenBalance();
  const {
    writeContract: mint,
    isLoading: isMinting,
    isSuccess,
    isError,
    error,
    isSubmitted,
  } = usePaymasterTransaction();

  const disabled = !address || isMinting;

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [isSuccess]);

  return (
    <Card className="flex flex-col gap-y-4 p-6 shadow-neutral-md">
      <Heading>Mint Tokens for free</Heading>
      <p>Mint some tokens using ZkSync Paymasters!</p>
      <p>Your Balance is {formatEther(balance ?? 0n) ?? "0"}</p>
      {isError && <p>{error}</p>}
      <Button disabled={disabled} onClick={mint}>
        {isMinting ? <Spinner /> : "Mint"}
      </Button>
    </Card>
  );
}
