import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';
import { counselorService } from '../../services/counselorService';

const DashboardScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const pData = await counselorService.getCounselorProfile();
    const sData = await counselorService.getPerformanceStats();
    const appts = await counselorService.getAppointments();
    setProfile(pData);
    setStats(sData);
    setTodaySchedule(appts.filter((a) => a.date === 'Today' || a.status === 'Confirmed'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Header Bar */}
        <View style={styles.headerRow}>
          <View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{profile?.role || 'CLINICAL STAFF'}</Text>
            </View>
            <Text style={styles.greetingTitle}>
              {profile?.name ? profile.name.split(',')[0] : 'Dr. Evelyn Martinez'}
            </Text>
            <Text style={styles.greetingSubtitle}>Good Morning 👋</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            accessibilityLabel="Open Profile"
          >
            <ImagePlaceholder
              initials={profile?.avatarInitials || 'EM'}
              size={48}
              backgroundColor={colors.softCoral}
              textColor={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Today's Load Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S LOAD</Text>
        </View>
        <Card style={styles.loadSummaryCard}>
          <Text style={styles.loadSummaryText}>
            "{stats?.summary || 'Your afternoon is fully booked with student check-ins.'}"
          </Text>
        </Card>

        {/* Manage Availability Banner */}
        <Card style={styles.availabilityBanner}>
          <View style={styles.availabilityTextCol}>
            <Text style={styles.availabilityTitle}>AVAILABILITY</Text>
            <Text style={styles.availabilitySub}>Update your open slots and office hours.</Text>
          </View>
          <TouchableOpacity
            style={styles.manageBtn}
            onPress={() => navigation.navigate('Availability')}
            accessibilityLabel="Manage Availability"
          >
            <Text style={styles.manageBtnText}>Manage Availability</Text>
          </TouchableOpacity>
        </Card>

        {/* Performance Stat Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PERFORMANCE</Text>
        </View>
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats?.activeCases || 42}</Text>
            <Text style={styles.statLabel}>Active Cases</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats?.thisWeekSessions || 18}</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats?.pendingRequests || 5}</Text>
            <Text style={styles.statLabel}>Requests</Text>
          </Card>
        </View>

        {/* Today's Schedule */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S SCHEDULE</Text>
        </View>

        {todaySchedule.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No appointments scheduled for today.</Text>
          </Card>
        ) : (
          todaySchedule.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('StudentSession', { studentId: item.studentId, appointment: item })}
              accessibilityLabel={`View session for ${item.studentName}`}
            >
              <Card style={styles.scheduleCard}>
                <View style={styles.scheduleLeft}>
                  <ImagePlaceholder
                    initials={item.avatarInitials || item.studentName.substring(0, 2)}
                    size={44}
                  />
                  <View style={styles.scheduleMeta}>
                    <Text style={styles.studentName}>{item.studentName}</Text>
                    <Text style={styles.sessionDetails}>
                      {item.sessionType} · {item.time}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Confirmed'
                      ? styles.confirmedBadge
                      : styles.pendingBadge
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === 'Confirmed'
                        ? styles.confirmedText
                        : styles.pendingText
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.creamBackground
  },
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.softCoral,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.5
  },
  greetingTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  greetingSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary
  },
  sectionHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.xs
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1
  },
  loadSummaryCard: {
    backgroundColor: colors.softCoral,
    borderColor: colors.mutedRose,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  loadSummaryText: {
    fontSize: typography.fontSize.md,
    color: colors.darkText,
    fontStyle: 'italic',
    lineHeight: 20
  },
  availabilityBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  availabilityTextCol: {
    flex: 1,
    marginRight: spacing.sm
  },
  availabilityTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 2
  },
  availabilitySub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary
  },
  manageBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: 8
  },
  manageBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md
  },
  statCard: {
    flex: 1,
    marginHorizontal: 3,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.white
  },
  statNumber: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: 2
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center'
  },
  scheduleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  scheduleMeta: {
    marginLeft: spacing.sm,
    flex: 1
  },
  studentName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  sessionDetails: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12
  },
  confirmedBadge: {
    backgroundColor: colors.statusGreenBg
  },
  confirmedText: {
    color: colors.statusGreenText,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium
  },
  pendingBadge: {
    backgroundColor: colors.statusYellowBg
  },
  pendingText: {
    color: colors.statusYellowText,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium
  },
  emptyCard: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.white
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md
  }
});

export default DashboardScreen;
