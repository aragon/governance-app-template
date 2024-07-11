import { useQueryClient } from "@tanstack/react-query";
import { useVotingToken, useVotingTokenBalance, useVotingTokenL2Balance } from "../../hooks/useVotingToken";
import { useEffect, useState } from "react";
import { useBridge, useBridgeQuote } from "../../hooks/useBridge";
import { useAllowance, useApproveTokens } from "../../hooks/useApproveTokens";
import {
  PUB_CHAIN_NAME,
  PUB_L2_CHAIN_NAME,
  PUB_OFT_ADAPTER_ADDRESS,
  PUB_OFT_TOKEN_BRIDGE_ADDRESS,
  PUB_TOKEN_L1_ADDRESS,
  PUB_TOKEN_L2_ADDRESS,
} from "@/constants";
import { useCrossChainTransaction } from "../../hooks/useCrossChainTransactions";
import { Address, formatEther, parseEther } from "viem";
import { Button, Card, Heading, InputNumber, Spinner, Tabs } from "@aragon/ods";
import { Else, If, Then } from "@/components/if";
import { SplitRow } from "./SplitRow";
import { compactNumber } from "@/utils/numbers";
import { useRouter } from "next/router";
import { MessageStatus } from "@layerzerolabs/scan-client";
import { OFTBridgeConfig, getEid, getGasForCrossChainOperation } from "../../utils/layer-zero";
import { ChainName, readableChainName } from "@/utils/chains";
import { useAccount } from "wagmi";

const formatQuote = (quote: string): string => {
  const parsed = parseFloat(quote);
  // for a given quote, if it's below 0.0001 ETH, simply write it as < 0.0001 ETH
  if (parsed < 0.0001) return "<0.0001 ETH";
  // else max 4 decimals
  return "~" + parseFloat(quote).toFixed(4) + " ETH";
};

export default function BridgeOFT() {
  const labelToL2 = "To " + readableChainName(PUB_L2_CHAIN_NAME).split(" ")[0];
  const labelToL1 = "To " + readableChainName(PUB_CHAIN_NAME).split(" ")[0];

  return (
    <Card className="flex flex-col gap-y-4 p-6 shadow-neutral">
      <Heading size="h3">Bridge Tokens</Heading>
      <Tabs.Root defaultValue={"l2"}>
        <Tabs.List className="pb-2">
          <Tabs.Trigger label={labelToL2} value="l2" />
          <Tabs.Trigger label={labelToL1} value="l1" />
        </Tabs.List>
        <Tabs.Content value="l2" className="flex flex-col gap-y-4">
          <BridgeToL2 />
        </Tabs.Content>
        <Tabs.Content value="l1" className="flex flex-col gap-y-4">
          <BridgeToL1 />
        </Tabs.Content>
      </Tabs.Root>
    </Card>
  );
}

type BridgeProps = {
  config: OFTBridgeConfig;
  tokenAddress: Address;
  chainName: ChainName;
  approveContractAddress: Address;
};

function Bridge({ config, tokenAddress, chainName, approveContractAddress }: BridgeProps) {
  // use state
  const [tokensToSend, setTokensToSend] = useState("0");
  const [isAllowanceEnough, setIsAllowanceEnough] = useState(false);

  // getters
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();
  const { balance: l1Balance, queryKey: l1BalanceQuery } = useVotingTokenBalance();
  const { balance: l2Balance, queryKey: l2BalanceQuery } = useVotingTokenL2Balance();
  const { symbol } = useVotingToken();
  const { quote } = useBridgeQuote(BigInt(tokensToSend), config);
  const { allowance, queryKey } = useAllowance(tokenAddress, approveContractAddress, chainName);

  // write functions
  const { bridgeTokens, bridgeTxHash, isConfirming: isBridging, bridgingStatus, isConfirmed: isBridged } = useBridge();
  const {
    approveTokens,
    isConfirmed: isApproved,
    isConfirming: isApproving,
    queryKey: approveQueryKey,
    approveStatus,
  } = useApproveTokens(tokenAddress, chainName);
  const { isBridging: isXChainBridging, isBridged: isXChainBridged } = useCrossChainTransaction(
    bridgeTxHash,
    chainName
  );

  // local variables

  // disabled statuses
  const baseDisabled = tokensToSend === "0" || !isConnected;
  const approveDisabled = baseDisabled || isApproving || approveStatus === "pending";
  const bridgeDisabled =
    baseDisabled || !isAllowanceEnough || isBridging || isXChainBridging || bridgingStatus === "pending";
  const inputDisabled = !isConnected || isBridging || isApproving || isXChainBridging;

  // compact numbers
  const fee = BigInt(quote?.nativeFee ?? 0);
  const compactQuote = formatQuote(formatEther(fee));

  const compact = compactNumber(formatEther(l1Balance ?? BigInt(0)));
  const compactL2 = compactNumber(formatEther(l2Balance ?? BigInt(0)));

  // effects
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: approveQueryKey });
  }, [isApproved]);

  useEffect(() => {
    if (allowance && BigInt(allowance) >= BigInt(tokensToSend)) {
      setIsAllowanceEnough(true);
    } else {
      setIsAllowanceEnough(false);
    }
  }, [allowance, tokensToSend]);

  useEffect(() => {
    if (isAllowanceEnough && isApproved) {
      bridgeTokens(BigInt(tokensToSend), fee, config);
    }
  }, [isAllowanceEnough, isApproved]);

  useEffect(() => {
    if (isBridged) {
      setTokensToSend("0");
    }
  }, [isBridged]);

  useEffect(() => {
    if (isXChainBridged) {
      queryClient.invalidateQueries({ queryKey: l1BalanceQuery });
      queryClient.invalidateQueries({ queryKey: l2BalanceQuery });
    }
  }, [isXChainBridged]);

  return (
    <>
      <Card className="flex flex-col gap-2 p-4 shadow-neutral">
        <SplitRow left="L1 Balance" right={`${compact} ${symbol ?? ""}`} />
        <SplitRow left="L2 Balance" right={`${compactL2} ${symbol ?? ""}`} />
      </Card>
      <div className="mt-4">
        <InputNumber
          disabled={inputDisabled}
          label="Amount To Bridge"
          placeholder={`100 ${symbol ?? ""}`}
          min={0}
          onChange={(val) => setTokensToSend(parseEther(val).toString())}
        />
      </div>

      <If condition={isAllowanceEnough}>
        <Then>
          <Button
            disabled={bridgeDisabled}
            className="max-w-xs"
            onClick={() => bridgeTokens(BigInt(tokensToSend), fee, config)}
          >
            {isBridging || isXChainBridging ? <Spinner size="lg" variant="neutral" /> : "Bridge"}
          </Button>
          <SplitRow left="Bridge Fee" right={compactQuote} />
        </Then>
        <Else>
          <Button
            disabled={approveDisabled}
            className="max-w-xs"
            onClick={() => approveTokens(BigInt(tokensToSend), approveContractAddress)}
          >
            {isConnected ? isApproving ? <Spinner size="lg" variant="neutral" /> : "Approve" : "Connect Wallet"}
          </Button>
        </Else>
      </If>
    </>
  );
}

// Usage for BridgeToL2
export function BridgeToL2() {
  const config = {
    address: PUB_OFT_ADAPTER_ADDRESS,
    chainName: PUB_CHAIN_NAME,
    gasLimit: getGasForCrossChainOperation(PUB_CHAIN_NAME, "BRIDGE_OFT"),
    dstEid: getEid(PUB_L2_CHAIN_NAME),
  };

  return (
    <Bridge
      config={config}
      tokenAddress={PUB_TOKEN_L1_ADDRESS}
      chainName={PUB_CHAIN_NAME}
      approveContractAddress={PUB_OFT_ADAPTER_ADDRESS}
    />
  );
}

// Usage for BridgeToL1
export function BridgeToL1() {
  const config = {
    address: PUB_OFT_TOKEN_BRIDGE_ADDRESS,
    chainName: PUB_L2_CHAIN_NAME,
    gasLimit: getGasForCrossChainOperation(PUB_L2_CHAIN_NAME, "BRIDGE_OFT"),
    dstEid: getEid(PUB_CHAIN_NAME),
  };

  return (
    <Bridge
      config={config}
      tokenAddress={PUB_TOKEN_L2_ADDRESS}
      chainName={PUB_L2_CHAIN_NAME}
      approveContractAddress={PUB_OFT_TOKEN_BRIDGE_ADDRESS}
    />
  );
}
