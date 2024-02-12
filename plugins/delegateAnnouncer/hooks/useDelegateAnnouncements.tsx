import { useEffect, useState } from "react";
import { DelegateAnnouncerAbi } from "@/plugins/delegateAnnouncer/artifacts/DelegateAnnouncer.sol";
import { Address, PublicClient, getAbiItem, fromHex } from "viem";
// import { useBlockNumber } from "wagmi";
import { DelegateAnnounce } from "../utils/types";

const AnnounceDelegationEvent = getAbiItem({abi: DelegateAnnouncerAbi, name: "AnnounceDelegation"})
const DELEGATION_CONTRACT = (process.env.NEXT_PUBLIC_DELEGATION_CONTRACT || "") as Address;
const DAO_ADDRESS = (process.env.NEXT_PUBLIC_DAO_ADDRESS || "") as Address;

export function useDelegateAnnouncements(
    publicClient: PublicClient,
) {
    // const { data: blockNumber } = useBlockNumber({watch: true})
    const [delegateAnnouncements, setDelegateAnnouncements] = useState<DelegateAnnounce[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true)
            
        publicClient.getLogs({
            address: DELEGATION_CONTRACT,
            event: AnnounceDelegationEvent,
            args: {
                dao: DAO_ADDRESS
            } as any,
            fromBlock: BigInt(53386422),
            toBlock: 'latest'
        }).then((logs: any) => {
            setDelegateAnnouncements(
                logs.map((log) => ({
                    logIndex: log.logIndex,
                    dao: log.args.dao,
                    delegate: log.args.delegate,
                    message: fromHex(log.args.message, 'string'),
                }))
            )
        }).catch((err) => {
            console.error("Could not fetch the proposal defailt", err);
            return null;
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])

    return { delegateAnnouncements, isLoading }
}