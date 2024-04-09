const PROPOSALS_PER_PAGE = 10;

export function digestPagination(proposalCount: number, page: number) {
  if (proposalCount < 0 || page < 0) throw new Error("Invalid parameters");
  else if (!proposalCount) {
    return {
      visibleProposalIds: [],
      showNext: false,
      showPrev: false,
    };
  }

  const visibleProposalIds = [] as number[];
  for (let i = 0; i < PROPOSALS_PER_PAGE; i++) {
    const n = proposalCount - 1 - page * PROPOSALS_PER_PAGE - i;
    if (n < 0) break;

    visibleProposalIds.push(n);
  }

  const showPrev = page > 0;
  const showNext = (visibleProposalIds.length && visibleProposalIds[visibleProposalIds.length - 1] > 0) || false;

  return {
    visibleProposalIds,
    showPrev,
    showNext,
  };
}
