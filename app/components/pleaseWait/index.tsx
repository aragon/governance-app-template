import { Spinner } from "@aragon/ods";

export const PleaseWaitSpinner = ({
  status = "Loading",
}: {
  status?: string;
}) => {
  return (
    <p>
      <Spinner size="sm" variant="neutral" className="inline-block -m-[2px]" />{" "}
      &nbsp;&nbsp;{status}, please wait...
    </p>
  );
};
