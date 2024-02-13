import DelegationPage from "./pages/index";
// import { useUrlHash } from "use-url-hash";
// import { NotFound } from "@/components/not-found";

export default function PluginPage() {
  // Select the inner pages to display depending on the URL hash
  // const hash = useUrlHash();

  // if (!hash || hash === "/") return <ProposalList />;
  // else if (hash === "/new") return <ProposalCreate />;
  // else if (hash.startsWith("/proposals/")) {
  //   const id = hash.replace("/proposals/", "");
  //   return <ProposalDetail id={id} />;
  // }

  // Default not found page
  // return <NotFound />;

  return <DelegationPage />;
}
