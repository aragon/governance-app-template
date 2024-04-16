import { Address } from "viem";
import { useState, useEffect } from "react";
import { useBalance, useAccount, useReadContracts } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/lockToVote/artifacts/OptimisticTokenVotingPlugin.sol";
import { PUB_CHAIN, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";

export function useCanCreateProposal() {
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [minProposerVotingPower, setMinProposerVotingPower] = useState<bigint>();
  const [votingToken, setVotingToken] = useState<Address>();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: votingToken,
    chainId: PUB_CHAIN.id,
  });

  const { data: contractReads } = useReadContracts({
    contracts: [
      {
        chainId: PUB_CHAIN.id,
        address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "minProposerVotingPower",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "getVotingToken",
      },
      // TODO: This needs to be checking as well if address has the DAO permission to create props
    ],
  });

  useEffect(() => {
    if (contractReads?.length) {
      setMinProposerVotingPower(contractReads[0]?.result as bigint);

      setVotingToken(contractReads[1]?.result as Address);
    }
  }, [contractReads]);

  useEffect(() => {
    if (balance !== undefined && minProposerVotingPower !== undefined && balance?.value >= minProposerVotingPower)
      setIsCreator(true);
  }, [balance]);

  return isCreator;
}
