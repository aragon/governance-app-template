import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useUrl() {
  const router = useRouter();
  const [url, setUrl] = useState(typeof window != "undefined" ? window.location.href : "");

  useEffect(() => {
    const urlChanged = (path: string) => {
      setUrl(location.protocol + "//" + location.host + path);
    };

    router.events.on("hashChangeStart", urlChanged);
    router.events.on("routeChangeStart", urlChanged);

    return () => {
      router.events.off("hashChangeStart", urlChanged);
      router.events.off("routeChangeStart", urlChanged);
    };
  }, []);

  return new URL(url);
}
