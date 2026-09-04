import { useGymFoodieStore } from '@/store/useGymFoodieStore';
import { DarkTheme, LightTheme, type AppTheme } from '@/constants/colors';

/**
 * useTheme — returns the active theme color palette
 * based on the user's preference stored in Zustand.
 *
 * Usage:
 *   const theme = useTheme();
 *   <View style={{ backgroundColor: theme.bgPrimary }} />
 */
export function useTheme(): AppTheme {
  const isDark = useGymFoodieStore((s) => s.isDarkMode);
  return isDark ? DarkTheme : LightTheme;
}
