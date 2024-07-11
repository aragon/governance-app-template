import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { PUB_CHAIN, PUB_L2_CHAIN, PUB_TOKEN_L1_ADDRESS, PUB_TOKEN_L2_ADDRESS } from "@/constants";

export function useVotingToken() {
  const {
    data: tokenSupply,
    isError: isError1,
    isLoading: isLoading1,
    error: error1,
  } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOKEN_L1_ADDRESS,
    abi: erc20Abi,
    functionName: "totalSupply",
  });

  const {
    data: tokenSymbol,
    isError: isError2,
    isLoading: isLoading2,
    error: error2,
  } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOKEN_L1_ADDRESS,
    abi: erc20Abi,
    functionName: "symbol",
  });

  return {
    address: PUB_TOKEN_L1_ADDRESS,
    tokenSupply,
    symbol: tokenSymbol,
    status: {
      isLoading: isLoading1 || isLoading2,
      isError: isError1 || isError2,
    },
  };
}

export function useVotingTokenL2Balance() {
  const { address, isConnected } = useAccount();

  const {
    data: balance,
    error,
    isError,
    isLoading,
    queryKey,
  } = useReadContract({
    address: PUB_TOKEN_L2_ADDRESS,
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

export function useVotingTokenBalance() {
  const { address, isConnected } = useAccount();

  const {
    data: balance,
    error,
    isError,
    isLoading,
    queryKey,
  } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_TOKEN_L1_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address ?? "0x"],
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
