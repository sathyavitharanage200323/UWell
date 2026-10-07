/**
 * ClinicalFocusAreasScreen
 * Dedicated full-screen list of the four clinical support areas.
 * Staggered entrance animation, pressable cards, floating illustration.
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
  AccessibilityInfo,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { initialClinicalFocusAreas } from '../../data/counselorMockData';

const { width } = Dimensions.get('window');
const CARD_W = (width - spacing.md * 2 - spacing.sm) / 2;

// ─── Tiny helper: render the right icon lib ──────────────────────────────────
const AreaIcon = ({ lib, name, size, color }) => {
  if (lib === 'MaterialCommunityIcons') return <MaterialCommunityIcons name={name} size={size} color={color} />;
  if (lib === 'Feather')               return <Feather name={name} size={size} color={color} />;
  return                                      <Ionicons  name={name} size={size} color={color} />;
};

// ─── Animated focus card ─────────────────────────────────────────────────────
const FocusCard = ({ area, entranceAnim, onPress }) => {
  const pressAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 2,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 3,
    }).start();
  };

  const cardStyle = {
    opacity:   entranceAnim,
    transform: [
      {
        translateY: entranceAnim.interpolate({
          inputRange:  [0, 1],
          outputRange: [20, 0],
        }),
      },
      { scale: pressAnim },
    ],
  };

  return (
    <Animated.View style={[styles.card, { backgroundColor: area.cardColor }, cardStyle]}>
      <TouchableOpacity
        style={styles.cardInner}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`${area.key}. ${area.description}`}
      >
        {/* Large icon circle */}
        <View style={[styles.cardIconCircle, { backgroundColor: `${area.accentColor}18` }]}>
          <AreaIcon lib={area.iconLib} name={area.iconName} size={30} color={area.accentColor} />
        </View>

        {/* Title */}
        <Text style={[styles.cardTitle, { color: colors.darkText }]}>{area.key}</Text>

        {/* Description */}
        <Text style={styles.cardDesc} numberOfLines={3}>{area.description}</Text>

        {/* Arrow button */}
        <View style={[styles.arrowBtn, { backgroundColor: area.accentColor }]}>
          <Feather name="arrow-right" size={14} color={colors.white} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Decorative illustration (no external assets) ────────────────────────────
const HeroIllustration = ({ floatAnim }) => (
  <Animated.View
    style={[styles.illustWrap, { transform: [{ translateY: floatAnim }] }]}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  >
    {/* Soft blob */}
    <View style={styles.illustBlob} />

    {/* Clipboard body */}
    <View style={styles.illustClipboard}>
      <View style={styles.illustClipboardTop} />
      <View style={styles.illustClipboardBody}>
        {/* Mini line items */}
        {[70, 55, 70, 45].map((w, i) => (
          <View
            key={i}
            style={[
              styles.illustLine,
              { width: `${w}%`, backgroundColor: i === 0 ? colors.primary : colors.border },
            ]}
          />
        ))}
        <View style={[styles.illustCheckRow]}>
          <Feather name="check-circle" size={11} color={colors.primary} />
          <View style={[styles.illustLine, { width: '60%', marginBottom: 0 }]} />
        </View>
      </View>
    </View>

    {/* Small calendar badge */}
    <View style={styles.illustCalBadge}>
      <Ionicons name="calendar-outline" size={18} color={colors.primary} />
    </View>

    {/* Green dot accent */}
    <View style={styles.illustGreenDot} />
    <View style={styles.illustPinkDot} />
  </Animated.View>
);

// ─── Main screen ─────────────────────────────────────────────────────────────
const ClinicalFocusAreasScreen = ({ navigation }) => {
  // Header fade + slide
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-12)).current;

  // Illustration fade
  const illustFade = useRef(new Animated.Value(0)).current;

  // Floating animation for illustration
  const floatAnim = useRef(new Animated.Value(0)).current;

  // One entrance Animated.Value per card
  const cardAnims = useRef(
    initialClinicalFocusAreas.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Respect reduce-motion preference
    AccessibilityInfo.isReduceMotionEnabled().then(reduceMotion => {
      if (reduceMotion) {
        // Jump straight to end state
        headerFade.setValue(1);
        headerSlide.setValue(0);
        illustFade.setValue(1);
        cardAnims.forEach(a => a.setValue(1));
        return;
      }

      // Header: fade + slide up
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
        Animated.timing(headerSlide, {
          toValue: 0, duration: 400, useNativeDriver: true,
        }),
      ]).start();

      // Illustration fade
      Animated.timing(illustFade, {
        toValue: 1, duration: 500, delay: 100, useNativeDriver: true,
      }).start();

      // Cards: staggered entrance, 100/180/260/340ms delays
      const delays = [100, 180, 260, 340];
      cardAnims.forEach((anim, i) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 380,
          delay: delays[i],
          useNativeDriver: true,
        }).start();
      });

      // Floating loop for illustration
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -5, duration: 2000, useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0, duration: 2000, useNativeDriver: true,
          }),
        ])
      ).start();
    });

    return () => {
      floatAnim.stopAnimation();
    };
  }, []);

  const handleCardPress = (area) => {
    navigation.navigate('FocusAreaDetail', { area });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />

      {/* ── Top nav bar ──────────────────────────────────────── */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="chevron-left" size={22} color={colors.darkText} />
        </TouchableOpacity>

        <Text style={styles.navLabel}>SUPPORT AREAS</Text>

        <TouchableOpacity
          style={styles.bellBtn}
          accessibilityLabel="Notifications"
        >
          <Feather name="bell" size={19} color={colors.primary} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero section ─────────────────────────────────────── */}
        <View style={styles.heroRow}>
          {/* Text column */}
          <Animated.View
            style={[
              styles.heroText,
              {
                opacity: headerFade,
                transform: [{ translateY: headerSlide }],
              },
            ]}
          >
            <Text style={styles.heroTitle}>Clinical Focus{'\n'}Areas</Text>
            <Text style={styles.heroSub}>
              Key areas I support students with.{'\n'}Tap to learn more or book a session.
            </Text>
          </Animated.View>

          {/* Illustration column */}
          <Animated.View style={{ opacity: illustFade }}>
            <HeroIllustration floatAnim={floatAnim} />
          </Animated.View>
        </View>

        {/* ── Card grid ────────────────────────────────────────── */}
        <View style={styles.grid}>
          {initialClinicalFocusAreas.map((area, i) => (
            <FocusCard
              key={area.id}
              area={area}
              entranceAnim={cardAnims[i]}
              onPress={() => handleCardPress(area)}
            />
          ))}
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // ── Nav bar ──────────────────────────────────────────────────
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
  navLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1.2,
  },
  bellBtn: {
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
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  // ── Hero ─────────────────────────────────────────────────────
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.darkText,
    lineHeight: 32,
    marginBottom: spacing.sm,
  },
  heroSub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 19,
  },

  // ── Illustration ─────────────────────────────────────────────
  illustWrap: {
    width: 110,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  illustBlob: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.softCoral,
    top: 10,
    right: 0,
  },
  illustClipboard: {
    width: 68,
    height: 82,
    borderRadius: 12,
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
  },
  illustClipboardTop: {
    height: 16,
    backgroundColor: colors.primary,
  },
  illustClipboardBody: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
    gap: 4,
  },
  illustLine: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: 4,
  },
  illustCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  illustCalBadge: {
    position: 'absolute',
    bottom: 4,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 3,
  },
  illustGreenDot: {
    position: 'absolute',
    top: 8,
    left: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(80,200,120,0.4)',
    zIndex: 1,
  },
  illustPinkDot: {
    position: 'absolute',
    bottom: 20,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(232,131,107,0.5)',
    zIndex: 1,
  },

  // ── Card grid ────────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: CARD_W,
    borderRadius: 24,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  cardInner: {
    padding: spacing.md,
    minHeight: 190,
    justifyContent: 'flex-start',
  },
  cardIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  cardDesc: {
    fontSize: typography.fontSize.xs + 1,
    color: colors.textSecondary,
    lineHeight: 17,
    flex: 1,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    alignSelf: 'flex-end',
  },
});

export default ClinicalFocusAreasScreen;
