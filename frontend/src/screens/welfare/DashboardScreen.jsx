import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useWelfare } from '../../context/WelfareContext';
import { dashboardStats, todayServiceActivity } from '../../data/welfareMockData';

const tintMap = {
  coral: { bg: '#FDF1EC', icon: '#E8836B' },
  green: { bg: '#DDF3E4', icon: '#397052' },
  blue: { bg: '#E5EEFA', icon: '#4A90E2' },
  orange: { bg: '#FFF0D6', icon: '#9A6818' },
};

const statusStyles = {
  'In Progress': { bg: '#FFF0D6', text: '#9A6818' },
  Scheduled: { bg: '#E5EEFA', text: '#4A90E2' },
  Completed: { bg: '#DDF3E4', text: '#397052' },
  Cancelled: { bg: '#FBE1DE', text: '#C0392B' },
};

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { profile } = useWelfare();
  const [refreshing, setRefreshing] = useState(false);

  // Combine real user info with profile context fallback
  const activeUser = {
    firstName: profile?.firstName || user?.firstName || 'Officer',
    lastName: profile?.lastName || user?.lastName || '',
    fullName: profile?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Welfare Officer'),
    staffId: profile?.staffId || user?.staffId || 'STF-PENDING',
    department: profile?.department || user?.department || 'Student Welfare Services',
    position: profile?.position || user?.position || 'Welfare Officer',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || user?.phone || '',
    officeLocation: profile?.officeLocation || user?.officeLocation || 'Main Welfare Office',
    isApproved: user?.isApproved !== undefined ? user.isApproved : true,
    avatarInitials: profile?.avatarInitials || (user?.firstName ? `${user.firstName[0]}${(user.lastName || 'O')[0]}`.toUpperCase() : 'WO'),
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulates or awaits data reload
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const quickActions = [
    {
      id: 'appointments',
      label: 'Appointments',
      icon: 'calendar-outline',
      screen: 'Appointments',
    },
    {
      id: 'counselors',
      label: 'Counselors',
      icon: 'people-outline',
      screen: 'Services',
    },
    {
      id: 'support',
      label: 'Support Info',
      icon: 'shield-checkmark-outline',
      screen: 'Support',
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: 'person-circle-outline',
      screen: 'Profile',
    },
  ];

  const handleQuickAction = (action) => {
    if (action.screen) {
      navigation.navigate(action.screen);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* ---------- Header ---------- */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Good Morning, {activeUser.firstName} 👋</Text>
            <Text style={styles.subGreeting}>Welfare Officer Dashboard</Text>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => navigation.navigate('Notifications')}
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        {/* ---------- Officer Registered Identity Card (Actual Data) ---------- */}
        <View style={styles.identityCard}>
          <View style={styles.identityTopRow}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{activeUser.avatarInitials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={styles.nameRow}>
                <Text style={styles.officerName} numberOfLines={1}>{activeUser.fullName}</Text>
              </View>
              <Text style={styles.officerPosition}>{activeUser.position}</Text>
              <Text style={styles.officerDepartment}>{activeUser.department}</Text>
            </View>
          </View>

          {/* Unique Key: Staff ID Highlight Pill */}
          <View style={styles.staffIdBadgeRow}>
            <View style={styles.staffIdPill}>
              <MaterialCommunityIcons name="badge-account-horizontal-outline" size={16} color="#1E5B3A" />
              <Text style={styles.staffIdLabel}>Staff ID (Unique Key):</Text>
              <Text style={styles.staffIdValue}>{activeUser.staffId}</Text>
            </View>

            <View style={styles.statusVerifiedPill}>
              <Ionicons name="checkmark-circle" size={14} color="#15803D" />
              <Text style={styles.statusVerifiedText}>Active & Approved</Text>
            </View>
          </View>

          {/* Officer Contact & Registration Details */}
          <View style={styles.officerDetailsBox}>
            {activeUser.email ? (
              <View style={styles.detailRow}>
                <Ionicons name="mail-outline" size={14} color={colors.textSecondary} style={styles.detailIcon} />
                <Text style={styles.detailLabelText}>Email:</Text>
                <Text style={styles.detailValueText} numberOfLines={1}>{activeUser.email}</Text>
              </View>
            ) : null}

            {activeUser.phone ? (
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={14} color={colors.textSecondary} style={styles.detailIcon} />
                <Text style={styles.detailLabelText}>Phone:</Text>
                <Text style={styles.detailValueText}>{activeUser.phone}</Text>
              </View>
            ) : null}

            <View style={[styles.detailRow, { marginBottom: 0 }]}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailLabelText}>Office:</Text>
              <Text style={styles.detailValueText}>{activeUser.officeLocation}</Text>
            </View>
          </View>
        </View>

        {/* ---------- Stats Grid ---------- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview & Metrics</Text>
        </View>

        <View style={styles.statsGrid}>
          {dashboardStats.map((stat) => {
            const tint = tintMap[stat.tint] || tintMap.green;
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
              <View key={item.id} style={[styles.activityRow, isLast && styles.activityRowLast]}>
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
    backgroundColor: colors.creamBackground,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  greeting: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subGreeting: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
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
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },

  // ---------- Officer Identity Card ----------
  identityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: spacing.md + 2,
    marginBottom: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#CDE5D7',
    shadowColor: '#397052',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  identityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#397052',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  officerName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  officerPosition: {
    fontSize: 13,
    fontWeight: '600',
    color: '#397052',
    marginTop: 1,
  },
  officerDepartment: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },

  // Unique Key (Staff ID) Badge
  staffIdBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEF3F0',
  },
  staffIdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B7E4C7',
    gap: 5,
  },
  staffIdLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  staffIdValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B4332',
    letterSpacing: 0.8,
  },
  statusVerifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 4,
  },
  statusVerifiedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
  },

  // Officer Details Box
  officerDetailsBox: {
    backgroundColor: '#F9FBFA',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EAF2ED',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    width: 50,
  },
  detailValueText: {
    fontSize: 12,
    color: colors.text,
    flex: 1,
  },

  // ---------- Section ----------
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },

  // ---------- Stats ----------
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statNumber: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ---------- Activity ----------
  activityCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  activityRowLast: {
    borderBottomWidth: 0,
  },
  activityName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  activityService: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },

  // ---------- Quick Access ----------
  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '23%',
    alignItems: 'center',
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
    marginBottom: spacing.sm,
  },
  quickActionLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    textAlign: 'center',
  },
});

export default DashboardScreen;