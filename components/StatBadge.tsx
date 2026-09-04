import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type StatBadgeProps = {
  label: string;
  color?: string;
  bgColor?: string;
};

export default function StatBadge({ label, color = Colors.green, bgColor = Colors.greenMuted }: StatBadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
