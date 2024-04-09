import { useEffect, useState } from "react";
import { DelegateAnnouncerAbi } from "@/plugins/delegateAnnouncer/artifacts/DelegateAnnouncer.sol";
import { Address, PublicClient, getAbiItem, fromHex } from "viem";
import { DelegateAnnounce } from "../utils/types";
import { PUB_DELEGATION_ANNOUNCEMENTS_START_BLOCK } from "@/constants";

const AnnounceDelegationEvent = getAbiItem({ abi: DelegateAnnouncerAbi, name: "AnnounceDelegation" });

export function useDelegateAnnouncements(publicClient: PublicClient, delegationContract: Address, daoAddress: Address) {
  const [delegateAnnouncements, setDelegateAnnouncements] = useState<DelegateAnnounce[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    publicClient
      .getLogs({
        address: delegationContract,
        event: AnnounceDelegationEvent,
        args: {
          dao: daoAddress,
        } as any,
        fromBlock: PUB_DELEGATION_ANNOUNCEMENTS_START_BLOCK,
        toBlock: "latest",
      })
      .then((logs) => {
        const announcements = logs.map((log) => ({
          logIndex: log.logIndex,
          dao: log.args.dao ?? "0x",
          delegate: log.args.delegate ?? "0x",
          message: fromHex(log.args.message ?? "0x", "string"),
        }));
        setDelegateAnnouncements(announcements);
      })
      .catch((err) => {
        console.error("Could not fetch the delegates list", err);
        return null;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { delegateAnnouncements, isLoading };
}
