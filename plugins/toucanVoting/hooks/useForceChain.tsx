import { PUB_CHAIN, PUB_L2_CHAIN } from "@/constants";
import { useSwitchChain } from "wagmi";

function _useForceChain(chainId: number) {
  const { switchChain } = useSwitchChain();
  return (onSuccess: () => void, onError?: (err: Error) => void, onSettled?: () => void) =>
    switchChain({ chainId }, { onSuccess, onError, onSettled });
}

export function useForceL2Chain() {
  return _useForceChain(PUB_L2_CHAIN.id);
}

export function useForceL1Chain() {
  return _useForceChain(PUB_CHAIN.id);
}

export function useForceChain() {
  return {
    forceL1: useForceL1Chain(),
    forceL2: useForceL2Chain(),
  };
}
