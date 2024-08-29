import { NotFound } from "@/components/not-found";
import ProposalCreate from "./pages/new";
import ProposalList from "./pages/proposal-list";
import ProposalDetail from "./pages/proposal";
import { useUrl } from "@/hooks/useUrl";

export default function PluginPage() {
  // Select the inner pages to display depending on the URL hash
  const { hash } = useUrl();

  if (!hash || hash === "#/") return <ProposalList />;
  else if (hash === "#/new") return <ProposalCreate />;
  else if (hash.startsWith("#/proposals/")) {
    const id = hash.replace("#/proposals/", "");

    return <ProposalDetail index={parseInt(id)} />;
  }

  // Default not found page
  return <NotFound />;
}
