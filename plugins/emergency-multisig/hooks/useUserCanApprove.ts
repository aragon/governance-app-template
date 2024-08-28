import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { useEffect } from "react";
import { PUB_CHAIN, PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS } from "@/constants";
import { EmergencyMultisigPluginAbi } from "../artifacts/EmergencyMultisigPlugin";

export function useUserCanApprove(proposalId: string | bigint | number) {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: canApprove, refetch } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: PUB_EMERGENCY_MULTISIG_PLUGIN_ADDRESS,
    abi: EmergencyMultisigPluginAbi,
    functionName: "canApprove",
    args: [BigInt(proposalId), address!],
    query: {
      enabled: !!address,
    },
  });

  useEffect(() => {
    if (Number(blockNumber) % 2 === 0) {
      refetch();
    }
  }, [blockNumber]);

  return { canApprove, refetch };
}
