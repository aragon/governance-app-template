import { Spinner } from "@aragon/ods";

export const PleaseWaitSpinner = ({ status = "Loading", fullMessage }: { status?: string; fullMessage?: string }) => {
  const message = fullMessage ? fullMessage : `${status}, please wait...`;

  return (
    <div>
      <Spinner size="sm" variant="neutral" className="-m-[2px] inline-block" /> &nbsp;&nbsp;{message}
    </div>
  );
};
