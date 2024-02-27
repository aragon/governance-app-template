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
    minTurnoutRatio =
      Number((minVotingPower * BigInt(10000)) / tokenSupply) / 10000;
  }

  return (
    <>
      <Card>
        <h2 className="text-xl flex-grow font-semibold text-neutral-600 pr-6">
          Support threshold
        </h2>
        <div className="items-right text-right flex-wrap">
          <span className="text-xl font-semibold">
            {compactNumber(formatEther(threshold))}
          </span>{" "}
          <span>{symbol ?? ""}</span>
          <p className="text-neutral-600">
            &gt;{" "}
            {(((supportThreshold ?? 0) * 100) / Number(PERCENT_BASE)).toFixed(
              1
            )}
            %
          </p>
        </div>
      </Card>
      <Card>
        <h2 className="text-xl flex-grow font-semibold pr-6 text-neutral-600">
          Minimum turnout
        </h2>
        <div className="items-right text-right flex-wrap">
          <span className="text-xl font-semibold">
            {minVotingPower ? compactNumber(formatEther(minVotingPower)) : null}
          </span>{" "}
          <span>{symbol ?? ""}</span>
          <p className="text-neutral-600">
            {minTurnoutRatio
              ? (minTurnoutRatio * 100).toFixed(1) + "% of the supply"
              : "-"}
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
