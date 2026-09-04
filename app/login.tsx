import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';
import { useTheme } from '@/hooks/useTheme';
import type { UserRole } from '@/types';

interface RoleConfig {
  id: UserRole;
  title: string;
  emoji: string;
  badge: string;
  demoEmail: string;
  demoPass: string;
  portalDescription: string;
  targetRoute: string;
}

const ROLES: RoleConfig[] = [
  {
    id: 'user',
    title: 'Member',
    emoji: '👤',
    badge: 'App User',
    demoEmail: 'abhishek@gymfoodie.in',
    demoPass: 'GymFoodie@123',
    portalDescription: 'Track macros, order chef meals, and scan your gym pass',
    targetRoute: '/(tabs)/home',
  },
  {
    id: 'gym_admin',
    title: 'Gym Admin',
    emoji: '🏋️‍♂️',
    badge: 'Iron House Gym',
    demoEmail: 'ironhouse.admin@gymfoodie.fit',
    demoPass: 'IronAdmin#2026',
    portalDescription: 'Manage turnstile QR scans, floor capacity, and check-in logs',
    targetRoute: '/gym-admin',
  },
  {
    id: 'restaurant_admin',
    title: 'Kitchen Admin',
    emoji: '🍳',
    badge: 'Diet & Protein Kitchen',
    demoEmail: 'kitchen.mangaluru@gymfoodie.fit',
    demoPass: 'ChefPro@Mangaluru',
    portalDescription: 'Live meal prep queue, courier dispatch, and diet specifications',
    targetRoute: '/restaurant-admin',
  },
  {
    id: 'super_admin',
    title: 'HQ Admin',
    emoji: '👑',
    badge: 'GymFoodie HQ',
    demoEmail: 'admin@gymfoodie.fit',
    demoPass: 'SuperAdmin#2026',
    portalDescription: 'Central operations, weekly treasury payouts, complaints, and network audits',
    targetRoute: '/super-admin',
  },
];

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { setRole, login } = useGymFoodieStore();

  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const activeRoleConfig = ROLES.find((r) => r.id === selectedRole)!;

  const [email, setEmail] = useState(activeRoleConfig.demoEmail);
  const [password, setPassword] = useState(activeRoleConfig.demoPass);
  const [showPassword, setShowPassword] = useState(false);

  // Switch role tab
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const newConfig = ROLES.find((r) => r.id === role)!;
    setEmail(newConfig.demoEmail);
    setPassword(newConfig.demoPass);
  };

  // Perform login
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please provide email and password.');
      return;
    }

    setRole(selectedRole);
    login();
    router.replace(activeRoleConfig.targetRoute as any);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.bgPrimary }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <View style={[styles.brandLogoBox, { backgroundColor: theme.bgCard, borderColor: theme.green }]}>
            <Text style={styles.brandEmoji}>🏋️🍃</Text>
          </View>
          <Text style={styles.brandTitle}>
            <Text style={{ color: theme.textPrimary }}>Gym</Text>
            <Text style={{ color: theme.green }}>Foodie</Text>
          </Text>
          <Text style={[styles.brandTagline, { color: theme.textMuted }]}>
            UNIFIED FITNESS & MACRO ECOSYSTEM
          </Text>
        </View>

        {/* Multi-Role Segmented Selector */}
        <View style={[styles.roleSelectorWrapper, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.rolePrompt, { color: theme.textMuted }]}>SELECT LOGIN PORTAL PERSPECTIVE</Text>
          <View style={styles.roleTabs}>
            {ROLES.map((r) => {
              const isActive = selectedRole === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.roleTab,
                    isActive && { backgroundColor: theme.green },
                  ]}
                  onPress={() => handleRoleChange(r.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleTabEmoji}>{r.emoji}</Text>
                  <Text
                    style={[
                      styles.roleTabTitle,
                      { color: isActive ? (theme.isDark ? '#090D16' : '#FFFFFF') : theme.textMuted },
                    ]}
                  >
                    {r.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Role Overview Card */}
        <View style={[styles.roleCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.roleCardHeader}>
            <View>
              <Text style={[styles.portalHeading, { color: theme.textPrimary }]}>
                {activeRoleConfig.emoji} {activeRoleConfig.title} Portal
              </Text>
              <Text style={[styles.portalDesc, { color: theme.textMuted }]}>
                {activeRoleConfig.portalDescription}
              </Text>
            </View>
            <View style={[styles.rolePill, { backgroundColor: theme.greenMuted }]}>
              <Text style={[styles.rolePillText, { color: theme.green }]}>{activeRoleConfig.badge}</Text>
            </View>
          </View>

          {/* 1-Tap Quick Login Button */}
          <TouchableOpacity
            style={[styles.instantLoginBtn, { backgroundColor: theme.green }]}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={[styles.instantLoginText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
              ⚡ 1-Tap Instant {activeRoleConfig.title} Login
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textMuted }]}>or custom login</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>EMAIL / IDENTIFIER</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.bgPrimary, borderColor: theme.border, color: theme.textPrimary }]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter email"
              placeholderTextColor={theme.textDim}
            />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>PASSWORD</Text>
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={[styles.showPassText, { color: theme.green }]}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.textInput, { backgroundColor: theme.bgPrimary, borderColor: theme.border, color: theme.textPrimary }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter password"
              placeholderTextColor={theme.textDim}
            />
          </View>

          {/* Standard Sign In Button */}
          <TouchableOpacity
            style={[styles.standardSignInBtn, { borderColor: theme.border }]}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={[styles.standardSignInText, { color: theme.textPrimary }]}>
              Sign In to {activeRoleConfig.title}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Demo Navigation Helper */}
        <View style={styles.demoHelper}>
          <Text style={[styles.demoHelperText, { color: theme.textDim }]}>
            💡 All 3 roles are pre-configured with static prototype credentials. You can also switch roles anytime using the top header in any dashboard!
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 22,
  },
  brandLogoBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandEmoji: {
    fontSize: 28,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  brandTagline: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '600',
  },

  roleSelectorWrapper: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  rolePrompt: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 10,
  },
  roleTabs: {
    flexDirection: 'row',
    gap: 6,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleTabEmoji: {
    fontSize: 16,
  },
  roleTabTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  roleCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  roleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  portalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  portalDesc: {
    fontSize: 12,
    lineHeight: 16,
    maxWidth: 240,
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  instantLoginBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  instantLoginText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    paddingHorizontal: 10,
  },

  formGroup: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  showPassText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  textInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 1,
  },

  standardSignInBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    marginTop: 4,
  },
  standardSignInText: {
    fontSize: 13,
    fontWeight: '600',
  },

  demoHelper: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  demoHelperText: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
