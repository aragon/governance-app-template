import MembersPage from "./pages/index";
import { DelegateProfile } from "./pages/delegate-profile";
import { useUrl } from "@/hooks/useUrl";
import { NotFound } from "@/components/not-found";
import { Address } from "viem";

export default function PluginPage() {
  // Select the inner pages to display depending on the URL hash
  const { hash } = useUrl();

  if (!hash || hash === "#/") return <MembersPage />;
  else if (hash.startsWith("#/delegates/")) {
    const address = hash.replace("#/delegates/", "") as Address;
    return <DelegateProfile address={address} />;
  }

  // Default not found page
  return <NotFound />;
}
