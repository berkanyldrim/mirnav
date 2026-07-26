import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { BackgroundGraceSeconds } from '@/constants/session';
import { useSessionStore } from '@/features/focus-session/session-store';

export function useAppStateGuard() {
  const status = useSessionStore((state) => state.status);
  const backgroundedAt = useRef<number | null>(null);

  useEffect(() => {
    if (status !== 'running') return;
    backgroundedAt.current = null;
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background') {
        backgroundedAt.current = Date.now();
        return;
      }
      if (nextState !== 'active' || backgroundedAt.current === null) return;
      const awaySeconds = (Date.now() - backgroundedAt.current) / 1000;
      backgroundedAt.current = null;
      const { endsAt, completeSession, failSession } = useSessionStore.getState();
      if (endsAt !== null && Date.now() >= endsAt) {
        completeSession();
        return;
      }
      if (awaySeconds > BackgroundGraceSeconds) {
        failSession();
      }
    });
    return () => subscription.remove();
  }, [status]);
}
