import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Avatar, Card, Link } from "@aragon/ods";
import { useAccount, useEnsName, useEnsAvatar } from "wagmi";
import { type Address } from "viem";
import { formatHexString } from "@/utils/evm";
import { normalize } from "viem/ens";
import { createClient, http } from "viem";
import { createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { PUB_ALCHEMY_API_KEY } from "@/constants";

const config = createConfig({
  chains: [mainnet],
  ssr: true,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(`https://eth-mainnet.g.alchemy.com/v2/${PUB_ALCHEMY_API_KEY}`, { batch: true }),
    });
  },
});

const WalletContainer = () => {
  const { address } = useAccount();
  const result = useEnsName({
    config,
    chainId: mainnet.id,
    address: address,
  });
  const avatarResult = useEnsAvatar({
    config,
    name: normalize(result.data!),
    chainId: mainnet.id,
    gatewayUrls: ["https://cloudflare-ipfs.com"],
  });
  const { open } = useWeb3Modal();

  return (
    <Card
      className="
        absolute right-0 top-0 m-2 flex cursor-pointer items-center !rounded-full border
        border-neutral-200 px-1 py-1 hover:drop-shadow md:relative md:right-auto md:top-auto md:m-0 
    "
      onClick={() => open()}
    >
      <Link className="mx-3 !text-sm" variant="neutral">
        {result.data ? result.data : formatHexString(address as Address)}
      </Link>
      <Avatar src={avatarResult.data ? avatarResult.data : "/profile.jpg"} size="md" alt="Profile picture" />
    </Card>
  );
};

export default WalletContainer;
