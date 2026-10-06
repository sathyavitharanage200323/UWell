import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { welfareNotifications } from '../../data/welfareMockData';

const typeStyles = {
  request: { icon: 'alert-circle-outline', bg: '#FDF1EC', tint: '#E8836B' },
  completed: { icon: 'checkmark-circle-outline', bg: '#DDF3E4', tint: '#397052' },
  schedule: { icon: 'time-outline', bg: '#FFF0D6', tint: '#9A6818' },
  system: { icon: 'chatbubble-ellipses-outline', bg: '#E5EEFA', tint: '#4A90E2' },
  reminder: { icon: 'person-circle-outline', bg: '#F3E8FA', tint: '#7E57C2' }
};

const NotificationsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markBtn}>
          <Text style={styles.markBtnText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {welfareNotifications.map((n) => {
          const t = typeStyles[n.type] || typeStyles.system;
          return (
            <TouchableOpacity key={n.id} style={styles.card} activeOpacity={0.85}>
              <View style={[styles.iconWrap, { backgroundColor: t.bg }]}>
                <Ionicons name={t.icon} size={20} color={t.tint} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{n.title}</Text>
                  {n.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.message}>{n.message}</Text>
                <Text style={styles.time}>{n.timestamp}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: {
    flex: 1,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  markBtn: { padding: spacing.xs },
  markBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary
  },
  scrollContent: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.sm
  },
  message: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18
  },
  time: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.sm
  }
});

export default NotificationsScreen;