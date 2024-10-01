import { useState, useEffect } from "react";
import { Address, Hex, getAbiItem } from "viem";
import { MultisigPluginAbi } from "../artifacts/MultisigPlugin.sol";
import { usePublicClient } from "wagmi";
import { PUB_MULTISIG_PLUGIN_ADDRESS } from "@/constants";

type ProposalCreatedEventArguments = {
  proposalId?: bigint | undefined;
  creator?: Address | undefined;
  startDate?: bigint | undefined;
  endDate?: bigint | undefined;
  metadata?: Hex | undefined;
  actions?:
    | readonly {
        to: Address;
        value: bigint;
        data: Hex;
      }[]
    | undefined;
  allowFailureMap?: bigint | undefined;
};

const event = getAbiItem({ abi: MultisigPluginAbi, name: "ProposalCreated" });

export function useProposalCreatedLogs(proposalId: string) {
  const publicClient = usePublicClient();
  const [creationLog, setCreationLog] = useState<ProposalCreatedEventArguments>();

  useEffect(() => {
    if (!publicClient || proposalId === undefined) return;

    publicClient
      .getLogs({
        address: PUB_MULTISIG_PLUGIN_ADDRESS,
        event,
        args: {
          proposalId: BigInt(proposalId),
        },
        fromBlock: BigInt(0),
        toBlock: "latest",
      })
      .then((logs) => {
        if (!logs.length) return;

        setCreationLog(logs[0].args);
      });
  }, [proposalId, !!publicClient]);

  return creationLog;
}
