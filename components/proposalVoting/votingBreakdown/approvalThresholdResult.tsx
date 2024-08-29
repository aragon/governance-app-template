import {
  AvatarIcon,
  type IApprovalThresholdResult,
  IconType,
  NumberFormat,
  Progress,
  formatterUtils,
  Button,
} from "@aragon/ods";
import { type VotingCta } from "./types";

export interface IBreakdownApprovalThresholdResult extends IApprovalThresholdResult {
  cta?: VotingCta;
}

export const BreakdownApprovalThresholdResult: React.FC<IBreakdownApprovalThresholdResult> = (props) => {
  const { approvalAmount, approvalThreshold, cta, stage } = props;

  const percentage = approvalThreshold !== 0 ? (approvalAmount / approvalThreshold) * 100 : 100;
  const approvalThresholdReached = approvalAmount >= approvalThreshold;

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex w-full flex-col gap-y-2 rounded-xl border border-neutral-100 bg-neutral-0 px-4 py-3 shadow-neutral-sm md:gap-y-3 md:px-6 md:py-5">
        <div className="flex flex-1 gap-x-3 leading-tight text-neutral-800 md:gap-x-6 md:text-lg">
          <span className="line-clamp-1 flex-1">{stage?.title ?? "Approved By"}</span>
          {approvalThresholdReached && <AvatarIcon size="sm" variant="primary" icon={IconType.CHECKMARK} />}
          {!approvalThresholdReached && <AvatarIcon size="sm" variant="neutral" icon={IconType.CLOSE} />}
        </div>
        <Progress value={percentage} />
        <div className="flex gap-x-0.5 leading-tight text-neutral-500 md:gap-x-1 md:text-lg">
          <span className="text-primary-400">
            {formatterUtils.formatNumber(approvalAmount, { format: NumberFormat.GENERIC_SHORT })}
          </span>
          <span>of</span>
          <span>{formatterUtils.formatNumber(approvalThreshold, { format: NumberFormat.GENERIC_SHORT })}</span>
          <span>Members</span>
        </div>
      </div>
      {/* Button */}
      {cta && (
        <span>
          <Button size="md" disabled={cta.disabled} onClick={() => cta.onClick?.()} isLoading={cta.isLoading}>
            {cta?.label}
          </Button>
        </span>
      )}
    </div>
  );
};
