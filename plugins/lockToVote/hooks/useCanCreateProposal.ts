import { type Address, keccak256, toHex } from "viem";
import { useState, useEffect } from "react";
import { useBalance, useAccount, useReadContracts, useReadContract } from "wagmi";
import { LockToVetoPluginAbi } from "@/plugins/lockToVote/artifacts/LockToVetoPlugin.sol";
import { DaoAbi } from "@/artifacts/DAO.sol";
import { PUB_CHAIN, PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS } from "@/constants";
import { ADDRESS_ZERO } from "@/utils/evm";

export function useCanCreateProposal() {
  const { address } = useAccount();

  const [minProposerVotingPower, setMinProposerVotingPower] = useState<bigint>();
  const [votingToken, setVotingToken] = useState<Address>();
  const [daoAddress, setDaoAddress] = useState<Address>();
  const [hasCreatePermission, setHasCreatePermission] = useState(false);
  const { data: balance } = useBalance({
    address,
    token: votingToken,
    chainId: PUB_CHAIN.id,
    query: {
      enabled: !!address,
    },
  });

  const { data: contractReads } = useReadContracts({
    contracts: [
      {
        chainId: PUB_CHAIN.id,
        address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
        abi: LockToVetoPluginAbi,
        functionName: "minProposerVotingPower",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
        abi: LockToVetoPluginAbi,
        functionName: "getVotingToken",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS,
        abi: LockToVetoPluginAbi,
        functionName: "dao",
      },
      // TODO: This needs to be checking as well if address has the DAO permission to create props
    ],
  });

  // Check if PROPOSER_PERMISSION is granted to the current wallet
  const {
    data: hasCreatePermissionData,
    refetch: hasCreatePermissionRefetch,
    status: hasCreatePermissionStatus,
  } = useReadContract({
    chainId: PUB_CHAIN.id,
    address: daoAddress,
    abi: DaoAbi,
    functionName: "hasPermission",
    // where, who, permissionId, data
    args: [PUB_LOCK_TO_VOTE_PLUGIN_ADDRESS, address ?? ADDRESS_ZERO, keccak256(toHex("PROPOSER_PERMISSION")), "0x"],
    query: {
      enabled: !!daoAddress && !!address,
    },
  });

  useEffect(() => {
    if (!contractReads?.length || contractReads?.length < 2) return;

    setMinProposerVotingPower(contractReads[0].result as bigint);
    setVotingToken(contractReads[1].result as Address);
    setDaoAddress(contractReads[2].result as Address);
  }, [contractReads?.[0]?.status, contractReads?.[1]?.status, contractReads?.[2]?.status]);

  useEffect(() => {
    setHasCreatePermission(!!hasCreatePermissionData);
  }, [hasCreatePermissionStatus]);

  useEffect(() => {
    hasCreatePermissionRefetch();
  }, [daoAddress, address]);

  if (!address) return false;
  else if (!hasCreatePermission) return false;
  else if (!balance) return false;
  else if (minProposerVotingPower) {
    if (balance?.value < minProposerVotingPower) return false;
  }

  return true;
}
