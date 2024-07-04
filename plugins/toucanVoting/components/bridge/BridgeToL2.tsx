import { useQueryClient } from "@tanstack/react-query";
import { useVotingToken, useVotingTokenBalance, useVotingTokenL2Balance } from "../../hooks/useVotingToken";
import { useEffect, useState } from "react";
import { useBridge, useBridgeQuote } from "../../hooks/useBridge";
import { useAllowance, useApproveTokens } from "../../hooks/useApproveTokens";
import { PUB_CHAIN_NAME, PUB_OFT_ADAPTER_ADDRESSS, PUB_TOKEN_L1_ADDRESS } from "@/constants";
import { useCrossChainTransaction } from "../../hooks/useCrossChainTransactions";
import { formatEther, parseEther } from "viem";
import { Button, Card, Heading, InputNumber, Spinner } from "@aragon/ods";
import { Else, If, Then } from "@/components/if";
import Link from "next/link";
import { PleaseWaitSpinner } from "@/components/please-wait";

function isNumeric(value: string): boolean {
  if (!value) return true;
  return !!value.match(/^[0-9]+$/);
}

function SplitRow({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between">
      <p>{left}</p>
      <p>{right}</p>
    </div>
  );
}

// for a given quote, if it's below 0.0001 ETH, simply write it as < 0.0001 ETH
function formatQuote(quote: string): string {
  return parseFloat(quote) < 0.0001 ? "< 0.0001" : quote;
}

export default function Bridge() {
  const queryClient = useQueryClient();

  const { balance, status } = useVotingTokenBalance();
  const { symbol } = useVotingToken();
  const [tokensToSend, setTokensToSend] = useState("0");
  const { balance: l2Balance, status: l2Status } = useVotingTokenL2Balance();
  const { quote, status: quoteStatus } = useBridgeQuote(BigInt(tokensToSend));
  const { bridgeTokens, bridgingStatus, bridgeTxHash } = useBridge();
  const { approveTokens, approveStatus, isConfirmed, isConfirming } = useApproveTokens(PUB_TOKEN_L1_ADDRESS);
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
    <Card className="flex flex-col gap-y-4 p-6 shadow-neutral">
      <Heading size="h3">Bridge Voting Tokens</Heading>
      <Card className="flex flex-col gap-2 p-4 shadow-neutral">
        <SplitRow left="L1 Token" right={`${compact} ${symbol ?? ""}`} />
        <SplitRow left="L2 Token" right={`${compactL2} ${symbol ?? ""}`} />
      </Card>
      <div className="mt-4">
        <InputNumber
          label="Amount To Bridge"
          placeholder={`1234 ${symbol ?? ""}`}
          min={0}
          // max={Number(parseEther(String(balance) ?? "0"))}
          onChange={(val) => setTokensToSend(parseEther(val).toString())}
        />
      </div>

      <If condition={isAllowanceEnough}>
        <Then>
          <Button className="max-w-xs" onClick={() => bridgeTokens(BigInt(tokensToSend), fee)}>
            Bridge
          </Button>
          <SplitRow left="Bridge Fee" right={`${formatQuote(compactQuote)} ETH`} />
        </Then>
        <Else>
          <Button
            disabled={isConfirming || balance === BigInt(0)}
            className="max-w-xs"
            onClick={() => approveTokens(BigInt(tokensToSend), PUB_OFT_ADAPTER_ADDRESSS)}
          >
            {isConfirming ? <Spinner size="lg" variant="neutral" /> : "Approve"}
          </Button>
        </Else>
      </If>
    </Card>
  );
}
