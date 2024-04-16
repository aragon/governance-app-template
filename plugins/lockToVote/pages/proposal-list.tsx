import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { type ReactNode, useEffect, useState } from "react";
import ProposalCard from "@/plugins/lockToVote/components/proposal";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { Button, Card, EmptyState, IconType } from "@aragon/ods";
import { useCanCreateProposal } from "@/plugins/lockToVote/hooks/useCanCreateProposal";
import Link from "next/link";
import { Else, ElseIf, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { PUB_CHAIN, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";
import { digestPagination } from "@/utils/pagination";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/router";

export default function Proposals() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { push } = useRouter();

  const { data: blockNumber } = useBlockNumber({ watch: true });
  const canCreate = useCanCreateProposal();
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: proposalCountResponse,
    isLoading,
    refetch,
  } = useReadContract({
    address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
    abi: OptimisticTokenVotingPluginAbi,
    functionName: "proposalCount",
    chainId: PUB_CHAIN.id,
  });

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  const proposalCount = Number(proposalCountResponse);
  const { visibleProposalIds, showNext, showPrev } = digestPagination(proposalCount, currentPage);

  return (
    <MainSection>
      <SectionView>
        <h1 className="justify-self-start align-middle text-3xl font-semibold">Proposals</h1>
        <div className="justify-self-end">
          <If condition={canCreate && proposalCount}>
            <Link href="#/new">
              <Button iconLeft={IconType.PLUS} size="md" variant="primary">
                Submit Proposal
              </Button>
            </Link>
          </If>
        </div>
      </SectionView>
      <If condition={proposalCount}>
        <Then>
          {visibleProposalIds.map((id) => (
            <ProposalCard key={id} proposalId={BigInt(id)} />
          ))}
          <div className="mb-10 mt-4 flex w-full flex-row justify-end gap-2">
            <Button
              variant="tertiary"
              size="sm"
              disabled={!showPrev}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
              iconLeft={IconType.CHEVRON_LEFT}
            >
              Previous
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              disabled={!showNext}
              onClick={() => setCurrentPage((page) => page + 1)}
              iconRight={IconType.CHEVRON_RIGHT}
            >
              Next
            </Button>
          </div>
        </Then>
        <ElseIf condition={isLoading}>
          <SectionView>
            <PleaseWaitSpinner />
          </SectionView>
        </ElseIf>
        <ElseIf condition={isConnected}>
          <SectionView>
            <Card className="w-full">
              <EmptyState
                className="w-full md:w-full lg:w-full xl:w-full"
                heading="There are no proposals yet"
                humanIllustration={{
                  body: "VOTING",
                  expression: "SMILE",
                  hairs: "CURLY",
                }}
                primaryButton={{
                  label: "Submit the first one",
                  iconLeft: IconType.PLUS,
                  onClick: () => push("#/new"),
                }}
              />
            </Card>
          </SectionView>
        </ElseIf>
        <Else>
          <SectionView>
            <Card className="w-full">
              <EmptyState
                className="w-full md:w-full lg:w-full xl:w-full"
                heading="There are no proposals yet"
                humanIllustration={{
                  body: "VOTING",
                  expression: "SMILE",
                  hairs: "CURLY",
                }}
                primaryButton={{
                  label: "Connect your wallet",
                  onClick: () => open(),
                }}
              />
            </Card>
          </SectionView>
        </Else>
      </If>
    </MainSection>
  );
}

function MainSection({ children }: { children: ReactNode }) {
  return <main className="flex w-screen max-w-full flex-col items-center pt-6">{children}</main>;
}

function SectionView({ children }: { children: ReactNode }) {
  return <div className="mb-6 flex w-full flex-row content-center justify-between">{children}</div>;
}
