import { VoteCastEvent } from "@/utils/types";
import { FC, ReactNode } from "react";
import { formatUnits } from "viem";

interface VoteTallyProps {
  voteType: string;
  voteCount: bigint;
  votePercentage: number;
  votes: VoteCastEvent[],
  color: string;
  option: number
}

const VoteTally: FC<VoteTallyProps> = ({ voteType, voteCount, votePercentage, votes, color, option }) => (
  <Card>
    <div className="flex flex-row space-between pb-2">
      <p className={`flex-grow text-xl text-${color}-700 font-semibold`}>{voteType}</p>
      <p className="text-xl font-semibold">{formatUnits(voteCount || BigInt(0), 18)}</p>
    </div>
    <div className={`h-4 w-full bg-${color}-100 rounded`}>
      <div className={`h-4 bg-${color}-700 rounded`} style={{ width: `${votePercentage}%` }}></div>
    </div>
  </Card>
);

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div className="p-4 xl:p-6 w-full flex flex-col space-y-6
    box-border border border-neutral-100
    focus:outline-none focus:ring focus:ring-primary
    bg-neutral-0 rounded-xl">
      {children}
    </div>
  );
};

export default VoteTally
