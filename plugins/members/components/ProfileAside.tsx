import { If } from "@/components/if";
import { PUB_CHAIN } from "@/constants";
import { formatHexString } from "@/utils/evm";
import { type IResource } from "@/utils/types";
import { Card, Heading, IconType, Link } from "@aragon/ods";
import React from "react";
import { type Address } from "viem";
import { useEnsName } from "wagmi";

interface IProfileAsideProps {
  address: string;
  resources?: IResource[];
}

export const ProfileAside: React.FC<IProfileAsideProps> = (props) => {
  const { address, resources } = props;
  const { data: ensName } = useEnsName({ chainId: PUB_CHAIN.id, address: address as Address });
  const formattedAddress = formatHexString(address);
  const explorerUrl = `${PUB_CHAIN.blockExplorers?.default.url}/address/${address}`;

  return (
    <>
      <Card className="w-full p-4 shadow-neutral md:p-6">
        <div className="flex flex-col gap-y-4">
          <Heading size="h3">Details</Heading>
          <hr className="border-neutral-100" />
          <div className="flex flex-col gap-y-4">
            <Link
              target="_blank"
              key={1}
              href={explorerUrl}
              variant="primary"
              iconRight={IconType.LINK_EXTERNAL}
              description={ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
            >
              Show on the block explorer
            </Link>
          </div>
        </div>
      </Card>

      <If true={!!resources?.length}>
        <Card className="w-full p-4 shadow-neutral md:p-6">
          <div className="flex flex-col gap-y-4">
            <Heading size="h3">Resources</Heading>
            <hr className="border-neutral-100" />
            <div className="flex flex-col gap-y-4">
              {(resources || []).map(({ name, link }) => (
                <Link
                  key={link}
                  href={link}
                  description={link}
                  iconRight={IconType.LINK_EXTERNAL}
                  target="_blank"
                  rel="noopener"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        </Card>
      </If>
    </>
  );
};
