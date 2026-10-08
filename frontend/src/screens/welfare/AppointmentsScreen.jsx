import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useWelfare } from '../../context/WelfareContext';

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

// Normalize backend lowercase → display title-case
const normalizeStatus = (raw = '') => {
  const s = raw.toLowerCase();
  if (s === 'upcoming' || s === 'scheduled') return 'Upcoming';
  if (s === 'completed' || s === 'done') return 'Completed';
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  if (s === 'in-session' || s === 'in session') return 'In Session';
  return raw;
};

const statusStyles = {
  Upcoming:   { bg: colors.statusRedBg,    text: colors.statusRedText },
  'In Session': { bg: colors.statusYellowBg, text: colors.statusYellowText },
  Completed:  { bg: colors.statusGreenBg,  text: colors.statusGreenText },
  Cancelled:  { bg: '#EAE1D7',             text: colors.textSecondary },
};

const AppointmentsScreen = ({ navigation }) => {
  const { appointments, getAppointments, refreshAppointments, isLoading } = useWelfare();
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const list = (() => {
    if (activeTab === 'All') return appointments;
    return appointments.filter(
      (a) => normalizeStatus(a.status) === activeTab
    );
  })();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAppointments();
    setRefreshing(false);
  }, [refreshAppointments]);

  const handleBack = () => {
    const parent = navigation.getParent();
    if (parent) parent.navigate('Dashboard');
  };

  // Counts per tab
  const counts = TABS.reduce((acc, tab) => {
    if (tab === 'All') acc[tab] = appointments.length;
    else acc[tab] = appointments.filter((a) => normalizeStatus(a.status) === tab).length;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading appointments…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Appointments</Text>
          <Text style={styles.headerSub}>{appointments.length} total records</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{counts['Upcoming'] || 0} upcoming</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
              {counts[tab] > 0 && (
                <View style={[styles.tabCount, active && styles.tabCountActive]}>
                  <Text style={[styles.tabCountText, active && styles.tabCountTextActive]}>
                    {counts[tab]}
                  </Text>
                </View>
              )}
              {active && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {list.length === 0 ? (
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="calendar-outline" size={36} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No {activeTab === 'All' ? '' : activeTab.toLowerCase()} appointments</Text>
            <Text style={styles.emptyText}>Pull down to refresh or check another tab.</Text>
          </View>
        ) : (
          list.map((apt) => {
            const displayStatus = normalizeStatus(apt.status);
            const st = statusStyles[displayStatus] || statusStyles.Upcoming;
            const aptId = apt._id || apt.id;

            return (
              <TouchableOpacity
                key={aptId}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('AppointmentDetails', { id: aptId })}
              >
                {/* Top row: date + status */}
                <View style={styles.cardTopRow}>
                  <View style={styles.dateChip}>
                    <Ionicons name="calendar-outline" size={12} color={colors.primary} />
                    <Text style={styles.cardDate}> {apt.date}</Text>
                    <Text style={styles.cardTime}> • {apt.time}</Text>
                  </View>
                  <View style={[styles.pill, { backgroundColor: st.bg }]}>
                    <Text style={[styles.pillText, { color: st.text }]}>{displayStatus}</Text>
                  </View>
                </View>

                {/* Student + Counselor info */}
                <View style={styles.cardBodyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{apt.studentName}</Text>
                    {apt.studentRegNo ? (
                      <Text style={styles.cardRegNo}>{apt.studentRegNo}</Text>
                    ) : null}
                    <View style={styles.counselorRow}>
                      <Ionicons name="person-outline" size={13} color={colors.textMuted} />
                      <Text style={styles.cardSub}>
                        {' '}{apt.counselorName}
                      </Text>
                    </View>
                    {apt.sessionType ? (
                      <View style={styles.typeRow}>
                        <Ionicons
                          name={apt.sessionType === 'Online' ? 'videocam-outline' : 'business-outline'}
                          size={12}
                          color={colors.textMuted}
                        />
                        <Text style={styles.typeText}> {apt.sessionType}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.md,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  headerSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerBadge: {
    backgroundColor: colors.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
    position: 'relative',
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  tabCount: {
    marginLeft: 5,
    backgroundColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  tabCountActive: { backgroundColor: colors.softCoral },
  tabCountText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.bold,
  },
  tabCountTextActive: { color: colors.primary },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },

  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },

  emptyBox: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textTransform: 'capitalize',
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },

  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardDate: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
    fontWeight: typography.fontWeight.medium,
  },
  cardTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  pillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },

  cardBodyRow: { flexDirection: 'row', alignItems: 'center' },
  cardName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: 2,
  },
  cardRegNo: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginBottom: 3,
  },
  counselorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  cardSub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  typeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  typeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});

export default AppointmentsScreen;