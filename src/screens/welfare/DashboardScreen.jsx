import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { welfareOfficer, dashboardStats, todayServiceActivity } from '../../data/welfareMockData';

const tintMap = {
  coral: { bg: '#FDF1EC', icon: '#E8836B' },
  green: { bg: '#DDF3E4', icon: '#397052' },
  blue: { bg: '#E5EEFA', icon: '#4A90E2' },
  orange: { bg: '#FFF0D6', icon: '#9A6818' }
};

const statusStyles = {
  'In Progress': { bg: '#FFF0D6', text: '#9A6818' },
  Scheduled: { bg: '#E5EEFA', text: '#4A90E2' },
  Completed: { bg: '#DDF3E4', text: '#397052' },
  Cancelled: { bg: '#FBE1DE', text: '#C0392B' }
};

const DashboardScreen = ({ navigation }) => {
  // Quick Access items — all 4 now navigate to their respective tabs
  const quickActions = [
    {
      id: 'appointments',
      label: 'Appointments',
      icon: 'calendar-outline',
      screen: 'Appointments'
    },
    {
      id: 'counselors',
      label: 'Counselors',
      icon: 'people-outline',
      screen: 'Services'
    },
    {
      id: 'support',
      label: 'Support Info',
      icon: 'shield-checkmark-outline',
      screen: 'Support'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: 'bar-chart-outline'
      // No screen yet — will just be a visual item
    }
  ];

  const handleQuickAction = (action) => {
    if (action.screen) {
      // Navigate to the tab (nested stack root)
      navigation.navigate(action.screen);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---------- Header ---------- */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              Good Morning, {welfareOfficer.firstName}
            </Text>
            <Text style={styles.subGreeting}>Welfare Officer Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* ---------- Stats Grid ---------- */}
        <View style={styles.statsGrid}>
          {dashboardStats.map((stat) => {
            const tint = tintMap[stat.tint];
            return (
              <View key={stat.id} style={styles.statCard}>
                <View style={[styles.statIconWrap, { backgroundColor: tint.bg }]}>
                  <Ionicons name={stat.icon} size={20} color={tint.icon} />
                </View>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* ---------- Today's Service Activity ---------- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Service Activity</Text>
        </View>

        <View style={styles.activityCard}>
          {todayServiceActivity.map((item, index) => {
            const status = statusStyles[item.status] || statusStyles.Scheduled;
            const isLast = index === todayServiceActivity.length - 1;
            return (
              <View
                key={item.id}
                style={[styles.activityRow, isLast && styles.activityRowLast]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityName}>{item.studentName}</Text>
                  <Text style={styles.activityService}>{item.service}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.activityTime}>{item.time}</Text>
                  <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                    <Text style={[styles.statusPillText, { color: status.text }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ---------- Quick Access ---------- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={styles.quickAccessRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickAction}
              activeOpacity={0.7}
              onPress={() => handleQuickAction(action)}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name={action.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },

  // ---------- Header ----------
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl
  },
  greeting: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  subGreeting: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: 2
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary
  },

  // ---------- Stats ----------
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm
  },
  statNumber: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2
  },

  // ---------- Section ----------
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.md
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },

  // ---------- Activity ----------
  activityCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  activityRowLast: {
    borderBottomWidth: 0
  },
  activityName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  activityService: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2
  },
  activityTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10
  },
  statusPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium
  },

  // ---------- Quick Access ----------
  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  quickAction: {
    width: '23%',
    alignItems: 'center'
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm
  },
  quickActionLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    textAlign: 'center'
  }
});

export default DashboardScreen;