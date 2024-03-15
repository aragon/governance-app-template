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
      <p className={`text-primary-700 flex-grow text-xl font-semibold`}>
        For
      </p>
      <p className="text-xl font-semibold">
        {compactNumber(formatUnits(voteCount || BigInt(0), 18))}
      </p>
    </div>
    <div className={`bg-primary-100 h-4 w-full rounded`}>
      <div
        className={`bg-primary-700 h-4 rounded`}
        style={{ width: `${Math.min(votePercentage, 100)}%` }}
      />
    </div>
  </Card>
);

// This should be encapsulated as soon as ODS exports this widget
const Card = function({ children }: { children: ReactNode }) {
  return (
    <div
      className="bg-neutral-0 box-border flex w-full flex-col space-y-6
    rounded-xl border border-neutral-100
    p-4 xl:p-6"
    >
      {children}
    </div>
  );
};

export default VetoTally;
