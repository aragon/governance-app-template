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
import { SplitRow } from "./SplitRow";
import { compactNumber } from "@/utils/numbers";
import { useRouter } from "next/router";
import { MessageStatus } from "@layerzerolabs/scan-client";

// for a given quote, if it's below 0.0001 ETH, simply write it as < 0.0001 ETH
const formatQuote = (quote: string): string => (parseFloat(quote) < 0.0001 ? "< 0.0001" : quote) + " ETH";

export default function Bridge() {
  const queryClient = useQueryClient();

  const { balance } = useVotingTokenBalance();
  const { symbol } = useVotingToken();
  const { reload } = useRouter();
  const [tokensToSend, setTokensToSend] = useState("0");
  const { balance: l2Balance } = useVotingTokenL2Balance();
  const { quote } = useBridgeQuote(BigInt(tokensToSend));
  const { bridgeTokens, bridgeTxHash } = useBridge();
  const {
    approveTokens,
    approveStatus,
    isConfirmed,
    isConfirming,
    queryKey: approveQueryKey,
  } = useApproveTokens(PUB_TOKEN_L1_ADDRESS);
  const { allowance, queryKey } = useAllowance(PUB_TOKEN_L1_ADDRESS, PUB_OFT_ADAPTER_ADDRESSS);

  const [isAllowanceEnough, setIsAllowanceEnough] = useState(false);
  const { message } = useCrossChainTransaction(bridgeTxHash, PUB_CHAIN_NAME);

  const disabled = tokensToSend === "0" || isConfirming || balance === BigInt(0);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: approveQueryKey });
  }, [isConfirmed]);

  useEffect(() => {
    if (allowance && BigInt(allowance) >= BigInt(tokensToSend)) {
      setIsAllowanceEnough(true);
    } else {
      setIsAllowanceEnough(false);
    }
  }, [allowance, approveStatus, isConfirmed, tokensToSend]);

  useEffect(() => {
    if (message?.status === MessageStatus.DELIVERED) reload();
  }, [message]);

  const fee = BigInt(quote?.nativeFee ?? 0);

  const compact = compactNumber(formatEther(balance ?? BigInt(0)));
  const compactL2 = compactNumber(formatEther(l2Balance ?? BigInt(0)));
  const compactQuote = formatQuote(formatEther(fee));

  return (
    <Card className="flex flex-col gap-y-4 p-6 shadow-neutral">
      <Heading size="h3">Bridge Voting Tokens To L2</Heading>
      <Card className="flex flex-col gap-2 p-4 shadow-neutral">
        <SplitRow left="L1 Balance" right={`${compact} ${symbol ?? ""}`} />
        <SplitRow left="L2 Balance" right={`${compactL2} ${symbol ?? ""}`} />
      </Card>
      <div className="mt-4">
        <InputNumber
          label="Amount To Bridge"
          placeholder={`100 ${symbol ?? ""}`}
          min={0}
          onChange={(val) => setTokensToSend(parseEther(val).toString())}
        />
      </div>

      <If condition={isAllowanceEnough}>
        <Then>
          <Button disabled={disabled} className="max-w-xs" onClick={() => bridgeTokens(BigInt(tokensToSend), fee)}>
            Bridge
          </Button>
          <SplitRow left="Bridge Fee" right={compactQuote} />
        </Then>
        <Else>
          <Button
            disabled={disabled}
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
