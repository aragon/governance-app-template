"use client";

import { useEffect, useCallback, useState } from 'react';
import { useContractRead, usePublicClient } from 'wagmi';
import { getAbiItem, Address } from 'viem'
import { TokenVotingAbi } from '../../../artifacts/TokenVoting.sol';
import { Tally, Action, Proposal, ProposalCreatedLogResponse, ProposalParameters, ProposalMetadata } from '../../../types';
import { useQuery } from 'react-query';
import { fromHex } from 'viem'


const pluginAddress: Address = `0x${process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || ""}`
const ipfsEndpoint = process.env.NEXT_PUBLIC_IPFS_ENDPOINT || "";
const ipfsKey = process.env.NEXT_PUBLIC_IPFS_API_KEY || "";

type ProposalInputs = {
  proposalId: bigint;
}

function getPath(hexedIpfs) {
  const ipfsPath = fromHex(hexedIpfs, 'string')
  const path = ipfsPath.includes('ipfs://') ? ipfsPath.substring(7) : ipfsPath
  return path
}
async function fetchFromIPFS(ipfsPath: string | undefined) {
  if (!ipfsPath) return
  const path = getPath(ipfsPath)
  const response = await fetch(`${ipfsEndpoint}${path}`, {
    method: 'POST',
    headers: {
      'X-API-KEY': ipfsKey,
      'Accept': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json(); // or .text(), .blob(), etc., depending on the data format
}

export default function Proposal(props: ProposalInputs) {
  const publicClient = usePublicClient()
  const [proposal, setProposal] = useState<Proposal>();
  const [proposalLogs, setProposalLogs] = useState<ProposalCreatedLogResponse>();
  const [proposalMetadata, setProposalMetadata] = useState<string>();
  const { data: ipfsResponse, isLoading: ipfsLoading, error } = useQuery<ProposalMetadata, Error>(
    `ipfsData${props.proposalId}`,
    () => fetchFromIPFS(proposalMetadata),
    { enabled: proposalMetadata ? true : false }
  );

  const { isLoading: proposalLoading } = useContractRead({
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
    setProposalMetadata(logs[0].args.metadata);
  }, [proposal]);

  useEffect(() => {
    if (proposal) getProposalLogs();
  }, [proposal]);

  if (proposalLogs) return (
    <div className="">
      <h1>Proposal {props.proposalId.toLocaleString()} - {ipfsResponse && ipfsResponse.title}</h1>
      <p>{ipfsResponse && ipfsResponse.summary}</p>
    </div>
  )
  else return (<></>)
}


