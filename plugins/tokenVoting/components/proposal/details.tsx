import dayjs from "dayjs";
import { ReactNode } from "react";
import { formatEther } from "viem";
import { useVotingToken } from "@/plugins/tokenVoting/hooks/useVotingToken";
import { compactNumber } from "@/utils/numbers";

const PERCENT_BASE = BigInt(1e6);

interface ProposalDetailsProps {
  supportThreshold?: number;
  minVotingPower?: bigint;
  snapshotBlock?: bigint;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({
  /** Ratio value ranging between 0 and 1_000_000 */
  supportThreshold,
  /** Timestamp */
  minVotingPower,
  snapshotBlock,
}) => {
  const { tokenSupply, symbol } = useVotingToken();
  let threshold = BigInt(0);
  if (supportThreshold && tokenSupply) {
    threshold = (BigInt(supportThreshold) * tokenSupply) / PERCENT_BASE;
  }
  let minTurnoutRatio;
  if (minVotingPower && tokenSupply) {
    minTurnoutRatio = Number((minVotingPower * BigInt(10000)) / tokenSupply) / 10000;
  }

  return (
    <>
      <Card>
        <h2 className="flex-grow pr-6 text-xl font-semibold text-neutral-600">Support threshold</h2>
        <div className="items-right flex-wrap text-right">
          <span className="text-xl font-semibold">{compactNumber(formatEther(threshold))}</span>{" "}
          <span>{symbol ?? ""}</span>
          <p className="text-neutral-600">
            &gt; {(((supportThreshold ?? 0) * 100) / Number(PERCENT_BASE)).toFixed(1)}%
          </p>
        </div>
      </Card>
      <Card>
        <h2 className="flex-grow pr-6 text-xl font-semibold text-neutral-600">Minimum turnout</h2>
        <div className="items-right flex-wrap text-right">
          <span className="text-xl font-semibold">
            {minVotingPower ? compactNumber(formatEther(minVotingPower)) : null}
          </span>{" "}
          <span>{symbol ?? ""}</span>
          <p className="text-neutral-600">
            {minTurnoutRatio ? (minTurnoutRatio * 100).toFixed(1) + "% of the supply" : "-"}
          </p>
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
