import { Action } from "@/utils/types";
import { Proposal } from "@/plugins/dualGovernance/utils/types";
import { whatsabi } from "@shazow/whatsabi";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { Address, decodeFunctionData } from "viem";
import { Else, If, IfCase, IfNot, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { AddressText } from "@/components/text/address";
import { isAddress } from "@/utils/evm";
import * as DOMPurify from "dompurify";
import { PUB_CHAIN, PUB_ETHERSCAN_API_KEY } from "@/constants";

const DEFAULT_PROPOSAL_SUMMARY = "(No description available)";

type FunctionData = {
  args: readonly unknown[] | undefined;
  functionName: string;
  to: Address;
};

export default function ProposalDescription(proposal: Proposal) {
  const publicClient = usePublicClient({ chainId: PUB_CHAIN.id });
  const [decodedActions, setDecodedActions] = useState<FunctionData[]>([]);
  const proposalActions = proposal?.actions || [];

  const getFunctionData = async (action: Action) => {
    const abiLoader = new whatsabi.loaders.EtherscanABILoader({
      apiKey: PUB_ETHERSCAN_API_KEY,
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
      proposalActions.map(async (action) => {
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
  }, [proposal]);

  useEffect(() => {
    fetchActionData();
  }, [proposal.actions]);

  return (
    <div className="pt-2">
      <div
        className="pb-6"
        dangerouslySetInnerHTML={{
          __html: proposal.summary
            ? DOMPurify.sanitize(proposal.summary)
            : DEFAULT_PROPOSAL_SUMMARY,
        }}
      />
      <h2 className="flex-grow text-2xl text-neutral-900 font-semibold pt-10 pb-3">
        Actions
      </h2>
      <div className="flex flex-row space-between">
        <IfNot condition={proposalActions.length}>
          <p className="pt-2">The proposal has no actions</p>
        </IfNot>
        <If condition={proposalActions.length && !decodedActions?.length}>
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
          {action?.args?.length &&
            action?.args?.map((arg: any, j: number) => (
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
