import { Else, ElseIf, If, Then } from "@/components/if";
import { formatHexString, equalAddresses } from "@/utils/evm";
import { type IDataListItemProps, DataList, MemberAvatar, Tag } from "@aragon/ods";
import { useAccount } from "wagmi";
import { Address, formatEther } from "viem";
import { useTokenVotes } from "../../../hooks/useTokenVotes";
import VerifiedDelegates from "../../../verified-delegates.json";
import { useDelegateAnnounce } from "../hooks/useDelegateAnnounce";

export interface IDelegateListItemProps extends IDataListItemProps {
  /** Whether the member is a delegate of current user or not */
  isMyDelegate?: boolean;
  /** 0x address of the user */
  address: Address;
  /** Direct URL src of the user avatar image to be rendered */
  avatarSrc?: string;
}

export const DelegateListItem: React.FC<IDelegateListItemProps> = (props) => {
  const { isMyDelegate, avatarSrc, address, ...otherProps } = props;
  const { address: currentUserAddress, isConnected } = useAccount();
  const isCurrentUser = isConnected && address && equalAddresses(currentUserAddress, address);
  const { votingPower } = useTokenVotes(address);
  const isVerified = VerifiedDelegates.findIndex((d) => equalAddresses(d.address, address)) >= 0;
  const { announce } = useDelegateAnnounce(address);

  return (
    <DataList.Item className="min-w-fit !py-0 px-4 md:px-6" {...otherProps}>
      <div className="flex flex-col items-start justify-center gap-y-3 py-4 md:min-w-44 md:py-6">
        <div className="flex w-full items-center justify-between">
          <MemberAvatar address={address} avatarSrc={avatarSrc} responsiveSize={{ md: "md" }} />
          <If true={isCurrentUser}>
            <Then>
              <Tag variant="neutral" label="You" />
            </Then>
            <ElseIf true={isMyDelegate}>
              <Tag variant="info" label="Your Delegate" />
            </ElseIf>
            <ElseIf true={isVerified}>
              <Tag variant="success" label="Verified" />
            </ElseIf>
            <Else>
              <Tag variant="neutral" label="Unverified" />
            </Else>
          </If>
        </div>

        <p className="inline-block w-full truncate text-lg text-neutral-800 md:text-xl">
          <If true={announce?.identifier}>
            <Then>
              <span>{announce?.identifier}</span>
              <br />
              <span className="text-sm text-neutral-400">{formatHexString(address)}</span>
            </Then>
            <Else>{formatHexString(address)}</Else>
          </If>
        </p>

        <If true={votingPower}>
          <div className="flex h-12 flex-col gap-y-2">
            <p className="text-sm md:text-base">
              <span className="text-neutral-500">Voting Power: </span>
              {formatEther(votingPower ?? BigInt(0))}
            </p>
          </div>
        </If>
      </div>
    </DataList.Item>
  );
};
