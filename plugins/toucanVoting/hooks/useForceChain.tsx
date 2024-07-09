import { PUB_CHAIN, PUB_L2_CHAIN } from "@/constants";
import { useSwitchChain } from "wagmi";

export function useForceChain(chainId: number) {
  const { switchChain } = useSwitchChain();
  return (callback: () => void) => switchChain({ chainId }, { onSuccess: callback });
}

export function useForceL2Chain() {
  return useForceChain(PUB_L2_CHAIN.id);
}

export function useForceL1Chain() {
  return useForceChain(PUB_CHAIN.id);
}
