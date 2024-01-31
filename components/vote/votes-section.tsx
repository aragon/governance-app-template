import { useState, useEffect } from "react";
import Blockies from "react-blockies";
import { VoteCastEvent } from "@/utils/types";
import { formatUnits } from "viem";
import { ReactNode } from "react";
import { AddressText } from "../text/address";

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
      console.log('votes-section || inside:useEffect || changing votes')
      console.log('votes: ', votes)
      setAbstainVotes(votes.filter((vote) => vote.voteOption === 1))
      setYesVotes(votes.filter((vote) => vote.voteOption === 2))
      setNoVotes(votes.filter((vote) => vote.voteOption === 3))
    }
  }, [votes])

  return (
    <div className="grid grod-cols-1 lg:grid-cols-2 mt-4 mb-14 gap-4">
      {yesVotes.map((vote, i) => (
        <VoteCard key={i} vote={vote} type="Yes" />
      ))}
      {noVotes.map((vote, i) => (
        <VoteCard key={i} vote={vote} type="No" />
      ))}
      {abstainVotes.map((vote, i) => (
        <VoteCard key={i} vote={vote} />
      ))}
    </div>
  );
}

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="p-4 xl:p-4 w-full flex flex-col space-y-6
    box-border border border-neutral-100
    focus:outline-none focus:ring focus:ring-primary
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};

const VoteCard = function ({
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
    <Card>
      <div className="flex flex-row space-between">
        <div className="flex flex-grow">
          <Blockies className="rounded-3xl" size={9} seed={vote?.voter} />
          <div className="px-2">
            <p className="text-primary-700 font-semibold underline">
              <AddressText>{vote.voter}</AddressText>
            </p>
            <p className="text-neutral-700 font-semibold">
              {formatUnits(vote.votingPower, 18)} votes
            </p>
          </div>
        </div>
        <p
          className={`py-1 px-3 h-9 bg-${colorType}-100 text-${colorType}-800 font-semibold rounded-xl border border-${colorType}-400`}
        >
          {type}
        </p>
      </div>
    </Card>
  );
};
