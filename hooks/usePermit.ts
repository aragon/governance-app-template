import { useEffect } from "react";
import { useReadContracts, useSignTypedData, useAccount } from "wagmi";
import { hexToSignature, Address } from "viem";
import { ERC20PermitAbi } from "@/artifacts/ERC20Permit.sol";
import { useAlerts, AlertContextProps } from "@/context/Alerts";
import { PUB_CHAIN, PUB_TOKEN_ADDRESS } from "@/constants";

export function usePermit() {
  const { addAlert } = useAlerts() as AlertContextProps;

  const account_address = useAccount().address!;
  const erc20Contract = {
    address: PUB_TOKEN_ADDRESS,
    abi: ERC20PermitAbi,
  };
  const { data: erc20data, refetch: erc20refetch } = useReadContracts({
    contracts: [
      {
        ...erc20Contract,
        functionName: "nonces",
        args: [account_address],
      },
      {
        ...erc20Contract,
        functionName: "name",
      },
      {
        ...erc20Contract,
        functionName: "version",
      },
    ],
  });
  const [nonceResult, nameResult, versionResult] = erc20data || [];

  const { signTypedDataAsync: permitSign, status: permitSignStatus, error: permitSignError } = useSignTypedData();

  useEffect(() => {
    switch (permitSignStatus) {
      case "idle":
      case "pending":
        return;
      case "error":
        if (permitSignError?.message?.startsWith("User rejected the request")) {
          addAlert("The transaction signature was declined", {
            description: "Nothing will be sent to the network",
            timeout: 4 * 1000,
          });
        } else {
          addAlert("Could not sign the permit", { type: "error", timeout: 1500 });
        }
        return;
      case "success":
        addAlert("Permit signed", { type: "success", timeout: 1500 });
        return;
    }
  }, [permitSignStatus]);

  const signPermit = async (
    dest: Address,
    value: bigint,
    deadline: bigint = BigInt(Math.floor(Date.now() / 1000) + 60 * 60)
  ) => {
    if (!nonceResult || !nameResult || !versionResult) return;

    const nonce = BigInt(Number(nonceResult?.result));
    const erc20_name = String(nameResult?.result);
    /* We assume 1 if permit version is not specified */
    const versionFromContract = String(versionResult?.result ?? "1");

    const domain = {
      chainId: PUB_CHAIN.id,
      name: erc20_name,
      version: versionFromContract,
      verifyingContract: PUB_TOKEN_ADDRESS,
    };

    const types = {
      Permit: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
        { name: "value", type: "uint256" },
        { name: "nonce", type: "uint256" },
        { name: "deadline", type: "uint256" },
      ],
    };

    const message = {
      owner: account_address,
      spender: dest,
      value,
      nonce,
      deadline,
    };

    try {
      const sig = await permitSign({
        account: account_address,
        types,
        domain,
        primaryType: "Permit",
        message,
      });

      return hexToSignature(sig);
    } catch (e) {
      return;
    }
  };

  return {
    refetchPermitData: erc20refetch,
    signPermit,
  };
}
