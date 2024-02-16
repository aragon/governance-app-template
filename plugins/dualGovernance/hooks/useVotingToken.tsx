import { Address, erc20Abi } from "viem";
import { useReadContract } from "wagmi";

import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";

const pluginAddress = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address;

export function useVotingToken() {
  const {
    data: tokenAddress,
    isError: error1,
    isLoading: loading1,
  } = useReadContract({
    address: pluginAddress,
    abi: OptimisticTokenVotingPluginAbi,
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
