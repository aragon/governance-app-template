import { NotFound } from "@/components/not-found";
import ProposalList from "./pages/proposal-list";
import ProposalDetail from "./pages/proposal";
import { useUrl } from "@/hooks/useUrl";

export default function PluginPage() {
  // Select the inner pages to display depending on the URL hash
  const { hash } = useUrl();

  if (!hash || hash === "#/") return <ProposalList />;
  else if (hash.startsWith("#/proposals/")) {
    const index = parseInt(hash.replace("#/proposals/", ""));
    if (isNaN(index)) return <NotFound />;

    return <ProposalDetail index={index} />;
  }

  // Default not found page
  return <NotFound />;
}
