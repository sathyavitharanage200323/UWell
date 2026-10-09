import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useWelfare } from '../../context/WelfareContext';
import { welfareService } from '../../services/welfareService';

// ── Greeting helper ────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// ── Color maps (strictly within UWell palette) ────────────────────────────────
const tintMap = {
  coral:  { bg: colors.softCoral,      icon: colors.primary },
  green:  { bg: colors.statusGreenBg,  icon: colors.statusGreenText },
  yellow: { bg: colors.statusYellowBg, icon: colors.statusYellowText },
  red:    { bg: colors.statusRedBg,    icon: colors.statusRedText },
};

const activityStatusStyles = {
  Scheduled:   { bg: '#E5EEFA', text: '#4A90E2' },
  'In Progress': { bg: colors.statusYellowBg, text: colors.statusYellowText },
  Completed:   { bg: colors.statusGreenBg,  text: colors.statusGreenText },
  Cancelled:   { bg: colors.statusRedBg,    text: colors.statusRedText },
};

// ── Stat definitions (values filled from API) ─────────────────────────────────
const buildStatCards = (stats = {}) => [
  {
    id: 'upcoming',
    label: 'Upcoming Appointments',
    value: stats.upcomingAppointments ?? '—',
    icon: 'calendar-outline',
    tint: 'coral',
  },
  {
    id: 'counselors',
    label: 'Available Counselors',
    value: stats.availableCounselors ?? '—',
    icon: 'people-outline',
    tint: 'green',
  },
  {
    id: 'completed',
    label: 'Completed Sessions',
    value: stats.completedSessions ?? '—',
    icon: 'checkmark-circle-outline',
    tint: 'green',
  },
  {
    id: 'cancelled',
    label: 'Cancelled Sessions',
    value: stats.cancelledAppointments ?? '—',
    icon: 'close-circle-outline',
    tint: 'red',
  },
  {
    id: 'total',
    label: 'Total Appointments',
    value: stats.totalAppointments ?? '—',
    icon: 'stats-chart-outline',
    tint: 'yellow',
  },
  {
    id: 'inSession',
    label: 'Counselors In Session',
    value: stats.inSessionCounselors ?? '—',
    icon: 'headset-outline',
    tint: 'coral',
  },
];

// ── Main Component ─────────────────────────────────────────────────────────────
const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { profile } = useWelfare();

  const [dashStats, setDashStats] = useState(null);
  const [todayActivity, setTodayActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Build display user from profile/auth
  const activeUser = {
    firstName: profile?.firstName || user?.firstName || 'Officer',
    lastName: profile?.lastName || user?.lastName || '',
    fullName:
      profile?.name ||
      (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Welfare Officer'),
    staffId: profile?.staffId || user?.staffId || 'STF-PENDING',
    department: profile?.department || user?.department || 'Student Welfare Services',
    position: profile?.position || user?.position || 'Welfare Officer',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || user?.phone || '',
    officeLocation: profile?.officeLocation || user?.officeLocation || 'Main Welfare Office',
    avatarInitials:
      profile?.avatarInitials ||
      (user?.firstName
        ? `${user.firstName[0]}${(user.lastName || 'O')[0]}`.toUpperCase()
        : 'WO'),
  };

  // ── Fetch dashboard data ─────────────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const res = await welfareService.getDashboardStats();
      if (res?.success) {
        setDashStats(res.stats || {});
        setTodayActivity(res.todayActivity || []);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Unable to load data. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboard();
  }, [fetchDashboard]);

  const statCards = buildStatCards(dashStats || {});

  // ── Quick actions ────────────────────────────────────────────────────────
  const quickActions = [
    { id: 'appointments', label: 'Appointments', icon: 'calendar-outline', screen: 'Appointments' },
    { id: 'counselors',   label: 'Counselors',   icon: 'people-outline',   screen: 'Services' },
    { id: 'support',      label: 'Support Info',  icon: 'shield-checkmark-outline', screen: 'Support' },
    { id: 'profile',      label: 'My Profile',    icon: 'person-circle-outline',    screen: 'Profile' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {getGreeting()}, {activeUser.firstName} 👋
            </Text>
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

        {/* ── Identity Card ──────────────────────────────────────────────── */}
        <View style={styles.identityCard}>
          <View style={styles.identityTopRow}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{activeUser.avatarInitials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.officerName} numberOfLines={1}>
                {activeUser.fullName}
              </Text>
              <Text style={styles.officerPosition}>{activeUser.position}</Text>
              <Text style={styles.officerDepartment}>{activeUser.department}</Text>
            </View>
          </View>

          <View style={styles.staffIdBadgeRow}>
            <View style={styles.staffIdPill}>
              <MaterialCommunityIcons name="badge-account-horizontal-outline" size={15} color={colors.statusGreenText} />
              <Text style={styles.staffIdLabel}>Staff ID:</Text>
              <Text style={styles.staffIdValue}>{activeUser.staffId}</Text>
            </View>
            <View style={styles.statusVerifiedPill}>
              <Ionicons name="checkmark-circle" size={13} color={colors.statusGreenText} />
              <Text style={styles.statusVerifiedText}>Active & Approved</Text>
            </View>
          </View>

          <View style={styles.officerDetailsBox}>
            {activeUser.email ? (
              <View style={styles.detailRow}>
                <Ionicons name="mail-outline" size={13} color={colors.textSecondary} style={styles.detailIcon} />
                <Text style={styles.detailLabelText}>Email:</Text>
                <Text style={styles.detailValueText} numberOfLines={1}>{activeUser.email}</Text>
              </View>
            ) : null}
            {activeUser.phone ? (
              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={13} color={colors.textSecondary} style={styles.detailIcon} />
                <Text style={styles.detailLabelText}>Phone:</Text>
                <Text style={styles.detailValueText}>{activeUser.phone}</Text>
              </View>
            ) : null}
            <View style={[styles.detailRow, { marginBottom: 0 }]}>
              <Ionicons name="location-outline" size={13} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailLabelText}>Office:</Text>
              <Text style={styles.detailValueText}>{activeUser.officeLocation}</Text>
            </View>
          </View>
        </View>

        {/* ── Overview & Metrics ─────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview & Metrics</Text>
          {loading && <ActivityIndicator size="small" color={colors.primary} />}
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="wifi-outline" size={22} color={colors.textMuted} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            {statCards.map((stat) => {
              const tint = tintMap[stat.tint] || tintMap.coral;
              return (
                <View key={stat.id} style={styles.statCard}>
                  <View style={[styles.statIconWrap, { backgroundColor: tint.bg }]}>
                    <Ionicons name={stat.icon} size={20} color={tint.icon} />
                  </View>
                  <Text style={styles.statNumber}>
                    {loading ? '…' : stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Today's Service Activity ───────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityCard}>
          {loading ? (
            <View style={styles.activityLoading}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.activityLoadingText}>Loading activity…</Text>
            </View>
          ) : todayActivity.length === 0 ? (
            <View style={styles.activityEmpty}>
              <Ionicons name="calendar-outline" size={28} color={colors.textMuted} />
              <Text style={styles.activityEmptyText}>No recent appointment activity.</Text>
            </View>
          ) : (
            todayActivity.map((item, index) => {
              const st = activityStatusStyles[item.status] || activityStatusStyles.Scheduled;
              const isLast = index === todayActivity.length - 1;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.activityRow, isLast && styles.activityRowLast]}
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate('Appointments')}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityName}>{item.studentName}</Text>
                    <Text style={styles.activityService}>
                      {item.service} • {item.counselorName}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.activityTime}>{item.time}</Text>
                    <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                      <Text style={[styles.statusPillText, { color: st.text }]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* ── Quick Access ───────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>

        <View style={styles.quickAccessRow}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickAction}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(action.screen)}
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

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Header
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

  // Identity card
  identityCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 18,
    padding: spacing.md + 2,
    marginBottom: spacing.lg,
    borderWidth: 1.5,
    borderColor: '#CDE5D7',
  },
  identityTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.statusGreenText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  officerName: { fontSize: 17, fontWeight: '700', color: colors.text },
  officerPosition: { fontSize: 13, fontWeight: '600', color: colors.statusGreenText, marginTop: 1 },
  officerDepartment: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },

  staffIdBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  staffIdPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusGreenBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B7E4C7',
    gap: 5,
  },
  staffIdLabel: { fontSize: 11, fontWeight: '600', color: colors.statusGreenText },
  staffIdValue: { fontSize: 12, fontWeight: '800', color: '#1B4332', letterSpacing: 0.8 },

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
  statusVerifiedText: { fontSize: 11, fontWeight: '600', color: colors.statusGreenText },

  officerDetailsBox: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  detailIcon: { marginRight: 6 },
  detailLabelText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, width: 50 },
  detailValueText: { fontSize: 12, color: colors.text, flex: 1 },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  sectionLink: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },

  // Error
  errorBox: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.backgroundLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
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
    lineHeight: 16,
  },

  // Activity card
  activityCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activityLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
  },
  activityLoadingText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  activityEmpty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  activityEmptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  activityRowLast: { borderBottomWidth: 0 },
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

  // Quick access
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