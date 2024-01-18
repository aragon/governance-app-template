import { useContractRead } from "wagmi";
import { ReactNode, useEffect, useState } from "react";
import Proposal from "@/components/proposal";
import { Address } from "viem";
import { TokenVotingAbi } from "../../artifacts/TokenVoting.sol";
import { Button, IconType } from "@aragon/ods";
import { useCanCreateProposal } from "@/hooks/useCanCreateProposal";
import Link from "next/link";
import { If, IfNot } from "@/components/if";

const pluginAddress = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address;

export default function Proposals() {
  const [skipRender, setSkipRender] = useState(true);
  const [proposalCount, setProposalCount] = useState(0);
  const canCreate = useCanCreateProposal();

  const { isLoading } = useContractRead({
    address: pluginAddress,
    abi: TokenVotingAbi,
    functionName: "proposalCount",
    watch: true,
    onSuccess(data) {
      setProposalCount(Number(data));
    },
  });

  useEffect(() => setSkipRender(false), []);
  if (skipRender) return <></>;

  return (
    <MainSection>
      <SectionView>
        <h1 className="justify-self-start text-3xl font-semibold align-middle">
          Proposals
        </h1>
        <div className="justify-self-end">
          <If condition={canCreate}>
            <Link href="/create">
              <Button iconLeft={IconType.ADD} size="lg" variant="primary">
                Submit Proposal
              </Button>
            </Link>
          </If>
        </div>
      </SectionView>
      <If condition={proposalCount}>
        {[...Array(proposalCount)].map((_, i) => (
          <Proposal key={i} proposalId={BigInt(proposalCount! - 1 - i)} />
        ))}
      </If>
      <IfNot condition={proposalCount}>
        <If condition={isLoading}>
          <SectionView>
            <p className="justify-self-start">Please wait...</p>
          </SectionView>
        </If>
      </IfNot>
    </MainSection>
  );
}

function MainSection({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col items-center mt-6 w-screen max-w-full">
      {children}
    </main>
  );
}

function SectionView({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row justify-between content-center w-full mb-6">
      {children}
    </div>
  );
}
