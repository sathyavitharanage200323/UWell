import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { welfareOfficer } from '../../data/welfareMockData';

const ProfileScreen = ({ navigation }) => {
  const menuGroups = [
    {
      id: 'info',
      items: [
        { id: 'personal', label: 'Personal Information', icon: 'person-outline' },
        { id: 'schedule', label: 'Work Schedule', icon: 'calendar-outline' }
      ]
    },
    {
      id: 'prefs',
      items: [
        { id: 'notifications', label: 'Notification Preferences', icon: 'notifications-outline' },
        {
          id: 'privacy',
          label: 'Privacy & Security',
          icon: 'shield-checkmark-outline',
          screen: 'PrivacySecurity'
        }
      ]
    },
    {
      id: 'about',
      items: [
        { id: 'help', label: 'Help & Support', icon: 'help-circle-outline' },
        { id: 'about', label: 'About', icon: 'information-circle-outline' }
      ]
    }
  ];

  const handlePress = (item) => {
    if (item.screen) navigation.navigate(item.screen);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{welfareOfficer.avatarInitials}</Text>
          </View>
          <Text style={styles.name}>{welfareOfficer.name}</Text>
          <Text style={styles.role}>{welfareOfficer.role}</Text>
          <Text style={styles.dept}>{welfareOfficer.department}</Text>
        </View>

        {menuGroups.map((group) => (
          <View key={group.id} style={styles.group}>
            {group.items.map((item, index) => {
              const isLast = index === group.items.length - 1;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isLast && styles.menuItemLast]}
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon} size={18} color={colors.text} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  avatarSection: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  avatarText: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary
  },
  name: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  role: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4
  },
  dept: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2
  },

  group: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden'
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  menuLabel: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium
  },

  logoutBtn: {
    borderWidth: 1.5,
    borderColor: '#E8836B',
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.backgroundLight
  },
  logoutText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#E8836B'
  }
});

export default ProfileScreen;