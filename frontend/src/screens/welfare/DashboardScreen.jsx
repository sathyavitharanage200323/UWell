import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useWelfare } from '../../context/WelfareContext';
import { welfareService, resolveProfileImageUrl } from '../../services/welfareService';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const getTodayDateFormatted = () => {
  const now = new Date();
  return now.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// ── Theme-aligned Tint Palette (Strictly within UWell Brand) ───────────────────
const tintMap = {
  coral: { bg: colors.softCoral, icon: colors.primary, border: '#F7D6CC' },
  green: { bg: colors.statusGreenBg, icon: colors.statusGreenText, border: '#C7E8D3' },
  blue: { bg: '#EBF3FC', icon: '#2563EB', border: '#D0E3FA' },
  yellow: { bg: colors.statusYellowBg, icon: colors.statusYellowText, border: '#FDE4B8' },
  red: { bg: colors.statusRedBg, icon: colors.statusRedText, border: '#F8C8C2' },
  purple: { bg: '#F5EEF8', icon: '#7E22CE', border: '#E8D4F0' },
};

const activityStatusStyles = {
  Scheduled: { bg: '#EBF3FC', text: '#2563EB', border: '#D0E3FA' },
  'In Progress': { bg: colors.statusYellowBg, text: colors.statusYellowText, border: '#FDE4B8' },
  Completed: { bg: colors.statusGreenBg, text: colors.statusGreenText, border: '#C7E8D3' },
  Cancelled: { bg: colors.statusRedBg, text: colors.statusRedText, border: '#F8C8C2' },
};

// ── Metric Definitions ────────────────────────────────────────────────────────
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
    id: 'inSession',
    label: 'Counselors In Session',
    value: stats.inSessionCounselors ?? '—',
    icon: 'headset-outline',
    tint: 'yellow',
  },
  {
    id: 'completed',
    label: 'Completed Sessions',
    value: stats.completedSessions ?? '—',
    icon: 'checkmark-circle-outline',
    tint: 'blue',
  },
  {
    id: 'total',
    label: 'Total Appointments',
    value: stats.totalAppointments ?? '—',
    icon: 'stats-chart-outline',
    tint: 'purple',
  },
  {
    id: 'cancelled',
    label: 'Cancelled Sessions',
    value: stats.cancelledAppointments ?? '—',
    icon: 'close-circle-outline',
    tint: 'red',
  },
];

// ── Main Dashboard Screen ─────────────────────────────────────────────────────
const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { profile } = useWelfare();

  const [dashStats, setDashStats] = useState(null);
  const [todayActivity, setTodayActivity] = useState([]);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Active officer info
  const activeUser = {
    firstName: profile?.firstName || user?.firstName || 'Officer',
    lastName: profile?.lastName || user?.lastName || '',
    fullName:
      profile?.name ||
      (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Welfare Officer'),
    staffId: profile?.staffId || user?.staffId || 'STF01',
    department: profile?.department || user?.department || 'Student Welfare Services',
    position: profile?.position || user?.position || 'Welfare Officer',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || user?.phone || '',
    officeLocation: profile?.officeLocation || user?.officeLocation || 'Main Welfare Office',
    profilePicture: profile?.profilePicture || user?.profilePicture || null,
    avatarInitials:
      profile?.avatarInitials ||
      (user?.firstName
        ? `${user.firstName[0]}${(user.lastName || 'O')[0]}`.toUpperCase()
        : 'WO'),
  };

  // ── Data Fetching ───────────────────────────────────────────────────────────
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
      setError('Unable to load live dashboard data. Pull down to refresh.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboard();
  }, [fetchDashboard]);

  const statCards = buildStatCards(dashStats || {});

  // ── Quick Actions ───────────────────────────────────────────────────────────
  const quickActions = [
    {
      id: 'appointments',
      label: 'Appointments',
      desc: 'Manage sessions',
      icon: 'calendar-outline',
      screen: 'Appointments',
    },
    {
      id: 'counselors',
      label: 'Counselors',
      desc: 'Live availability',
      icon: 'heart-pulse',
      isMaterial: true,
      screen: 'Services',
    },
    {
      id: 'support',
      label: 'Support Hub',
      desc: 'Guides & policies',
      icon: 'shield-account-outline',
      isMaterial: true,
      screen: 'Support',
    },
    {
      id: 'profile',
      label: 'My Profile',
      desc: 'Official details',
      icon: 'account-outline',
      isMaterial: true,
      screen: 'Profile',
    },
  ];

  const visibleActivity = showAllActivity ? todayActivity : todayActivity.slice(0, 5);

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
        {/* ── Top App Bar ─────────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <View style={styles.dateBadge}>
              <Ionicons name="calendar-clear-outline" size={12} color={colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.dateBadgeText}>{getTodayDateFormatted()}</Text>
            </View>
            <Text style={styles.greetingText}>
              {getGreeting()}, {activeUser.firstName}
            </Text>
            <Text style={styles.subGreetingText}>University Welfare Dashboard</Text>
          </View>

          <View style={styles.topBarActions}>
            <TouchableOpacity
              style={styles.iconCircleBtn}
              onPress={onRefresh}
              disabled={refreshing}
              accessibilityLabel="Refresh Data"
            >
              {refreshing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="sync-outline" size={19} color={colors.text} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconCircleBtn, { marginLeft: 8 }]}
              onPress={() => navigation.navigate('Notifications')}
              accessibilityLabel="Notifications"
            >
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Official Welfare Officer Hero Card ──────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroAvatar}>
              {resolveProfileImageUrl(activeUser.profilePicture) ? (
                <Image
                  source={{ uri: resolveProfileImageUrl(activeUser.profilePicture) }}
                  style={styles.heroAvatarImage}
                />
              ) : (
                <Text style={styles.heroAvatarText}>{activeUser.avatarInitials}</Text>
              )}
            </View>

            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={styles.heroNameRow}>
                <Text style={styles.heroName} numberOfLines={1}>
                  {activeUser.fullName}
                </Text>
                <View style={styles.verifiedChip}>
                  <Ionicons name="checkmark-circle" size={13} color={colors.statusGreenText} />
                  <Text style={styles.verifiedChipText}>Official</Text>
                </View>
              </View>

              <Text style={styles.heroPosition}>{activeUser.position}</Text>
              <Text style={styles.heroDept} numberOfLines={1}>{activeUser.department}</Text>
            </View>
          </View>

          {/* Identity Chips Row */}
          <View style={styles.heroInfoRow}>
            <View style={styles.infoChip}>
              <MaterialCommunityIcons name="badge-account-horizontal-outline" size={14} color={colors.primary} />
              <Text style={styles.infoChipLabel}>ID:</Text>
              <Text style={styles.infoChipVal}>{activeUser.staffId}</Text>
            </View>

            <View style={styles.infoChip}>
              <Ionicons name="location-outline" size={14} color={colors.primary} />
              <Text style={styles.infoChipVal} numberOfLines={1}>{activeUser.officeLocation}</Text>
            </View>
          </View>
        </View>

        {/* ── Quick Access Action Center ──────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={styles.quickIconWrap}>
                {action.isMaterial ? (
                  <MaterialCommunityIcons name={action.icon} size={22} color={colors.primary} />
                ) : (
                  <Ionicons name={action.icon} size={22} color={colors.primary} />
                )}
              </View>
              <Text style={styles.quickTitle}>{action.label}</Text>
              <Text style={styles.quickDesc}>{action.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Overview & Metrics Section ─────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>Overview & Metrics</Text>
            {loading && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />}
          </View>
          <View style={styles.metricLiveDot}>
            <View style={styles.pulseDot} />
            <Text style={styles.metricLiveText}>Live Data</Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={24} color={colors.statusRedText} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchDashboard}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.metricsGrid}>
            {statCards.map((stat) => {
              const tint = tintMap[stat.tint] || tintMap.coral;
              return (
                <View key={stat.id} style={styles.metricCard}>
                  <View style={styles.metricHeaderRow}>
                    <View style={[styles.metricIconWrap, { backgroundColor: tint.bg }]}>
                      <Ionicons name={stat.icon} size={16} color={tint.icon} />
                    </View>
                    <Text style={styles.metricNumber}>
                      {loading ? '…' : stat.value}
                    </Text>
                  </View>

                  <Text style={styles.metricLabel} numberOfLines={2}>
                    {stat.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Recent Activity Section ────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {todayActivity.length > 0 ? (
              <View style={styles.countTag}>
                <Text style={styles.countTagText}>{todayActivity.length}</Text>
              </View>
            ) : null}
          </View>

          {todayActivity.length > 5 ? (
            <TouchableOpacity
              onPress={() => setShowAllActivity((prev) => !prev)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.sectionLink}>
                {showAllActivity ? 'Show Less' : 'View All Details'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Appointments')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.sectionLink}>All Appointments</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.activityContainer}>
          {loading ? (
            <View style={styles.activityLoading}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.activityLoadingText}>Loading live activities…</Text>
            </View>
          ) : todayActivity.length === 0 ? (
            <View style={styles.activityEmpty}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="calendar-outline" size={26} color={colors.textMuted} />
              </View>
              <Text style={styles.activityEmptyTitle}>No Recent Activity</Text>
              <Text style={styles.activityEmptyText}>Appointment bookings and session changes will appear here.</Text>
            </View>
          ) : (
            <>
              {visibleActivity.map((item, index) => {
                const st = activityStatusStyles[item.status] || activityStatusStyles.Scheduled;
                const isLast = index === visibleActivity.length - 1 && !(todayActivity.length > 5 && !showAllActivity);
                const initials = (item.studentName || 'S')
                  .split(' ')
                  .map((w) => w[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <TouchableOpacity
                    key={item.id || index}
                    style={[styles.activityRow, isLast && styles.activityRowLast]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Appointments')}
                  >
                    <View style={styles.studentAvatar}>
                      <Text style={styles.studentAvatarText}>{initials}</Text>
                    </View>

                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={styles.activityStudentName}>{item.studentName}</Text>
                      <Text style={styles.activityDetailLine} numberOfLines={1}>
                        <Text style={styles.activityServiceText}>{item.service}</Text>
                        <Text style={styles.activityBullet}> • </Text>
                        <Text style={styles.activityCounselorText}>{item.counselorName}</Text>
                      </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <View style={styles.timeBadge}>
                        <Ionicons name="time-outline" size={11} color={colors.textSecondary} style={{ marginRight: 3 }} />
                        <Text style={styles.activityTimeText}>{item.time || '10:00 AM'}</Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: st.bg, borderColor: st.border }]}>
                        <Text style={[styles.statusBadgeText, { color: st.text }]}>
                          {item.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {todayActivity.length > 5 && (
                <TouchableOpacity
                  style={styles.expandToggleBtn}
                  activeOpacity={0.75}
                  onPress={() => setShowAllActivity((prev) => !prev)}
                >
                  <Text style={styles.expandToggleText}>
                    {showAllActivity
                      ? 'Show Less'
                      : `View All Details (${todayActivity.length} activities)`}
                  </Text>
                  <Ionicons
                    name={showAllActivity ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={colors.primary}
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  greetingText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subGreetingText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#C6AEA1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  // Official Hero Card
  heroCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    padding: spacing.md + 2,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#C6AEA1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  heroAvatarImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  heroAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  verifiedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusGreenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  verifiedChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.statusGreenText,
  },
  heroPosition: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 2,
  },
  heroDept: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  heroInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  infoChipLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  infoChipVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm + 2,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  countTag: {
    backgroundColor: colors.softCoral,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  countTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  metricLiveDot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusGreenBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 5,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.statusGreenText,
  },
  metricLiveText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.statusGreenText,
  },

  // Quick Action Grid
  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  quickCard: {
    width: '23%',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#C6AEA1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  quickIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  quickDesc: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: colors.backgroundLight,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#C6AEA1',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  metricHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    lineHeight: 16,
  },

  // Activity Card
  activityContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 18,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#C6AEA1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  activityLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
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
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activityEmptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  activityEmptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 3,
    paddingHorizontal: 20,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  activityRowLast: {
    borderBottomWidth: 0,
  },
  studentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  studentAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  activityStudentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  activityDetailLine: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  activityServiceText: {
    color: colors.textSecondary,
  },
  activityBullet: {
    color: colors.textMuted,
  },
  activityCounselorText: {
    color: colors.primary,
    fontWeight: '500',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTimeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  expandToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  expandToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },

  // Error Card
  errorBox: {
    backgroundColor: colors.statusRedBg,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#F8C8C2',
  },
  errorText: {
    fontSize: 13,
    color: colors.statusRedText,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  retryBtn: {
    backgroundColor: colors.statusRedText,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DashboardScreen;