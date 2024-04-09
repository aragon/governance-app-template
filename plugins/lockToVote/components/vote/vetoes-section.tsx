import Blockies from "react-blockies";
import { VetoCastEvent } from "@/plugins/lockToVote/utils/types";
import { formatUnits } from "viem";
import { AddressText } from "@/components/text/address";
import { Card, Tag } from "@aragon/ods";
import { compactNumber } from "@/utils/numbers";

export default function VetoesSection({ vetoes }: { vetoes: Array<VetoCastEvent> }) {
  return (
    <div className="mb-14 mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div>
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
      <div className="space-between flex flex-row">
        <div className="flex flex-grow">
          <Blockies className="rounded-3xl" size={9} seed={veto?.voter} />
          <div className="px-2">
            <AddressText>{veto?.voter}</AddressText>
            <p className="text-sm text-neutral-600">{compactNumber(formatUnits(veto.votingPower, 18))} votes</p>
          </div>
        </div>
        <Tag className="!text-sm" variant="critical" label="Veto" />
      </div>
    </Card>
  );
};
