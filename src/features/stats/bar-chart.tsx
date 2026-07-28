import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ChartHeight = 160;

type BarChartProps = {
  values: number[];
  labels: (string | null)[];
  selectedIndex: number | null;
  onSelectIndex: (index: number | null) => void;
  getBarLabel: (index: number) => string;
};

export function BarChart({
  values,
  labels,
  selectedIndex,
  onSelectIndex,
  getBarLabel,
}: BarChartProps) {
  const theme = useTheme();
  const maxValue = Math.max(...values, 1);

  return (
    <View>
      <View style={[styles.plot, { borderBottomColor: theme.backgroundSelected }]}>
        {values.map((value, index) => {
          const dimmed = selectedIndex !== null && selectedIndex !== index;
          return (
            <Pressable
              key={index}
              onPress={() => onSelectIndex(selectedIndex === index ? null : index)}
              accessibilityRole="button"
              accessibilityLabel={getBarLabel(index)}
              style={styles.column}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: theme.chart,
                    height: Math.max((value / maxValue) * ChartHeight, 2),
                    opacity: value === 0 ? 0.25 : dimmed ? 0.45 : 1,
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
      <View style={styles.labelRow}>
        {labels.map((label, index) => (
          <View key={index} style={styles.labelSlot}>
            {label !== null && (
              <ThemedText type="small" themeColor="textSecondary" style={styles.labelText}>
                {label}
              </ThemedText>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: ChartHeight,
    gap: 2,
    borderBottomWidth: 1,
  },
  column: {
    flex: 1,
    height: ChartHeight,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  labelRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: Spacing.one,
  },
  labelSlot: {
    flex: 1,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 10,
    lineHeight: 14,
  },
});
