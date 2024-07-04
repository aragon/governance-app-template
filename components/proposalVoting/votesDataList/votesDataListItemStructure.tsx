import { formatHexString } from "@/utils/evm";
import { DataListItem, MemberAvatar, Tag, type IDataListItemProps, type TagVariant } from "@aragon/ods";
import classNames from "classnames";

export type IVotesDataListVariant = "yes" | "approve" | "no" | "abstain";

export interface IVotesDataListItemStructureProps extends IDataListItemProps {
  address: string;
  variant: IVotesDataListVariant;
  ensAvatar?: string;
  ensName?: string;
  connectedAccount?: boolean;
  delegate?: boolean;
  votingPower?: string;
}

export const VotesDataListItemStructure: React.FC<IVotesDataListItemStructureProps> = (props) => {
  const { address, connectedAccount, delegate, ensAvatar, ensName, variant, className, votingPower, ...otherProps } =
    props;

  const label = connectedAccount ? "You" : delegate ? "Your delegate" : null;

  const dataListVariantToTagVariant: Record<IVotesDataListVariant, TagVariant> = {
    yes: "success",
    approve: "success",
    no: "critical",
    abstain: "neutral",
  };

  return (
    <DataListItem className={classNames("flex flex-col gap-y-3 py-3 md:py-4", className)} {...otherProps}>
      <div className="flex w-full items-center gap-x-3 md:gap-x-4">
        <MemberAvatar
          src={ensAvatar ?? ""}
          address={address}
          alt="Profile picture"
          className="shrink-0"
          size="sm"
          // TODO: update to md: sm, size:xs
        />
        <div className="flex flex-1 flex-col justify-center gap-y-1 md:gap-y-1.5">
          <div className="flex">
            <span className="leading-tight text-neutral-800 md:text-lg">{ensName || formatHexString(address)}</span>
            {label && <Tag label={label} variant="primary" className="relative -top-2 left-1 shrink-0 capitalize" />}
          </div>
          {votingPower && (
            <span className="line-clamp-1 text-sm leading-tight text-neutral-500 md:text-base">{votingPower}</span>
          )}
        </div>
        <Tag label={variant} variant={dataListVariantToTagVariant[variant]} className="shrink-0 capitalize" />
      </div>
    </DataListItem>
  );
};
