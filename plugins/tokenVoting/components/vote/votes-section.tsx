import Blockies from "react-blockies";
import { VoteCastEvent } from "@/plugins/tokenVoting/utils/types";
import { formatUnits } from "viem";
import { AddressText } from "@/components/text/address";
import { Card, Tag, TagVariant } from "@aragon/ods";
import { compactNumber } from "@/utils/numbers";
import { If } from "@/components/if";

export default function VotesSection({
  votes,
}: {
  votes: Array<VoteCastEvent>;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 mt-2 mb-14 gap-4">
      <If not={votes.length}>
        <p>The proposal has no votes</p>
      </If>
      {votes?.map((vote, i) => (
        <div>
          <div className="grid gap-3">
            <VoteCard
              key={i}
              vote={vote}
              type={
                vote.voteOption === 2
                  ? "Yes"
                  : vote.voteOption === 3
                  ? "No"
                  : "Abstain"
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const VoteCard = function ({
  vote,
  type = "Abstain",
}: {
  vote: VoteCastEvent;
  type?: "Yes" | "No" | "Abstain";
}) {
  let colorType: TagVariant = "neutral";
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
              {compactNumber(formatUnits(vote.votingPower, 18))} votes
            </p>
          </div>
        </div>
        <Tag className="!text-sm" variant={colorType} label={type} />
      </div>
    </Card>
  );
};
