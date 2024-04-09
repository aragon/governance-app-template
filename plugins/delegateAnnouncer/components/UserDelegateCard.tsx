import { useState } from "react";
import { If } from "@/components/if";
import Image from "next/image";
import { Button, Card, Link, TextAreaRichText } from "@aragon/ods";
import { Address, formatUnits, toHex } from "viem";
import { useEnsName, useEnsAvatar } from "wagmi";
import { normalize } from "viem/ens";
import { mainnet } from "wagmi/chains";
import { useReadContract, useWriteContract } from "wagmi";
import { iVotesAbi } from "../artifacts/iVotes.sol";
import { formatHexString } from "@/utils/evm";
import { DelegateAnnouncerAbi } from "@/plugins/delegateAnnouncer/artifacts/DelegateAnnouncer.sol";
import * as DOMPurify from "dompurify";
import { PUB_DAO_ADDRESS, PUB_DELEGATION_CONTRACT_ADDRESS } from "@/constants";

type SelfDelegationProfileCardProps = {
  address: Address;
  tokenAddress: Address;
  loading: boolean;
  message: string | undefined;
  delegates: Address;
};

export const SelfDelegationProfileCard = ({
  address,
  tokenAddress,
  message,
  loading,
  delegates,
}: SelfDelegationProfileCardProps) => {
  const [inputDescription, setInputDescription] = useState<string>();
  const result = useEnsName({
    chainId: mainnet.id,
    address,
  });
  const avatarResult = useEnsAvatar({
    name: normalize(result.data!),
    chainId: mainnet.id,
    gatewayUrls: ["https://cloudflare-ipfs.com"],
  });
  const { data: votingPower } = useReadContract({
    abi: iVotesAbi,
    address: tokenAddress,
    functionName: "getVotes",
    args: [address],
  });
  const { writeContract: delegateWrite } = useWriteContract();
  const { writeContract: delegateAnnouncementWrite } = useWriteContract();

  const delegateTo = () => {
    delegateWrite({
      abi: iVotesAbi,
      address: tokenAddress,
      functionName: "delegate",
      args: [address],
    });
  };

  const announceDelegate = () => {
    delegateAnnouncementWrite({
      abi: DelegateAnnouncerAbi,
      address: PUB_DELEGATION_CONTRACT_ADDRESS,
      functionName: "announceDelegation",
      args: [PUB_DAO_ADDRESS, toHex(inputDescription!)],
    });
  };

  return (
    <Card className="space-between flex flex-col p-3">
      <div className="flex flex-row">
        <Image
          src={avatarResult.data ? avatarResult.data : "/profile.jpg"}
          width="48"
          height="48"
          className="m-2 w-24 rounded-xl"
          alt="profile pic"
        />
        <div className="flex flex-col justify-center">
          <Link className="!font-xl !text-xl">{result.data ? result.data : formatHexString(address)}</Link>
          <p className="text-md text-neutral-300">{votingPower ? formatUnits(votingPower!, 18)! : 0} Voting Power</p>
        </div>
      </div>
      <div className="text-md m-1 grow text-neutral-500">
        <If condition={message}>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(message ?? ""),
            }}
          />
        </If>
        <If condition={!loading && !message}>
          <TextAreaRichText
            label="Summary"
            className="pt-2"
            value={inputDescription}
            onChange={setInputDescription}
            placeholder="A brief description of who you are and what you can bring to the DAO"
          />
        </If>
      </div>
      <div className="flex flex-row gap-2">
        <If condition={delegates !== address}>
          <div className="mt-1">
            <Button variant="secondary" size="sm" onClick={() => delegateTo()}>
              Delegate
            </Button>
          </div>
        </If>
        <If not={message}>
          <div className="mt-1">
            <Button
              variant="primary"
              size="sm"
              disabled={inputDescription === "<p></p>" || !inputDescription}
              onClick={() => announceDelegate()}
            >
              Announce yourself
            </Button>
          </div>
        </If>
      </div>
    </Card>
  );
};
