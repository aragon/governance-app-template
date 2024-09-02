import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProposalMetadata, RawAction } from "@/utils/types";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useAlerts } from "@/context/Alerts";
import {
  PUB_APP_NAME,
  PUB_CHAIN,
  PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
  PUB_MULTISIG_PLUGIN_ADDRESS,
  PUB_PROJECT_URL,
} from "@/constants";
import { uploadToPinata } from "@/utils/ipfs";
import { MultisigPluginAbi } from "../artifacts/MultisigPlugin";
import { URL_PATTERN } from "@/utils/input-values";
import { toHex } from "viem";
import { useTransactionManager } from "@/hooks/useTransactionManager";

const UrlRegex = new RegExp(URL_PATTERN);

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

  const { writeContract: createProposalWrite, isConfirming } = useTransactionManager({
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

  const submitProposal = async () => {
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

    try {
      setIsCreating(true);
      const proposalMetadataJsonObject: ProposalMetadata = {
        title,
        summary,
        description,
        resources,
      };

      const ipfsPin = await uploadToPinata(JSON.stringify(proposalMetadataJsonObject));

      createProposalWrite({
        chainId: PUB_CHAIN.id,
        abi: MultisigPluginAbi,
        address: PUB_MULTISIG_PLUGIN_ADDRESS,
        functionName: "createProposal",
        args: [toHex(ipfsPin), actions, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS, false],
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
