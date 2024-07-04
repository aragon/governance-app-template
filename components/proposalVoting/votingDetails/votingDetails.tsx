import { If } from "@/components/if";
import { DefinitionList, Heading, IconType, Link } from "@aragon/ods";

export interface IVotingDetailsProps {
  startDate?: string;
  endDate: string;
  snapshotBlock: string;
  snapshotBlockURL: string;
  options: string;
  strategy: string;
}

export const VotingDetails: React.FC<IVotingDetailsProps> = (props) => {
  const { startDate, endDate, snapshotBlockURL, snapshotBlock, options, strategy } = props;
  return (
    <div className="flex flex-col gap-y-3">
      <div>
        <Heading size="h4">Voting</Heading>
        <DefinitionList.Container className="">
          <If condition={startDate}>
            <DefinitionList.Item term="Starts" className="!gap-y-1 *:text-neutral-500">
              <div className="w-full text-neutral-800 md:text-right">{startDate}</div>
            </DefinitionList.Item>
          </If>
          <DefinitionList.Item term="Expires" className="!gap-y-1 *:text-neutral-500">
            <div className="w-full text-neutral-800 md:text-right">{endDate}</div>
          </DefinitionList.Item>
          <DefinitionList.Item term="Census Snapshot" className="!gap-y-1 *:text-neutral-500">
            <div className="w-full text-neutral-800 md:text-right">
              <Link iconRight={IconType.LINK_EXTERNAL} href={snapshotBlockURL} target="_blank">
                {snapshotBlock}
              </Link>
            </div>
          </DefinitionList.Item>
        </DefinitionList.Container>
      </div>
      <div>
        <Heading size="h4">Governance Settings</Heading>
        <DefinitionList.Container>
          <DefinitionList.Item term="Strategy" className="!gap-y-1 *:text-neutral-500">
            <div className="w-full text-neutral-800 md:text-right">{strategy}</div>
          </DefinitionList.Item>
          <DefinitionList.Item term="Voting options" className="!gap-y-1 *:text-neutral-500">
            <div className="w-full text-neutral-800 md:text-right">{options}</div>
          </DefinitionList.Item>
        </DefinitionList.Container>
      </div>
    </div>
  );
};
