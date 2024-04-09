import { create } from "ipfs-http-client";
import { Button, IconType, Icon, InputText, TextAreaRichText } from "@aragon/ods";
import React, { useEffect, useState } from "react";
import { uploadToIPFS } from "@/utils/ipfs";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { toHex } from "viem";
import { OptimisticTokenVotingPluginAbi } from "@/plugins/dualGovernance/artifacts/OptimisticTokenVotingPlugin.sol";
import { useAlerts } from "@/context/Alerts";
import WithdrawalInput from "@/components/input/withdrawal";
import { FunctionCallForm } from "@/components/input/function-call-form";
import { Action } from "@/utils/types";
import { getPlainText } from "@/utils/html";
import { useRouter } from "next/router";
import { Else, ElseIf, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { PUB_IPFS_ENDPOINT, PUB_IPFS_API_KEY, PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS, PUB_CHAIN } from "@/constants";
import { ActionCard } from "@/components/actions/action";

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
  const { addAlert } = useAlerts();
  const { writeContract: createProposalWrite, data: createTxHash, error, status } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: createTxHash });
  const [actionType, setActionType] = useState<ActionType>(ActionType.Signaling);

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
        console.error(error);
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
      return addAlert("Invalid proposal details", {
        description: "Please, enter a title",
        type: "error",
      });

    const plainSummary = getPlainText(summary).trim();
    if (!plainSummary.trim())
      return addAlert("Invalid proposal details", {
        description: "Please, enter a summary of what the proposal is about",
        type: "error",
      });

    // Check the action
    switch (actionType) {
      case ActionType.Signaling:
        break;
      case ActionType.Withdrawal:
        if (!actions.length) {
          return addAlert("Invalid proposal details", {
            description: "Please ensure that the withdrawal address and the amount to transfer are valid",
            type: "error",
          });
        }
        break;
      default:
        if (!actions.length || !actions[0].data || actions[0].data === "0x") {
          return addAlert("Invalid proposal details", {
            description: "Please ensure that the values of the action to execute are complete and correct",
            type: "error",
          });
        }
    }

    const proposalMetadataJsonObject = { title, summary };
    const blob = new Blob([JSON.stringify(proposalMetadataJsonObject)], {
      type: "application/json",
    });

    const ipfsPin = await uploadToIPFS(ipfsClient, blob);
    createProposalWrite({
      chainId: PUB_CHAIN.id,
      abi: OptimisticTokenVotingPluginAbi,
      address: PUB_DUAL_GOVERNANCE_PLUGIN_ADDRESS,
      functionName: "createProposal",
      args: [toHex(ipfsPin), actions, BigInt(0), BigInt(0), BigInt(0)],
    });
  };

  const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };

  const showLoading = status === "pending" || isConfirming;

  return (
    <section className="flex w-screen min-w-full max-w-full flex-col items-center">
      <div className="w-full justify-between py-5">
        <h1 className="mb-10 text-3xl font-semibold text-neutral-900">Create Proposal</h1>
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
            placeholder="A description for what the proposal is all about"
          />
        </div>
        <div className="mb-6">
          <span className="mb-2 block text-lg font-normal text-neutral-900 ">Select the type of proposal</span>
          <div className="mt-2 grid h-24 grid-cols-3 gap-5">
            <div
              onClick={() => {
                changeActionType(ActionType.Signaling);
              }}
              className={`flex cursor-pointer flex-col items-center rounded-xl border border-2 border-solid bg-neutral-0 hover:bg-neutral-50 ${
                actionType === ActionType.Signaling ? "border-primary-300" : "border-neutral-100"
              }`}
            >
              <Icon
                className={
                  "mt-2 !h-12 !w-10 p-2 " +
                  (actionType === ActionType.Signaling ? "text-primary-400" : "text-neutral-400")
                }
                icon={IconType.INFO}
                size="lg"
              />
              <span className="text-center text-sm text-neutral-400">Signaling</span>
            </div>
            <div
              onClick={() => changeActionType(ActionType.Withdrawal)}
              className={`flex cursor-pointer flex-col items-center rounded-xl border border-2 border-solid bg-neutral-0 hover:bg-neutral-50 ${
                actionType === ActionType.Withdrawal ? "border-primary-300" : "border-neutral-100"
              }`}
            >
              <Icon
                className={
                  "mt-2 !h-12 !w-10 p-2 " +
                  (actionType === ActionType.Withdrawal ? "text-primary-400" : "text-neutral-400")
                }
                icon={IconType.WITHDRAW}
                size="lg"
              />
              <span className="text-center text-sm text-neutral-400">DAO Payment</span>
            </div>
            <div
              onClick={() => changeActionType(ActionType.Custom)}
              className={`flex cursor-pointer flex-col items-center rounded-xl border border-2 border-solid bg-neutral-0 hover:bg-neutral-50 ${
                actionType === ActionType.Custom ? "border-primary-300" : "border-neutral-100"
              }`}
            >
              <Icon
                className={
                  "mt-2 !h-12 !w-10 p-2 " + (actionType === ActionType.Custom ? "text-primary-400" : "text-neutral-400")
                }
                icon={IconType.BLOCKCHAIN_BLOCKCHAIN}
                size="lg"
              />
              <span className="text-center text-sm text-neutral-400">Custom action</span>
            </div>
          </div>
          <div className="mb-6">
            {actionType === ActionType.Withdrawal && <WithdrawalInput setActions={setActions} />}
            {actionType === ActionType.Custom && (
              <FunctionCallForm onAddAction={(action) => setActions(actions.concat([action]))} />
            )}
          </div>
        </div>

        <If condition={showLoading}>
          <Then>
            <div className="mb-6 mt-14">
              <PleaseWaitSpinner fullMessage="Confirming transaction..." />
            </div>
          </Then>
          <ElseIf condition={actionType !== ActionType.Custom}>
            <Button className="mb-6 mt-14" size="lg" variant="primary" onClick={() => submitProposal()}>
              Submit proposal
            </Button>
          </ElseIf>
          <Else>
            <div className="mb-6 mt-14">
              <If not={actions.length}>
                <Then>
                  <p>Add the first action to continue</p>
                </Then>
                <Else>
                  <p className="flex-grow pb-3 text-lg font-semibold text-neutral-900">Actions</p>
                  <div className="mb-10">
                    {actions?.map?.((action, i) => (
                      <div className="mb-3" key={`${i}-${action.to}-${action.data}`}>
                        <ActionCard action={action} idx={i} />
                      </div>
                    ))}
                  </div>
                </Else>
              </If>
              <Button
                className="mt-3"
                size="lg"
                variant="primary"
                disabled={!actions.length}
                onClick={() => submitProposal()}
              >
                Submit proposal
              </Button>
            </div>
          </Else>
        </If>
      </div>
    </section>
  );
}
