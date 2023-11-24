import { VoteCastEvent } from "@/utils/types";
import { FC } from "react";
import { formatUnits } from "viem";
import Blockies from 'react-blockies';

interface VoteTallyProps {
  voteType: string;
  voteCount: bigint;
  votePercentage: number;
  votes: VoteCastEvent[],
  color: string;
  option: number
}

const VoteTally: FC<VoteTallyProps> = ({ voteType, voteCount, votePercentage, votes, color, option }) => (
  <div className="flex flex-col space-between border bg-neutral-50 border-neutral-300 rounded-2xl py-8 px-6">
    <div className="flex flex-row space-between pb-2">
      <p className={`flex-grow text-xl text-${color}-700 font-semibold`}>{voteType}</p>
      <p className="text-xl font-semibold">{formatUnits(voteCount || BigInt(0), 18)}</p>
    </div>
    {/** bg-success-700 bg-neutral-700 bg-critical-700 bg-success-100 bg-neutral-100 bg-critical-100*/}
    <div className={`h-4 w-full bg-${color}-100 rounded`}>
      <div className={`h-4 bg-${color}-700 rounded`} style={{ width: `${votePercentage}%` }}></div>
    </div>
    <div className="mt-4 grid grid-cols-5 space-between">
      {votes && votes.filter(vote => vote.voteOption === option).map(vote => (
        <div key={vote?.voter}>
          <Blockies
            size={11}
            className="rounded-3xl"
            seed={vote?.voter}
          />
        </div>
      ))}
    </div>
  </div>
);

export default VoteTally
