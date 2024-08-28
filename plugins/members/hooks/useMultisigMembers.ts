import { usePublicClient } from "wagmi";
import { MultisigPluginAbi } from "@/plugins/members/artifacts/MultisigPlugin.sol";
import { PUB_MULTISIG_PLUGIN_ADDRESS } from "@/constants";
import { Address, PublicClient, getAbiItem } from "viem";
import { useEffect, useState } from "react";

const MembersAddedEvent = getAbiItem({
  abi: MultisigPluginAbi,
  name: "MembersAdded",
});
const MembersRemovedEvent = getAbiItem({
  abi: MultisigPluginAbi,
  name: "MembersRemoved",
});

export function useMultisigMembers() {
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [signers, setSigners] = useState<Address[]>([]);

  // Creation event
  useEffect(() => {
    if (!publicClient) return;

    loadSigners();
  }, [!!publicClient]);

  const loadSigners = () => {
    if (!publicClient) {
      setError(new Error("No public client available"));
      return;
    }
    setIsLoading(true);

    Promise.all([fetchAddedMembers(publicClient), fetchRemovedMembers(publicClient)])
      .then(([added, removed]) => {
        const result = computeFinalList(added, removed);

        setSigners(result);
        setIsLoading(false);
        setError(null);
      })
      .catch((err: any) => {
        console.error(err);
        setIsLoading(false);
        setError(err);
      });
  };

  // return { members, status, refetch };

  return {
    members: signers,
    isLoading,
    error,
    refetch: loadSigners,
  };
}

// Helpers

function fetchAddedMembers(publicClient: PublicClient): Promise<MemberAddRemoveItem[]> {
  return publicClient
    .getLogs({
      address: PUB_MULTISIG_PLUGIN_ADDRESS,
      event: MembersAddedEvent,
      // args: {},
      fromBlock: BigInt(0),
      toBlock: "latest",
    })
    .then((logs) => {
      if (!logs) throw new Error("Empty response");

      return logs.map((item) => {
        return {
          blockNumber: item.blockNumber,
          added: item.args.members || ([] as any),
          removed: [],
        };
      });
    });
}

function fetchRemovedMembers(publicClient: PublicClient): Promise<MemberAddRemoveItem[]> {
  return publicClient
    .getLogs({
      address: PUB_MULTISIG_PLUGIN_ADDRESS,
      event: MembersRemovedEvent,
      // args: {},
      fromBlock: BigInt(0),
      toBlock: "latest",
    })
    .then((logs) => {
      if (!logs) throw new Error("Empty response");

      return logs.map((item) => {
        return {
          blockNumber: item.blockNumber,
          added: [],
          removed: item.args.members || ([] as any),
        };
      });
    });
}

type MemberAddRemoveItem = {
  blockNumber: bigint;
  added: Address[];
  removed: Address[];
};

function computeFinalList(added: MemberAddRemoveItem[], removed: MemberAddRemoveItem[]) {
  const merged = added.concat(removed);
  const result = [] as Address[];

  merged.sort((a, b) => {
    return Number(a.blockNumber - b.blockNumber);
  });

  for (const item of merged) {
    for (const addr of item.added) {
      if (!result.includes(addr)) result.push(addr);
    }
    for (const addr of item.removed) {
      const idx = result.indexOf(addr);
      if (idx >= 0) result.splice(idx, 1);
    }
  }
  return result;
}
