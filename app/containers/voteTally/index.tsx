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
  }
  
  const VoteTally: FC<VoteTallyProps> = ({ voteType, voteCount, votePercentage, votes, color }) => (
    <div className="flex flex-col space-between border bg-neutral-50 border-neutral-300 rounded-2xl py-8 px-6 m-2">
      <div className="flex flex-row space-between pb-2">
        <p className={`flex-grow text-xl text-${color}-700 font-semibold`}>{voteType}</p>
        <p className="text-xl font-semibold">{formatUnits(voteCount || BigInt(0), 18)}</p>
      </div>
      <div className={`h-4 w-full bg-${color}-100 rounded`}>
        <div className={`h-4 bg-${color}-800 rounded`} style={{ width: `${votePercentage}%` }}></div>
      </div>
      <div className="mt-4 grid grid-cols-5 space-between">
        {votes && votes.filter(vote => vote.voteOption === 2).map(vote => (
          <Blockies
            key={vote?.voter}
            size={11}
            className="rounded-3xl"
            seed={vote?.voter}
          />
        ))}
      </div>
    </div>
  );

  export default VoteTally