import { encodeAbiParameters, keccak256, toHex } from "viem";
import { EncryptedProposalMetadata } from "../utils/types";
import { hexToUint8Array } from "@/utils/hex";
import { encryptProposal, encryptSymmetricKey } from "@/utils/encryption";
import { ProposalMetadata, RawAction } from "@/utils/types";
import { usePublicKeyRegistry } from "./usePublicKeyRegistry";
import { RawActionListAbi } from "../artifacts/RawActionListAbi";
import { getContentCid } from "@/utils/ipfs";
import { useMultisigMembers } from "@/plugins/members/hooks/useMultisigMembers";

export function useEncryptedData() {
  const { data: pubKeyItems, isLoading: isLoadingPubKeys } = usePublicKeyRegistry();
  const { members: signers, isLoading: isLoadingMultisig, error: multisigMembersError } = useMultisigMembers();

  const encryptProposalData = async (privateMetadata: ProposalMetadata, actions: RawAction[]) => {
    const actionsBytes = encodeAbiParameters(RawActionListAbi, [actions]);
    if (isLoadingPubKeys || isLoadingMultisig) throw new Error("The multisig members are not available yet");
    else if (multisigMembersError) throw multisigMembersError;

    // Encrypt data
    const strMetadata = JSON.stringify(privateMetadata);
    const { encrypted: cipherData, symmetricKey } = encryptProposal(strMetadata, hexToUint8Array(actionsBytes));

    // Only for those who are on the multisig
    const filteredSignerItems = pubKeyItems.filter((item) => {
      return signers.includes(item.address);
    });
    const encryptedSymKeys = encryptSymmetricKey(
      symmetricKey,
      filteredSignerItems.map((item) => hexToUint8Array(item.publicKey))
    );

    // Hash the raw actions
    const hashedActions = keccak256(actionsBytes);

    // Compute the CiD of the private metadata and hash it
    const metadataUri = await getContentCid(strMetadata);
    const hashedMetadataUri = keccak256(toHex(metadataUri));

    // Result
    const payload: EncryptedProposalMetadata = {
      encrypted: {
        metadata: cipherData.metadata,
        actions: cipherData.actions,
        symmetricKeys: encryptedSymKeys.map((k) => toHex(k)),
      },
    };
    const hashed = {
      actions: hashedActions,
      metadataUri: hashedMetadataUri,
    };
    return {
      payload,
      hashed,
    };
  };

  return {
    encryptProposalData,
  };
}
