import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';

export default function RootLayout() {
  const isDarkMode = useGymFoodieStore((state) => state.isDarkMode);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={isDarkMode ? '#090D16' : '#F1F5F9'} />
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: isDarkMode ? '#090D16' : '#F1F5F9' },
          animation: 'fade',
        }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="plans" options={{ headerShown: false }} />
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="gym-admin" options={{ headerShown: false }} />
          <Stack.Screen name="restaurant-admin" options={{ headerShown: false }} />
          <Stack.Screen name="super-admin" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
