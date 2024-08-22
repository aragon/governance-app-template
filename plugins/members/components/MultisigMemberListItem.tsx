import { Else, If, Then } from "@/components/if";
import { formatHexString, equalAddresses } from "@/utils/evm";
import { type IDataListItemProps, DataList, MemberAvatar, Tag } from "@aragon/ods";
import { useAccount } from "wagmi";
import { Address } from "viem";

export interface IMultisigMemberListItemProps extends IDataListItemProps {
  /** 0x address of the user */
  address: Address;
  /** Direct URL src of the user avatar image to be rendered */
  avatarSrc?: string;
}

export const MultisigMemberListItem: React.FC<IMultisigMemberListItemProps> = (props) => {
  const { avatarSrc, address, ...otherProps } = props;
  const { address: currentUserAddress, isConnected } = useAccount();
  const isCurrentUser = isConnected && address && equalAddresses(currentUserAddress, address);

  return (
    <DataList.Item className="min-w-fit !py-0 px-4 md:px-6" {...otherProps}>
      <div className="flex flex-col items-start justify-center gap-y-3 py-4 md:min-w-44 md:py-6">
        <div className="flex w-full items-center justify-between">
          <MemberAvatar address={address} avatarSrc={avatarSrc} responsiveSize={{ md: "md" }} />
          <If true={isCurrentUser}>
            <Then>
              <Tag variant="success" label="You" />
            </Then>
            <Else>
              <Tag variant="success" label="Signer" />
            </Else>
          </If>
        </div>

        <p className="inline-block w-full truncate text-lg text-neutral-800 md:text-xl">{formatHexString(address)}</p>
      </div>
    </DataList.Item>
  );
};
