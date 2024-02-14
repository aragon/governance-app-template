import { FC, ReactNode } from "react";
import { formatUnits } from "viem";

interface VoteTallyProps {
  voteCount: bigint;
  votePercentage: number;
}

const VetoTally: FC<VoteTallyProps> = ({ voteCount, votePercentage }) => (
  <Card>
    <div className="flex flex-row space-between pb-2">
      <p className={`flex-grow text-xl text-critical-700 font-semibold`}>Veto</p>
      <p className="text-xl font-semibold">{formatUnits(voteCount || BigInt(0), 18)}</p>
    </div>
    <div className={`h-4 w-full bg-critical-100 rounded`}>
      <div className={`h-4 bg-critical-700 rounded`} style={{ width: `${votePercentage}%` }}/>
    </div>
  </Card>
);

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div className="p-4 xl:p-6 w-full flex flex-col space-y-6
    box-border border border-neutral-100
    bg-neutral-0 rounded-xl">
      {children}
    </div>
  );
};

export default VetoTally