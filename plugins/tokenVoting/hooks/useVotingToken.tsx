import { Address, erc20Abi } from "viem";
import { useReadContract } from "wagmi";

import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";

const pluginAddress = (process.env.NEXT_PUBLIC_TOKEN_VOTING_PLUGIN_ADDRESS || "") as Address;

export function useVotingToken() {
  const {
    data: tokenAddress,
    isError: error1,
    isLoading: loading1,
  } = useReadContract({
    address: pluginAddress,
    abi: TokenVotingAbi,
    functionName: "getVotingToken",
  });

  const {
    data: tokenSupply,
    isError: error2,
    isLoading: loading2,
  } = useReadContract({ 
    address: tokenAddress as Address,
    abi: erc20Abi,
    functionName: 'totalSupply'
  });

  return {
    address: tokenAddress,
    tokenSupply,
    status: {
      isLoading: loading1 || loading2,
      isError: error1 || error2,
    },
  };
}
