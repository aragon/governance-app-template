import { Button, Card, Heading, Spinner, Tooltip } from "@aragon/ods";
import { useCanDispatch, useDispatchQuote, useDispatchVotes } from "../../hooks/useDispatchVotes";
import { useCrossChainTransaction } from "../../hooks/useCrossChainTransactions";
import { PUB_CHAIN, PUB_CHAIN_NAME, PUB_L2_CHAIN_NAME } from "@/constants";
import { SplitRow } from "./SplitRow";
import { formatEther } from "viem";
import { useVotingToken } from "../../hooks/useVotingToken";
import { MessageStatus } from "@layerzerolabs/scan-client";
import { compactNumber } from "@/utils/numbers";
import { useGetPendingVotesOnL2 } from "../../hooks/usePendingVotesRelay";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { readableChainName } from "@/utils/chains";

function compactAllowNegativeNumber(value: string, decimalPlace = 2) {
  if (value.startsWith("-")) {
    const positive = value.slice(1);
    return `-${compactNumber(positive, decimalPlace)}`;
  } else {
    return compactNumber(value, decimalPlace);
  }
}

export default function DispatchVotes({ id: proposalId }: { id: number }) {
  const queryClient = useQueryClient();
  const { canDispatch } = useCanDispatch(proposalId);
  const quote = useDispatchQuote(proposalId);
  const { pending, hasPending, queries } = useGetPendingVotesOnL2(proposalId);
  const { symbol } = useVotingToken();

  const { dispatchVotes, dispatchTxHash, isConfirming, dispatchTxStatus } = useDispatchVotes(
    proposalId,
    quote?.lzSendParams
  );
  const { isBridged, isBridging, message } = useCrossChainTransaction(dispatchTxHash, PUB_L2_CHAIN_NAME);

  const isInFlight = isBridging || isConfirming;
  const disabled = !canDispatch || !hasPending || isBridging || isConfirming || dispatchTxStatus === "pending";

  // parse to sensible values
  const [y, n, a] = [pending.yes, pending.no, pending.abstain].map((i) =>
    compactAllowNegativeNumber(formatEther(i), 2).concat(symbol ? ` ${symbol}` : "")
  );

  useEffect(() => {
    if (message?.status === MessageStatus.DELIVERED && Array.isArray(queries)) {
      queries.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
    }
  }, [isBridged, message, queries]);

  return (
    <Card className="flex flex-col gap-5 p-4 shadow-neutral-sm">
      <Heading size="h3">Dispatch Pending Votes</Heading>
      <div className="flex flex-col gap-1">
        <p>
          Below are all votes recorded on {readableChainName(PUB_L2_CHAIN_NAME)}, but not yet sent to{" "}
          {readableChainName(PUB_CHAIN_NAME)}. You can dispatch them by clicking the button below.
        </p>
        <div>
          {/* <Tooltip /> */}
          <p>(Negative votes indicate that someone has changed their vote.)</p>
        </div>
      </div>
      <Card className="flex flex-col gap-2 border border-neutral-100 p-3">
        <Heading size="h4">Votes Pending</Heading>
        <SplitRow left="Yes" right={y} />
        <SplitRow left="No" right={n} />
        <SplitRow left="Abstain" right={a} />
      </Card>
      <Button disabled={disabled} onClick={dispatchVotes}>
        {isInFlight ? <Spinner size="lg" variant="neutral" /> : hasPending ? "Dispatch Votes" : "Nothing to Dispatch"}
      </Button>
    </Card>
  );
}
