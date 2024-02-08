import { Address } from "viem";
import { useState, useEffect } from "react";
import { PublicClient, useContractRead } from "wagmi";
import { TokenVotingAbi } from "@/tokenVoting/artifacts/TokenVoting.sol";
import { Erc20Abi } from "../artifacts/ERC20.sol";

const pluginAddress = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address;

export function useVotingToken(publicClient: PublicClient) {
  const [tokenSupply, setTokenSupply] = useState(BigInt(0));

  const {
    data: tokenAddress,
    isError,
    isLoading,
  } = useContractRead({
    address: pluginAddress,
    abi: TokenVotingAbi,
    functionName: "getVotingToken",
    watch: false
  });

  useEffect(() => {
    if (!tokenAddress) return;

    publicClient
      .readContract({
        address: tokenAddress as Address,
        abi: Erc20Abi,
        functionName: "totalSupply",
      })
      .then((res: any) => {
        setTokenSupply(res as bigint);
      });
  }, [tokenAddress]);

  return {
    address: tokenAddress,
    supply: tokenSupply,
    status: {
      isLoading,
      isError,
    },
  };
}
