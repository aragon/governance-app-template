import { formatHexString, getTransactionExplorerLink } from "@/utils/evm";
import { getChildrenText } from "@/utils/content";
import { ReactNode, useState, useEffect } from "react";
import { usePublicClient } from 'wagmi'
// import { Link } from '@aragon/ods'

export const TransactionText = ({ children }: { children: ReactNode }) => {
  const txHash = getChildrenText(children);
  const client = usePublicClient()
  const [link, setLink] = useState<string>();

  const formattedAddress = formatHexString(txHash.trim());
  useEffect(() => {
    setLink(client.chain.blockExplorers?.default.url + "/tx/" + txHash)
  }, [txHash, client])


  if (!link) {
    return (
      <span className="text-primary-400 font-semibold underline">{formattedAddress}</span>
    );
  }
  return (
    <>
      {/**
        <Link href={link} iconRight="LINK_EXTERNAL">
          {formattedAddress}
        </Link>
     */}
    <a href={link} target="_blank" className="text-primary-400 font-semibold underline">
      {formattedAddress}
    </a>
    </>
  );
};
