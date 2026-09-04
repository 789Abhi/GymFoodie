import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@/hooks/useTheme';
import Header from '@/components/Header';
import StatBadge from '@/components/StatBadge';

const WEEK_DAYS = [
  { d: 'M', done: true }, { d: 'T', done: true }, { d: 'W', done: true },
  { d: 'T', done: true }, { d: 'F', done: true },
  { d: 'S', rest: true }, { d: 'S', active: true },
];

export default function GymPassScreen() {
  const theme = useTheme();
  const [checkedIn, setCheckedIn] = useState(false);
  const [qrKey, setQrKey] = useState(Date.now().toString());

  // Auto-rotate QR code every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQrKey(Date.now().toString());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: theme.bgPrimary }]}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>

        {/* Partner Facility Card */}
        <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.facilityLabel, { color: theme.textMuted }]}>PARTNER FACILITY</Text>
          <View style={styles.facilityRow}>
            <View style={[styles.facilityIcon, { backgroundColor: theme.bgPrimary }]}>
              <Text style={styles.facilityEmoji}>🏋️</Text>
            </View>
            <View style={styles.facilityInfo}>
              <Text style={[styles.facilityName, { color: theme.textPrimary }]}>Iron House Gym</Text>
              <Text style={[styles.facilityLocation, { color: theme.textMuted }]}>📍 Mangaluru, India</Text>
            </View>
            <View style={styles.facilityRight}>
              <StatBadge label="● Active" color={theme.green} bgColor={theme.greenMuted} />
              <Text style={[styles.validUntil, { color: theme.textMuted }]}>Valid until Sep 30</Text>
            </View>
          </View>
        </View>

        {/* VIP Pass Card */}
        <View style={[styles.card, styles.passCard, { backgroundColor: theme.bgCard, borderColor: theme.green }]}>
          <View style={styles.passHeader}>
            <View>
              <Text style={[styles.passTitle, { color: theme.textPrimary }]}>⚡ GYMFOODIE ALL-ACCESS PASS</Text>
            </View>
            <View style={[styles.vipBadge, { backgroundColor: theme.purple }]}>
              <Text style={styles.vipText}>VIP{'\n'}TIER</Text>
            </View>
          </View>

          <View style={styles.passDetails}>
            <View>
              <Text style={[styles.passFieldLabel, { color: theme.textMuted }]}>MEMBER NAME</Text>
              <Text style={[styles.passFieldValue, { color: theme.textPrimary }]}>Abhishek TK</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.passFieldLabel, { color: theme.textMuted }]}>PASS ID</Text>
              <Text style={[styles.passFieldValue, { color: theme.green }]}>#GF-8921</Text>
            </View>
          </View>

          <View style={styles.nfcRow}>
            <Text style={styles.nfcIcon}>📡</Text>
            <Text style={[styles.nfcText, { color: theme.textMuted }]}>Ready for Turnstile NFC Wave or QR Scan</Text>
          </View>
        </View>

        {/* Dynamic QR Code Card */}
        <View style={[styles.qrCard, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <View style={styles.qrBox}>
            <QRCode
              value={`GYMFOODIE-PASS-GF-8921-${qrKey}`}
              size={170}
              color="#090D16"
              backgroundColor="#FFFFFF"
            />
          </View>
          <View style={styles.qrFooter}>
            <View style={[styles.liveDot, { backgroundColor: theme.green }]} />
            <Text style={[styles.liveText, { color: theme.textMuted }]}>
              Live Turnstile Pass • Auto-rotates 30s
            </Text>
          </View>
        </View>

        {/* Check-In Button */}
        <TouchableOpacity
          style={[styles.checkInBtn, { backgroundColor: checkedIn ? theme.greenDark : theme.green }]}
          onPress={() => {
            setCheckedIn(true);
            Alert.alert('Check-In Successful! 🏋️‍♂️', 'Welcome to Iron House Gym! Turnstile unlocked.');
          }}
          activeOpacity={0.75}
        >
          <Text style={styles.checkInBtnIcon}>{checkedIn ? '✓' : '⚡'}</Text>
          <Text style={[styles.checkInBtnText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
            {checkedIn ? 'Checked In for Today' : 'Instant Gym Check-In'}
          </Text>
        </TouchableOpacity>

        {/* Gym Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={[styles.activityTitle, { color: theme.textPrimary }]}>Gym Activity & Insights</Text>
            <Text style={[styles.activityMonth, { color: theme.green }]}>SEPTEMBER</Text>
          </View>

          {/* Check-ins */}
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.checkinsRow}>
              <Text style={styles.checkinsIcon}>📅</Text>
              <Text style={[styles.checkinsLabel, { color: theme.textPrimary }]}>Check-ins this month</Text>
              <Text style={[styles.checkinsValue, { color: theme.textPrimary }]}>
                {checkedIn ? '19' : '18'}<Text style={[styles.checkinsTotal, { color: theme.textMuted }]}>/24 Days</Text>
              </Text>
            </View>

            {/* Week Row */}
            <View style={styles.weekRow}>
              {WEEK_DAYS.map((item, idx) => (
                <View key={idx} style={styles.weekDayCol}>
                  <Text style={[styles.weekDayLabel, { color: theme.textMuted }]}>{item.d}</Text>
                  {item.done && (
                    <View style={[styles.weekDone, { backgroundColor: theme.green }]}>
                      <Text style={[styles.weekDoneText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>✓</Text>
                    </View>
                  )}
                  {item.rest && <Text style={[styles.weekRest, { color: theme.textMuted }]}>REST</Text>}
                  {item.active && (
                    <View style={[styles.weekActive, { backgroundColor: theme.greenMuted, borderColor: theme.green }]}>
                      <Text style={[styles.weekDoneText, { color: theme.green }]}>✓</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Occupancy Card */}
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.occupancyRow}>
              <Text style={styles.occupancyIcon}>👥</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.occupancyTitle, { color: theme.textPrimary }]}>Live Floor Occupancy</Text>
                <View style={[styles.occupancyTrack, { backgroundColor: theme.border }]}>
                  <View style={[styles.occupancyFill, { backgroundColor: theme.green }]} />
                </View>
              </View>
              <View style={[styles.occupancyBadge, { backgroundColor: theme.greenMuted }]}>
                <Text style={[styles.occupancyBadgeText, { color: theme.green }]}>35% Full • Low Crowd</Text>
              </View>
            </View>
            <View style={styles.peakRow}>
              <Text style={[styles.peakText, { color: theme.textMuted }]}>Peak Rush: 6:00 PM – 8:30 PM</Text>
              <Text style={[styles.bestTime, { color: theme.green }]}>Best time to lift right now</Text>
            </View>
          </View>

          {/* Coach Card */}
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.coachRow}>
              <View style={[styles.coachAvatar, { backgroundColor: theme.warning }]}>
                <Text style={styles.coachAvatarText}>R</Text>
              </View>
              <View style={styles.coachInfo}>
                <Text style={[styles.coachLabel, { color: theme.textMuted }]}>Assigned Coach</Text>
                <Text style={[styles.coachName, { color: theme.textPrimary }]}>Coach Rahul</Text>
                <Text style={[styles.coachSynced, { color: theme.textMuted }]}>✅ Macros & Routine Synced</Text>
              </View>
              <TouchableOpacity
                style={[styles.pingBtn, { backgroundColor: theme.border }]}
                onPress={() => Alert.alert('Ping Coach', 'Notification sent to Coach Rahul. He will reply shortly!')}
                activeOpacity={0.75}
              >
                <Text style={styles.pingIcon}>💬</Text>
                <Text style={[styles.pingText, { color: theme.textPrimary }]}>Ping</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Facility Details Button */}
        <TouchableOpacity
          style={[styles.facilityBtn, { backgroundColor: theme.green }]}
          onPress={() => Alert.alert('Directions', 'Opening Google Maps navigation to Iron House Gym, Kankanady, Mangaluru.')}
          activeOpacity={0.75}
        >
          <Text style={styles.facilityBtnIcon}>📍</Text>
          <Text style={[styles.facilityBtnText, { color: theme.isDark ? '#090D16' : '#FFFFFF' }]}>
            Facility Details & Directions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.changeGymRow}
          onPress={() => Alert.alert('Change Gym', 'Gym switch request submitted for next billing cycle (Oct 1).')}
          activeOpacity={0.75}
        >
          <Text style={[styles.changeGymText, { color: theme.textMuted }]}>⇄  Change Partner Gym for Next Month</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: {
    marginHorizontal: 16, borderRadius: 16,
    padding: 16, marginBottom: 12, borderWidth: 1,
  },

  facilityLabel: { fontSize: 10, letterSpacing: 1.5, marginBottom: 10, fontWeight: '600' },
  facilityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  facilityIcon: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },
  facilityEmoji: { fontSize: 22 },
  facilityInfo: { flex: 1 },
  facilityName: { fontSize: 16, fontWeight: 'bold' },
  facilityLocation: { fontSize: 12, marginTop: 2 },
  facilityRight: { alignItems: 'flex-end', gap: 4 },
  validUntil: { fontSize: 11 },

  passCard: { borderWidth: 1.5 },
  passHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  passTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },
  vipBadge: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 8, alignItems: 'center',
  },
  vipText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  passDetails: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  passFieldLabel: { fontSize: 10, letterSpacing: 1, marginBottom: 4 },
  passFieldValue: { fontSize: 18, fontWeight: 'bold' },
  nfcRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nfcIcon: { fontSize: 16 },
  nfcText: { fontSize: 12 },

  qrCard: {
    marginHorizontal: 16, borderRadius: 16,
    padding: 20, marginBottom: 12, borderWidth: 1,
    alignItems: 'center',
  },
  qrBox: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  qrFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { fontSize: 12, fontWeight: '500' },

  checkInBtn: {
    marginHorizontal: 16, borderRadius: 14, paddingVertical: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 8, marginBottom: 12,
  },
  checkInBtnIcon: { fontSize: 16 },
  checkInBtnText: { fontSize: 15, fontWeight: 'bold' },

  activitySection: { marginTop: 4 },
  activityHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 10,
  },
  activityTitle: { fontSize: 17, fontWeight: 'bold' },
  activityMonth: { fontSize: 12, fontWeight: 'bold' },

  checkinsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  checkinsIcon: { fontSize: 18 },
  checkinsLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
  checkinsValue: { fontSize: 20, fontWeight: 'bold' },
  checkinsTotal: { fontSize: 14, fontWeight: 'normal' },

  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekDayCol: { alignItems: 'center', gap: 6 },
  weekDayLabel: { fontSize: 12 },
  weekDone: {
    width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  weekActive: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  weekDoneText: { fontWeight: 'bold', fontSize: 14 },
  weekRest: { fontSize: 9, fontWeight: 'bold' },

  occupancyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  occupancyIcon: { fontSize: 24 },
  occupancyTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  occupancyTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  occupancyFill: { height: '100%', width: '35%', borderRadius: 3 },
  occupancyBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  occupancyBadgeText: { fontSize: 10, fontWeight: 'bold' },
  peakRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  peakText: { fontSize: 12 },
  bestTime: { fontSize: 12, fontWeight: '600' },

  coachRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coachAvatar: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center',
  },
  coachAvatarText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 20 },
  coachInfo: { flex: 1 },
  coachLabel: { fontSize: 10, letterSpacing: 1, marginBottom: 2 },
  coachName: { fontSize: 15, fontWeight: 'bold' },
  coachSynced: { fontSize: 11, marginTop: 2 },
  pingBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  pingIcon: { fontSize: 16 },
  pingText: { fontSize: 13, fontWeight: '600' },

  facilityBtn: {
    marginHorizontal: 16, borderRadius: 14,
    paddingVertical: 15, flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 8, marginBottom: 12,
  },
  facilityBtnIcon: { fontSize: 18 },
  facilityBtnText: { fontSize: 15, fontWeight: 'bold' },

  changeGymRow: { alignItems: 'center', paddingBottom: 8 },
  changeGymText: { fontSize: 13 },
});
