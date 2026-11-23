import { useState } from 'react';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';

export default function RootLayout() {
  const isDarkMode = useGymFoodieStore((state) => state.isDarkMode);
  const { width, height } = useWindowDimensions();
  const [isFrameEnabled, setIsFrameEnabled] = useState(true);

  // Detect desktop web viewport (> 600px width)
  const isWebDesktop = Platform.OS === 'web' && width > 600;

  // Modern simulated insets for the desktop mobile frame
  const webInitialMetrics = isWebDesktop && isFrameEnabled ? {
    frame: { x: 0, y: 0, width: Math.min(width, 430), height: Math.min(height, 900) },
    insets: { top: 40, left: 0, right: 0, bottom: 20 },
  } : undefined;

  const content = (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDarkMode ? '#090D16' : '#F1F5F9' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="plans" options={{ headerShown: false }} />
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="gym-admin" options={{ headerShown: false }} />
      <Stack.Screen name="restaurant-admin" options={{ headerShown: false }} />
      <Stack.Screen name="super-admin" options={{ headerShown: false }} />
    </Stack>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={webInitialMetrics}>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={isDarkMode ? '#090D16' : '#F1F5F9'} />

        {isWebDesktop ? (
          <View style={[styles.webCanvas, { backgroundColor: isDarkMode ? '#040711' : '#E2E8F0' }]}>
            {/* Desktop Preview Header Toolbar */}
            <View
              style={[
                styles.webToolbar,
                {
                  backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                  borderColor: isDarkMode ? '#1E293B' : '#CBD5E1',
                },
              ]}
            >
              <View style={styles.toolbarBrandGroup}>
                <View style={styles.brandBadge}>
                  <Text style={styles.brandIcon}>🏋️</Text>
                </View>
                <View>
                  <Text style={[styles.brandText, { color: isDarkMode ? '#F8FAFC' : '#0F172A' }]}>
                    Gym<Text style={{ color: '#10B981' }}>Foodie</Text>
                  </Text>
                  <Text style={[styles.brandSub, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>
                    Desktop Mobile Preview Mode
                  </Text>
                </View>
              </View>

              {/* Dev Tip Banner */}
              <View style={[styles.tipPill, { backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(16, 185, 129, 0.15)' }]}>
                <Text style={[styles.tipText, { color: isDarkMode ? '#34D399' : '#059669' }]}>
                  💡 Chrome DevTip: Press <Text style={styles.kbd}>F12</Text> then <Text style={styles.kbd}>Ctrl + Shift + M</Text> for touch simulation
                </Text>
              </View>

              {/* View Switcher Controls */}
              <View style={[styles.toggleGroup, { backgroundColor: isDarkMode ? '#090D16' : '#F1F5F9', borderColor: isDarkMode ? '#1E293B' : '#E2E8F0' }]}>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    isFrameEnabled && { backgroundColor: '#10B981' },
                  ]}
                  onPress={() => setIsFrameEnabled(true)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      { color: isFrameEnabled ? '#FFFFFF' : (isDarkMode ? '#94A3B8' : '#64748B') },
                    ]}
                  >
                    📱 Mobile (430px)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    !isFrameEnabled && { backgroundColor: '#10B981' },
                  ]}
                  onPress={() => setIsFrameEnabled(false)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      { color: !isFrameEnabled ? '#FFFFFF' : (isDarkMode ? '#94A3B8' : '#64748B') },
                    ]}
                  >
                    🖥️ Full Width
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Mobile Device Mockup Frame */}
            {isFrameEnabled ? (
              <View
                style={[
                  styles.phoneBezel,
                  {
                    maxHeight: Math.min(Math.max(height - 80, 520), 920),
                    borderColor: isDarkMode ? '#1E293B' : '#94A3B8',
                    backgroundColor: isDarkMode ? '#090D16' : '#F8FAFC',
                    shadowColor: '#000',
                  },
                ]}
              >
                {/* Simulated iPhone Status Bar */}
                <View style={[styles.phoneStatusBar, { backgroundColor: isDarkMode ? '#090D16' : '#F8FAFC' }]}>
                  <Text style={[styles.statusBarTime, { color: isDarkMode ? '#F8FAFC' : '#0F172A' }]}>9:41</Text>
                  
                  {/* Dynamic Island Pill */}
                  <View style={styles.dynamicIsland}>
                    <View style={styles.cameraLens} />
                    <View style={styles.sensorDot} />
                  </View>

                  <View style={styles.statusBarIcons}>
                    <Text style={[styles.statusIconText, { color: isDarkMode ? '#F8FAFC' : '#0F172A' }]}>5G  100%</Text>
                  </View>
                </View>

                {/* Main App Content Viewport */}
                <View style={{ flex: 1, width: '100%' }}>
                  {content}
                </View>

                {/* Simulated iOS Home Indicator Bar */}
                <View style={styles.homeIndicatorWrapper} pointerEvents="none">
                  <View
                    style={[
                      styles.homeIndicator,
                      { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.35)' },
                    ]}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.fullWidthContainer}>
                {content}
              </View>
            )}
          </View>
        ) : (
          content
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  webCanvas: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 16,
  },
  webToolbar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginBottom: 12,
    zIndex: 10,
  },
  toolbarBrandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandIcon: {
    fontSize: 16,
  },
  brandText: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '500',
  },
  tipPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  kbd: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  toggleGroup: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    gap: 2,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  phoneBezel: {
    width: '100%',
    maxWidth: 430,
    flex: 1,
    borderRadius: 44,
    borderWidth: 8,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 36,
    elevation: 24,
    position: 'relative',
  },
  phoneStatusBar: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  statusBarTime: {
    fontSize: 13,
    fontWeight: '700',
    width: 50,
  },
  dynamicIsland: {
    width: 96,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    gap: 6,
    borderWidth: 0.5,
    borderColor: '#334155',
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0F172A',
  },
  sensorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0284C7',
    opacity: 0.7,
  },
  statusBarIcons: {
    width: 55,
    alignItems: 'flex-end',
  },
  statusIconText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  homeIndicatorWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  homeIndicator: {
    width: 130,
    height: 4,
    borderRadius: 2,
  },
  fullWidthContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
  },
});
