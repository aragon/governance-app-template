import { compactNumber } from "@/utils/numbers";
import { FC, ReactNode } from "react";
import { formatUnits } from "viem";

interface VoteTallyProps {
  voteCount: bigint;
  votePercentage: number;
}

const VetoTally: FC<VoteTallyProps> = ({ voteCount, votePercentage }) => (
  <Card>
    <div className="space-between flex flex-row pb-2">
      <p className={`flex-grow text-xl font-semibold text-primary-500`}>Vetoed</p>
      <p className="text-xl font-semibold">{compactNumber(formatUnits(voteCount || BigInt(0), 18))}</p>
    </div>
    <div className={`h-4 w-full rounded bg-primary-100`}>
      <div className={`h-4 rounded bg-primary-700`} style={{ width: `${Math.min(votePercentage, 100)}%` }} />
    </div>
  </Card>
);

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="box-border flex w-full flex-col space-y-6 rounded-xl
    border border-neutral-100 bg-neutral-0
    p-4 xl:p-6"
    >
      {children}
    </div>
  );
};

export default VetoTally;
