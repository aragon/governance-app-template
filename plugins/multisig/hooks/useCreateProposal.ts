import { useRouter } from "next/router";
import { useState } from "react";
import { ProposalMetadata, RawAction } from "@/utils/types";
import { useAlerts } from "@/context/Alerts";
import { PUB_APP_NAME, PUB_CHAIN, PUB_MULTISIG_PLUGIN_ADDRESS, PUB_PROJECT_URL } from "@/constants";
import { uploadToPinata } from "@/utils/ipfs";
import { MultisigPluginAbi } from "../artifacts/MultisigPlugin.sol";
import { URL_PATTERN } from "@/utils/input-values";
import { toHex } from "viem";
import { useTransactionManager } from "@/hooks/useTransactionManager";

const PROPOSAL_EXPIRATION_TIME = 60 * 60 * 24 * 10; // 10 days in seconds
const UrlRegex = new RegExp(URL_PATTERN);

type CreateProposalParams = {
  allowFailureMap?: number;
  approveProposal?: boolean;
  tryExecution?: boolean;
};

export function useCreateProposal() {
  const { push } = useRouter();
  const { addAlert } = useAlerts();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [actions, setActions] = useState<RawAction[]>([]);
  const [resources, setResources] = useState<{ name: string; url: string }[]>([
    { name: PUB_APP_NAME, url: PUB_PROJECT_URL },
  ]);

  const {
    writeContract: createProposalWrite,
    isConfirming,
    status,
  } = useTransactionManager({
    onSuccessMessage: "Proposal created",
    onSuccess() {
      setTimeout(() => {
        push("#/");
        window.scroll(0, 0);
      }, 1000 * 2);
    },
    onErrorMessage: "Could not create the proposal",
    onError: () => setIsCreating(false),
  });

  const submitProposal = async ({ allowFailureMap, approveProposal, tryExecution }: CreateProposalParams = {}) => {
    // Check metadata
    if (!title.trim()) {
      return addAlert("Invalid proposal details", {
        description: "Please enter a title",
        type: "error",
      });
    }

    if (!summary.trim()) {
      return addAlert("Invalid proposal details", {
        description: "Please enter a summary of what the proposal is about",
        type: "error",
      });
    }

    for (const item of resources) {
      if (!item.name.trim()) {
        return addAlert("Invalid resource name", {
          description: "Please enter a name for all the resources",
          type: "error",
        });
      } else if (!UrlRegex.test(item.url.trim())) {
        return addAlert("Invalid resource URL", {
          description: "Please enter valid URL for all the resources",
          type: "error",
        });
      }
    }

    if (typeof allowFailureMap === "number" && (allowFailureMap >= 256 || allowFailureMap < 0)) {
      return addAlert("Internal error", { description: "Received an invalid proposal parameter", type: "error" });
    }

    try {
      setIsCreating(true);
      const proposalMetadataJsonObject: ProposalMetadata = {
        title,
        summary,
        description,
        resources,
      };

      const ipfsPin = await uploadToPinata(JSON.stringify(proposalMetadataJsonObject));
      const endDate = Math.floor(Date.now() / 1000) + PROPOSAL_EXPIRATION_TIME;

      createProposalWrite({
        chainId: PUB_CHAIN.id,
        abi: MultisigPluginAbi,
        address: PUB_MULTISIG_PLUGIN_ADDRESS,
        functionName: "createProposal",
        args: [
          toHex(ipfsPin),
          actions,
          BigInt(allowFailureMap || 0),
          approveProposal ?? false,
          tryExecution ?? false,
          BigInt(0), // startDate: now
          BigInt(endDate), // endDate: now + 10 days
        ],
      });
    } catch (err) {
      setIsCreating(false);
    }
  };

  return {
    isCreating: isCreating || isConfirming || status === "pending",
    title,
    summary,
    description,
    actions,
    resources,
    setTitle,
    setSummary,
    setDescription,
    setActions,
    setResources,
    submitProposal,
  };
}
