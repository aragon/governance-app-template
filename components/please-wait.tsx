import { Spinner } from "@aragon/ods";
import { useEffect, useState } from "react";

export const PleaseWaitSpinner = ({
  status = "Loading",
}: {
  status?: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);

  if (!loaded) return null;

  return (
    <div suppressHydrationWarning>
      <Spinner size="sm" variant="neutral" className="inline-block -m-[2px]" />{" "}
      &nbsp;&nbsp;{status}, please wait...
    </div>
  );
};
