import { ElseIf, If, Then } from "@/components/if";
import { AvatarIcon, IconType, Spinner, StatePingAnimation } from "@aragon/ods";

interface IVotingStageStatus {
  endDate: string;
  status: "pending" | "active" | "accepted" | "rejected" | "unreached";
}

export const VotingStageStatus: React.FC<IVotingStageStatus> = (props) => {
  const { endDate, status } = props;

  return (
    <div className="flex items-center gap-x-2 text-lg leading-tight">
      <If val={status} is={"pending"}>
        <Then>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-800">Stage</span>
            <span className="flex-grow truncate text-neutral-500">is pending</span>
          </div>
          <Spinner size="md" variant="neutral" className="shrink-0" />
        </Then>
        <ElseIf all={[status === "active", endDate]}>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-primary-500">{endDate}</span>&nbsp;
            <span className="flex-grow truncate text-neutral-500">left to participate</span>
          </div>
          <StatePingAnimation variant="primary" className="shrink-0" />
        </ElseIf>
        <ElseIf val={status} is="accepted">
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-500">The proposal has been</span>
            <span className="flex-grow truncate text-success-800">accepted</span>
          </div>
          <AvatarIcon size="sm" variant="success" icon={IconType.CHECKMARK} className="shrink-0" />
        </ElseIf>
        <ElseIf true={["rejected", "vetoed"].includes(status)}>
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-500">The proposal has been</span>
            <span className="flex-grow truncate text-critical-800">rejected</span>
          </div>
          <AvatarIcon size="sm" variant="critical" icon={IconType.CLOSE} className="shrink-0" />
        </ElseIf>
        <ElseIf val={status} is="unreached">
          <div className="flex flex-grow items-center gap-x-0.5">
            <span className="shrink-0 text-neutral-800">Stage</span>
            <span className="flex-grow truncate text-neutral-500">not reached</span>
          </div>
          <AvatarIcon size="sm" variant="neutral" icon={IconType.CLOSE} className="shrink-0" />
        </ElseIf>
      </If>
    </div>
  );
};
