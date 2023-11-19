"use client";

import { useEffect, useCallback, useState } from 'react';
import { useContractRead, usePublicClient } from 'wagmi';
import { getAbiItem, Address } from 'viem'
import { TokenVotingAbi } from '../../../artifacts/TokenVoting.sol';
import { Tally, Action, Proposal, ProposalCreatedLogResponse, ProposalParameters } from '../../../types';

const pluginAddress: Address = `0x${process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || ""}`

type ProposalInputs = {
  proposalId: bigint;
}

export default function Proposal(props: ProposalInputs) {
  const publicClient = usePublicClient()
  const [proposal, setProposal] = useState<Proposal>();
  const [proposalLogs, setProposalLogs] = useState<ProposalCreatedLogResponse>();

  const { isLoading } = useContractRead({
    address: pluginAddress,
    abi: TokenVotingAbi,
    functionName: 'getProposal',
    args: [props.proposalId],
    onSuccess(data) {
      setProposal({
        open: (data as Array<boolean>)[0],
        executed: (data as Array<boolean>)[1],
        parameters: (data as Array<ProposalParameters>)[2],
        tally: (data as Array<Tally>)[3],
        actions: (data as Array<Array<Action>>)[4],
        allowFailureMap: (data as Array<bigint>)[5],
      } as Proposal)
    }
  })

  const getProposalLogs = useCallback(async () => {
    if (!proposal) return
    const event = getAbiItem({ abi: TokenVotingAbi, name: 'ProposalCreated' })

    const logs: ProposalCreatedLogResponse[] = await publicClient.getLogs({
      address: pluginAddress,
      event,
      args: {
        proposalId: props.proposalId,
      } as any,
      fromBlock: (proposal as Proposal).parameters.snapshotBlock,
      toBlock: (proposal as Proposal).parameters.startDate,
    });
    setProposalLogs(logs[0]);
  }, [proposal]);

  useEffect(() => {
    if (proposal) getProposalLogs();
  }, [proposal]);

  if (proposalLogs) return (
    <div className="">
      <h1>Proposal {props.proposalId.toLocaleString()}</h1>
      {proposalLogs?.args.metadata}
    </div>
  )
  else return (<></>)
}


