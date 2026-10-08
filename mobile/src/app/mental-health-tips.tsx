import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const CORAL = '#EF806B';
const CREAM = '#FFF9F3';
const DARK = '#4A3833';
const MUTED = '#8A7770';
const SOFT_TEXT = '#806F68';
const WHITE = '#FFFFFF';
const BORDER = '#F0E2DC';

/* =========================================================
   TIP DATA
========================================================= */

const TIPS = [
  {
    id: '3',
    iconType: 'break',
    title: 'Take a short break',
    description:
      'Give yourself a few minutes away from study or screen time to relax and reset.',
    category: 'Relaxation Technique',
    accent: '#DDEBD2',
    iconColor: '#7FA66D',
  },
  {
    id: '3',
    iconType: 'breathing',
    title: 'Practice deep breathing',
    description:
      'Take slow, deep breaths when you feel stressed or overwhelmed.',
    category: 'Relaxation Technique',
    accent: '#F8DED7',
    iconColor: CORAL,
  },
  {
    id: '2',
    iconType: 'water',
    title: 'Stay hydrated',
    description:
      'Drink enough water throughout the day to support your body and mind.',
    category: 'Self Care',
    accent: '#E2ECEC',
    iconColor: '#789A9A',
  },
  {
    id: '2',
    iconType: 'sleep',
    title: 'Get enough sleep',
    description:
      'A consistent sleep routine can help support your mood, focus and wellbeing.',
    category: 'Sleep & Recovery',
    accent: '#E7E0EC',
    iconColor: '#8C789D',
  },
  {
    id: '1',
    iconType: 'walk',
    title: 'Move your body',
    description:
      'A short walk or gentle physical activity can help you feel refreshed.',
    category: 'Stress & Wellbeing',
    accent: '#E6ECD9',
    iconColor: '#81965F',
  },
  {
    id: '6',
    iconType: 'support',
    title: 'Talk to someone',
    description:
      'If something is bothering you, consider talking with someone you trust.',
    category: 'Support & Connection',
    accent: '#F4DDD8',
    iconColor: '#C87E75',
  },
];

/* =========================================================
   UWELL LOGO
========================================================= */

function UWellLogo() {
  return (
    <View style={styles.logoCircle}>
      <View style={[styles.logoLeaf, styles.logoLeafLeft]} />
      <View style={[styles.logoLeaf, styles.logoLeafRight]} />

      <Text style={styles.logoHeart}>♡</Text>

      <View style={styles.logoStem} />
    </View>
  );
}

/* =========================================================
   BACK ICON
========================================================= */

function BackIcon() {
  return (
    <View style={styles.backIconWrap}>
      <Text style={styles.backArrow}>‹</Text>
    </View>
  );
}

/* =========================================================
   WELLBEING ICON
========================================================= */

function WellbeingIcon() {
  return (
    <View style={styles.wellbeingIcon}>
      <View style={styles.wellbeingLeafLeft} />
      <View style={styles.wellbeingLeafRight} />
      <View style={styles.wellbeingStem} />

      <View style={styles.wellbeingHeart}>
        <Text style={styles.wellbeingHeartText}>♡</Text>
      </View>
    </View>
  );
}

/* =========================================================
   TIP ICONS
========================================================= */

function TipIcon({
  type,
  color,
}: {
  type: string;
  color: string;
}) {
  if (type === 'break') {
    return (
      <View style={styles.iconIllustration}>
        <View
          style={[
            styles.pauseLine,
            { backgroundColor: color },
          ]}
        />
        <View
          style={[
            styles.pauseLine,
            { backgroundColor: color },
          ]}
        />
      </View>
    );
  }

  if (type === 'breathing') {
    return (
      <View style={styles.iconIllustration}>
        <View
          style={[
            styles.breathCircle,
            { borderColor: color },
          ]}
        />
        <View
          style={[
            styles.breathWaveOne,
            { borderColor: color },
          ]}
        />
        <View
          style={[
            styles.breathWaveTwo,
            { borderColor: color },
          ]}
        />
      </View>
    );
  }

  if (type === 'water') {
    return (
      <View style={styles.iconIllustration}>
        <View
          style={[
            styles.waterDrop,
            { backgroundColor: color },
          ]}
        />
        <View style={styles.waterShine} />
      </View>
    );
  }

  if (type === 'sleep') {
    return (
      <View style={styles.iconIllustration}>
        <View
          style={[
            styles.moon,
            { backgroundColor: color },
          ]}
        />
        <View style={styles.moonCutout} />
        <Text
          style={[
            styles.zText,
            { color },
          ]}
        >
          z
        </Text>
      </View>
    );
  }

  if (type === 'walk') {
    return (
      <View style={styles.iconIllustration}>
        <View
          style={[
            styles.walkHead,
            { backgroundColor: color },
          ]}
        />
        <View
          style={[
            styles.walkBody,
            { backgroundColor: color },
          ]}
        />
        <View
          style={[
            styles.walkLegLeft,
            { backgroundColor: color },
          ]}
        />
        <View
          style={[
            styles.walkLegRight,
            { backgroundColor: color },
          ]}
        />
      </View>
    );
  }

  return (
    <View style={styles.iconIllustration}>
      <View
        style={[
          styles.chatBubble,
          { borderColor: color },
        ]}
      />

      <View
        style={[
          styles.chatDotOne,
          { backgroundColor: color },
        ]}
      />

      <View
        style={[
          styles.chatDotTwo,
          { backgroundColor: color },
        ]}
      />

      <View
        style={[
          styles.chatDotThree,
          { backgroundColor: color },
        ]}
      />
    </View>
  );
}

/* =========================================================
   SUPPORT ICON
========================================================= */

function SupportIcon() {
  return (
    <View style={styles.supportIcon}>
      <View style={styles.supportPersonOne}>
        <View style={styles.supportHead} />
        <View style={styles.supportBody} />
      </View>

      <View style={styles.supportPersonTwo}>
        <View style={styles.supportHeadSmall} />
        <View style={styles.supportBodySmall} />
      </View>

      <View style={styles.supportHeart}>
        <Text style={styles.supportHeartText}>♡</Text>
      </View>
    </View>
  );
}

/* =========================================================
   ARROW
========================================================= */

function ArrowIcon() {
  return (
    <View style={styles.arrowCircle}>
      <Text style={styles.arrowText}>›</Text>
    </View>
  );
}

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function MentalHealthTipsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;
  const introScale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(introScale, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* =======================================================
     EXISTING RESOURCE NAVIGATION PRESERVED
  ======================================================= */

  const openResource = (
    id: string,
    title: string,
    category: string,
  ) => {
    router.push({
      pathname: '/resource-details',
      params: {
        id,
        title,
        category,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.headerRow}>

          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backPressed,
            ]}
            onPress={() => router.back()}
          >
            <BackIcon />

            <Text style={styles.backText}>
              Back
            </Text>
          </Pressable>

          <UWellLogo />

          <View style={styles.headerSpacer} />

        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          {/* =================================================
              TITLE
          ================================================= */}

          <Text style={styles.smallTitle}>
            WELLBEING
          </Text>

          <Text style={styles.title}>
            Mental Health Tips
          </Text>

          <Text style={styles.subtitle}>
            Simple ideas to support your mental wellbeing
            during your university journey.
          </Text>

          {/* =================================================
              INTRO CARD
          ================================================= */}

          <Animated.View
            style={[
              styles.introCard,
              {
                transform: [
                  {
                    scale: introScale,
                  },
                ],
              },
            ]}
          >
            <WellbeingIcon />

            <View style={styles.introContent}>

              <Text style={styles.introTitle}>
                Take care of yourself
              </Text>

              <Text style={styles.introText}>
                Small, healthy habits can make a positive
                difference in how you feel each day.
              </Text>

            </View>
          </Animated.View>

          {/* =================================================
              SECTION
          ================================================= */}

          <View style={styles.sectionHeader}>

            <Text style={styles.sectionTitle}>
              Helpful Tips
            </Text>

            <View style={styles.sectionLine} />

          </View>

          {/* =================================================
              TIP CARDS
          ================================================= */}

          {TIPS.map((tip, index) => (
            <AnimatedTipCard
              key={`${tip.title}-${index}`}
              tip={tip}
              index={index}
              onPress={() =>
                openResource(
                  tip.id,
                  tip.title,
                  tip.category,
                )
              }
            />
          ))}

          {/* =================================================
              COUNSELOR SUPPORT
          ================================================= */}

          <View style={styles.supportCard}>

            <SupportIcon />

            <View style={styles.supportContent}>

              <Text style={styles.supportTitle}>
                Need someone to talk to?
              </Text>

              <Text style={styles.supportText}>
                You can find a counselor and book a
                confidential counseling session through UWell.
              </Text>

              <Pressable
                style={({ pressed }) => [
                  styles.counselorButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() =>
                  router.push('/counselor-search')
                }
              >
                <Text style={styles.counselorText}>
                  Find a Counselor
                </Text>

                <ArrowIcon />
              </Pressable>

            </View>

          </View>

          {/* =================================================
              HOME BUTTON
          ================================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.homeButton,
              pressed && styles.homePressed,
            ]}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.homeButtonText}>
              Back to Home
            </Text>

            <Text style={styles.homeArrow}>
              ›
            </Text>
          </Pressable>

          <Text style={styles.footerText}>
            Be kind to yourself. Small steps matter.
          </Text>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =========================================================
   ANIMATED TIP CARD
========================================================= */

function AnimatedTipCard({
  tip,
  index,
  onPress,
}: {
  tip: (typeof TIPS)[number];
  index: number;
  onPress: () => void;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, index * 70);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [
          {
            translateY,
          },
        ],
      }}
    >
      <Pressable
        style={({ pressed }) => [
          styles.tipCard,
          pressed && styles.tipCardPressed,
        ]}
        onPress={onPress}
      >
        {/* ICON */}

        <View
          style={[
            styles.tipIconContainer,
            {
              backgroundColor: tip.accent,
            },
          ]}
        >
          <TipIcon
            type={tip.iconType}
            color={tip.iconColor}
          />
        </View>

        {/* CONTENT */}

        <View style={styles.tipContent}>

          <View style={styles.tipTitleRow}>

            <Text style={styles.tipTitle}>
              {tip.title}
            </Text>

            <Text style={styles.tipArrow}>
              ›
            </Text>

          </View>

          <Text style={styles.tipDescription}>
            {tip.description}
          </Text>

          <Text style={styles.readMore}>
            Read more
          </Text>

        </View>
      </Pressable>
    </Animated.View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: CREAM,
  },

  container: {
    paddingHorizontal: 22,
    paddingBottom: 32,
  },

  content: {
    flex: 1,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
    marginBottom: 20,
  },

  backButton: {
    width: 82,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backPressed: {
    opacity: 0.55,
  },

  backIconWrap: {
    width: 24,
    height: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  backArrow: {
    color: DARK,
    fontSize: 30,
    lineHeight: 30,
  },

  backText: {
    color: '#6F5E58',
    fontSize: 13,
    fontWeight: '500',
  },

  headerSpacer: {
    width: 82,
  },

  /* =======================================================
     UWELL LOGO
  ======================================================= */

  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

    shadowColor: CORAL,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  logoLeaf: {
    position: 'absolute',
    width: 9,
    height: 17,
    backgroundColor: WHITE,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 2,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 9,
  },

  logoLeafLeft: {
    transform: [{ rotate: '-38deg' }],
    left: 13,
    top: 13,
  },

  logoLeafRight: {
    transform: [{ rotate: '38deg' }],
    right: 13,
    top: 13,
  },

  logoHeart: {
    position: 'absolute',
    color: CORAL,
    fontSize: 14,
    fontWeight: '700',
    top: 16,
    zIndex: 5,
  },

  logoStem: {
    position: 'absolute',
    width: 2,
    height: 11,
    backgroundColor: WHITE,
    bottom: 10,
    borderRadius: 2,
  },

  /* =======================================================
     TITLE
  ======================================================= */

  smallTitle: {
    color: CORAL,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 7,
  },

  title: {
    color: DARK,
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },

  /* =======================================================
     INTRO CARD
  ======================================================= */

  introCard: {
    backgroundColor: '#F8E1DA',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F2D5CE',

    shadowColor: '#C9AFA7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 9,
    elevation: 1,
  },

  wellbeingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDEBD2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    position: 'relative',
  },

  wellbeingLeafLeft: {
    position: 'absolute',
    width: 10,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#7FA66D',
    left: 13,
    top: 11,
    transform: [{ rotate: '-35deg' }],
  },

  wellbeingLeafRight: {
    position: 'absolute',
    width: 10,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#9CB985',
    right: 12,
    top: 11,
    transform: [{ rotate: '35deg' }],
  },

  wellbeingStem: {
    position: 'absolute',
    width: 2,
    height: 19,
    backgroundColor: '#6E8E60',
    bottom: 8,
    borderRadius: 2,
  },

  wellbeingHeart: {
    position: 'absolute',
    top: 15,
  },

  wellbeingHeartText: {
    color: CORAL,
    fontSize: 13,
    fontWeight: '800',
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },

  introText: {
    color: '#765F58',
    fontSize: 11,
    lineHeight: 17,
  },

  /* =======================================================
     SECTION
  ======================================================= */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    color: DARK,
    fontSize: 18,
    fontWeight: '700',
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEDFD8',
    marginLeft: 12,
    marginTop: 5,
  },

  /* =======================================================
     TIP CARD
  ======================================================= */

  tipCard: {
    backgroundColor: WHITE,
    borderRadius: 19,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 11,

    shadowColor: '#C9B5AE',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.045,
    shadowRadius: 8,
    elevation: 1,
  },

  tipCardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },

  tipIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  iconIllustration: {
    width: 30,
    height: 30,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* BREAK */

  pauseLine: {
    width: 5,
    height: 18,
    borderRadius: 3,
    marginHorizontal: 2.5,
  },

  /* BREATHING */

  breathCircle: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
  },

  breathWaveOne: {
    position: 'absolute',
    width: 22,
    height: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '25deg' }],
    opacity: 0.75,
  },

  breathWaveTwo: {
    position: 'absolute',
    width: 28,
    height: 18,
    borderRadius: 15,
    borderWidth: 1.5,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '25deg' }],
    opacity: 0.45,
  },

  /* WATER */

  waterDrop: {
    width: 18,
    height: 23,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    transform: [{ rotate: '45deg' }],
  },

  waterShine: {
    position: 'absolute',
    width: 4,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.65)',
    left: 10,
    top: 7,
  },

  /* SLEEP */

  moon: {
    width: 21,
    height: 21,
    borderRadius: 11,
  },

  moonCutout: {
    position: 'absolute',
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: '#E7E0EC',
    top: 2,
    left: 7,
  },

  zText: {
    position: 'absolute',
    fontSize: 11,
    fontWeight: '800',
    top: 0,
    right: 0,
  },

  /* WALK */

  walkHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 2,
    left: 13,
  },

  walkBody: {
    width: 6,
    height: 13,
    borderRadius: 4,
    position: 'absolute',
    top: 10,
    left: 14,
    transform: [{ rotate: '-12deg' }],
  },

  walkLegLeft: {
    width: 4,
    height: 12,
    borderRadius: 3,
    position: 'absolute',
    top: 20,
    left: 11,
    transform: [{ rotate: '28deg' }],
  },

  walkLegRight: {
    width: 4,
    height: 12,
    borderRadius: 3,
    position: 'absolute',
    top: 20,
    left: 18,
    transform: [{ rotate: '-30deg' }],
  },

  /* SUPPORT */

  chatBubble: {
    width: 25,
    height: 18,
    borderWidth: 2,
    borderRadius: 9,
  },

  chatDotOne: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    left: 8,
    top: 13,
  },

  chatDotTwo: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    left: 13,
    top: 13,
  },

  chatDotThree: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    left: 18,
    top: 13,
  },

  tipContent: {
    flex: 1,
  },

  tipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  tipTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    paddingRight: 8,
  },

  tipArrow: {
    color: '#C4A9A1',
    fontSize: 22,
    lineHeight: 22,
  },

  tipDescription: {
    color: SOFT_TEXT,
    fontSize: 11,
    lineHeight: 17,
  },

  readMore: {
    color: CORAL,
    fontSize: 10.5,
    fontWeight: '800',
    marginTop: 6,
  },

  /* =======================================================
     SUPPORT CARD
  ======================================================= */

  supportCard: {
    backgroundColor: '#F4EEE8',
    borderRadius: 21,
    padding: 16,
    flexDirection: 'row',
    marginTop: 9,
    borderWidth: 1,
    borderColor: '#EEE2DB',
  },

  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDEBD2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },

  supportPersonOne: {
    position: 'absolute',
    left: 10,
    bottom: 9,
  },

  supportPersonTwo: {
    position: 'absolute',
    right: 9,
    bottom: 9,
  },

  supportHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7FA66D',
    marginBottom: 2,
  },

  supportBody: {
    width: 14,
    height: 9,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#7FA66D',
  },

  supportHeadSmall: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CB985',
    marginBottom: 2,
  },

  supportBodySmall: {
    width: 11,
    height: 8,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    backgroundColor: '#9CB985',
  },

  supportHeart: {
    position: 'absolute',
    top: 5,
    right: 5,
  },

  supportHeartText: {
    color: CORAL,
    fontSize: 11,
    fontWeight: '800',
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    color: DARK,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },

  supportText: {
    color: SOFT_TEXT,
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 12,
  },

  counselorButton: {
    height: 42,
    backgroundColor: CORAL,
    borderRadius: 21,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: CORAL,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 2,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  counselorText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '800',
  },

  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  arrowText: {
    color: WHITE,
    fontSize: 20,
    lineHeight: 20,
    marginTop: -2,
  },

  /* =======================================================
     HOME BUTTON
  ======================================================= */

  homeButton: {
    height: 48,
    backgroundColor: WHITE,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },

  homePressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },

  homeButtonText: {
    color: CORAL,
    fontSize: 13,
    fontWeight: '800',
  },

  homeArrow: {
    color: CORAL,
    fontSize: 22,
    lineHeight: 22,
    marginLeft: 8,
    marginTop: -2,
  },

  footerText: {
    color: '#A18F88',
    fontSize: 10.5,
    textAlign: 'center',
    marginTop: 13,
  },
});