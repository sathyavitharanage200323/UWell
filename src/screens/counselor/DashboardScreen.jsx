import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { counselorService } from '../../services/counselorService';

const { width } = Dimensions.get('window');

// ─── Mini sparkline (pure RN, no SVG dep) ──────────────────────────────────
const Sparkline = ({ color = colors.primary, style }) => {
  // Simple decorative wave using a series of View bars
  const points = [3, 5, 4, 6, 5, 7, 5];
  const max = 7;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-end', height: 20 }, style]}>
      {points.map((p, i) => (
        <View
          key={i}
          style={{
            width: 6,
            height: (p / max) * 18,
            backgroundColor: color,
            opacity: 0.35,
            borderRadius: 3,
            marginRight: 2
          }}
        />
      ))}
    </View>
  );
};

// ─── Stat card ────────────────────────────────────────────────────────────
const StatCard = ({ icon, iconBg, iconColor, number, label, sparkColor }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconCircle, { backgroundColor: iconBg }]}>
      {icon}
    </View>
    <Text style={[styles.statNumber, { color: iconColor }]}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Sparkline color={sparkColor} style={{ marginTop: 4 }} />
  </View>
);

// ─── Today's Load carousel dot ────────────────────────────────────────────
const Dot = ({ active }) => (
  <View
    style={{
      width: active ? 16 : 6,
      height: 5,
      borderRadius: 3,
      backgroundColor: active ? colors.primary : colors.border,
      marginRight: 4
    }}
  />
);

// ─── Avatar circle with initials ──────────────────────────────────────────
const Avatar = ({ initials, size = 44, bg = colors.softCoral, textColor = colors.primary, style }) => (
  <View
    style={[
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center'
      },
      style
    ]}
  >
    <Text style={{ fontSize: size * 0.36, fontWeight: '700', color: textColor }}>
      {initials.substring(0, 2).toUpperCase()}
    </Text>
  </View>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────
const DashboardScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadDotActive, setLoadDotActive] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadDashboardData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
    // Carousel dots auto-cycle
    const timer = setInterval(() => setLoadDotActive(d => (d + 1) % 2), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadDashboardData);
    return unsubscribe;
  }, [navigation]);

  const loadDashboardData = async () => {
    const [pData, sData, appts, studentsData] = await Promise.all([
      counselorService.getCounselorProfile(),
      counselorService.getPerformanceStats(),
      counselorService.getAppointments(),
      counselorService.getStudents()
    ]);
    setProfile(pData);
    setStats(sData);
    setTodaySchedule(appts.filter(a => a.date === 'Today' || a.status === 'Confirmed'));
    setStudents(studentsData || []);
  };

  const firstName = profile?.name
    ? profile.name.split(' ').slice(0, 3).join(' ').split(',')[0]
    : 'Dr. Evelyn Martinez';

  const initials = profile?.avatarInitials || 'EM';
  const role = profile?.role || 'CLINICAL STAFF';

  const notesWithStudents = students
    .filter(s => s.sessionNotesHistory && s.sessionNotesHistory.trim())
    .slice(0, 3);

  const hasNotes = notesWithStudents.length > 0;

  const getStudentFromAppointment = (studentId) => {
    return students.find(s => s.id === studentId);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ── HEADER ─────────────────────────────────────────────── */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{role}</Text>
              </View>
              <Text style={styles.nameText}>{firstName}</Text>
              <Text style={styles.greetingText}>Good Morning 👋</Text>
            </View>

            {/* Notification bell */}
            <TouchableOpacity
              style={styles.bellBtn}
              accessibilityLabel="Notifications"
              onPress={() => {}}
            >
              <Feather name="bell" size={20} color={colors.primary} />
              <View style={styles.bellDot} />
            </TouchableOpacity>

            {/* Avatar with online dot */}
            <TouchableOpacity
              style={styles.avatarWrap}
              onPress={() => navigation.navigate('Profile')}
              accessibilityLabel="Open Profile"
            >
              <Avatar initials={initials} size={46} />
              <View style={styles.onlineDot} />
            </TouchableOpacity>
          </View>

          {/* ── TODAY'S LOAD CARD ───────────────────────────────────── */}
          <View style={styles.loadCard}>
            <View style={styles.loadCardLeft}>
              <View style={styles.loadIconCircle}>
                <Feather name="calendar" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.loadLabel}>TODAY'S LOAD</Text>
                <Text style={styles.loadQuote}>
                  "{stats?.summary || 'Your afternoon is fully booked with student check-ins.'}"
                </Text>
                {/* Carousel dots */}
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Dot active={loadDotActive === 0} />
                  <Dot active={loadDotActive === 1} />
                </View>
              </View>
            </View>

            {/* Decorative calendar illustration */}
            <View style={styles.loadCalendarDecor}>
              <View style={styles.calendarIllus}>
                <View style={styles.calendarTop} />
                <View style={styles.calendarBody}>
                  <Feather name="check-circle" size={18} color={colors.primary} />
                </View>
              </View>
              <View style={styles.clockDecor}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
              </View>
            </View>
          </View>

          {/* ── AVAILABILITY BANNER ─────────────────────────────────── */}
          <View style={styles.availCard}>
            <View style={styles.availIconCircle}>
              <MaterialCommunityIcons name="calendar-clock" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.availTitle}>AVAILABILITY</Text>
              <Text style={styles.availSub}>Update your open slots and office hours.</Text>
            </View>
            <TouchableOpacity
              style={styles.manageBtn}
              onPress={() => navigation.navigate('Availability')}
              accessibilityLabel="Manage Availability"
            >
              <Text style={styles.manageBtnText}>Manage Availability</Text>
              <Feather name="chevron-right" size={14} color={colors.white} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>

          {/* ── PERFORMANCE ─────────────────────────────────────────── */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>PERFORMANCE</Text>
            <TouchableOpacity style={styles.weekPill}>
              <Text style={styles.weekPillText}>This Week</Text>
              <Feather name="chevron-down" size={12} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <StatCard
              icon={<Ionicons name="people-outline" size={18} color={colors.primary} />}
              iconBg={colors.softCoral}
              iconColor={colors.primary}
              number={stats?.activeCases ?? 42}
              label="Active Cases"
              sparkColor={colors.primary}
            />
            <StatCard
              icon={<Ionicons name="bar-chart-outline" size={18} color="#4A90E2" />}
              iconBg="#EAF3FF"
              iconColor="#4A90E2"
              number={stats?.thisWeekSessions ?? 18}
              label="This Week"
              sparkColor="#4A90E2"
            />
            <StatCard
              icon={<Feather name="file-text" size={18} color={colors.statusGreenText} />}
              iconBg={colors.statusGreenBg}
              iconColor={colors.statusGreenText}
              number={stats?.pendingRequests ?? 5}
              label="Requests"
              sparkColor={colors.statusGreenText}
            />
          </View>

          {/* ── RECENT SESSION NOTES ─────────────────────────────────── */}
          {hasNotes && (
            <View>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>RECENT SESSION NOTES</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Students')}>
                  <Text style={styles.viewAllText}>View All  ›</Text>
                </TouchableOpacity>
              </View>
              {notesWithStudents.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  activeOpacity={0.8}
                  style={styles.notesCard}
                  onPress={() => navigation.navigate('StudentSession', { studentId: s.id })}
                  accessibilityLabel={`View notes for ${s.name}`}
                >
                  <View style={styles.notesCardHeader}>
                    <Avatar initials={s.avatarInitials || s.name.substring(0, 2)} size={40} />
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <Text style={styles.studentName}>{s.name}</Text>
                      <Text style={styles.courseText}>{s.yearCourse}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color={colors.textSecondary} />
                  </View>
                  <Text style={styles.notesCardBody} numberOfLines={3}>
                    {s.sessionNotesHistory}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {todaySchedule.length === 0 ? (
            <View style={styles.emptyCard}>
              <Feather name="calendar" size={24} color={colors.border} />
              <Text style={styles.emptyText}>No appointments scheduled for today.</Text>
            </View>
          ) : (
            todaySchedule.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.scheduleCard}
                onPress={() =>
                  navigation.navigate('StudentSession', {
                    studentId: item.studentId,
                    appointment: item
                  })
                }
                accessibilityLabel={`View session for ${item.studentName}`}
              >
                {/* Left accent bar */}
                <View
                  style={[
                    styles.scheduleAccentBar,
                    { backgroundColor: index % 2 === 0 ? colors.primary : '#4A90E2' }
                  ]}
                />

                {/* Avatar */}
                <Avatar
                  initials={item.avatarInitials || item.studentName.substring(0, 2)}
                  size={44}
                  bg={index % 2 === 0 ? colors.softCoral : '#EAF3FF'}
                  textColor={index % 2 === 0 ? colors.primary : '#4A90E2'}
                  style={{ marginHorizontal: spacing.sm }}
                />

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName}>{item.studentName}</Text>
                  {(() => {
                    const st = getStudentFromAppointment(item.studentId);
                    if (st && st.sessionNotesHistory && st.sessionNotesHistory.trim()) {
                      return (
                        <View style={styles.sessionMetaRow}>
                          <Feather name="file-text" size={11} color={colors.primary} />
                          <Text style={[styles.sessionMetaText, { color: colors.primary, fontWeight: '600' }]}> Has notes</Text>
                        </View>
                      );
                    }
                    return null;
                  })()}
                  <View style={styles.sessionMetaRow}>
                    <Ionicons name="person-outline" size={11} color={colors.textSecondary} />
                    <Text style={styles.sessionMetaText}> {item.sessionType}</Text>
                  </View>
                  <View style={styles.sessionMetaRow}>
                    <Feather name="clock" size={11} color={colors.textSecondary} />
                    <Text style={styles.sessionMetaText}> {item.time}</Text>
                  </View>
                </View>

                {/* Status badge + dots */}
                <View style={{ alignItems: 'flex-end' }}>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === 'Confirmed' ? styles.confirmedBadge : styles.pendingBadge
                    ]}
                  >
                    {item.status === 'Confirmed' && (
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color={colors.statusGreenText}
                        style={{ marginRight: 3 }}
                      />
                    )}
                    <Text
                      style={[
                        styles.statusText,
                        item.status === 'Confirmed' ? styles.confirmedText : styles.pendingText
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                  <Feather
                    name="more-vertical"
                    size={16}
                    color={colors.textSecondary}
                    style={{ marginTop: 6 }}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const STAT_CARD_WIDTH = (width - spacing.md * 2 - spacing.sm * 2) / 3;

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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl
  },

  // ── Header ──────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 4
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.darkText,
    lineHeight: 28
  },
  greetingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 1
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm
  },
  bellDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.white
  },
  avatarWrap: {
    position: 'relative'
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#50C878',
    borderWidth: 2,
    borderColor: colors.white
  },

  // ── Today's Load Card ─────────────────────────────────────
  loadCard: {
    backgroundColor: colors.softCoral,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    overflow: 'hidden',
    minHeight: 100
  },
  loadCardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  loadIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(232,131,107,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2
  },
  loadLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 4
  },
  loadQuote: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.darkText,
    lineHeight: 21,
    flex: 1
  },
  loadCalendarDecor: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  calendarIllus: {
    width: 54,
    height: 58,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center'
  },
  calendarTop: {
    width: '100%',
    height: 14,
    backgroundColor: colors.primary
  },
  calendarBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  clockDecor: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },

  // ── Availability Card ─────────────────────────────────────
  availCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3
  },
  availIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center'
  },
  availTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 2
  },
  availSub: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 22,
    marginLeft: spacing.sm
  },
  manageBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700'
  },

  // ── Section header ────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.xs
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1
  },
  weekPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1
  },
  weekPillText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    marginRight: 2
  },
  viewAllText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600'
  },

  // ── Stat Cards ────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md
  },
  statCard: {
    width: STAT_CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 26
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },

  // ── Schedule Cards ────────────────────────────────────────
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing.sm,
    paddingVertical: 12,
    paddingRight: 14,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden'
  },
  scheduleAccentBar: {
    width: 4,
    height: '100%',
    borderRadius: 4,
    position: 'absolute',
    left: 0,
    top: 0
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 3
  },
  sessionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  sessionMetaText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  confirmedBadge: {
    backgroundColor: colors.statusGreenBg
  },
  confirmedText: {
    color: colors.statusGreenText,
    fontSize: 11,
    fontWeight: '600'
  },
  pendingBadge: {
    backgroundColor: colors.statusYellowBg
  },
  pendingText: {
    color: colors.statusYellowText,
    fontSize: 11,
    fontWeight: '600'
  },
  statusText: {},

  // ── Empty state ───────────────────────────────────────────
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 16
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 8
  },
  courseText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1
  },
  notesCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2
  },
  notesCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  notesCardBody: {
    fontSize: 12,
    color: colors.darkText,
    lineHeight: 18
  }
});

export default DashboardScreen;
