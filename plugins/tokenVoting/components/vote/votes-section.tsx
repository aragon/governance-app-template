import Blockies from "react-blockies";
import { VoteCastEvent } from "../../utils/types";
import { formatUnits } from "viem";
import { AddressText } from "@/components/text/address";
import { Card } from "@aragon/ods";
import { compactNumber } from "@/utils/numbers";
import { If } from "@/components/if";

export default function VotesSection({ votes }: { votes: Array<VoteCastEvent> }) {
  return (
    <div className="mb-14 mt-2 grid grid-cols-1 lg:grid-cols-3">
      <div>
        <If not={votes.length}>
          <p>The proposal has no votes</p>
        </If>
        <div className="grid gap-2">
          {votes.map((veto, i) => (
            <VetoCard key={i} veto={veto} />
          ))}
        </div>
      </div>
    </div>
  );
}

const VetoCard = function ({ veto }: { veto: VoteCastEvent }) {
  return (
    <Card className="p-3">
      <div className="space-between flex flex-row">
        <div className="flex flex-grow">
          <Blockies className="rounded-3xl" size={9} seed={veto?.voter} />
          <div className="px-2">
            <AddressText>{veto?.voter}</AddressText>
            <p className="text-sm text-neutral-600">{compactNumber(formatUnits(veto.votingPower, 18))} votes</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
