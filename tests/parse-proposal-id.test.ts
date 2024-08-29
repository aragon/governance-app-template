import { parseProposalId } from "@/plugins/optimistic-proposals/utils/proposal-id";
import { expect, test, describe } from "bun:test";

describe("Optimistic proposal ID", () => {
  test("Parses the index and the timestamps 1", () => {
    const { index, startDate, endDate } = parseProposalId(585286874342463589627155947503667611999762644992n);
    expect(index).toBe(0);
    expect(startDate).toBe(1720003536);
    expect(endDate).toBe(1720889936);
  });
  test("Parses the index and the timestamps 2", () => {
    const { index, startDate, endDate } = parseProposalId(585287214624830510565619420101647080622749910226n);
    expect(index).toBe(1234);
    expect(startDate).toBe(1720004536);
    expect(endDate).toBe(1720890436);
  });
});
