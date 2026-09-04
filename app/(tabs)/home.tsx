import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Header from '@/components/Header';
import MacroBar from '@/components/MacroBar';
import StatBadge from '@/components/StatBadge';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.bgPrimary }]}>
      <Header />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>METABOLIC FUEL • DAY 14</Text>
          <View style={styles.greetingRow}>
            <Text style={[styles.greeting, { color: theme.textPrimary }]}>Hey Abhishek 👋</Text>
            <View style={[styles.lightningBtn, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
              <Text style={styles.lightningIcon}>⚡</Text>
            </View>
          </View>

          {/* Plan Banner */}
          <View style={[styles.planBanner, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.planLeft}>
              <Text style={styles.planIcon}>🎯</Text>
              <View>
                <Text style={[styles.planName, { color: theme.green }]}>TRANSFORMATION PLAN</Text>
                <Text style={[styles.planCredits, { color: theme.textMuted }]}>28/40 Plan Credits Remaining</Text>
              </View>
            </View>
            <StatBadge label="● Active" color={theme.green} bgColor={theme.greenMuted} />
          </View>
        </View>

        {/* Daily Caloric Target Card */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.calorieHeader}>
            <Text style={[styles.cardLabel, { color: theme.textMuted }]}>DAILY CALORIC TARGET</Text>
            <StatBadge label="75% Reached" color={theme.green} bgColor={theme.greenMuted} />
          </View>

          <View style={styles.calorieRow}>
            {/* Circular FitScore */}
            <View style={styles.fitscoreContainer}>
              <View style={[styles.outerRing, { borderColor: theme.green }]}>
                <View style={[styles.middleRing, { borderColor: theme.carbs }]}>
                  <View style={[styles.innerRing, { borderColor: theme.fats, backgroundColor: theme.bgPrimary }]}>
                    <Text style={[styles.fitscoreLabel, { color: theme.textMuted }]}>FitScore</Text>
                    <Text style={[styles.fitscoreValue, { color: theme.textPrimary }]}>87</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Calorie Info + Macros */}
            <View style={styles.calorieInfo}>
              <Text style={[styles.calorieNumber, { color: theme.textPrimary }]}>1,650</Text>
              <Text style={[styles.calorieTarget, { color: theme.textMuted }]}>/2,200 kcal</Text>
              <Text style={[styles.kcalLeft, { color: theme.textMuted }]}>550 kcal left</Text>

              <View style={styles.macros}>
                <MacroBar label="Protein" current={110} target={150} unit="g" color={theme.protein} />
                <MacroBar label="Carbs" current={120} target={180} unit="g" color={theme.carbs} />
                <MacroBar label="Fats" current={42} target={60} unit="g" color={theme.fats} />
              </View>
            </View>
          </View>
        </View>

        {/* Meal Card */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.mealHeaderRow}>
            <View style={[styles.mealBadge, { backgroundColor: theme.isDark ? '#1E2D40' : '#E2E8F0' }]}>
              <Text style={[styles.mealBadgeText, { color: theme.textMuted }]}>🍽️ POST-WORKOUT LUNCH</Text>
            </View>
            <Text style={[styles.mealTime, { color: theme.textMuted }]}>⏰ Today 1:00 PM</Text>
          </View>

          {/* Meal Image Placeholder */}
          <View style={[styles.mealImageBox, { backgroundColor: theme.bgPrimary }]}>
            <Text style={styles.mealEmoji}>🥗</Text>
          </View>

          {/* Delivery Info */}
          <View style={styles.deliveryRow}>
            <Text style={styles.deliveryIcon}>🛵</Text>
            <Text style={[styles.deliveryText, { color: theme.textMuted }]}>Arriving by 1:00 PM at Home • Courier Karan 1.2 km away</Text>
            <TouchableOpacity style={[styles.trackBtn, { backgroundColor: theme.greenMuted }]} activeOpacity={0.75}>
              <Text style={[styles.trackBtnText, { color: theme.green }]}>Track</Text>
            </TouchableOpacity>
          </View>

          {/* Meal Details */}
          <Text style={[styles.mealName, { color: theme.textPrimary }]}>Grilled Herb Chicken & Quinoa</Text>
          <Text style={[styles.mealDesc, { color: theme.textMuted }]}>Sous-vide herb chicken, avocado cream, citrus kale</Text>
          <Text style={[styles.mealCalories, { color: theme.green }]}>620 KCAL</Text>

          {/* Macro Pills */}
          <View style={styles.pillRow}>
            <View style={[styles.pill, { backgroundColor: theme.greenMuted }]}>
              <Text style={[styles.pillText, { color: theme.green }]}>⚡ 48g Protein</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: theme.carbsBg }]}>
              <Text style={[styles.pillText, { color: theme.carbs }]}>52g Carbs</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: theme.fatsBg }]}>
              <Text style={[styles.pillText, { color: theme.fats }]}>14g Fats</Text>
            </View>
            <View style={[styles.pill, { backgroundColor: theme.isDark ? '#1E2D40' : '#E2E8F0' }]}>
              <Text style={[styles.pillText, { color: theme.textMuted }]}>6g Fiber</Text>
            </View>
          </View>
        </View>

        {/* Daily Hub & Passes */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Daily Hub & Passes</Text>
          <Text style={[styles.sectionBadge, { color: theme.green }]}>Synchronized</Text>
        </View>

        {/* Gym Pass Tile */}
        <TouchableOpacity
          style={[styles.hubTile, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          onPress={() => router.push('/(tabs)/gym-pass')}
          activeOpacity={0.75}
        >
          <Text style={styles.hubIcon}>🏋️</Text>
          <View style={styles.hubInfo}>
            <Text style={[styles.hubTitle, { color: theme.textPrimary }]}>
              Iron House Gym <Text style={{ color: theme.green }}>●</Text>
            </Text>
            <Text style={[styles.hubSub, { color: theme.textMuted }]}>Turnstile pass active • Peak hours</Text>
          </View>
          <View style={[styles.tapQrBtn, { backgroundColor: theme.green }]}>
            <Text style={[styles.tapQrText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>Tap QR</Text>
          </View>
        </TouchableOpacity>

        {/* Meal Calendar Tile */}
        <TouchableOpacity
          style={[styles.hubTile, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          onPress={() => router.push('/(tabs)/meal-plan')}
          activeOpacity={0.75}
        >
          <Text style={styles.hubIcon}>📅</Text>
          <View style={styles.hubInfo}>
            <Text style={[styles.hubTitle, { color: theme.textPrimary }]}>7-Day Meal Calendar</Text>
            <Text style={[styles.hubSub, { color: theme.textMuted }]}>Salmon bowl tomorrow • 6 custom meals</Text>
          </View>
          <Text style={[styles.hubArrow, { color: theme.textMuted }]}>›</Text>
        </TouchableOpacity>

        {/* Swap Dinner Tile */}
        <View style={[styles.hubTile, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={styles.hubIcon}>🔄</Text>
          <View style={styles.hubInfo}>
            <Text style={[styles.hubTitle, { color: theme.textPrimary }]}>Swap Dinner Dish</Text>
            <Text style={[styles.hubSub, { color: theme.textMuted }]}>Locking daily kitchen orders at 9:00 PM</Text>
          </View>
          <View style={styles.swapRight}>
            <Text style={[styles.timerText, { color: theme.warning }]}>13h 59m left</Text>
            <TouchableOpacity style={[styles.swapBtn, { backgroundColor: theme.border }]} activeOpacity={0.75} onPress={() => router.push('/(tabs)/meal-plan')}>
              <Text style={[styles.swapBtnText, { color: theme.textPrimary }]}>Swap</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1 },

  greetingSection: { paddingHorizontal: 16, paddingTop: 4, marginBottom: 14 },
  subtitle: { fontSize: 11, letterSpacing: 1.5, marginBottom: 4, fontWeight: '600' },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { fontSize: 26, fontWeight: 'bold' },
  lightningBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
  },
  lightningIcon: { fontSize: 18 },
  planBanner: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderRadius: 12, padding: 12,
    borderWidth: 1,
  },
  planLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  planIcon: { fontSize: 20 },
  planName: { fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  planCredits: { fontSize: 12, marginTop: 2 },

  card: {
    marginHorizontal: 16, borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1,
  },
  cardLabel: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },

  calorieHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  calorieRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  fitscoreContainer: { alignItems: 'center' },
  outerRing: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 6,
    justifyContent: 'center', alignItems: 'center',
  },
  middleRing: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 5,
    justifyContent: 'center', alignItems: 'center',
  },
  innerRing: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 4,
    justifyContent: 'center', alignItems: 'center',
  },
  fitscoreLabel: { fontSize: 8 },
  fitscoreValue: { fontSize: 17, fontWeight: 'bold' },

  calorieInfo: { flex: 1 },
  calorieNumber: { fontSize: 28, fontWeight: 'bold' },
  calorieTarget: { fontSize: 13 },
  kcalLeft: { fontSize: 12, marginBottom: 8 },
  macros: { marginTop: 2 },

  mealHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mealBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  mealBadgeText: { fontSize: 10, fontWeight: 'bold' },
  mealTime: { fontSize: 11 },
  mealImageBox: {
    height: 120,
    borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  mealEmoji: { fontSize: 56 },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  deliveryIcon: { fontSize: 16 },
  deliveryText: { flex: 1, fontSize: 11 },
  trackBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  trackBtnText: { fontSize: 12, fontWeight: 'bold' },
  mealName: { fontSize: 17, fontWeight: 'bold', marginBottom: 4 },
  mealDesc: { fontSize: 12, marginBottom: 8 },
  mealCalories: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  pillText: { fontSize: 11, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  sectionBadge: { fontSize: 11 },
  hubTile: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 16, borderRadius: 14,
    padding: 14, marginBottom: 10, borderWidth: 1,
  },
  hubIcon: { fontSize: 24 },
  hubInfo: { flex: 1 },
  hubTitle: { fontSize: 14, fontWeight: '600' },
  hubSub: { fontSize: 11, marginTop: 2 },
  hubArrow: { fontSize: 22 },
  tapQrBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  tapQrText: { fontSize: 12, fontWeight: 'bold' },
  swapRight: { alignItems: 'flex-end', gap: 4 },
  timerText: { fontSize: 10, fontWeight: 'bold' },
  swapBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  swapBtnText: { fontSize: 12, fontWeight: '600' },
});
