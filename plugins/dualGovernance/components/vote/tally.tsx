import { compactNumber } from "@/utils/numbers";
import { FC, ReactNode } from "react";
import { formatUnits } from "viem";

interface VoteTallyProps {
  voteCount: bigint;
  votePercentage: number;
}

const VetoTally: FC<VoteTallyProps> = ({ voteCount, votePercentage }) => (
  <Card>
    <div className="flex flex-row space-between pb-2">
      <p className={`flex-grow text-xl text-primary-500 font-semibold`}>
        Vetoed
      </p>
      <p className="text-xl font-semibold">
        {compactNumber(formatUnits(voteCount || BigInt(0), 18))}
      </p>
    </div>
    <div className={`h-4 w-full bg-primary-100 rounded`}>
      <div
        className={`h-4 bg-primary-700 rounded`}
        style={{ width: `${Math.min(votePercentage, 100)}%` }}
      />
    </div>
  </Card>
);

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="p-4 xl:p-6 w-full flex flex-col space-y-6
    box-border border border-neutral-100
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};

export default VetoTally;
