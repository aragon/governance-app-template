import { create } from "ipfs-http-client";
import {
  Button,
  IconType,
  Icon,
  InputText,
  TextAreaRichText,
} from "@aragon/ods";
import React, { useEffect, useState } from "react";
import { uploadToIPFS } from "@/utils/ipfs";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { toHex } from "viem";
import { TokenVotingAbi } from "@/plugins/tokenVoting/artifacts/TokenVoting.sol";
import { useAlertContext } from "@/context/AlertContext";
import WithdrawalInput from "@/components/input/withdrawal";
import CustomActionInput from "@/components/input/custom-action";
import { Action } from "@/utils/types";
import { getPlainText } from "@/utils/html";
import { useRouter } from "next/router";
import { Else, IfCase, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import {
  PUB_IPFS_API_KEY,
  PUB_IPFS_ENDPOINT,
  PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
} from "@/constants";

enum ActionType {
  Signaling,
  Withdrawal,
  Custom,
}

const ipfsClient = create({
  url: PUB_IPFS_ENDPOINT,
  headers: { "X-API-KEY": PUB_IPFS_API_KEY, Accept: "application/json" },
});

export default function Create() {
  const { push } = useRouter();
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [actions, setActions] = useState<Action[]>([]);
  const { addAlert } = useAlertContext();
  const {
    writeContract: createProposalWrite,
    data: createTxHash,
    status,
    error,
  } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: createTxHash });
  const [actionType, setActionType] = useState<ActionType>(
    ActionType.Signaling
  );

  const changeActionType = (actionType: ActionType) => {
    setActions([]);
    setActionType(actionType);
  };

  useEffect(() => {
    if (status === "idle" || status === "pending") return;
    else if (status === "error") {
      if (error?.message?.startsWith("User rejected the request")) {
        addAlert("Transaction rejected by the user", {
          timeout: 4 * 1000,
        });
      } else {
        addAlert("Could not create the proposal", { type: "error" });
      }
      return;
    }

    // success
    if (!createTxHash) return;
    else if (isConfirming) {
      addAlert("Proposal submitted", {
        description: "Waiting for the transaction to be validated",
        txHash: createTxHash,
      });
      return;
    } else if (!isConfirmed) return;

    addAlert("Proposal created", {
      description: "The transaction has been validated",
      type: "success",
      txHash: createTxHash,
    });

    setTimeout(() => {
      push("#/");
    }, 1000 * 2);
  }, [status, createTxHash, isConfirming, isConfirmed]);

  const submitProposal = async () => {
    // Check metadata
    if (!title.trim())
      return addAlert("Please, enter a title", { type: "error" });

    const plainSummary = getPlainText(summary).trim();
    if (!plainSummary.trim())
      return addAlert("Please, enter a summary of what the proposal is about", {
        type: "error",
      });

    // Check the action
    switch (actionType) {
      case ActionType.Signaling:
        break;
      case ActionType.Withdrawal:
        if (!actions.length) {
          return addAlert(
            "Please ensure that the withdrawal address and the amount to transfer are valid",
            { type: "error" }
          );
        }
        break;
      default:
        if (!actions.length || !actions[0].data || actions[0].data === "0x") {
          return addAlert(
            "Please ensure that the values of the action to execute are correct",
            { type: "error" }
          );
        }
    }

    const proposalMetadataJsonObject = { title, summary };
    const blob = new Blob([JSON.stringify(proposalMetadataJsonObject)], {
      type: "application/json",
    });

    const ipfsPin = await uploadToIPFS(ipfsClient, blob);
    createProposalWrite({
      abi: TokenVotingAbi,
      address: PUB_TOKEN_VOTING_PLUGIN_ADDRESS,
      functionName: "createProposal",
      args: [toHex(ipfsPin), actions, 0, 0, 0, 0, 0],
    });
  };

  const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };

  const showLoading = status === "pending" || isConfirming;

  return (
    <section className="flex flex-col items-center w-screen max-w-full min-w-full">
      <div className="justify-between py-5 w-full">
        <h1 className="font-semibold text-neutral-900 text-3xl mb-10">
          Create Proposal
        </h1>
        <div className="mb-6">
          <InputText
            className=""
            label="Title"
            maxLength={100}
            placeholder="A short title that describes the main purpose"
            variant="default"
            value={title}
            onChange={handleTitleInput}
          />
        </div>
        <div className="mb-6">
          <TextAreaRichText
            label="Summary"
            className="pt-2"
            value={summary}
            onChange={setSummary}
            placeholder="A detailed description for what the proposal is all about"
          />
        </div>
        <div className="mb-6">
          <span className="block mb-2 text-lg text-neutral-900 ">
            Select proposal action
          </span>
          <div className="grid grid-cols-3 gap-5 h-24 mt-2">
            <div
              onClick={() => {
                changeActionType(ActionType.Signaling);
              }}
              className={`rounded-xl border border-solid border-2 bg-neutral-0 hover:bg-neutral-50 flex flex-col items-center cursor-pointer ${
                actionType === ActionType.Signaling
                  ? "border-primary-300"
                  : "border-neutral-100"
              }`}
            >
              <Icon
                className="mt-2 p-2 rounded-full text-primary-400 !h-12 !w-12"
                icon={IconType.INFO}
                size="lg"
              />
              <span className="text-sm text-neutral-400 text-center">
                Signaling
              </span>
            </div>
            <div
              onClick={() => changeActionType(ActionType.Withdrawal)}
              className={`rounded-xl border border-solid border-2 bg-neutral-0 hover:bg-neutral-50 flex flex-col items-center cursor-pointer ${
                actionType === ActionType.Withdrawal
                  ? "border-primary-300"
                  : "border-neutral-100"
              }`}
            >
              <Icon
                className="mt-2 p-2 rounded-full text-primary-400 !h-12 !w-12"
                icon={IconType.TX_WITHDRAW}
                size="lg"
              />
              <span className="text-sm text-neutral-400 text-center">
                DAO Payment
              </span>
            </div>
            <div
              onClick={() => changeActionType(ActionType.Custom)}
              className={`rounded-xl border border-solid border-2 bg-neutral-0 hover:bg-neutral-50 flex flex-col items-center cursor-pointer ${
                actionType === ActionType.Custom
                  ? "border-primary-300"
                  : "border-neutral-100"
              }`}
            >
              <Icon
                className="mt-2 p-2 rounded-full text-primary-400 !h-12 !w-12"
                icon={IconType.BLOCKCHAIN}
                size="lg"
              />
              <span className="text-sm text-neutral-400 text-center">
                Custom action
              </span>
            </div>
          </div>
          <div className="mb-6">
            {actionType === ActionType.Withdrawal && (
              <WithdrawalInput setActions={setActions} />
            )}
            {actionType === ActionType.Custom && (
              <CustomActionInput setActions={setActions} />
            )}
          </div>
        </div>

        <IfCase condition={showLoading}>
          <Then>
            <div className="mt-14 mb-6">
              <PleaseWaitSpinner fullMessage="Confirming transaction..." />
            </div>
          </Then>
          <Else>
            <Button
              className="mt-14 mb-6"
              size="lg"
              variant="primary"
              onClick={() => submitProposal()}
            >
              Submit
            </Button>
          </Else>
        </IfCase>
      </div>
    </section>
  );
}
