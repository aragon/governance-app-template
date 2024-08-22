import { NotFound } from "@/components/not-found";
import ProposalCreate from "./pages/new";
import ProposalList from "./pages/proposal-list";
import ProposalDetail from "./pages/proposal";
import { useUrl } from "@/hooks/useUrl";
import { Else, ElseIf, If, Then } from "@/components/if";

export default function PluginPage() {
  // Select the inner pages to display depending on the URL hash
  const { hash } = useUrl();

  return (
    <If some={[!hash, hash === "#/"]}>
      <Then>
        <ProposalList />
      </Then>
      <ElseIf val={hash} is="#/new">
        <ProposalCreate />
      </ElseIf>
      <ElseIf true={hash.startsWith("#/proposals/")}>
        <ProposalView hash={hash} />
      </ElseIf>
      <Else>
        <main className="flex w-full flex-col items-center px-4 py-6 md:w-4/5 md:p-6 lg:w-2/3 xl:py-10 2xl:w-3/5">
          <NotFound />
        </main>
      </Else>
    </If>
  );
}

const ProposalView = ({ hash }: { hash: string }) => {
  const id = hash.replace("#/proposals/", "");
  return <ProposalDetail id={id} />;
};
