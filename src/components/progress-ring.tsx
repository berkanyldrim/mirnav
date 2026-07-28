import { StyleSheet, View, type ViewProps } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/hooks/use-theme';

type ProgressRingProps = ViewProps & {
  size: number;
  strokeWidth: number;
  progress: number;
};

export function ProgressRing({
  size,
  strokeWidth,
  progress,
  children,
  style,
  ...rest
}: ProgressRingProps) {
  const theme = useTheme();
  const safeSize = Math.max(size, strokeWidth);
  const center = safeSize / 2;
  const radius = (safeSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <View style={[{ width: safeSize, height: safeSize }, styles.container, style]} {...rest}>
      <Svg width={safeSize} height={safeSize} style={styles.svg}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.backgroundElement}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.accent}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clampedProgress)}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
});
