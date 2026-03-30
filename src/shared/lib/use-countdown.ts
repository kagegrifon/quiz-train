import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export function useStopwatch(enabled: boolean): number {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [enabled]);

  return elapsed;
}

export function useCountdown(
  totalSec: number,
  enabled: boolean,
  onExpire: () => void,
): number {
  const [remaining, setRemaining] = useState(totalSec);
  const onExpireRef = useRef(onExpire);
  useLayoutEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (!enabled) return;
    if (remaining <= 0) {
      onExpireRef.current();
      return;
    }
    const id = setInterval(() => setRemaining((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [enabled, remaining]);

  return remaining;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
