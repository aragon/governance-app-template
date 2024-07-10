import { PUB_CHAIN, PUB_L2_CHAIN } from "@/constants";
import { useSwitchChain } from "wagmi";

export function useForceChain(chainId: number) {
  const { switchChain } = useSwitchChain();
  return (onSuccess: () => void, onError?: (err: Error) => void, onSettled?: () => void) =>
    switchChain({ chainId }, { onSuccess, onError, onSettled });
}

export function useForceL2Chain() {
  return useForceChain(PUB_L2_CHAIN.id);
}

export function useForceL1Chain() {
  return useForceChain(PUB_CHAIN.id);
}
