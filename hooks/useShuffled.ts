import { useEffect, useState } from "react";

export function useShuffled<T>(array?: T[] | readonly T[]) {
  const [shuffledArray, setShuffledArray] = useState<T[]>([]);

  useEffect(() => {
    if (!array) return;

    // If the length changes, shuffle and update
    const newArray = ([] as T[]).concat(array);
    newArray.sort(() => (Math.random() >= 0.5 ? 1 : -1));

    setShuffledArray(newArray);
  }, [array?.length]);

  return shuffledArray;
}
