import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useGymFoodieStore } from '@/store/useGymFoodieStore';
import { useTheme } from '@/hooks/useTheme';
import type { UserRole } from '@/types';

interface RoleSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function RoleSwitcherModal({ visible, onClose }: RoleSwitcherModalProps) {
  const theme = useTheme();
  const { currentRole, setRole } = useGymFoodieStore();

  const handleSelectRole = (role: UserRole) => {
    setRole(role);
    onClose();
    if (role === 'user') {
      router.replace('/(tabs)/home');
    } else if (role === 'gym_admin') {
      router.replace('/gym-admin');
    } else if (role === 'restaurant_admin') {
      router.replace('/restaurant-admin');
    } else if (role === 'super_admin') {
      router.replace('/super-admin');
    }
  };

  const ROLES: { id: UserRole; title: string; subtitle: string; emoji: string }[] = [
    {
      id: 'user',
      title: 'User / Member Portal',
      subtitle: 'Abhishek TK • Transformation VIP',
      emoji: '👤',
    },
    {
      id: 'gym_admin',
      title: 'Gym Partner Admin',
      subtitle: 'Iron House Gym • Mangaluru Turnstiles',
      emoji: '🏋️‍♂️',
    },
    {
      id: 'restaurant_admin',
      title: 'Restaurant Partner Admin',
      subtitle: 'Diet & Protein Mangaluru • Dispatch Queue',
      emoji: '🍳',
    },
    {
      id: 'super_admin',
      title: 'GymFoodie Super Admin',
      subtitle: 'HQ Command • Central Treasury & Support',
      emoji: '👑',
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={[styles.modalContent, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Switch Portal Perspective</Text>
              <Text style={[styles.subtitle, { color: theme.textMuted }]}>
                Experience GymFoodie as each stakeholder
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={[styles.closeBtnText, { color: theme.textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.roleList}>
            {ROLES.map((r) => {
              const isSelected = currentRole === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.roleItem,
                    { backgroundColor: theme.bgPrimary, borderColor: theme.border },
                    isSelected && { borderColor: theme.green, borderWidth: 2 },
                  ]}
                  onPress={() => handleSelectRole(r.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.roleEmoji}>{r.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.roleTitle, { color: theme.textPrimary }]}>{r.title}</Text>
                    <Text style={[styles.roleSubtitle, { color: theme.textMuted }]}>{r.subtitle}</Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.activeBadge, { backgroundColor: theme.greenMuted }]}>
                      <Text style={[styles.activeBadgeText, { color: theme.green }]}>Active</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.goToLoginBtn, { borderColor: theme.border }]}
            onPress={() => {
              onClose();
              router.push('/login');
            }}
            activeOpacity={0.75}
          >
            <Text style={[styles.goToLoginText, { color: theme.textMuted }]}>
              🔐 Open Full Multi-Role Login Page
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleList: {
    gap: 10,
    marginBottom: 16,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  roleEmoji: {
    fontSize: 26,
  },
  roleTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  roleSubtitle: {
    fontSize: 12,
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  goToLoginBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  goToLoginText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
