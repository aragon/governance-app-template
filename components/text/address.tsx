import { formatHexString } from "@/utils/evm";
import { getChildrenText } from "@/utils/content";
import { type ReactNode, useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
// import { Link } from '@aragon/ods'

export const AddressText = ({ children }: { children: ReactNode }) => {
  const address = getChildrenText(children);
  const client = usePublicClient();
  const [link, setLink] = useState<string>();

  useEffect(() => {
    if (!client) return;

    setLink(`${client.chain.blockExplorers?.default.url}/address/${address}`);
  }, [address, client]);

  const formattedAddress = formatHexString(address.trim());
  if (!link) {
    return <span className="font-semibold text-primary-400 underline">{formattedAddress}</span>;
  }
  return (
    <>
      <a href={link} target="_blank" className="font-semibold text-primary-400 underline">
        {formattedAddress}
      </a>
    </>
  );
};
