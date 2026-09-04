import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import Header from '@/components/Header';
import StatBadge from '@/components/StatBadge';

const DAYS = [
  { day: 'MON', date: '14', done: true },
  { day: 'TUE', date: '15', done: true },
  { day: 'WED', date: '16', done: true },
  { day: 'THU', date: '17', today: true },
  { day: 'FRI', date: '18', locked: true },
  { day: 'SAT', date: '19', locked: true },
];

const SWAPS = [
  { name: 'Egg White Burrito Bowl', kcal: '540 kcal', protein: '42g Protein', credits: '+0 Credits' },
  { name: 'Soya Tikka & Mash', kcal: '560 kcal', protein: '40g Protein', credits: '+0 Credits' },
];

export default function MealPlanScreen() {
  const theme = useTheme();
  const [selectedDay, setSelectedDay] = useState('17');
  const [confirmed, setConfirmed] = useState(false);

  return (
    <View style={[styles.screen, { backgroundColor: theme.bgPrimary }]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

        {/* Auto-lock Banner */}
        <View style={[styles.warningBanner, { backgroundColor: theme.isDark ? '#1A1500' : '#FEF3C7', borderBottomColor: theme.border }]}>
          <Text style={styles.warningIcon}>⏰</Text>
          <Text style={[styles.warningText, { color: theme.isDark ? '#F59E0B' : '#B45309' }]}>
            Orders auto-lock at 9:00 PM the previous night
          </Text>
          <StatBadge label="ACTIVE" color={theme.green} bgColor={theme.greenMuted} />
        </View>

        {/* Meal Calendar Header */}
        <View style={styles.calendarHeader}>
          <Text style={[styles.calendarTitle, { color: theme.textPrimary }]}>Meal Calendar</Text>
          <Text style={[styles.calendarMonth, { color: theme.green }]}>October 2024</Text>
        </View>

        {/* Date Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {DAYS.map((item) => {
            const isSelected = selectedDay === item.date;
            return (
              <TouchableOpacity
                key={item.date}
                onPress={() => setSelectedDay(item.date)}
                style={[
                  styles.dateItem,
                  { backgroundColor: theme.bgCard, borderColor: theme.border },
                  isSelected && { backgroundColor: theme.green, borderColor: theme.green },
                ]}
                activeOpacity={0.75}
              >
                <Text style={[styles.dayText, { color: isSelected ? (theme.isDark ? '#090D16' : '#FFFFFF') : theme.textMuted }]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateText, { color: isSelected ? (theme.isDark ? '#090D16' : '#FFFFFF') : theme.textPrimary }]}>
                  {item.date}
                </Text>
                {item.today && !isSelected && <Text style={[styles.todayLabel, { color: theme.green }]}>• TODAY</Text>}
                {item.done && <Text style={styles.doneCheck}>✅</Text>}
                {item.locked && <Text style={styles.lockIcon}>🔒</Text>}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Chef's Choice Card */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.mealTagRow}>
            <View style={[styles.chefBadge, { backgroundColor: theme.isDark ? '#1E2D40' : '#E2E8F0' }]}>
              <Text style={[styles.chefBadgeText, { color: theme.green }]}>👨‍🍳 CHEF'S CHOICE</Text>
            </View>
            <StatBadge label="High Protein" color={theme.warning} bgColor={theme.warningMuted} />
          </View>

          {/* Meal Image */}
          <View style={[styles.mealImageBox, { backgroundColor: theme.bgPrimary }]}>
            <Text style={styles.mealEmoji}>🍗🥦🍚</Text>
          </View>

          {/* Prepared By */}
          <View style={styles.preparedRow}>
            <Text style={[styles.preparedText, { color: theme.textMuted }]}>🍴 Prepared by Diet & Protein Mangaluru</Text>
            <Text style={[styles.rating, { color: theme.warning }]}>⭐ 4.9</Text>
          </View>

          {/* Meal Name */}
          <View style={styles.mealNameRow}>
            <Text style={[styles.mealName, { color: theme.textPrimary }]}>Teriyaki Paneer & Brown Rice Bowl</Text>
            <View style={[styles.glutenBadge, { backgroundColor: theme.greenMuted }]}>
              <Text style={[styles.glutenText, { color: theme.green }]}>GLUTEN-FREE</Text>
            </View>
          </View>

          <Text style={[styles.mealDesc, { color: theme.textMuted }]}>
            House-marinated organic paneer grilled with sugar-free teriyaki reduction, steamed broccoli florets, and mineral-rich brown rice.
          </Text>

          {/* Nutrition Row */}
          <View style={styles.nutritionRow}>
            <View style={styles.nutriStat}>
              <Text style={[styles.nutriValue, { color: theme.textPrimary }]}>580</Text>
              <Text style={[styles.nutriLabel, { color: theme.textMuted }]}>ENERGY{'\n'}kcal</Text>
            </View>
            <View style={[styles.nutriDivider, { backgroundColor: theme.border }]} />
            <View style={styles.nutriStat}>
              <Text style={[styles.nutriValue, { color: theme.green }]}>38g</Text>
              <Text style={[styles.nutriLabel, { color: theme.textMuted }]}>PROTEIN{'\n'}target met</Text>
            </View>
            <View style={[styles.nutriDivider, { backgroundColor: theme.border }]} />
            <View style={styles.nutriStat}>
              <Text style={[styles.nutriValue, { color: theme.carbs }]}>65g</Text>
              <Text style={[styles.nutriLabel, { color: theme.textMuted }]}>CARBS{'\n'}complex</Text>
            </View>
            <View style={[styles.nutriDivider, { backgroundColor: theme.border }]} />
            <View style={styles.nutriStat}>
              <Text style={[styles.nutriValue, { color: theme.fats }]}>14g</Text>
              <Text style={[styles.nutriLabel, { color: theme.textMuted }]}>FATS{'\n'}healthy</Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: confirmed ? theme.greenDark : theme.green }]}
            onPress={() => {
              setConfirmed(true);
              Alert.alert('Meal Confirmed! 🥗', 'Your meal for today has been locked in for 1:00 PM delivery.');
            }}
            activeOpacity={0.75}
          >
            <Text style={styles.confirmBtnIcon}>{confirmed ? '✓' : '✅'}</Text>
            <Text style={[styles.confirmBtnText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
              {confirmed ? 'Daily Meal Confirmed' : 'Confirm Daily Meal'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.swapBtn, { borderColor: theme.border }]}
            onPress={() => Alert.alert('Smart Swap', 'Choose from the Macro-Equivalent alternatives below!')}
            activeOpacity={0.75}
          >
            <Text style={[styles.swapBtnText, { color: theme.textPrimary }]}>⇄  Swap / Customize Meal</Text>
          </TouchableOpacity>
        </View>

        {/* Macro-Equivalent Swaps */}
        <View style={styles.swapSection}>
          <View style={styles.swapHeader}>
            <Text style={[styles.swapTitle, { color: theme.textPrimary }]}>⇄  Macro-Equivalent Swaps</Text>
            <StatBadge label="Matched to target" color={theme.warning} bgColor={theme.warningMuted} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SWAPS.map((item, idx) => (
              <View key={idx} style={[styles.swapCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                <View style={[styles.swapImageBox, { backgroundColor: theme.bgPrimary }]}>
                  <Text style={styles.swapEmoji}>🥣</Text>
                </View>
                <Text style={[styles.swapCreditBadge, { color: theme.green }]}>{item.credits} (Included)</Text>
                <Text style={[styles.swapName, { color: theme.textPrimary }]}>{item.name}</Text>
                <Text style={[styles.swapStats, { color: theme.textMuted }]}>{item.kcal} • {item.protein}</Text>
                <TouchableOpacity
                  style={[styles.swapSelectBtn, { borderColor: theme.border }]}
                  onPress={() => Alert.alert('Swap Successful! 🔄', `Swapped to ${item.name} with 0 additional credits.`)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.swapSelectText, { color: theme.textPrimary }]}>⇄  Select & Swap</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  warningBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1,
  },
  warningIcon: { fontSize: 14 },
  warningText: { flex: 1, fontSize: 11, fontWeight: '500' },

  calendarHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
  },
  calendarTitle: { fontSize: 20, fontWeight: 'bold' },
  calendarMonth: { fontSize: 13, fontWeight: '600' },

  dateScroll: { paddingHorizontal: 12, marginBottom: 16 },
  dateItem: {
    alignItems: 'center', marginHorizontal: 6, paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1, minWidth: 56,
  },
  dayText: { fontSize: 11, marginBottom: 4, fontWeight: '600' },
  dateText: { fontSize: 18, fontWeight: 'bold' },
  todayLabel: { fontSize: 8, fontWeight: 'bold', marginTop: 2 },
  doneCheck: { fontSize: 14, marginTop: 4 },
  lockIcon: { fontSize: 14, marginTop: 4 },

  card: {
    marginHorizontal: 16, borderRadius: 16,
    padding: 16, marginBottom: 16, borderWidth: 1,
  },
  mealTagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  chefBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  chefBadgeText: { fontSize: 11, fontWeight: 'bold' },
  mealImageBox: {
    height: 150, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  mealEmoji: { fontSize: 56 },

  preparedRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  preparedText: { fontSize: 12 },
  rating: { fontSize: 12, fontWeight: 'bold' },

  mealNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 },
  mealName: { flex: 1, fontSize: 18, fontWeight: 'bold' },
  glutenBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  glutenText: { fontSize: 9, fontWeight: 'bold' },
  mealDesc: { fontSize: 12, lineHeight: 18, marginBottom: 14 },

  nutritionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  nutriStat: { flex: 1, alignItems: 'center' },
  nutriValue: { fontSize: 20, fontWeight: 'bold' },
  nutriLabel: { fontSize: 10, textAlign: 'center', lineHeight: 14, marginTop: 2 },
  nutriDivider: { width: 1 },

  confirmBtn: {
    borderRadius: 12, paddingVertical: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 8, marginBottom: 10,
  },
  confirmBtnIcon: { fontSize: 16 },
  confirmBtnText: { fontSize: 15, fontWeight: 'bold' },
  swapBtn: {
    borderRadius: 12, paddingVertical: 14,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5,
  },
  swapBtnText: { fontSize: 14, fontWeight: '500' },

  swapSection: { paddingHorizontal: 16 },
  swapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  swapTitle: { fontSize: 16, fontWeight: 'bold' },
  swapCard: {
    borderRadius: 14, padding: 12,
    marginRight: 12, width: 190, borderWidth: 1,
  },
  swapImageBox: {
    height: 90, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  swapEmoji: { fontSize: 36 },
  swapCreditBadge: { fontSize: 10, fontWeight: 'bold', marginBottom: 6 },
  swapName: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
  swapStats: { fontSize: 11, marginBottom: 10 },
  swapSelectBtn: {
    borderRadius: 8, paddingVertical: 8,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1,
  },
  swapSelectText: { fontSize: 12, fontWeight: '500' },
});
