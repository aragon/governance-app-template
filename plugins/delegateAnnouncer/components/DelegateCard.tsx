import { If } from "@/components/if";
import Image from "next/image";
import { Button, Card, Link } from "@aragon/ods";
import { useAccount } from "wagmi";
import { Address, formatUnits } from "viem";
import { useEnsName, useEnsAvatar } from "wagmi";
import { normalize } from "viem/ens";
import { mainnet } from "wagmi/chains";
import { useReadContract, useWriteContract } from "wagmi";
import { iVotesAbi } from "../artifacts/iVotes.sol";
import { formatHexString } from "@/utils/evm";
import * as DOMPurify from "dompurify";

type DelegateCardProps = {
  delegate: Address;
  tokenAddress: Address;
  message: string;
  delegates: Address;
};
export const DelegateCard = ({ delegate, message, tokenAddress }: DelegateCardProps) => {
  const account = useAccount();
  const result = useEnsName({
    chainId: mainnet.id,
    address: delegate,
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
    args: [delegate],
  });
  const { writeContract: delegateWrite } = useWriteContract();

  const delegateTo = () => {
    delegateWrite({
      abi: iVotesAbi,
      address: tokenAddress,
      functionName: "delegate",
      args: [delegate],
    });
  };

  return (
    <Card className="space-between flex flex-col p-3">
      <div className="flex flex-row">
        <Image
          src={avatarResult.data ? avatarResult.data : "/profile.jpg"}
          width="24"
          height="24"
          className="m-2 w-12 rounded-xl"
          alt="profile pic"
        />
        <div className="flex flex-col justify-center">
          <Link className="">{result.data ? result.data : formatHexString(delegate)}</Link>
          <p className="text-sm text-neutral-300">{votingPower ? formatUnits(votingPower!, 18)! : 0} Voting Power</p>
        </div>
      </div>
      <div
        className="text-md m-1 grow text-neutral-500"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }}
      />
      <If condition={account.address && account.address !== delegate}>
        <div className="mt-1">
          <Button variant="tertiary" size="sm" onClick={() => delegateTo()}>
            Delegate
          </Button>
        </div>
      </If>
    </Card>
  );
};
