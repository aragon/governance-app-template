import dayjs from "dayjs";
import { ReactNode } from "react";
import { formatEther } from "viem";
import { useVotingToken } from "@/plugins/tokenVoting/hooks/useVotingToken";

const SUPPORT_THRESHOLD_BASE = BigInt(1e6);

interface ProposalDetailsProps {
  supportThreshold?: number;
  endDate?: bigint;
  snapshotBlock?: bigint;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({
  /** Ratio value ranging between 0 and 1_000_000 */
  supportThreshold,
  /** Timestamp */
  endDate,
  snapshotBlock,
}) => {
  const { tokenSupply } = useVotingToken();
  let threshold = BigInt(0);
  if (supportThreshold && tokenSupply) {
    threshold =
      (BigInt(supportThreshold) * tokenSupply) /
      SUPPORT_THRESHOLD_BASE;
  }

  return (
    <>
      <Card>
        <h2 className="text-xl flex-grow font-semibold text-neutral-600 pr-6">
          Support threshold
        </h2>
        <div className="items-right text-right flex-wrap">
          <span className="text-xl font-semibold">
            {formatEther(threshold)}
          </span>
          <p className="text-neutral-600">voting power</p>
        </div>
      </Card>
      <Card>
        <h2 className="text-xl flex-grow font-semibold pr-6 text-neutral-600">
          Ending
        </h2>
        <div className="items-right text-right flex-wrap">
          <span className="text-xl font-semibold">
            {dayjs(Number(endDate) * 1000).format("DD/MM/YYYY")}
          </span>
          <p className="text-neutral-600">
            {dayjs(Number(endDate) * 1000).format("HH:mm")}h
          </p>
        </div>
      </Card>
      <Card>
        <h2 className="text-xl flex-grow font-semibold text-neutral-600 pr-6">
          Snapshot
        </h2>
        <div className="items-right text-right flex-wrap">
          <p className="text-neutral-600">Taken at block</p>
          <span className="text-xl mr-2 font-semibold">
            {snapshotBlock?.toLocaleString()}
          </span>
        </div>
      </Card>
    </>
  );
};

// This should be encapsulated as soon as ODS exports this widget
const Card = function ({ children }: { children: ReactNode }) {
  return (
    <div
      className="p-4 xl:p-6 w-full flex flex-col space-y-6
    box-border border border-neutral-100
    focus:outline-none focus:ring focus:ring-primary
    bg-neutral-0 rounded-xl"
    >
      {children}
    </div>
  );
};

export default ProposalDetails;
