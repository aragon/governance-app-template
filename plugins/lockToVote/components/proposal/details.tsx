import dayjs from "dayjs";
import { compactNumber } from "@/utils/numbers";
import { ReactNode } from "react";
import { formatUnits } from "viem";

interface ProposalDetailsProps {
  minVetoVotingPower?: bigint;
  endDate?: bigint;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({
  /** Timestamp */
  endDate,
  minVetoVotingPower,
}) => {
  return (
    <>
      <Card>
        <h2 className="flex-grow pr-6 text-xl font-semibold text-neutral-600">Threshold</h2>
        <div className="items-right flex-wrap text-right">
          <p className="text-neutral-600">Min. Quorum</p>
          <span className="mr-2 text-xl font-semibold">
            {compactNumber(formatUnits(minVetoVotingPower || BigInt(0), 18))}
          </span>
        </div>
      </Card>
      <Card>
        <h2 className="flex-grow pr-6 text-xl font-semibold text-neutral-600">Ending</h2>
        <div className="items-right flex-wrap text-right">
          <span className="text-xl font-semibold">{dayjs(Number(endDate) * 1000).format("DD/MM/YYYY")}</span>
          <p className="text-neutral-600">{dayjs(Number(endDate) * 1000).format("HH:mm")}h</p>
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
