import { MainSection } from "@/components/layout/main-section";
import { Button, Heading, Toggle, ToggleGroup } from "@aragon/ods";
import { PUB_APP_NAME, PUB_PROJECT_URL } from "@/constants";
import { useState } from "react";
import { useAccount } from "wagmi";
import { DelegateAnnouncementDialog } from "../components/DelegateAnnouncementDialog";
import { DelegateMemberList } from "../components/DelegateMemberList";
import { AddressText } from "@/components/text/address";
import { PUB_TOKEN_ADDRESS } from "@/constants";
import { Else, ElseIf, If, Then } from "@/components/if";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useDelegates } from "../hooks/useDelegates";
import { useDelegateAnnounce } from "../hooks/useDelegateAnnounce";
import { MultisigMemberList } from "../components/MultisigMemberList";
import { useMultisigMembers } from "../hooks/useMultisigMembers";

const DELEGATION_DESCRIPTION =
  "Proposals submitted to the community can be vetoed by token holders. Additionally, token holders can opt to delegate their voting power to delegates.";
const SECURITY_COUNCIL_DESCRIPTION =
  "Proposals are created by the Security Council. When its members approve one, the proposal is forwarded to the community veto phase for ratification.";

export default function MembersList() {
  const { open } = useWeb3Modal();
  const [showProfileCreationDialog, setShowProfileCreationDialog] = useState(false);
  const { address, isConnected } = useAccount();
  const { delegates } = useDelegates();
  const delegateCount = delegates?.length || 0;
  const { members: multisigMembers, isLoading: isLoadingMultisigMembers } = useMultisigMembers();

  const [toggleValue, setToggleValue] = useState<"all" | "verified" | "multisig">("all");
  const onToggleChange = (value: string | undefined) => {
    if (value) setToggleValue(value as "all" | "verified");
  };

  const { announce } = useDelegateAnnounce(address);

  return (
    <MainSection>
      <div className="flex w-full max-w-[1280] flex-col gap-x-10 gap-y-8 lg:flex-row">
        <div className="flex flex-1 flex-col gap-y-6">
          <div className="flex items-start justify-between">
            <If some={[toggleValue === "all", toggleValue === "verified"]}>
              <Then>
                <Heading size="h1">Delegates</Heading>
              </Then>
              <Else>
                <Heading size="h1">Security council</Heading>
              </Else>
            </If>

            <ToggleGroup
              isMultiSelect={false}
              onChange={onToggleChange}
              value={toggleValue}
              className="flex justify-end"
            >
              <Toggle value="all" label="Registered" className="rounded-lg" />
              <Toggle value="verified" label="Verified" className="rounded-lg" />
              <Toggle value="multisig" label="Security council" className="rounded-lg" />
            </ToggleGroup>
          </div>
          <If some={[toggleValue === "all", toggleValue === "verified"]}>
            <Then>
              <DelegateMemberList verifiedOnly={toggleValue === "verified"} />
            </Then>
            <Else>
              <MultisigMemberList />
            </Else>
          </If>
        </div>
        <aside className="flex w-full flex-col gap-y-4 lg:max-w-[280px] lg:gap-y-6">
          <div className="flex flex-col gap-y-3">
            <Heading size="h3">Details</Heading>
            <If some={[toggleValue === "all", toggleValue === "verified"]}>
              <Then>
                <p className="text-neutral-500">{DELEGATION_DESCRIPTION}</p>
              </Then>
              <Else>
                <p className="text-neutral-500">{SECURITY_COUNCIL_DESCRIPTION}</p>
              </Else>
            </If>
          </div>
          <dl className="divide-y divide-neutral-100">
            <div className="flex flex-col items-baseline gap-y-2 py-3 lg:gap-x-6 lg:py-4">
              <dt className="line-clamp-1 shrink-0 text-lg leading-tight text-neutral-800 lg:line-clamp-6 lg:w-40">
                About the project
              </dt>
              <dd className="size-full text-base leading-tight text-neutral-500">
                <a href={PUB_PROJECT_URL} target="_blank" className="font-semibold text-primary-400 underline">
                  Learn more about {PUB_APP_NAME}
                </a>
              </dd>
            </div>
            <If some={[toggleValue === "all", toggleValue === "verified"]}>
              <Then>
                <div className="flex flex-col items-baseline gap-y-2 py-3 lg:gap-x-6 lg:py-4">
                  <dt className="line-clamp-1 shrink-0 text-lg leading-tight text-neutral-800 lg:line-clamp-6 lg:w-40">
                    Token contract
                  </dt>
                  <dd className="size-full text-base leading-tight text-neutral-500">
                    <AddressText>{PUB_TOKEN_ADDRESS}</AddressText>
                  </dd>
                </div>
                <div className="flex flex-col items-baseline gap-y-2 py-3 lg:gap-x-6 lg:py-4">
                  <dt className="line-clamp-1 shrink-0 text-lg leading-tight text-neutral-800 lg:line-clamp-6 lg:w-40">
                    Delegates
                  </dt>
                  <dd className="size-full text-base leading-tight text-neutral-500">
                    {delegateCount === 1 ? "1 delegate" : `${delegateCount} delegates`} registered
                  </dd>
                </div>
              </Then>
              <Else>
                <If not={isLoadingMultisigMembers}>
                  <div className="flex flex-col items-baseline gap-y-2 py-3 lg:gap-x-6 lg:py-4">
                    <dt className="line-clamp-1 shrink-0 text-lg leading-tight text-neutral-800 lg:line-clamp-6 lg:w-40">
                      Security Council
                    </dt>
                    <dd className="size-full text-base leading-tight text-neutral-500">
                      {multisigMembers?.length === 1 ? "1 member" : `${multisigMembers?.length || 0} members`}
                    </dd>
                  </div>
                </If>
              </Else>
            </If>
          </dl>
          <If not={isConnected}>
            <Then>
              <Button onClick={() => open()}>Connect to create your profile</Button>
            </Then>
            <ElseIf val={toggleValue} is="multisig">
              {/* nop */}
            </ElseIf>
            <ElseIf true={announce}>
              <Button onClick={() => setShowProfileCreationDialog(true)}>Update my delegate profile</Button>
            </ElseIf>
            <Else>
              <Button onClick={() => setShowProfileCreationDialog(true)}>Create my delegate profile</Button>
            </Else>
          </If>
          <DelegateAnnouncementDialog
            onClose={() => setShowProfileCreationDialog(false)}
            open={showProfileCreationDialog}
          />
        </aside>
      </div>
    </MainSection>
  );
}
