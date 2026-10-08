/**
 * FocusAreaDetailScreen
 * Reusable detail view for any clinical focus area.
 * Receives route.params.area — an object from initialClinicalFocusAreas.
 */
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

const { width } = Dimensions.get('window');

// ─── Render the right icon library ──────────────────────────────────────────
const AreaIcon = ({ lib, name, size, color }) => {
  if (lib === 'MaterialCommunityIcons') return <MaterialCommunityIcons name={name} size={size} color={color} />;
  if (lib === 'Feather')               return <Feather name={name} size={size} color={color} />;
  return                                      <Ionicons  name={name} size={size} color={color} />;
};

// ─── "How we can help" list item ─────────────────────────────────────────────
const HelpItem = ({ text, accentColor, anim }) => (
  <Animated.View style={[styles.helpRow, { opacity: anim }]}>
    <View style={[styles.helpDot, { backgroundColor: `${accentColor}22` }]}>
      <Feather name="check" size={12} color={accentColor} />
    </View>
    <Text style={styles.helpText}>{text}</Text>
  </Animated.View>
);

// ─── "Common experiences" pill tag ───────────────────────────────────────────
const ExpPill = ({ text, anim }) => (
  <Animated.View style={[styles.expPill, { opacity: anim }]}>
    <Text style={styles.expPillText}>{text}</Text>
  </Animated.View>
);

// ─── Main screen ─────────────────────────────────────────────────────────────
const FocusAreaDetailScreen = ({ route, navigation }) => {
  const area = route.params?.area ?? {
    key: 'Clinical Area',
    subtitle: '',
    description: '',
    cardColor: colors.softCoral,
    iconLib: 'Ionicons',
    iconName: 'medical-outline',
    accentColor: colors.primary,
    howWeCanHelp: [],
    commonExperiences: [],
  };

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // One animated value per help item + per exp pill (staggered)
  const helpAnims = useRef(
    (area.howWeCanHelp || []).map(() => new Animated.Value(0))
  ).current;
  const expAnims = useRef(
    (area.commonExperiences || []).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(reduceMotion => {
      if (reduceMotion) {
        fadeAnim.setValue(1);
        slideAnim.setValue(0);
        helpAnims.forEach(a => a.setValue(1));
        expAnims.forEach(a => a.setValue(1));
        return;
      }

      // Header + hero fade/slide
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]).start();

      // Staggered help items
      helpAnims.forEach((anim, i) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 340,
          delay: 200 + i * 70,
          useNativeDriver: true,
        }).start();
      });

      // Staggered exp pills
      expAnims.forEach((anim, i) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: 400 + i * 60,
          useNativeDriver: true,
        }).start();
      });

      // Gentle floating loop on icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, { toValue: -4, duration: 1800, useNativeDriver: true }),
          Animated.timing(floatAnim, { toValue:  0, duration: 1800, useNativeDriver: true }),
        ])
      ).start();
    });

    return () => floatAnim.stopAnimation();
  }, []);

  const handleMessage = () => {
    navigation.navigate('Messages');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />

      {/* ── Nav bar ─────────────────────────────────────────────── */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="chevron-left" size={22} color={colors.darkText} />
        </TouchableOpacity>

        <Text style={styles.navTitle} numberOfLines={1}>{area.key}</Text>

        <TouchableOpacity
          style={styles.bookmarkBtn}
          accessibilityLabel="Save area"
        >
          <Feather name="bookmark" size={19} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Scrollable body — paddingBottom leaves room for the sticky bottom bar */}
      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero band ────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.heroBand,
            { backgroundColor: area.cardColor, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Floating icon */}
          <Animated.View
            style={[styles.heroIconCircle, { transform: [{ translateY: floatAnim }] }]}
          >
            <View style={[styles.heroIconInner, { backgroundColor: `${area.accentColor}1A` }]}>
              <AreaIcon lib={area.iconLib} name={area.iconName} size={40} color={area.accentColor} />
            </View>
          </Animated.View>

          <Text style={[styles.heroTitle, { color: colors.darkText }]}>{area.key}</Text>
          <Text style={styles.heroSubtitle}>{area.subtitle}</Text>

          {/* Decorative dots */}
          <View style={[styles.decoDot, { top: 12, right: 18, width: 14, height: 14, borderRadius: 7 }]} />
          <View style={[styles.decoDot, { bottom: 16, left: 16, width: 9, height: 9, borderRadius: 5, backgroundColor: 'rgba(80,200,120,0.3)' }]} />
        </Animated.View>

        {/* ── How we can help ──────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: area.accentColor }]} />
            <Text style={styles.sectionTitle}>How we can help</Text>
          </View>

          <View style={styles.helpList}>
            {(area.howWeCanHelp || []).map((item, i) => (
              <HelpItem
                key={i}
                text={item}
                accentColor={area.accentColor}
                anim={helpAnims[i] ?? new Animated.Value(1)}
              />
            ))}
          </View>
        </View>

        {/* ── Divider ──────────────────────────────────────────── */}
        <View style={styles.divider} />

        {/* ── Common experiences ──────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionDot, { backgroundColor: area.accentColor }]} />
            <Text style={styles.sectionTitle}>Common experiences</Text>
          </View>

          <View style={styles.expPillsWrap}>
            {(area.commonExperiences || []).map((item, i) => (
              <ExpPill
                key={i}
                text={item}
                anim={expAnims[i] ?? new Animated.Value(1)}
              />
            ))}
          </View>
        </View>

        {/* Extra space so content isn't hidden under sticky bar */}
        <View style={{ height: 110 }} />
      </Animated.ScrollView>

      {/* ── Sticky bottom action bar ─────────────────────────── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          {/* Secondary — Message */}
          <TouchableOpacity
            style={[styles.msgBtn, { borderColor: area.accentColor }]}
            onPress={handleMessage}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Message the clinician"
          >
            <Feather name="message-circle" size={16} color={area.accentColor} style={{ marginRight: 8 }} />
            <Text style={[styles.msgBtnText, { color: area.accentColor }]}>Message Clinician</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },

  // ── Nav ──────────────────────────────────────────────────────
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.creamBackground,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  navTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    color: colors.darkText,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.xs,
  },
  bookmarkBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Hero band ────────────────────────────────────────────────
  heroBand: {
    marginHorizontal: spacing.md,
    borderRadius: 24,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  heroIconCircle: {
    marginBottom: spacing.md,
  },
  heroIconInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: spacing.sm,
  },
  decoDot: {
    position: 'absolute',
    backgroundColor: 'rgba(232,131,107,0.25)',
  },

  // ── Section ──────────────────────────────────────────────────
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  sectionDot: {
    width: 4,
    height: 18,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.darkText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },

  // ── Help list ────────────────────────────────────────────────
  helpList: {
    gap: spacing.sm,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  helpDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  helpText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.darkText,
    lineHeight: 22,
  },

  // ── Experience pills ─────────────────────────────────────────
  expPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  expPill: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  expPillText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // ── Sticky bottom bar ─────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 24,
    paddingTop: spacing.sm,
  },
  bottomBarInner: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: '700',
  },
  msgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 13,
    borderWidth: 1.5,
    backgroundColor: colors.white,
  },
  msgBtnText: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
  },
});

export default FocusAreaDetailScreen;
