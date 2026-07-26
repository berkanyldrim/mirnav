import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const subscribeToNothing = () => () => {};

export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
