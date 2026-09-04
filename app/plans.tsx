import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';
import Header from '@/components/Header';

const PLANS = [
  {
    id: 'fitness',
    tier: 'STARTER TIER',
    name: 'FITNESS',
    monthlyPrice: 5999,
    quarterlyPrice: 15297,
    desc: 'Essential fuel and workout access',
    features: [
      'Any Partner Gym Access',
      '20 Gourmet Meal Credits',
      'Sync Macros via App Track',
      'Kitchen Pick-Up Only',
      'Quick digital check-in',
    ],
    popular: false,
    color: '#94A3B8',
  },
  {
    id: 'transformation',
    tier: 'RECOMMENDED',
    name: 'TRANSFORMATION',
    monthlyPrice: 8999,
    quarterlyPrice: 22947,
    desc: 'The full athlete body recomposition suite',
    features: [
      'All Gym Access + High-End Clubs',
      '40 Gourmet Meal Credits / month',
      'Trainer Macro Sync via Apple Health / Garmin',
      '20 Free Priority Home Deliveries',
      'Weekly Macro Tuning by Sports Dietitian',
    ],
    popular: true,
    color: '#10B981',
    badge: 'Best Value Choice',
    extra: 'Includes personal locker priority',
  },
  {
    id: 'premium',
    tier: 'VIP CONCIERGE',
    name: 'PREMIUM',
    monthlyPrice: 11999,
    quarterlyPrice: 30597,
    desc: 'White-glove executive performance',
    features: [
      'VIP Gym Access + Tier-1 Crossfit Boxes',
      '60 Meal Credits (Lunch + Dinner)',
      'Unlimited Doorstep Thermal Delivery',
      '1-on-1 Monthly Nutritionist Video Consult',
      'Direct Michelin-trained Chef Requests',
    ],
    popular: false,
    color: '#8B5CF6',
    extra: 'Dedicated concierge line',
  },
];

export default function PlansScreen() {
  const theme = useTheme();
  const [billing, setBilling] = useState<'monthly' | 'quarterly'>('monthly');
  const [activePlan, setActivePlan] = useState('transformation');
  const { upgradePlan } = useGymFoodieStore();

  const handleSubscribe = (planId: string, planName: string, price: number) => {
    upgradePlan(planId as any, billing);
    setActivePlan(planId);
    Alert.alert(
      'Subscription Activated! 🎉',
      `Welcome to the ${planName} Plan (${billing}). ₹${price.toLocaleString('en-IN')} confirmed.`
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.bgPrimary }]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Back navigation */}
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()} activeOpacity={0.75}>
          <Text style={[styles.backText, { color: theme.green }]}>‹ Back to Profile</Text>
        </TouchableOpacity>

        {/* Header Hero */}
        <View style={styles.topSection}>
          <View style={[styles.unifyBadge, { backgroundColor: theme.greenMuted }]}>
            <Text style={[styles.unifyText, { color: theme.green }]}>⚡ UNIFY BODY & FUEL</Text>
          </View>
          <Text style={[styles.mainTitle, { color: theme.textPrimary }]}>Choose Your All-In-One Fitness Plan</Text>
          <Text style={[styles.mainSubtitle, { color: theme.textMuted }]}>Gym Access + Macro Meals + Nutrition Tracking</Text>

          {/* Toggle */}
          <View style={[styles.toggle, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.toggleBtn, billing === 'monthly' && { backgroundColor: theme.green }]}
              onPress={() => setBilling('monthly')}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleBtnText, { color: billing === 'monthly' ? (theme.isDark ? '#090D16' : '#FFFFFF') : theme.textMuted }]}>
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, billing === 'quarterly' && { backgroundColor: theme.green }]}
              onPress={() => setBilling('quarterly')}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleBtnText, { color: billing === 'quarterly' ? (theme.isDark ? '#090D16' : '#FFFFFF') : theme.textMuted }]}>
                Quarterly
              </Text>
              <View style={[styles.saveBadge, { backgroundColor: theme.warning }]}>
                <Text style={styles.saveBadgeText}>SAVE 15%</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plan Cards */}
        {PLANS.map((plan) => {
          const isSelected = activePlan === plan.id;
          const displayPrice = billing === 'monthly' ? plan.monthlyPrice : plan.quarterlyPrice;
          const perLabel = billing === 'monthly' ? '/mo' : '/quarter';

          return (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                { backgroundColor: theme.bgCard, borderColor: theme.border },
                plan.popular && { borderColor: theme.green, borderWidth: 2 },
              ]}
            >
              {plan.popular && (
                <View style={[styles.mostPopularBadge, { backgroundColor: theme.green }]}>
                  <Text style={[styles.mostPopularText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
                    ⭐ MOST POPULAR
                  </Text>
                </View>
              )}

              <View style={styles.planCardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planTier, { color: plan.color }]}>{plan.tier}</Text>
                  <Text style={[styles.planName, { color: theme.textPrimary }]}>{plan.name}</Text>
                  <Text style={[styles.planDesc, { color: theme.textMuted }]}>{plan.desc}</Text>
                </View>
                <View style={styles.priceSection}>
                  <Text style={[styles.planPrice, { color: plan.popular ? theme.green : theme.textPrimary }]}>
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </Text>
                  <Text style={[styles.planPer, { color: theme.textMuted }]}>{perLabel}</Text>
                  {plan.badge && (
                    <View style={[styles.valueBadge, { backgroundColor: theme.greenMuted }]}>
                      <Text style={[styles.valueBadgeText, { color: theme.green }]}>{plan.badge}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Meal Image for Popular */}
              {plan.popular && (
                <View style={[styles.planImageBox, { backgroundColor: theme.bgPrimary }]}>
                  <Text style={styles.planImageEmoji}>🥗🍗</Text>
                  <Text style={[styles.planImageLabel, { color: theme.textMuted }]}>Chef Crafted & Macro Balanced</Text>
                </View>
              )}

              {/* Features */}
              {plan.features.map((feature, fIdx) => (
                <View key={fIdx} style={styles.featureRow}>
                  <View style={[styles.featureCheck, { backgroundColor: theme.greenMuted }]}>
                    <Text style={[styles.featureCheckText, { color: theme.green }]}>✓</Text>
                  </View>
                  <Text style={[styles.featureText, { color: theme.textMuted }]}>{feature}</Text>
                </View>
              ))}

              {plan.extra && (
                <View style={[styles.extraRow, { borderTopColor: theme.border }]}>
                  <Text style={styles.extraIcon}>🔒</Text>
                  <Text style={[styles.extraText, { color: theme.textMuted }]}>{plan.extra}</Text>
                  {plan.popular && <Text style={styles.extraCheck}>✅</Text>}
                </View>
              )}

              {/* Action button */}
              <TouchableOpacity
                style={[
                  styles.selectPlanBtn,
                  { backgroundColor: isSelected ? theme.greenDark : (plan.popular ? theme.green : theme.border) },
                ]}
                onPress={() => handleSubscribe(plan.id, plan.name, displayPrice)}
                activeOpacity={0.75}
              >
                <Text style={[styles.selectPlanText, { color: isSelected || plan.popular ? (theme.isDark ? '#090D16' : '#FFFFFF') : theme.textPrimary }]}>
                  {isSelected ? '✓ Current Active Plan' : `Select ${plan.name}`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Review */}
        <View style={[styles.reviewCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
          <Text style={[styles.reviewText, { color: theme.textMuted }]}>
            "Lost 4kg fat while hitting PRs. Meals arrive warm, macros are on point every single day."
          </Text>
          <Text style={[styles.reviewAuthor, { color: theme.textPrimary }]}>— Verified Foodie Athlete</Text>
        </View>

        {/* Trust Info */}
        <View style={styles.trustRow}>
          <Text style={styles.trustIcon}>✅</Text>
          <Text style={[styles.trustText, { color: theme.textMuted }]}>Cancel or switch partner gym anytime at renewal</Text>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={[styles.paymentLabel, { color: theme.textMuted }]}>GUARANTEED SAFE & INSTANT CHECKOUT</Text>
          <View style={styles.paymentMethods}>
            {['UPI / QR', 'GPay', 'Razorpay', 'Cards'].map((method) => (
              <View key={method} style={[styles.paymentMethod, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
                <Text style={[styles.paymentMethodText, { color: theme.textPrimary }]}>{method}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  backRow: { paddingHorizontal: 16, paddingTop: 4 },
  backText: { fontSize: 14, fontWeight: '600' },

  topSection: { padding: 16, alignItems: 'center' },
  unifyBadge: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12,
  },
  unifyText: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  mainTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  mainSubtitle: { fontSize: 13, textAlign: 'center', marginBottom: 18 },

  toggle: {
    flexDirection: 'row',
    borderRadius: 12, padding: 4, borderWidth: 1,
  },
  toggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 8,
    paddingHorizontal: 20, paddingVertical: 8,
  },
  toggleBtnText: { fontWeight: 'bold', fontSize: 13 },
  saveBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  saveBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold' },

  planCard: {
    marginHorizontal: 16, borderRadius: 16,
    padding: 16, marginBottom: 14, borderWidth: 1,
  },
  mostPopularBadge: {
    alignSelf: 'center',
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginBottom: 12,
  },
  mostPopularText: { fontSize: 11, fontWeight: 'bold' },

  planCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  planTier: { fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 2 },
  planName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  planDesc: { fontSize: 12 },
  priceSection: { alignItems: 'flex-end' },
  planPrice: { fontSize: 20, fontWeight: 'bold' },
  planPer: { fontSize: 12 },
  valueBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 4 },
  valueBadgeText: { fontSize: 9, fontWeight: 'bold' },

  planImageBox: {
    height: 90, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  planImageEmoji: { fontSize: 36 },
  planImageLabel: { fontSize: 11, marginTop: 4 },

  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  featureCheck: {
    width: 20, height: 20, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  featureCheckText: { fontSize: 11, fontWeight: 'bold' },
  featureText: { fontSize: 13, flex: 1 },

  extraRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 8, paddingTop: 10, borderTopWidth: 1,
  },
  extraIcon: { fontSize: 14 },
  extraText: { flex: 1, fontSize: 12, fontStyle: 'italic' },
  extraCheck: { fontSize: 16 },

  selectPlanBtn: {
    borderRadius: 12, paddingVertical: 12,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 14,
  },
  selectPlanText: { fontSize: 14, fontWeight: 'bold' },

  reviewCard: {
    marginHorizontal: 16, borderRadius: 14,
    padding: 16, marginBottom: 12, borderWidth: 1,
  },
  reviewStars: { fontSize: 14, marginBottom: 8 },
  reviewText: { fontSize: 13, lineHeight: 20, marginBottom: 6, fontStyle: 'italic' },
  reviewAuthor: { fontSize: 12, fontWeight: '600' },

  trustRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 16,
  },
  trustIcon: { fontSize: 16 },
  trustText: { fontSize: 12 },

  paymentSection: { alignItems: 'center', marginBottom: 16 },
  paymentLabel: { fontSize: 10, letterSpacing: 1, marginBottom: 10 },
  paymentMethods: { flexDirection: 'row', gap: 8 },
  paymentMethod: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1,
  },
  paymentMethodText: { fontSize: 12 },
});
