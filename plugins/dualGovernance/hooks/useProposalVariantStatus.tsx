import { useState, useEffect } from 'react';
import { Proposal } from '@/plugins/dualGovernance/utils/types';

export const useProposalVariantStatus = (proposal: Proposal) => {
  const [status, setStatus] = useState({ variant: '', label: '' });

  useEffect(() => {
    setStatus(
      proposal?.vetoTally >= proposal.parameters.minVetoVotingPower 
        ? { variant: 'critical', label: 'Defeated' }
        : proposal.active
          ? { variant: 'primary', label: 'Active' }
          : proposal.executed 
            ? { variant: 'success', label: 'Executed' }
            : { variant: 'success', label: 'Executable' }
    );
  }, [proposal]);

  return status;
}
