import { useState, useEffect } from "react";
import { AlertInline, Button, Tag } from "@aragon/ods";
import { Proposal } from "@/plugins/dualGovernance/utils/types";
import { IAlertCardProps } from "@aragon/ods";
import { Else, If, IfCase, Then } from "@/components/if";
import { AddressText } from "@/components/text/address";
import { useWriteContract } from "wagmi";
import { goerli } from "viem/chains";
import { OptimisticTokenVotingPluginAbi } from "../../artifacts/OptimisticTokenVotingPlugin.sol";
import { Address } from "viem";
import { AlertContextProps, useAlertContext } from "@/context/AlertContext";

const DEFAULT_PROPOSAL_TITLE = "(No proposal title)";
const PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_DUAL_GOVERNANCE_PLUGIN_ADDRESS || "") as Address;

interface ProposalHeaderProps {
  proposalNumber: number;
  proposal: Proposal;
  userCanVeto: boolean;
  onVetoPressed: Function;
}
type AlertVariant = IAlertCardProps["variant"];

const ProposalHeader: React.FC<ProposalHeaderProps> = ({
  proposalNumber,
  proposal,
  userCanVeto,
  onVetoPressed,
}) => {
  const { writeContract: executeWrite, data: executeResponse } = useWriteContract()
  const { addAlert } = useAlertContext() as AlertContextProps;
  const [proposalVariant, setProposalVariant] = useState({
    variant: "",
    label: "",
  });

  const executeButtonPressed = () => {
    executeWrite({
      chainId: goerli.id,
      abi: OptimisticTokenVotingPluginAbi,
      address: PLUGIN_ADDRESS,
      functionName: 'execute',
      args: [proposalNumber]
    })
  }

  useEffect(() => {
    if (executeResponse) addAlert('Your execution has been registered', executeResponse)
  }, [executeResponse])

  useEffect(() => {
    setProposalVariant(getProposalVariantStatus());
  }, [proposal]);

  const getProposalVariantStatus = () => {
  return proposal?.vetoTally >= proposal.parameters.minVetoVotingPower 
    ? { variant: 'critical', label: 'Defeated' }
    : proposal.active
      ? { variant: 'primary', label: 'Active' }
      : proposal.executed 
        ? { variant: 'success', label: 'Executed' }
        : { variant: 'success', label: 'Executable' }
  
}
  return (
    <div className="w-full">
      <div className="flex flex-row pb-2 h-16 items-center">
        <div className="flex flex-grow justify-between">
          <div className="flex-col text-center">
            {/** bg-info-200 bg-success-200 bg-critical-200
             * text-info-800 text-success-800 text-critical-800
             */}
              <div className="flex">
                <Tag
                  className="text-center text-critical-800"
                  label={proposalVariant.label}
                  variant={proposalVariant.variant as AlertVariant}
                />
              </div>
            <span className="text-xl font-semibold text-neutral-700 pt-1">
              Proposal {proposalNumber + 1}
            </span>
          </div>
        </div>
        <div className="flex ">
          <IfCase condition={userCanVeto}>
            <Then>
              <Button
                className="flex h-5 items-center"
                size="lg"
                variant="primary"
                onClick={() => onVetoPressed()}
              >
                Veto
              </Button>
            </Then>
            <Else>
              <If condition={getProposalVariantStatus().label === 'Executable'}>
                <Button
                className="flex h-5 items-center"
                size="lg"
                variant="success"
                onClick={() => executeButtonPressed()}
              >
                Execute
              </Button>
              </If>
            </Else>
          </IfCase>
        </div>
      </div>

      <h4 className="flex-grow mb-1 text-3xl text-neutral-900 font-semibold">
        {proposal.title || DEFAULT_PROPOSAL_TITLE}
      </h4>
      <p className="text-base text-l text-body-color dark:text-dark-6">
        Proposed by <AddressText>{proposal?.creator}</AddressText>
      </p>
    </div>
  );
};

export default ProposalHeader;
