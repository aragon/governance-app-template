import Blockies from "react-blockies";
import { VetoCastEvent } from "@/plugins/dualGovernance/utils/types";
import { formatUnits } from "viem";
import { AddressText } from "@/components/text/address";
import { Card } from "@aragon/ods";
import { compactNumber } from "@/utils/numbers";
import { If } from "@/components/if";

export default function VetoesSection({
  vetoes,
}: {
  vetoes: Array<VetoCastEvent>;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 mt-2 mb-14">
      <div>
        <If not={vetoes.length}>
          <p>The proposal has no vetoes</p>
        </If>
        <div className="grid gap-2">
          {vetoes.map((veto, i) => (
            <VetoCard key={i} veto={veto} />
          ))}
        </div>
      </div>
    </div>
  );
}

const VetoCard = function ({ veto }: { veto: VetoCastEvent }) {
  return (
    <Card className="p-3">
      <div className="flex flex-row space-between">
        <div className="flex flex-grow">
          <Blockies className="rounded-3xl" size={9} seed={veto?.voter} />
          <div className="px-2">
            <AddressText>{veto?.voter}</AddressText>
            <p className="text-neutral-600 text-sm">
              {compactNumber(formatUnits(veto.votingPower, 18))} votes
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
