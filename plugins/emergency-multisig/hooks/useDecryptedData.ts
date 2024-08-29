import { decodeAbiParameters } from "viem";
import { EncryptedProposalMetadata } from "../utils/types";
import { hexToUint8Array } from "@/utils/hex";
import { decryptProposal, decryptSymmetricKey } from "@/utils/encryption";
import type { ProposalMetadata, RawAction } from "@/utils/types";
import { useDerivedWallet } from "../../../hooks/useDerivedWallet";
import { RawActionListAbi } from "../artifacts/RawActionListAbi";

export function useDecryptedData(encryptedMetadata?: EncryptedProposalMetadata) {
  const { privateKey, publicKey } = useDerivedWallet();
  let privateMetadata: ProposalMetadata | null = null;
  let privateActions: readonly RawAction[] | null = null;
  let error: Error | null = null;
  let privateRawActions: Uint8Array | null = null;
  let privateRawMetadata: string | null = null;

  // Attempt to decrypt
  if (privateKey && publicKey && encryptedMetadata) {
    const pubKeys = encryptedMetadata.encrypted.symmetricKeys.map((pk) => hexToUint8Array(pk));
    try {
      const proposalSymKey = decryptSymmetricKey(pubKeys, { privateKey, publicKey });
      const result = decryptProposal(
        {
          metadata: encryptedMetadata.encrypted.metadata,
          actions: encryptedMetadata.encrypted.actions,
        },
        proposalSymKey
      );
      privateRawActions = result.rawActions;
      privateRawMetadata = result.rawMetadata;
      privateMetadata = result.metadata as ProposalMetadata;
      const decoded = decodeAbiParameters(RawActionListAbi, privateRawActions);
      if (!decoded[0]) throw new Error("The actions parameter can't be recovered");

      privateActions = decoded[0];
    } catch (err) {
      error = err as Error;
    }
  }

  return {
    privateActions,
    privateMetadata,
    raw: {
      privateRawActions,
      privateRawMetadata,
    },
    error,
  };
}
