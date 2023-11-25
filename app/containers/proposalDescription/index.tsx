import { Action, Proposal } from "@/utils/types"
import { whatsabi } from "@shazow/whatsabi";
import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { Address, decodeFunctionData } from 'viem'
import { formatAddress } from "@/utils/addressHelper";


type FunctionData = {
  args: readonly unknown[] | undefined;
  functionName: string;
  to: Address;
}

const etherscanKey: string = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "";

export default function ProposalDescription(proposal: Proposal) {
  const publicClient = usePublicClient()
  const [decodedActions, setDecodedActions] = useState<FunctionData[]>([])

  const getFunctionData = async (action: Action) => {
    const abiLoader = new whatsabi.loaders.EtherscanABILoader({apiKey: etherscanKey});

    const { abi } = await whatsabi.autoload(action.to, {
      provider: publicClient,
      abiLoader,
      followProxies: true,
    });

    return decodeFunctionData({
      abi,
      data: action.data as Address
    })
  } 

  const fetchActionData = useCallback(async () => {
    var decodedActions = await Promise.all(proposal.actions.map(async (action) => {
      const functionData = await getFunctionData(action)
      return {...functionData, to: action.to} as FunctionData
    }))
    setDecodedActions(decodedActions)
  }, [])

  useEffect(() => {
    fetchActionData()
  }, [])


  return (
    <div className="pt-2">
      <p className="pb-6">{proposal?.summary}</p>
      <h2 className="flex-grow text-2xl text-neutral-900 font-semibold pt-10">To execute</h2>
      <div className="flex flex-row space-between">
        {!proposal.actions.length && <span className="pt-2">No actions in this proposal</span>}
        {decodedActions?.length >= 0 && decodedActions.map((action, i) => (
          <div key={`${i}-${action.to}-${action.functionName}`}>
            <p>{i} - <span className="text-primary-500 underline">{formatAddress(action.to)}</span>.{action.functionName}(</p>
            <div className="pl-4">
              {
                action?.args?.map((arg: any, j: number) => (
                  <div key={`arg-${j}`}>
                    <p>{arg.toString()},</p>
                  </div>
                ))
              }
          </div>
            <p>){}</p>
          </div>
        ))
        }
      </div>
    </div>
  )
}
