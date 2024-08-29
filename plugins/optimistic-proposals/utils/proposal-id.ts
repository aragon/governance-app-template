export function parseProposalId(proposalId: bigint) {
  const mask64Bit = BigInt("0xffffffffffffffff");
  const index = Number(proposalId & mask64Bit);
  const startDate = Number((proposalId >> BigInt(128)) & mask64Bit);
  const endDate = Number((proposalId >> BigInt(64)) & mask64Bit);

  return { index, startDate, endDate };
}
