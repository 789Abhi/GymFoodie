import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';
import { useTheme } from '@/hooks/useTheme';
import Header from '@/components/Header';
import StatBadge from '@/components/StatBadge';
import RoleSwitcherModal from '@/components/RoleSwitcherModal';

export default function ProfileScreen() {
  const { isDarkMode, toggleTheme, currentRole, logout } = useGymFoodieStore();
  const theme = useTheme();
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.bgPrimary }]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={[styles.avatarLarge, { backgroundColor: theme.green }]}>
            <Text style={[styles.avatarText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>A</Text>
          </View>
          <Text style={[styles.profileName, { color: theme.textPrimary }]}>Abhishek TK</Text>
          <Text style={[styles.profileEmail, { color: theme.textMuted }]}>abhishek@gymfoodie.in</Text>
          <StatBadge label="VIP • Transformation Plan" color={theme.green} bgColor={theme.greenMuted} />
        </View>

        {/* Portal Perspective Switcher Card */}
        <TouchableOpacity
          style={[styles.portalSwitcherCard, { backgroundColor: theme.bgCard, borderColor: theme.green }]}
          onPress={() => setRoleModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 24 }}>🔀</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.portalSwitcherTitle, { color: theme.textPrimary }]}>
                Switch Portal Perspective
              </Text>
              <Text style={[styles.portalSwitcherSub, { color: theme.textMuted }]}>
                Currently browsing as: <Text style={{ color: theme.green, fontWeight: 'bold' }}>{currentRole.toUpperCase()}</Text>
              </Text>
            </View>
            <View style={[styles.switchBadge, { backgroundColor: theme.green }]}>
              <Text style={[styles.switchBadgeText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
                Switch ⇄
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Appearance / Theme Toggle Card */}
        <View style={[styles.themeCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.themeRow}>
            <Text style={styles.themeEmoji}>{isDarkMode ? '🌙' : '☀️'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.themeTitle, { color: theme.textPrimary }]}>
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
              <Text style={[styles.themeSubtitle, { color: theme.textMuted }]}>
                {isDarkMode ? 'Deep obsidian theme active' : 'Clean bright theme active'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: '#10B981' }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>18</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Gym Check-ins</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>40</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Meals Tracked</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>87</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>FitScore</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {[
            { icon: '📋', label: 'My Subscription Plan', onPress: () => router.push('/plans') },
            { icon: '👑', label: 'GymFoodie HQ Super Admin Portal', onPress: () => router.push('/super-admin') },
            { icon: '🏋️‍♂️', label: 'Gym Partner Admin Portal', onPress: () => router.push('/gym-admin') },
            { icon: '🍳', label: 'Kitchen Partner Admin Portal', onPress: () => router.push('/restaurant-admin') },
            { icon: '🔐', label: 'Multi-Role Login Page', onPress: () => router.push('/login') },
            { icon: '🎯', label: 'Goals & Preferences', onPress: () => {} },
            { icon: '👨‍🍳', label: 'My Coach — Coach Rahul', onPress: () => {} },
            { icon: '🔔', label: 'Notifications', onPress: () => {} },
            { icon: '❓', label: 'Help & Support', onPress: () => {} },
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.menuItem, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
              onPress={item.onPress}
              activeOpacity={0.75}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuLabel, { color: theme.textPrimary }]}>{item.label}</Text>
              <Text style={[styles.menuArrow, { color: theme.textMuted }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.75}>
          <Text style={styles.logoutText}>Log Out & Return to Login</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: theme.textDim }]}>GymFoodie v1.0.0 • Multi-Role Prototype</Text>
      </ScrollView>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        visible={roleModalVisible}
        onClose={() => setRoleModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  profileCard: {
    alignItems: 'center', padding: 22,
    marginHorizontal: 16,
    borderRadius: 16, marginBottom: 12,
    borderWidth: 1,
  },
  avatarLarge: {
    width: 76, height: 76, borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center', marginBottom: 10,
  },
  avatarText: { fontSize: 34, fontWeight: 'bold' },
  profileName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  profileEmail: { fontSize: 13, marginBottom: 10 },

  portalSwitcherCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  portalSwitcherTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  portalSwitcherSub: {
    fontSize: 11,
  },
  switchBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  switchBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  themeCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeEmoji: { fontSize: 22 },
  themeTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  themeSubtitle: { fontSize: 11 },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16, borderRadius: 16, padding: 14,
    marginBottom: 12, borderWidth: 1,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', marginBottom: 2 },
  statLabel: { fontSize: 11, textAlign: 'center' },
  statDivider: { width: 1 },

  menuSection: { marginHorizontal: 16, marginBottom: 14 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14,
    borderRadius: 12, marginBottom: 8,
    borderWidth: 1,
  },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: 13, fontWeight: '500' },
  menuArrow: { fontSize: 18 },

  logoutBtn: {
    marginHorizontal: 16, borderRadius: 14, paddingVertical: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#EF4444', marginBottom: 12,
  },
  logoutText: { color: '#EF4444', fontSize: 14, fontWeight: 'bold' },

  version: { fontSize: 11, textAlign: 'center' },
});
