import { ReactNode } from "react";
import { useVotingToken } from "../../hooks/useVotingToken";
import { formatEther } from "viem";
import { compactNumber } from "@/utils/numbers";

interface ProposalDetailsProps {
  minVetoVotingPower?: bigint;
  snapshotBlock?: bigint;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ minVetoVotingPower, snapshotBlock }) => {
  const { symbol } = useVotingToken();
  return (
    <>
      <Card>
        <h2 className="flex-grow pr-6 text-xl font-semibold text-neutral-600">Minimum veto power</h2>
        <div className="items-right flex-wrap text-right">
          <span className="text-xl font-semibold">
            {minVetoVotingPower ? compactNumber(formatEther(minVetoVotingPower)) : null}
          </span>{" "}
          <span>{symbol ?? ""}</span>
        </div>
      </Card>
      <Card>
        <h2 className="flex-grow pr-6 text-xl font-semibold text-neutral-600">Snapshot</h2>
        <div className="items-right flex-wrap text-right">
          <p className="text-neutral-600">Taken at block</p>
          <span className="mr-2 text-xl font-semibold">{snapshotBlock?.toLocaleString()}</span>
        </div>
      </Card>
    </>
  );
};

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="box-border flex w-full flex-col space-y-6 rounded-xl
    border border-neutral-100 bg-neutral-0
    p-4 focus:outline-none focus:ring
    focus:ring-primary xl:p-6"
    >
      {children}
    </div>
  );
};

export default ProposalDetails;
