import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';
import RoleSwitcherModal from './RoleSwitcherModal';

export default function Header() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const currentRole = useGymFoodieStore((state) => state.currentRole);
  const [switcherVisible, setSwitcherVisible] = useState(false);

  const getRoleLabel = () => {
    switch (currentRole) {
      case 'gym_admin':
        return 'Gym Admin ⇄';
      case 'restaurant_admin':
        return 'Kitchen Admin ⇄';
      default:
        return 'Member ⇄';
    }
  };

  return (
    <>
      <View style={[styles.container, { paddingTop: Math.max(insets.top, 12), backgroundColor: theme.bgPrimary }]}>
        {/* Logo Area */}
        <View style={styles.logoRow}>
          <View style={[styles.logoIcon, { backgroundColor: theme.bgCard, borderColor: theme.green }]}>
            <Text style={styles.logoEmoji}>🏋️</Text>
          </View>
          <View>
            <Text style={styles.logoText}>
              <Text style={{ color: theme.textPrimary }}>Gym</Text>
              <Text style={{ color: theme.green }}>Foodie</Text>
            </Text>
            <Text style={[styles.tagline, { color: theme.textMuted }]}>EAT SMART. TRAIN HARD.</Text>
          </View>
        </View>

        {/* Right side: Role Switcher Pill + Avatar */}
        <View style={styles.rightGroup}>
          <TouchableOpacity
            style={[styles.roleBadge, { backgroundColor: theme.greenMuted, borderColor: theme.green }]}
            onPress={() => setSwitcherVisible(true)}
            activeOpacity={0.75}
          >
            <Text style={[styles.roleBadgeText, { color: theme.green }]}>{getRoleLabel()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: theme.green }]}
            onPress={() => setSwitcherVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.avatarText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>A</Text>
          </TouchableOpacity>
        </View>
      </View>

      <RoleSwitcherModal
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  logoEmoji: {
    fontSize: 18,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 9,
    letterSpacing: 1,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
