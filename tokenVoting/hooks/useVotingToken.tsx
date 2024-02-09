import { Address } from "viem";
import { useContractRead, useToken } from "wagmi";
import { TokenVotingAbi } from "@/tokenVoting/artifacts/TokenVoting.sol";

const pluginAddress = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address;

export function useVotingToken() {
  const {
    data: tokenAddress,
    isError: error1,
    isLoading: loading1,
  } = useContractRead({
    address: pluginAddress,
    abi: TokenVotingAbi,
    functionName: "getVotingToken",
    watch: false,
  });

  const {
    data: token,
    isError: error2,
    isLoading: loading2,
  } = useToken({ address: tokenAddress as Address });

  return {
    address: tokenAddress,
    token,
    status: {
      isLoading: loading1 || loading2,
      isError: error1 || error2,
    },
  };
}
