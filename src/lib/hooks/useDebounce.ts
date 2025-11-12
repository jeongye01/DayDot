import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      setDebounced(value);
    }
  }, [value]);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timerRef.current!);
  }, [value, delay]);

  return { debounced, flush };
}
