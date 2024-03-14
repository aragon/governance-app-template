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
        <h2 className="text-xl flex-grow font-semibold text-neutral-600 pr-6">
          Threshold
        </h2>
        <div className="items-right text-right flex-wrap">
          <p className="text-neutral-600">Min. Quorum</p>
          <span className="text-xl mr-2 font-semibold">
            {compactNumber(formatUnits(minVetoVotingPower || BigInt(0), 18))}
          </span>
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

    </>
  );
};

// This should be encapsulated as soon as ODS exports this widget
const Card = function({ children }: { children: ReactNode }) {
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
