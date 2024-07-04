import { useQueryClient } from "@tanstack/react-query";
import { useVotingTokenBalance, useVotingTokenL2Balance } from "../../hooks/useVotingToken";
import { useEffect, useState } from "react";
import { useBridge, useBridgeQuote } from "../../hooks/useBridge";
import { useAllowance, useApproveTokens } from "../../hooks/useApproveTokens";
import { PUB_CHAIN_NAME, PUB_OFT_ADAPTER_ADDRESSS, PUB_TOKEN_L1_ADDRESS } from "@/constants";
import { useCrossChainTransaction } from "../../hooks/useCrossChainTransactions";
import { formatEther, parseEther } from "viem";
import { Button, Card, Heading, InputNumber } from "@aragon/ods";
import { Else, If, Then } from "@/components/if";
import Link from "next/link";

function isNumeric(value: string): boolean {
  if (!value) return true;
  return !!value.match(/^[0-9]+$/);
}

export default function Bridge() {
  const queryClient = useQueryClient();

  const { balance, status } = useVotingTokenBalance();
  const [tokensToSend, setTokensToSend] = useState("0");
  const { balance: l2Balance, status: l2Status } = useVotingTokenL2Balance();
  const { quote, status: quoteStatus } = useBridgeQuote(BigInt(tokensToSend));
  const { bridgeTokens, bridgingStatus, bridgeTxHash } = useBridge();
  const { approveTokens, approveStatus, isConfirmed } = useApproveTokens(PUB_TOKEN_L1_ADDRESS);
  const { allowance, queryKey } = useAllowance(PUB_TOKEN_L1_ADDRESS, PUB_OFT_ADAPTER_ADDRESSS);

  const [isAllowanceEnough, setIsAllowanceEnough] = useState(false);
  const { scanUrl, message } = useCrossChainTransaction(bridgeTxHash, PUB_CHAIN_NAME);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [isConfirmed]);

  useEffect(() => {
    if (allowance && BigInt(allowance) >= BigInt(tokensToSend)) {
      setIsAllowanceEnough(true);
    } else {
      setIsAllowanceEnough(false);
    }
  }, [allowance, approveStatus, isConfirmed, tokensToSend]);

  const fee = BigInt(quote?.nativeFee ?? 0);

  const compact = formatEther(balance ?? BigInt(0));
  const compactL2 = formatEther(l2Balance ?? BigInt(0));
  const compactQuote = formatEther(fee);

  return (
    <Card className="flex grow-0 flex-col gap-y-4 p-6 shadow-neutral">
      <Heading size="h3">Bridge Votes</Heading>
      <div className="flex flex-col gap-y-4">L1 Balance {compact}</div>
      <div className="flex flex-col gap-y-4">
        <p>L2 Balance {compactL2}</p>
        {l2Status.isError && <p>L2 Err: {String(l2Status?.error) ?? ""}</p>}
      </div>
      <div className="mb-6">
        <InputNumber
          label="Amount"
          placeholder="1.234 ETH"
          min={0}
          variant={typeof tokensToSend === "undefined" || isNumeric(tokensToSend) ? "default" : "critical"}
          onChange={(val) => setTokensToSend(parseEther(val).toString())}
        />
      </div>
      <div className="flex flex-col gap-y-4">
        <p>Quote {compactQuote} ETH</p>
        {quoteStatus.isError && <p>Quote Err: {String(quoteStatus?.error) ?? ""}</p>}
      </div>
      <If condition={isAllowanceEnough}>
        <Then>
          <Button className="max-w-xs" onClick={() => bridgeTokens(BigInt(tokensToSend), fee)}>
            Bridge
          </Button>
        </Then>
        <Else>
          <Button className="max-w-xs" onClick={() => approveTokens(BigInt(tokensToSend), PUB_OFT_ADAPTER_ADDRESSS)}>
            Approve
          </Button>
        </Else>
      </If>
      <p>Message Status: {message?.status}</p>
      <p>Dst Tx Hash: {message?.dstTxHash}</p>
      <If condition={scanUrl}>
        <Link target="_blank" href={scanUrl} className="text-blue-500 cursor-pointer underline">
          See Crosschain Transaction
        </Link>
      </If>
      <p>Src Tx Hash: {bridgeTxHash}</p>

      <If condition={bridgingStatus === "pending"}>
        <p>Waiting for confirmation</p>
      </If>
    </Card>
  );
}
