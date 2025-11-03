import { useEffect, useMemo, useState } from "react";

export function useRotatingData(baseSeries, stepMs = 3000) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset((o) => (o + 1) % baseSeries.length), stepMs);
    return () => clearInterval(id);
  }, [baseSeries.length, stepMs]);

  const data = useMemo(() => {
    const a = baseSeries.slice(offset).concat(baseSeries.slice(0, offset));
    return a;
  }, [offset, baseSeries]);

  const reset = () => setOffset(0);
  return { data, reset };
}
