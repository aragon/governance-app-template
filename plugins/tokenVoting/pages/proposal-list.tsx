import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { ReactNode, useEffect, useState } from "react";
import ProposalCard from "@/plugins/tokenVoting/components/proposal";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import { Button, CardEmptyState, IconType } from "@aragon/ods";
import { useCanCreateProposal } from "@/plugins/tokenVoting/hooks/useCanCreateProposal";
import Link from "next/link";
import { Else, ElseIf, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { PUB_TOKEN_VOTING_PLUGIN_ADDRESS } from "@/constants";
import { useVotingToken } from "@/plugins/tokenVoting/hooks/useVotingToken";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useRouter } from "next/router";

const PROPOSALS_PER_PAGE = 10;

export default function Proposals() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { push } = useRouter();
  const [proposalCount, setProposalCount] = useState(0);
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const canCreate = useCanCreateProposal();
  const { tokenSupply } = useVotingToken();

  const [currentPage, setCurrentPage] = useState(0);
  const [paginatedProposals, setPaginatedProposals] = useState<number[]>([]);

  useEffect(() => {
    const start = currentPage * PROPOSALS_PER_PAGE;
    const end = (currentPage + 1) * PROPOSALS_PER_PAGE;
    const propIds = new Array(proposalCount).fill(0).map((_, i) => i);
    setPaginatedProposals(propIds.slice(start, end));
  }, [proposalCount, currentPage]);

  const {
    data: proposalCountResponse,
    isLoading,
    refetch,
  } = useReadContract({
    address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
    abi: TokenVotingAbi,
    functionName: "proposalCount",
  });

  useEffect(() => {
    if (!proposalCountResponse) return;
    setProposalCount(Number(proposalCountResponse));
  }, [proposalCountResponse]);

  useEffect(() => {
    refetch();
  }, [blockNumber]);

  const skipRender = useSkipFirstRender();
  if (skipRender) return <></>;

  return (
    <MainSection>
      <SectionView>
        <h1 className="justify-self-start text-3xl font-semibold align-middle">
          Proposals
        </h1>
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
          {paginatedProposals.map((_, i) => (
            <ProposalCard
              key={i}
              proposalId={BigInt(
                proposalCount! - 1 - currentPage * PROPOSALS_PER_PAGE - i
              )}
              tokenSupply={tokenSupply || BigInt("0")}
            />
          ))}
          <div className="w-full flex flex-row justify-end gap-2 mt-4 mb-10">
            <Button
              variant="tertiary"
              size="sm"
              disabled={!currentPage}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
              iconLeft={IconType.CHEVRON_LEFT}
            >
              Previous
            </Button>
            <Button
              variant="tertiary"
              size="sm"
              disabled={(currentPage + 1) * PROPOSALS_PER_PAGE >= proposalCount}
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
            <CardEmptyState
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
          </SectionView>
        </ElseIf>
        <Else>
          <SectionView>
            <CardEmptyState
              className="w-full"
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
          </SectionView>
        </Else>
      </If>
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
