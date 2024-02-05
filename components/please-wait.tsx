import { useSkipFirstRender } from "@/hooks/useSkipFirstRender";
import { Spinner } from "@aragon/ods";

export const PleaseWaitSpinner = ({
  status = "Loading",
  fullMessage,
}: {
  status?: string;
  fullMessage?: string;
}) => {
  const skipRender = useSkipFirstRender();
  if (skipRender) return <></>;

  const message = fullMessage ? fullMessage : status + ", please wait...";

  return (
    <div>
      <Spinner size="sm" variant="neutral" className="inline-block -m-[2px]" />{" "}
      &nbsp;&nbsp;{message}
    </div>
  );
};
