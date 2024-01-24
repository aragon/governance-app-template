import { useContractRead } from "wagmi";
import { ReactNode, useEffect, useState } from "react";
import Proposal from "@/components/proposal";
import { Address } from "viem";
import { TokenVotingAbi } from "../../artifacts/TokenVoting.sol";
import { Button, Icon, IconType } from "@aragon/ods";
import { useCanCreateProposal } from "@/hooks/useCanCreateProposal";
import Link from "next/link";
import { If, IfNot } from "@/components/if";

const pluginAddress = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address;

export default function Proposals() {
  const [skipRender, setSkipRender] = useState(true);
  const [proposalCount, setProposalCount] = useState(0);
  const canCreate = useCanCreateProposal();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Change this to the number of items you want per page
  const [paginatedProposals, setPaginatedProposals] = useState([]);

  useEffect(() => {
    const start = (currentPage) * itemsPerPage;
    const end = (currentPage + 1)* itemsPerPage;
    setPaginatedProposals([...Array(proposalCount)].slice(start, end));
  }, [proposalCount, currentPage]);



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
              <Button iconLeft={IconType.ADD} size="md" variant="primary">
                Submit Proposal
              </Button>
            </Link>
          </If>
        </div>
      </SectionView>
      <If condition={proposalCount}>
        {paginatedProposals.map((_, i) => (
          <Proposal 
            key={BigInt((proposalCount! - 1) - (currentPage*itemsPerPage) - i)} 
            proposalId={BigInt((proposalCount! - 1) - (currentPage*itemsPerPage) - i)} />
        ))}
        <div className="flex flex-row gap-2 mt-4">
          <Button 
            variant="tertiary"
            size="md"
            disabled={!currentPage}
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
            iconLeft={IconType.CHEVRON_LEFT}
          >
            Previous
          </Button>
          <Button 
            variant="tertiary"
            size="md"
            disabled={(currentPage + 1) * itemsPerPage > proposalCount}
            onClick={() => setCurrentPage((page) => page + 1)}
            iconRight={IconType.CHEVRON_RIGHT}
          >
            Next
          </Button>
        </div>
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
