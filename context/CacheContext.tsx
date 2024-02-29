import { createContext, useState, useContext, useEffect } from "react";

type CacheContext<T = any> = Record<string, T>;
type CacheKey = string | string[];
type CacheResult<T> = {
  value: T;
  isPending: boolean;
  error: Error | null;
};

const CacheContext = createContext({
  setValue: (_key: CacheKey, _value: any) => {},
  setLoading: (_key: CacheKey) => {},
  setError: (_key: CacheKey, _error: Error) => {},
  get: (_key: CacheKey) => null as any,
});

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cache, setCache] = useState<CacheContext>({});
  const [loadingStatus, setLoadingStatus] = useState<CacheContext<boolean>>({});
  const [errorResult, setErrorResult] = useState<CacheContext<Error | null>>(
    {}
  );

  const setValue = (key: CacheKey, value: any) => {
    let k = typeof key === "string" ? key : key.join(",");

    const newCache = { ...cache };
    newCache[k] = value;
    setCache(newCache);

    const newLoadingStatus = { ...cache };
    newLoadingStatus[k] = false;
    setLoadingStatus(newLoadingStatus);
  };

  const setLoading = (key: CacheKey) => {
    let k = typeof key === "string" ? key : key.join(",");

    const newLoadingStatus = { ...cache };
    newLoadingStatus[k] = true;
    setLoadingStatus(newLoadingStatus);
  };

  const setError = (key: CacheKey, error: Error) => {
    let k = typeof key === "string" ? key : key.join(",");

    const newErrorResult = { ...errorResult };
    newErrorResult[k] = error;
    setErrorResult(newErrorResult);

    const newLoadingStatus = { ...cache };
    newLoadingStatus[k] = false;
    setLoadingStatus(newLoadingStatus);
  };

  const get = (key: CacheKey): any | null => {
    let k = typeof key === "string" ? key : key.join(",");

    return {
      value: cache[k] || null,
      loading: loadingStatus[k] || false,
      error: errorResult[k] || null,
    };
  };

  return (
    <CacheContext.Provider value={{ setValue, setLoading, setError, get }}>
      {children}
    </CacheContext.Provider>
  );
};

export function useCache<T>(
  loadFunc: () => any | Promise<T>,
  key: CacheKey
): CacheResult<T> {
  const ctx = useContext(CacheContext);
  if (!ctx) {
    throw new Error("useCache must be used inside the CacheContext");
  }

  const { setValue, setLoading, setError, get } = ctx;

  useEffect(
    () => {
      // Do not refetch
      if (!!get(key).value) {
        return;
      }

      // Fetch the first time
      try {
        const result = loadFunc();
        if (result instanceof Promise) {
          setLoading(key);

          result
            .then((result) => {
              setValue(key, result);
            })
            .catch((err) => {
              setError(key, err);
            });
        } else {
          setValue(key, result);
        }
      } catch (err) {
        setError(key, err as any);
      }
    },
    Array.isArray(key) ? [...key] : [key]
  );

  const resolved = get(key);

  return {
    value: resolved.value,
    isPending: resolved.loading ?? false,
    error: resolved.error ?? null,
  };
}
