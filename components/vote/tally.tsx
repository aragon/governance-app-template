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
      {/* Please don't delete or the bundler won't add these colors to the build */}
      {/* The reason is because the are being added in js at rendering time */}
      {/** bg-critical-700 bg-critical-100 bg-success-100 bg-success-700 bg-neutral-100 bg-neutral-700 */}
      <div className={`h-4 bg-${color}-700 rounded`} style={{ width: `${votePercentage}%` }}/>
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

export default VoteTally
