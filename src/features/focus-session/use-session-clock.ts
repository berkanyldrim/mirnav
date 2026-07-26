import { useEffect, useState } from 'react';

import { useSessionStore } from '@/features/focus-session/session-store';

export function useSessionClock() {
  const status = useSessionStore((state) => state.status);
  const endsAt = useSessionStore((state) => state.endsAt);
  const durationMinutes = useSessionStore((state) => state.durationMinutes);
  const completeSession = useSessionStore((state) => state.completeSession);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (status !== 'running') return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    if (status === 'running' && endsAt !== null && now >= endsAt) {
      completeSession();
    }
  }, [status, endsAt, now, completeSession]);

  const totalSeconds = durationMinutes * 60;

  if (status !== 'running' || endsAt === null) {
    return { remainingSeconds: totalSeconds, totalSeconds };
  }

  const remainingSeconds = Math.min(totalSeconds, Math.max(0, Math.ceil((endsAt - now) / 1000)));

  return { remainingSeconds, totalSeconds };
}
