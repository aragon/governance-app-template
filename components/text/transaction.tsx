import { formatHexString, getTransactionExplorerLink } from "@/utils/evm";
import { getChildrenText } from "@/utils/content";
import { ReactNode } from "react";
import { useWalletClient } from "wagmi";

export const TransactionText = ({ children }: { children: ReactNode }) => {
  const txHash = getChildrenText(children);
  const { data: client } = useWalletClient();

  const formattedAddress = formatHexString(txHash.trim());
  const link = getTransactionExplorerLink(txHash, client?.chain?.name || "");

  if (!link) {
    return (
      <span className="text-primary-400 font-semibold underline">{formattedAddress}</span>
    );
  }
  return (
    <a href={link} target="_blank" className="text-primary-400 font-semibold underline">
      {formattedAddress}
    </a>
  );
};
