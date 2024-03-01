import { Address } from "viem";
import { useState, useEffect } from "react";
import { useBalance, useAccount, useReadContracts } from "wagmi";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";

export function useCanCreateProposal() {
  const { address } = useAccount();
  const [minProposerVotingPower, setMinProposerVotingPower] =
    useState<bigint>();
  const [votingToken, setVotingToken] = useState<Address>();
  const { data: balance } = useBalance({
    address,
    token: votingToken,
    chainId: PUB_CHAIN.id,
  });

  const { data: contractReads } = useReadContracts({
    contracts: [
      {
        chainId: PUB_CHAIN.id,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "minProposerVotingPower",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "getVotingToken",
      },
      // TODO: This needs to be checking as well if address has the DAO permission to create props
    ],
  });

  useEffect(() => {
    if (!contractReads?.length || contractReads?.length < 2) return;

    setMinProposerVotingPower(contractReads[0].result as bigint);
    setVotingToken(contractReads[1].result as Address);
  }, [contractReads?.[0]?.status, contractReads?.[1]?.status]);

  if (!address) return false;
  else if (!minProposerVotingPower) return true;
  else if (!balance) return false;
  else if (balance?.value >= minProposerVotingPower) return true;

  return false;
}
