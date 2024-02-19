import { useState, useEffect } from "react";
import Blockies from "react-blockies";
import { VoteCastEvent } from "@/plugins/tokenVoting/utils/types";
import { formatUnits } from "viem";
import { AddressText } from "@/components/text/address";
import { Card, Tag } from '@aragon/ods'
import { formatLargeNumber } from "@/utils/formatNumber";

export default function VotesSection({
  votes,
}: {
  votes: Array<VoteCastEvent>;
}) {
  const [abstainVotes, setAbstainVotes] = useState<VoteCastEvent[]>([])
  const [yesVotes, setYesVotes] = useState<VoteCastEvent[]>([])
  const [noVotes, setNoVotes] = useState<VoteCastEvent[]>([])

  useEffect(() => {
    if (votes) {
      setAbstainVotes(votes.filter((vote) => vote.voteOption === 1))
      setYesVotes(votes.filter((vote) => vote.voteOption === 2))
      setNoVotes(votes.filter((vote) => vote.voteOption === 3))
    }
  }, [votes])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 mt-4 mb-14 gap-4">
      <div>
        <div className="grid gap-3">
          {yesVotes.map((vote, i) => (
            <VoteCard key={i} vote={vote} type="Yes" />
          ))}
        </div>
      </div>
      <div>
        <div className="grid gap-3">
          {noVotes.map((vote, i) => (
            <VoteCard key={i} vote={vote} type="No" />
          ))}
        </div>
      </div>
      <div>
        <div className="grid gap-3">
          {abstainVotes.map((vote, i) => (
            <VoteCard key={i} vote={vote} />
          ))}
        </div>
      </div>
    </div>
  );
}

const VoteCard = function({
  vote,
  type = "Abstain",
}: {
  vote: VoteCastEvent;
  type?: "Yes" | "No" | "Abstain";
}) {
  let colorType = "neutral";
  if (type === "No") colorType = "critical";
  else if (type === "Yes") colorType = "success";

  return (
    <Card className="p-3">
      <div className="flex flex-row space-between">
        <div className="flex flex-grow">
          <Blockies className="rounded-3xl" size={9} seed={vote?.voter} />
          <div className="px-2">
            <AddressText>{vote.voter}</AddressText>
            <p className="text-neutral-600 text-sm">
              {formatLargeNumber(formatUnits(vote.votingPower, 18))} votes
            </p>
          </div>
        </div>
        <Tag
          className="!text-sm"
          variant={colorType}
          label={type}
        />
      </div>
    </Card>
  );
};
