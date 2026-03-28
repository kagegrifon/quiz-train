import { useEffect, useRef, useState } from 'react';

export function useCountdown(
  totalSec: number,
  enabled: boolean,
  onExpire: () => void,
): number {
  const [remaining, setRemaining] = useState(totalSec);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

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
