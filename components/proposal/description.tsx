import { Action, Proposal } from "@/utils/types";
import { whatsabi } from "@shazow/whatsabi";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { Address, decodeFunctionData } from "viem";
import { Else, If, IfCase, IfNot, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { AddressText } from "@/components/text/address";

type FunctionData = {
  args: readonly unknown[] | undefined;
  functionName: string;
  to: Address;
};

const etherscanKey: string = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || "";

const isAddress = (maybeAddress: any) => {
  if (!maybeAddress || typeof maybeAddress !== "string") return false;
  else if (!maybeAddress.match(/^0x[0-9a-fA-F]{40}$/)) return false;
  return true;
};

export default function ProposalDescription(proposal: Proposal) {
  const publicClient = usePublicClient();
  const [decodedActions, setDecodedActions] = useState<FunctionData[]>([]);

  const getFunctionData = async (action: Action) => {
    console.log("Data: ", action.data)
    const abiLoader = new whatsabi.loaders.EtherscanABILoader({
      apiKey: etherscanKey,
    });

    const { abi } = await whatsabi.autoload(action.to, {
      provider: publicClient,
      abiLoader,
      followProxies: true,
    });

    return decodeFunctionData({
      abi,
      data: action.data as Address,
    });
  };

  const fetchActionData = useCallback(async () => {
    const decodedActions = await Promise.all(
      proposal.actions.map(async (action) => {
        let functionData: any;
        if (action.data != "0x") {
          functionData = await getFunctionData(action);
        } else {
          functionData = { functionName: "transfer", args: [action.value] };
        }
        return { ...functionData, to: action.to } as FunctionData;
      })
    );
    setDecodedActions(decodedActions);
  }, []);

  useEffect(() => {
    fetchActionData();
  }, []);

  return (
    <div className="pt-2">
      <p className="pb-6">{proposal?.summary}</p>
      <h2 className="flex-grow text-2xl text-neutral-900 font-semibold pt-10 pb-3">
        Actions
      </h2>
      <div className="flex flex-row space-between">
        <IfNot condition={proposal.actions.length}>
          <p className="pt-2">The proposal has no actions</p>
        </IfNot>
        <If condition={proposal.actions.length && !decodedActions?.length}>
          <PleaseWaitSpinner />
        </If>
        {decodedActions?.map?.((action, i) => (
          <ActionCard
            key={`${i}-${action.to}-${action.functionName}`}
            action={action}
            idx={i}
          />
        ))}
      </div>
    </div>
  );
}

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="p-4 lg:p-6 w-full flex flex-col space-y-6
    box-border border border-neutral-100
    focus:outline-none focus:ring focus:ring-primary
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};

const ActionCard = function ({
  action,
  idx,
}: {
  action: FunctionData;
  idx: number;
}) {
  return (
    <Card>
      <div className="flex flex-row space-between">
        <div className="">
          <h3>Target contract</h3>
          <p>
            <AddressText>{action.to}</AddressText>
          </p>
        </div>
        <div className="w-7 h-7 text-center border border-primary-600 text-primary-500 rounded-lg ml-auto">
          {idx + 1}
        </div>
      </div>

      <div>
        <h3>Function name</h3>
        <p>
          <code>{action.functionName}</code>
        </p>
      </div>

      <div>
        <h3>Parameters</h3>
        <ul className="list-disc pl-4">
          {action?.args?.length && action?.args?.map((arg: any, j: number) => (
            <li key={`arg-${j}`}>
              <IfCase condition={isAddress(arg)}>
                <Then>
                  <AddressText>{arg.toString()}</AddressText>
                </Then>
                <Else>
                  <code>{arg.toString()}</code>
                </Else>
              </IfCase>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
