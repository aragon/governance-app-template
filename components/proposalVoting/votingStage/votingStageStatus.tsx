import { AvatarIcon, IconType, Spinner, StatePingAnimation } from "@aragon/ods";

interface IVotingStageStatus {
  endDate: string;
  status: "pending" | "active" | "accepted" | "rejected" | "unreached";
}

export const VotingStageStatus: React.FC<IVotingStageStatus> = (props) => {
  const { endDate, status } = props;

  return (
    <div className="flex items-center gap-x-2 text-lg leading-tight">
      {status === "pending" && (
        <>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-800">Stage</span>
            <span className="flex-grow truncate text-neutral-500">is pending</span>
          </div>
          <Spinner size="md" variant="neutral" className="shrink-0" />
        </>
      )}
      {status === "active" && endDate && (
        <>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-primary-500">{endDate}</span>
            <span className="flex-grow truncate text-neutral-500">left to vote</span>
          </div>
          <StatePingAnimation variant="primary" className="shrink-0" />
        </>
      )}
      {status === "accepted" && (
        <>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-500">Proposal has been</span>
            <span className="flex-grow truncate text-success-800">accepted</span>
          </div>
          <AvatarIcon size="sm" variant="success" icon={IconType.CHECKMARK} className="shrink-0" />
        </>
      )}
      {status === "rejected" && (
        <>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-500">Proposal has been</span>
            <span className="flex-grow truncate text-critical-800">rejected</span>
          </div>
          <AvatarIcon size="sm" variant="critical" icon={IconType.CLOSE} className="shrink-0" />
        </>
      )}
      {status === "unreached" && (
        <>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-800">Stage</span>
            <span className="flex-grow truncate text-neutral-500">not reached</span>
          </div>
          <AvatarIcon size="sm" variant="neutral" icon={IconType.CLOSE} className="shrink-0" />
        </>
      )}
    </div>
  );
};
