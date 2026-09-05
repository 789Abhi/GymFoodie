import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';

export default function SplashScreen() {
  const theme = useTheme();
  const { setRole, login } = useGymFoodieStore();

  const handleInstantMember = () => {
    setRole('user');
    login();
    router.replace('/(tabs)/home');
  };

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: theme.bgPrimary }]} contentContainerStyle={styles.container} bounces={false}>

      {/* Logo */}
      <View style={styles.logoSection}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.splashLogoImage}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>
          <Text style={{ color: theme.textPrimary }}>Gym</Text>
          <Text style={{ color: theme.green }}>Foodie</Text>
        </Text>
        <View style={styles.taglineRow}>
          <View style={[styles.line, { backgroundColor: theme.textMuted }]} />
          <Text style={[styles.tagline, { color: theme.textMuted }]}>  EAT SMART. TRAIN HARD.  </Text>
          <View style={[styles.line, { backgroundColor: theme.textMuted }]} />
        </View>
      </View>

      {/* Hero Image Card */}
      <View style={[styles.heroCard, { borderColor: theme.border }]}>
        <Image
          source={require('@/assets/images/salmon-avocado.jpg')}
          style={styles.heroRealImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroBadgeText}>⚡ CHEF PREPARED • MACRO CRAFTED</Text>
          <Text style={styles.heroOverlayTitle}>Gourmet Macro Meals & Gym Access</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={[styles.description, { color: theme.textMuted }]}>
        One monthly subscription uniting your{' '}
        <Text style={{ color: theme.green, fontWeight: '600' }}>gym access</Text>, chef-prepared{' '}
        <Text style={{ color: theme.green, fontWeight: '600' }}>macro meals</Text>, and{' '}
        <Text style={{ color: theme.green, fontWeight: '600' }}>nutrition tracking</Text>.
      </Text>

      {/* Primary CTA: Choose Role / Sign In */}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: theme.green }]}
        onPress={() => router.push('/login')}
        activeOpacity={0.8}
      >
        <Text style={[styles.primaryBtnText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
          Select Login Role & Sign In
        </Text>
        <Text style={[styles.arrowIcon, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>›</Text>
      </TouchableOpacity>

      {/* Secondary CTA: Quick Member Demo */}
      <TouchableOpacity
        style={[styles.secondaryBtn, { borderColor: theme.border }]}
        onPress={handleInstantMember}
        activeOpacity={0.8}
      >
        <Text style={[styles.secondaryBtnText, { color: theme.textPrimary }]}>Instant Member Access (Demo)</Text>
        <Text style={[styles.arrowIconDark, { color: theme.textPrimary }]}>›</Text>
      </TouchableOpacity>

      {/* Direct Partner Admin Link */}
      <TouchableOpacity
        style={styles.adminLink}
        onPress={() => router.push('/login')}
        activeOpacity={0.75}
      >
        <Text style={[styles.adminLinkText, { color: theme.textMuted }]}>
          👑 Gym Admin • Kitchen Admin • Super Admin ➔
        </Text>
      </TouchableOpacity>

      {/* Security Note */}
      <View style={styles.securityRow}>
        <Text style={styles.securityIcon}>🛡️</Text>
        <Text style={[styles.securityText, { color: theme.textMuted }]}>Your health data is 100% secure and private.</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  logoSection: { alignItems: 'center', marginBottom: 24 },
  splashLogoImage: {
    width: 140,
    height: 72,
    marginBottom: 8,
  },
  logoText: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  taglineRow: { flexDirection: 'row', alignItems: 'center' },
  line: { flex: 1, height: 1 },
  tagline: { fontSize: 10, letterSpacing: 2 },

  heroCard: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    position: 'relative',
  },
  heroRealImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(9, 13, 22, 0.82)',
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#10B981',
    letterSpacing: 1,
    marginBottom: 2,
  },
  heroOverlayTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8FAFC',
  },

  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },

  primaryBtn: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: { fontSize: 15, fontWeight: 'bold' },
  arrowIcon: { fontSize: 20, marginLeft: 8, fontWeight: 'bold' },

  secondaryBtn: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: 20,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '500' },
  arrowIconDark: { fontSize: 20, marginLeft: 8 },

  adminLink: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  adminLinkText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  securityRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  securityText: { fontSize: 12 },
  securityIcon: { fontSize: 14 },
});
