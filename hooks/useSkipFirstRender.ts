import { useEffect, useState } from "react";

export function useSkipFirstRender() {
  const [skipRender, setSkipRender] = useState(true);

  useEffect(() => setSkipRender(false), []);
  return skipRender;
}
