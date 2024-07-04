import { PUB_CHAIN } from "@/constants";
import { capitalizeFirstLetter } from "@/utils/text";
import { type RawAction } from "@/utils/types";
import { InputText, NumberFormat, formatterUtils } from "@aragon/ods";
import { formatEther } from "viem";

type IEncodedViewProps = {
  rawAction: RawAction;
};

export const EncodedView: React.FC<IEncodedViewProps> = (props) => {
  const { rawAction } = props;

  return getEncodedArgs(rawAction).map((arg) => (
    <InputText key={arg.title} label={arg.title} disabled={true} value={arg.value} className="w-full" />
  ));
};

function getEncodedArgs(action: RawAction) {
  const isEthTransfer = !action.data || action.data === "0x";

  if (isEthTransfer) {
    return [
      { title: "To", value: action.to },
      {
        title: "Value",
        value: `${formatterUtils.formatNumber(formatEther(action.value, "wei"), { format: NumberFormat.TOKEN_AMOUNT_SHORT })} ${PUB_CHAIN.nativeCurrency.symbol}`,
      },
    ];
  }

  return Object.entries(action).map(([key, value]) => ({ title: capitalizeFirstLetter(key), value: value.toString() }));
}
