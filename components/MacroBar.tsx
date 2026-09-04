import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type MacroBarProps = {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
};

export default function MacroBar({ label, current, target, unit, color }: MacroBarProps) {
  const theme = useTheme();
  const progress = Math.min((current / target) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
        <Text style={styles.values}>
          <Text style={{ color }}>{current}{unit}</Text>
          <Text style={[styles.target, { color: theme.textMuted }]}> /{target}{unit}</Text>
        </Text>
      </View>
      <View style={[styles.trackBg, { backgroundColor: theme.border }]}>
        <View style={[styles.trackFill, { width: `${progress}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
  },
  values: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  target: {
    fontWeight: 'normal',
  },
  trackBg: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 3,
  },
});
