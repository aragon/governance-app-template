import { Address, keccak256, toHex } from "viem";
import { useState, useEffect } from "react";
import { useBalance, useAccount, useReadContracts, useConfig } from "wagmi";
import { readContract } from "@wagmi/core";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { DaoAbi } from "@/artifacts/DAO.sol";
import { PUB_CHAIN, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS } from "@/constants";

export function useCanCreateProposal() {
  const config = useConfig();
  const { address } = useAccount();
  const [minProposerVotingPower, setMinProposerVotingPower] =
    useState<bigint>();
  const [votingToken, setVotingToken] = useState<Address>();
  const [daoAddress, setDaoAddress] = useState<Address>();
  const [hasCreatePermission, setHasCreatePermission] = useState(false);
  const { data: balance } = useBalance({
    address,
    token: votingToken,
    chainId: PUB_CHAIN.id,
  });

  const { data: contractReads } = useReadContracts({
    contracts: [
      {
        chainId: PUB_CHAIN.id,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "minProposerVotingPower",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "getVotingToken",
      },
      {
        chainId: PUB_CHAIN.id,
        address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        abi: OptimisticTokenVotingPluginAbi,
        functionName: "dao",
      },
      // TODO: This needs to be checking as well if address has the DAO permission to create props
    ],
  });

  useEffect(() => {
    if (!contractReads?.length || contractReads?.length < 2) return;

    setMinProposerVotingPower(contractReads[0].result as bigint);
    setVotingToken(contractReads[1].result as Address);
    setDaoAddress(contractReads[2].result as Address);
  }, [
    contractReads?.[0]?.status,
    contractReads?.[1]?.status,
    contractReads?.[2]?.status,
  ]);

  // Check if PROPOSER_PERMISSION is granted to the current wallet
  useEffect(() => {
    if (!address || !daoAddress) return;

    readContract(config, {
      chainId: PUB_CHAIN.id,
      address: daoAddress,
      abi: DaoAbi,
      functionName: "hasPermission",
      // where, who, permissionId, data
      args: [
        PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
        address,
        keccak256(toHex("PROPOSER_PERMISSION")),
        "0x",
      ],
    })
      .then((result) => {
        setHasCreatePermission(!!result);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [daoAddress, address]);

  if (!address) return false;
  else if (!hasCreatePermission) return false;
  else if (!balance) return false;
  else if (minProposerVotingPower) {
    if (balance?.value < minProposerVotingPower) return false;
  }

  return true;
}
