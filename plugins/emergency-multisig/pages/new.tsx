import React, { ReactNode, useState } from "react";
import { Button, IconType, InputText, Tag, TextAreaRichText } from "@aragon/ods";
import { useAccount } from "wagmi";
import { Else, ElseIf, If, Then } from "@/components/if";
import { PleaseWaitSpinner } from "@/components/please-wait";
import { MissingContentView } from "@/components/MissingContentView";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useDerivedWallet } from "../../../hooks/useDerivedWallet";
import { MainSection } from "@/components/layout/main-section";
import { useCreateProposal } from "../hooks/useCreateProposal";
import { useCanCreateProposal } from "../hooks/useCanCreateProposal";
import { usePublicKeyRegistry } from "../hooks/usePublicKeyRegistry";
import { useMultisigMembers } from "@/plugins/members/hooks/useMultisigMembers";
import { RawAction } from "@/utils/types";
import { NewActionDialog, NewActionType } from "@/components/dialogs/NewActionDialog";
import { Address } from "viem";
import { AddActionCard } from "@/components/cards/AddActionCard";
import { ProposalActions } from "@/components/proposalActions/proposalActions";
import { downloadAsFile } from "@/utils/download-as-file";
import { encodeActionsAsJson } from "@/utils/json-actions";

export default function Create() {
  const { address: selfAddress, isConnected } = useAccount();
  const { canCreate } = useCanCreateProposal();
  const [addActionType, setAddActionType] = useState<NewActionType>("");
  const { data: registeredSigners } = usePublicKeyRegistry();
  const {
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
    isCreating,
    submitProposal,
  } = useCreateProposal();
  const { members: multisigMembers } = useMultisigMembers();

  const handleTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };
  const handleSummaryInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSummary(event?.target?.value);
  };
  const handleNewActionDialogClose = (newAction: RawAction[] | null) => {
    if (!newAction) {
      setAddActionType("");
      return;
    }

    setActions(actions.concat(newAction));
    setAddActionType("");
  };
  const onRemoveAction = (idx: number) => {
    actions.splice(idx, 1);
    setActions([].concat(actions as any));
  };
  const removeResource = (idx: number) => {
    resources.splice(idx, 1);
    setResources([].concat(resources as any));
  };
  const onResourceNameChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    resources[idx].name = event.target.value;
    setResources([].concat(resources as any));
  };
  const onResourceUrlChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    resources[idx].url = event.target.value;
    setResources([].concat(resources as any));
  };

  const filteredSignerItems = registeredSigners.filter((signer) => {
    return multisigMembers.includes(signer.address);
  });
  const signersWithPubKey = filteredSignerItems.length;

  const exportAsJson = () => {
    if (!actions.length) return;

    const strResult = encodeActionsAsJson(actions);
    downloadAsFile("actions.json", strResult, "text/json");
  };

  return (
    <MainSection narrow>
      <div className="w-full justify-between">
        <h1 className="mb-8 line-clamp-1 flex flex-1 shrink-0 text-2xl font-normal leading-tight text-neutral-800 md:text-3xl">
          Create Proposal
        </h1>
        <PlaceHolderOr selfAddress={selfAddress} canCreate={canCreate} isConnected={isConnected}>
          <div className="mb-6">
            <InputText
              className=""
              label="Title"
              maxLength={100}
              placeholder="A short title that describes the main purpose"
              variant="default"
              value={title}
              readOnly={isCreating}
              onChange={handleTitleInput}
            />
          </div>
          <div className="mb-6">
            <InputText
              className=""
              label="Summary"
              maxLength={280}
              placeholder="A short summary that outlines the main purpose of the proposal"
              variant="default"
              value={summary}
              readOnly={isCreating}
              onChange={handleSummaryInput}
            />
          </div>
          <div className="mb-6">
            <TextAreaRichText
              label="Body"
              className="pt-2"
              value={description}
              onChange={setDescription}
              placeholder="A description of what the proposal is all about"
            />
          </div>

          <div className="mb-6 flex flex-col gap-y-2 md:gap-y-3">
            <div className="flex flex-col gap-0.5 md:gap-1">
              <div className="flex gap-x-3">
                <p className="text-base font-normal leading-tight text-neutral-800 md:text-lg">Resources</p>
                <Tag label="Optional" />
              </div>
              <p className="text-sm font-normal leading-normal text-neutral-500 md:text-base">
                Add links to external resources
              </p>
            </div>
            <div className="flex flex-col gap-y-4 rounded-xl border border-neutral-100 bg-neutral-0 p-4">
              <If not={!!resources.length}>
                <p className="text-sm font-normal leading-normal text-neutral-500 md:text-base">
                  There are no resources yet. Click the button below to add the first one.
                </p>
              </If>
              {resources.map((resource, idx) => {
                return (
                  <div key={idx} className="flex flex-col gap-y-3 py-3 md:py-4">
                    <div className="flex items-end gap-x-3">
                      <InputText
                        label="Resource name"
                        readOnly={isCreating}
                        value={resource.name}
                        onChange={(e) => onResourceNameChange(e, idx)}
                        placeholder="GitHub, Twitter, etc."
                      />
                      <Button
                        size="lg"
                        variant="tertiary"
                        onClick={() => removeResource(idx)}
                        iconLeft={IconType.MINUS}
                      />
                    </div>
                    <InputText
                      label="URL"
                      value={resource.url}
                      onChange={(e) => onResourceUrlChange(e, idx)}
                      placeholder="https://..."
                      readOnly={isCreating}
                    />
                  </div>
                );
              })}
            </div>
            <span className="mt-3">
              <Button
                variant="tertiary"
                size="lg"
                iconLeft={IconType.PLUS}
                disabled={isCreating}
                onClick={() => {
                  setResources(resources.concat({ url: "", name: "" }));
                }}
              >
                Add resource
              </Button>
            </span>
          </div>

          {/* Actions */}

          <ProposalActions
            actions={actions}
            emptyListDescription="The proposal has no actions defined yet. Select a type of action to add to the proposal."
            onRemove={(idx) => onRemoveAction(idx)}
          />

          <If true={actions?.length}>
            <Button
              className="mt-6"
              iconLeft={IconType.RICHTEXT_LIST_UNORDERED}
              size="lg"
              variant="tertiary"
              onClick={() => exportAsJson()}
            >
              Export actions as JSON
            </Button>
          </If>

          <div className="mt-8 grid w-full grid-cols-2 gap-4 md:grid-cols-4">
            <AddActionCard
              title="Add a payment"
              icon={IconType.WITHDRAW}
              disabled={isCreating}
              onClick={() => setAddActionType("withdrawal")}
            />
            <AddActionCard
              title="Add a function call"
              icon={IconType.BLOCKCHAIN_BLOCKCHAIN}
              disabled={isCreating}
              onClick={() => setAddActionType("select-abi-function")}
            />
            <AddActionCard
              title="Add raw calldata"
              icon={IconType.COPY}
              disabled={isCreating}
              onClick={() => setAddActionType("calldata")}
            />
            <AddActionCard
              title="Import JSON actions"
              disabled={isCreating}
              icon={IconType.RICHTEXT_LIST_UNORDERED}
              onClick={() => setAddActionType("import-json")}
            />
          </div>

          {/* Dialog */}

          <NewActionDialog
            newActionType={addActionType}
            onClose={(newActions) => handleNewActionDialogClose(newActions)}
          />

          {/* Submit */}

          <div className="mt-6 flex w-full flex-col items-center">
            <div>
              <span className="text-md mb-2 block font-normal text-neutral-700 ">
                {signersWithPubKey || 0} signer(s) registered their public key
              </span>
            </div>
            <Button
              isLoading={isCreating}
              className="mt-3 border-primary-400"
              size="lg"
              variant={actions.length ? "primary" : "secondary"}
              onClick={() => submitProposal()}
            >
              <If true={actions.length}>
                <Then>Submit proposal</Then>
                <Else>Submit signaling proposal</Else>
              </If>
            </Button>
          </div>
        </PlaceHolderOr>
      </div>
    </MainSection>
  );
}

// HELPERS

const PlaceHolderOr = ({
  selfAddress,
  isConnected,
  canCreate,
  children,
}: {
  selfAddress: Address | undefined;
  isConnected: boolean;
  canCreate: boolean | undefined;
  children: ReactNode;
}) => {
  const { open } = useWeb3Modal();
  const { publicKey, requestSignature } = useDerivedWallet();
  const {
    data: registeredSigners,
    registerPublicKey,
    isLoading: isLoadingPubKeys,
    isConfirming: isRegisteringPublicKey,
  } = usePublicKeyRegistry();
  const hasPubKeyRegistered = registeredSigners.some((item) => item.address === selfAddress);

  return (
    <If true={isLoadingPubKeys}>
      <Then>
        {/* No public keys yet */}
        <div>
          <PleaseWaitSpinner fullMessage="Loading the signer public keys..." />
        </div>
      </Then>
      <ElseIf true={!selfAddress || !isConnected}>
        {/* Not connected */}
        <MissingContentView callToAction="Connect wallet" onClick={() => open()}>
          Please connect your wallet to continue.
        </MissingContentView>
      </ElseIf>
      <ElseIf true={selfAddress && !hasPubKeyRegistered}>
        {/* Public key not registered yet */}
        <MissingContentView
          callToAction="Register your public key"
          onClick={() => registerPublicKey()}
          isLoading={isRegisteringPublicKey}
        >
          You haven&apos;t registered a public key yet. A public key is necessary in order for proposals to have private
          data that only members can decrypt. You will sign a deterministic text, which will be used to generate an
          encryption key only for this DAO.
        </MissingContentView>
      </ElseIf>
      <ElseIf true={!publicKey}>
        {/* Not signed in */}
        <MissingContentView callToAction="Sign in to continue" onClick={() => requestSignature()}>
          Please sign in with your wallet to decrypt the private proposal data.
        </MissingContentView>
      </ElseIf>
      <ElseIf true={!canCreate}>
        {/* Not a member */}
        <MissingContentView>
          You cannot create proposals on the multisig because you are not currently defined as a member.
        </MissingContentView>
      </ElseIf>
      <Else>{children}</Else>
    </If>
  );
};
