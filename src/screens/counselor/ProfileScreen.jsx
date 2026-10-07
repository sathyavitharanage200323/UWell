import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { counselorService } from '../../services/counselorService';
import { initialClinicalFocusAreas } from '../../data/counselorMockData';

const { width } = Dimensions.get('window');

// ─── Focus area config ────────────────────────────────────────────────────
const FOCUS_ICONS = {
  'Academic Burnout':    { icon: 'school',          lib: 'Ionicons',   bg: '#FDF1EC', color: '#E8836B' },
  'ADHD Management':    { icon: 'brain',            lib: 'Material',   bg: '#EAF3FF', color: '#4A90E2' },
  'Anxiety Disorder':   { icon: 'heart',            lib: 'Feather',    bg: '#E8F8EF', color: '#397052' },
  'Social Adjustment':  { icon: 'people',           lib: 'Ionicons',   bg: '#F3EEFF', color: '#7C5CBF' },
};

const FocusIcon = ({ name }) => {
  const cfg = FOCUS_ICONS[name] || { icon: 'star', lib: 'Feather', bg: colors.softCoral, color: colors.primary };
  const size = 26;
  if (cfg.lib === 'Ionicons')  return <Ionicons name={cfg.icon} size={size} color={cfg.color} />;
  if (cfg.lib === 'Material')  return <MaterialCommunityIcons name={cfg.icon} size={size} color={cfg.color} />;
  return <Feather name={cfg.icon} size={size} color={cfg.color} />;
};

// ─── Days short names ────────────────────────────────────────────────────
const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_FULL  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ─── Main Screen ─────────────────────────────────────────────────────────
const ProfileScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [profile, setProfile]       = useState(null);
  const [stats, setStats]           = useState(null);
  const [schedule, setSchedule]     = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadAll);
    loadAll();
    Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();
    return unsubscribe;
  }, [navigation]);

  const loadAll = async () => {
    const [p, s, av] = await Promise.all([
      counselorService.getCounselorProfile(),
      counselorService.getPerformanceStats(),
      counselorService.getAvailability(),
    ]);
    setProfile(p);
    setStats(s);
    setSchedule(av);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout?.() },
    ]);
  };

  // Map full day name → schedule entry
  const dayMap = {};
  schedule.forEach(s => { dayMap[s.day] = s; });

  const focus = profile?.clinicalFocus || [
    'Academic Burnout', 'ADHD Management', 'Anxiety Disorder', 'Social Adjustment',
  ];

  // Navigate to the full list screen or directly to a detail card
  const handleSeeAll = () => navigation.navigate('ClinicalFocusAreas');
  const handleFocusCard = (itemKey) => {
    const area = initialClinicalFocusAreas.find(a => a.key === itemKey);
    if (area) {
      navigation.navigate('FocusAreaDetail', { area });
    } else {
      navigation.navigate('ClinicalFocusAreas');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />

      {/* ── Top bar ───────────────────────────────────────────── */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.pageTitle}>My Profile</Text>
          <Text style={styles.pageSubtitle}>View and manage your professional details</Text>
        </View>
        <TouchableOpacity
          style={styles.gearBtn}
          onPress={handleSignOut}
          accessibilityLabel="Settings / Sign Out"
        >
          <Feather name="settings" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Card ────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          {/* Decorative blobs */}
          <View style={styles.blobTopRight} />
          <View style={styles.blobBottomLeft} />

          {/* Left col */}
          <View style={styles.heroLeft}>
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {(profile?.avatarInitials || 'EM').toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editAvatarBtn}
                onPress={() => navigation.navigate('EditProfile')}
                accessibilityLabel="Edit avatar"
              >
                <Feather name="edit-2" size={11} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Name & title */}
            <Text style={styles.heroName}>
              {profile?.name || 'Dr. Evelyn Martinez, PhD'}
            </Text>
            <Text style={styles.heroTitle}>
              {profile?.title || 'Senior Student Cognitive Psychologist'}
            </Text>

            {/* Rating */}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#F5A623" />
              <Text style={styles.ratingNum}> {profile?.rating || '4.9'}</Text>
              <Text style={styles.ratingMeta}>
                {'  '}({profile?.sessionsReviewed || 148} sessions reviewed)
              </Text>
            </View>

            {/* Mini stats */}
            <View style={styles.miniStatsRow}>
              <View style={styles.miniStat}>
                <Ionicons name="people-outline" size={16} color={colors.primary} />
                <Text style={styles.miniStatNum}>{stats?.activeCases ?? 42}</Text>
                <Text style={styles.miniStatLabel}>Active Cases</Text>
              </View>
              <View style={styles.miniStatDivider} />
              <View style={styles.miniStat}>
                <Ionicons name="bar-chart-outline" size={16} color={colors.primary} />
                <Text style={styles.miniStatNum}>{stats?.thisWeekSessions ?? 18}</Text>
                <Text style={styles.miniStatLabel}>This Week</Text>
              </View>
              <View style={styles.miniStatDivider} />
              <View style={styles.miniStat}>
                <Feather name="file-text" size={15} color={colors.primary} />
                <Text style={styles.miniStatNum}>{stats?.pendingRequests ?? 5}</Text>
                <Text style={styles.miniStatLabel}>Requests</Text>
              </View>
            </View>
          </View>

          {/* Right decorative image placeholder */}
          <View style={styles.heroImageBox}>
            <View style={styles.heroImageInner}>
              <Ionicons name="business-outline" size={38} color={colors.primary} style={{ opacity: 0.35 }} />
            </View>
            <View style={styles.heroQuoteBox}>
              <Text style={styles.heroQuoteText}>
                "Supporting{'\n'}students today{'\n'}for a{' '}
                <Text style={{ textDecorationLine: 'underline', color: colors.primary }}>brighter{'\n'}tomorrow.</Text>"
              </Text>
            </View>
          </View>

          {/* Manage Availability */}
          <TouchableOpacity
            style={styles.availBtn}
            onPress={() => navigation.navigate('Availability')}
            accessibilityLabel="Manage Availability"
          >
            <Feather name="calendar" size={16} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={styles.availBtnText}>Manage Availability</Text>
            <Feather name="chevron-right" size={16} color={colors.white} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>

        {/* ── Clinical Focus Areas ─────────────────────────────── */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionLeft}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#FDF1EC' }]}>
              <MaterialCommunityIcons name="brain" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>CLINICAL FOCUS AREAS</Text>
              <Text style={styles.sectionSub}>Key areas you support students with</Text>
            </View>
          </View>
          {/* ── WIRED: See All navigates to full list screen ── */}
          <TouchableOpacity
            onPress={handleSeeAll}
            accessibilityLabel="See all clinical focus areas"
            accessibilityRole="button"
          >
            <Text style={styles.seeAll}>See All ›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.focusGrid}>
          {focus.map((item, i) => {
            const cfg = FOCUS_ICONS[item] || { bg: colors.softCoral, color: colors.primary };
            return (
              // ── WIRED: each card navigates to its detail screen ──
              <TouchableOpacity
                key={i}
                style={styles.focusCard}
                activeOpacity={0.8}
                accessibilityLabel={`${item}. Tap to view details.`}
                accessibilityRole="button"
                onPress={() => handleFocusCard(item)}
              >
                <View style={[styles.focusIconCircle, { backgroundColor: cfg.bg }]}>
                  <FocusIcon name={item} />
                </View>
                <Text style={styles.focusLabel}>{item}</Text>
                <Feather name="chevron-right" size={14} color={colors.textSecondary} style={styles.focusChevron} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Office & Contact ─────────────────────────────────── */}
        <View style={[styles.sectionRow, { marginTop: 4 }]}>
          <View style={styles.sectionLeft}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#FDF1EC' }]}>
              <Ionicons name="business-outline" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>OFFICE & CONTACT</Text>
              <Text style={styles.sectionSub}>Your office location and professional contact details</Text>
            </View>
          </View>
        </View>

        <View style={styles.officeCard}>
          {/* Building image placeholder */}
          <View style={styles.buildingImgBox}>
            <View style={styles.buildingImgInner}>
              <Ionicons name="business" size={44} color={colors.primary} style={{ opacity: 0.25 }} />
            </View>
            <View style={styles.buildingLabel}>
              <Ionicons name="location" size={12} color={colors.white} />
              <Text style={styles.buildingLabelText}>
                {profile?.officeLocation || 'Clinic Hall B, Room 302'}
              </Text>
            </View>
          </View>

          {/* Contact details */}
          <View style={styles.contactDetails}>
            <View style={styles.contactRow}>
              <View style={[styles.contactIconCircle, { backgroundColor: '#FDF1EC' }]}>
                <Ionicons name="location-outline" size={14} color={colors.primary} />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Office Location</Text>
                <Text style={styles.contactVal}>
                  {profile?.officeLocation || 'Clinic Hall B, Room 302'}
                </Text>
              </View>
            </View>

            <View style={styles.contactDivider} />

            <View style={styles.contactRow}>
              <View style={[styles.contactIconCircle, { backgroundColor: '#EAF3FF' }]}>
                <Feather name="mail" size={14} color="#4A90E2" />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Contact Email</Text>
                <Text style={styles.contactVal}>
                  {profile?.email || 'e.martinez@university.edu'}
                </Text>
              </View>
            </View>

            <View style={styles.contactDivider} />

            <View style={styles.contactRow}>
              <View style={[styles.contactIconCircle, { backgroundColor: '#E8F8EF' }]}>
                <Feather name="award" size={14} color="#397052" />
              </View>
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Qualification</Text>
                <Text style={styles.contactVal}>
                  {profile?.qualification || 'PhD in Clinical Psychology, Stanford'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Office Hours ─────────────────────────────────────── */}
        <View style={[styles.sectionRow, { marginTop: 4 }]}>
          <View style={styles.sectionLeft}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#FDF1EC' }]}>
              <Feather name="clock" size={17} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>OFFICE HOURS</Text>
              <Text style={styles.sectionSub}>Your regular availability at the clinic</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.manageHoursBtn}
            onPress={() => navigation.navigate('Availability')}
          >
            <Text style={styles.manageHoursText}>Manage Hours</Text>
            <Feather name="chevron-right" size={12} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.hoursCard}>
          <View style={styles.hoursGrid}>
            {DAY_SHORT.map((short, i) => {
              const full  = DAY_FULL[i];
              const entry = dayMap[full];
              const isOpen   = entry?.active;
              const isWeekend = i >= 5;
              return (
                <View key={short} style={styles.hoursDayCol}>
                  <Text style={[styles.hoursDayName, isWeekend && { color: colors.primary }]}>
                    {short}
                  </Text>
                  {isOpen ? (
                    <>
                      <Text style={styles.hoursTime}>
                        {(entry.startTime || '9:00').replace(' AM', '').replace(' PM', '')}
                      </Text>
                      <Text style={styles.hoursDivText}>–</Text>
                      <Text style={styles.hoursTime}>
                        {(entry.endTime || '17:00').replace(' AM', '').replace(' PM', '')}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.hoursClosed}>Closed</Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Edit Profile Button ───────────────────────────────── */}
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => navigation.navigate('EditProfile')}
          accessibilityLabel="Edit Profile"
        >
          <Feather name="edit-2" size={16} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          <Feather name="chevron-right" size={16} color={colors.white} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────
const FOCUS_CARD_W = (width - spacing.md * 2 - spacing.sm) / 2;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // ── Top bar ──────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.creamBackground,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.darkText,
    lineHeight: 32,
  },
  pageSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  gearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Hero Card ────────────────────────────────────────────────
  heroCard: {
    backgroundColor: colors.softCoral,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  blobTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(232,131,107,0.18)',
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: 40,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(232,131,107,0.12)',
  },
  heroLeft: {
    flex: 1,
    zIndex: 1,
  },
  avatarWrap: {
    position: 'relative',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(232,131,107,0.25)',
    borderWidth: 3,
    borderColor: 'rgba(232,131,107,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primary,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkText,
    lineHeight: 26,
  },
  heroTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingNum: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.darkText,
  },
  ratingMeta: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  miniStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  miniStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  miniStatNum: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 20,
  },
  miniStatLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  miniStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  heroImageBox: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 110,
    alignItems: 'flex-end',
    zIndex: 2,
  },
  heroImageInner: {
    width: 100,
    height: 110,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  heroQuoteBox: {
    width: 100,
  },
  heroQuoteText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 15,
    textAlign: 'right',
  },
  availBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: spacing.md,
    marginTop: 4,
    zIndex: 1,
  },
  availBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },

  // ── Section header ────────────────────────────────────────────
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  sectionIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.darkText,
    letterSpacing: 0.6,
  },
  sectionSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  seeAll: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },

  // ── Focus Areas grid ─────────────────────────────────────────
  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  focusCard: {
    width: FOCUS_CARD_W,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  focusIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  focusLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.darkText,
    lineHeight: 18,
  },
  focusChevron: {
    flexShrink: 0,
  },

  // ── Office & Contact ──────────────────────────────────────────
  officeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.md,
    flexDirection: 'row',
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  buildingImgBox: {
    width: 130,
    backgroundColor: colors.softCoral,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
  },
  buildingImgInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buildingLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(61,44,46,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
    gap: 3,
  },
  buildingLabelText: {
    fontSize: 9,
    color: colors.white,
    fontWeight: '600',
    flex: 1,
  },
  contactDetails: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 6,
  },
  contactIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  contactVal: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkText,
    lineHeight: 16,
  },
  contactDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
    marginLeft: 38,
  },

  // ── Office Hours ─────────────────────────────────────────────
  manageHoursBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 2,
  },
  manageHoursText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  hoursCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: spacing.md,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  hoursGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hoursDayCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  hoursDayName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  hoursTime: {
    fontSize: 9,
    color: colors.darkText,
    fontWeight: '500',
    textAlign: 'center',
  },
  hoursDivText: {
    fontSize: 9,
    color: colors.textSecondary,
  },
  hoursClosed: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },

  // ── Edit Profile button ───────────────────────────────────────
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editProfileBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ProfileScreen;
