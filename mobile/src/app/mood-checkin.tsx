import React, { useEffect, useRef, useState } from 'react';
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
const MUTED = '#806E68';
const WHITE = '#FFFFFF';
const BORDER = '#F0E2DC';

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
    <View style={styles.backIcon}>
      <View style={styles.backLine} />
      <View style={styles.backArrowTop} />
      <View style={styles.backArrowBottom} />
    </View>
  );
}

/* =========================================================
   3D ANIME MOOD CHARACTER
   UWell CALM COLOR PALETTE
========================================================= */

function MoodCharacter({
  mood,
  selected,
}: {
  mood: string;
  selected: boolean;
}) {
  let main = '#AFCF9B';
  let light = '#DDEBD2';
  let shadow = '#7FA66D';
  let facial = '#55714B';

  /* VERY GOOD - Soft Sage */

  if (mood === 'Very Good') {
    main = '#AFCF9B';
    light = '#DDEBD2';
    shadow = '#7FA66D';
    facial = '#55714B';
  }

  /* GOOD - Light Sage */

  if (mood === 'Good') {
    main = '#C7DDB0';
    light = '#E7F0DC';
    shadow = '#9CB985';
    facial = '#617652';
  }

  /* OKAY - Warm Taupe */

  if (mood === 'Okay') {
    main = '#D8C7BE';
    light = '#F0E3DD';
    shadow = '#B49D94';
    facial = '#76625A';
  }

  /* LOW - Soft Coral */

  if (mood === 'Low') {
    main = '#E6A9A0';
    light = '#F6D1CA';
    shadow = '#C87E75';
    facial = '#82534E';
  }

  /* VERY LOW - Deeper Soft Coral */

  if (mood === 'Very Low') {
    main = '#D98F87';
    light = '#EDBBB4';
    shadow = '#B66D67';
    facial = '#754844';
  }

  return (
    <View
      style={[
        styles.characterArea,
        selected && styles.characterAreaSelected,
      ]}
    >

      {/* Soft glow */}

      <View
        style={[
          styles.characterGlow,
          {
            backgroundColor: light,
            opacity: selected ? 0.42 : 0.25,
          },
        ]}
      />

      {/* Ground shadow */}

      <View
        style={[
          styles.characterShadow,
          {
            backgroundColor: shadow,
          },
        ]}
      />

      {/* Main 3D face */}

      <View
        style={[
          styles.character,
          {
            backgroundColor: main,
            shadowColor: shadow,
          },
        ]}
      >

        {/* Large soft 3D highlight */}

        <View
          style={[
            styles.bigHighlight,
            {
              backgroundColor: light,
            },
          ]}
        />

        {/* Tiny glossy highlight */}

        <View style={styles.glossyDot} />

        {/* Left eye */}

        <View style={styles.eyeLeft}>
          <View style={styles.eyePupil}>
            <View style={styles.eyeShineLarge} />
            <View style={styles.eyeShineSmall} />
          </View>
        </View>

        {/* Right eye */}

        <View style={styles.eyeRight}>
          <View style={styles.eyePupil}>
            <View style={styles.eyeShineLarge} />
            <View style={styles.eyeShineSmall} />
          </View>
        </View>

        {/* Eyebrows */}

        {mood === 'Very Good' ? (
          <>
            <View
              style={[
                styles.browHappyLeft,
                { borderColor: facial },
              ]}
            />

            <View
              style={[
                styles.browHappyRight,
                { borderColor: facial },
              ]}
            />
          </>
        ) : mood === 'Low' || mood === 'Very Low' ? (
          <>
            <View
              style={[
                styles.browSadLeft,
                { backgroundColor: facial },
              ]}
            />

            <View
              style={[
                styles.browSadRight,
                { backgroundColor: facial },
              ]}
            />
          </>
        ) : (
          <>
            <View
              style={[
                styles.browNormalLeft,
                { backgroundColor: facial },
              ]}
            />

            <View
              style={[
                styles.browNormalRight,
                { backgroundColor: facial },
              ]}
            />
          </>
        )}

        {/* Cheeks */}

        <View
          style={[
            styles.cheekLeft,
            {
              backgroundColor:
                mood === 'Very Good' || mood === 'Good'
                  ? '#DCE9DF'
                  : mood === 'Okay'
                  ? '#E9DAD4'
                  : '#F3C4BC',
            },
          ]}
        />

        <View
          style={[
            styles.cheekRight,
            {
              backgroundColor:
                mood === 'Very Good' || mood === 'Good'
                  ? '#DCE9DF'
                  : mood === 'Okay'
                  ? '#E9DAD4'
                  : '#F3C4BC',
            },
          ]}
        />

        {/* Mouth */}

        {mood === 'Very Good' ? (
          <View
            style={[
              styles.happyMouth,
              { borderColor: facial },
            ]}
          />
        ) : mood === 'Good' ? (
          <View
            style={[
              styles.goodMouth,
              { borderColor: facial },
            ]}
          />
        ) : mood === 'Okay' ? (
          <View
            style={[
              styles.neutralMouth,
              { backgroundColor: facial },
            ]}
          />
        ) : (
          <View
            style={[
              styles.sadMouth,
              { borderColor: facial },
            ]}
          />
        )}

      </View>

      {/* Floating sparkles */}

      <View
        style={[
          styles.sparkle,
          styles.sparkleOne,
          { backgroundColor: light },
        ]}
      />

      <View
        style={[
          styles.sparkle,
          styles.sparkleTwo,
          { backgroundColor: light },
        ]}
      />

    </View>
  );
}

/* =========================================================
   CHECK ICON
========================================================= */

function CheckIcon() {
  return (
    <View style={styles.checkCircle}>
      <View style={styles.checkOne} />
      <View style={styles.checkTwo} />
    </View>
  );
}

/* =========================================================
   PRIVACY ICON
========================================================= */

function PrivacyIcon() {
  return (
    <View style={styles.privacyIcon}>
      <Text style={styles.privacyHeart}>♡</Text>
    </View>
  );
}

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function MoodCheckInScreen() {
  const [selectedMood, setSelectedMood] =
    useState<string | null>(null);

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const slideAnim = useRef(
    new Animated.Value(15)
  ).current;

  const logoScale = useRef(
    new Animated.Value(0.9)
  ).current;

  const moods = [
    { label: 'Very Good' },
    { label: 'Good' },
    { label: 'Okay' },
    { label: 'Low' },
    { label: 'Very Low' },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (selectedMood) {
      router.push({
        pathname: '/checkin-result',
        params: {
          mood: selectedMood,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View
        style={[
          styles.screen,
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >

          {/* HEADER */}

          <View style={styles.header}>

            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
              onPress={() => router.back()}
            >
              <BackIcon />
            </Pressable>

            <Animated.View
              style={{
                transform: [
                  {
                    scale: logoScale,
                  },
                ],
              }}
            >
              <UWellLogo />
            </Animated.View>

            <View style={styles.headerSpacer} />

          </View>

          {/* TITLE */}

          <View style={styles.titleSection}>

            <Text style={styles.smallTitle}>
              DAILY CHECK-IN
            </Text>

            <Text style={styles.title}>
              How are you feeling today?
            </Text>

            <Text style={styles.subtitle}>
              Take a moment to check in with yourself.
              {'\n'}
              There are no right or wrong answers.
            </Text>

          </View>

          {/* PROGRESS */}

          <View style={styles.progressSection}>

            <View style={styles.progressHeader}>

              <Text style={styles.progressLabel}>
                Your wellbeing check
              </Text>

              <Text style={styles.progressCount}>
                {selectedMood ? '1 of 1' : '0 of 1'}
              </Text>

            </View>

            <View style={styles.progressTrack}>

              <View
                style={[
                  styles.progressFill,
                  {
                    width: selectedMood
                      ? '100%'
                      : '0%',
                  },
                ]}
              />

            </View>

            <Text style={styles.progressHint}>
              {selectedMood
                ? 'Mood selected'
                : 'Choose one option below'}
            </Text>

          </View>

          {/* PRIVATE SPACE */}

          <View style={styles.privacyCard}>

            <PrivacyIcon />

            <View style={styles.privacyContent}>

              <Text style={styles.privacyTitle}>
                A private space for you
              </Text>

              <Text style={styles.privacyText}>
                Your response helps UWell provide
                relevant wellbeing support.
              </Text>

            </View>

          </View>

          {/* QUESTION CARD */}

          <View style={styles.card}>

            <View style={styles.questionHeader}>

              <View style={styles.questionNumber}>
                <Text style={styles.questionNumberText}>
                  01
                </Text>
              </View>

              <Text style={styles.questionStep}>
                1 / 1
              </Text>

            </View>

            <Text style={styles.question}>
              How have you been feeling recently?
            </Text>

            <Text style={styles.questionHint}>
              Choose the option that best describes
              how you feel right now.
            </Text>

            {/* MOOD OPTIONS */}

            <View style={styles.moodContainer}>

              {moods.map((mood) => {

                const isSelected =
                  selectedMood === mood.label;

                return (
                  <Pressable
                    key={mood.label}
                    style={({ pressed }) => [
                      styles.moodButton,
                      isSelected &&
                        styles.selectedMood,
                      pressed &&
                        styles.moodPressed,
                    ]}
                    onPress={() =>
                      setSelectedMood(mood.label)
                    }
                  >

                    <View style={styles.characterWrapper}>

                      <MoodCharacter
                        mood={mood.label}
                        selected={isSelected}
                      />

                    </View>

                    <Text
                      style={[
                        styles.moodLabel,
                        isSelected &&
                          styles.selectedMoodLabel,
                      ]}
                    >
                      {mood.label}
                    </Text>

                    {isSelected && (
                      <CheckIcon />
                    )}

                  </Pressable>
                );
              })}

            </View>

          </View>

          {/* ENCOURAGEMENT */}

          <View style={styles.encouragement}>

            <View style={styles.encouragementIcon}>

              <Text style={styles.encouragementHeart}>
                ♡
              </Text>

            </View>

            <View style={styles.encouragementContent}>

              <Text style={styles.encouragementTitle}>
                Remember
              </Text>

              <Text style={styles.encouragementText}>
                There is no right or wrong answer.
                This check-in is simply a moment for you.
              </Text>

            </View>

          </View>

          {/* CONTINUE */}

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              !selectedMood &&
                styles.disabledButton,
              pressed &&
                selectedMood &&
                styles.continuePressed,
            ]}
            disabled={!selectedMood}
            onPress={handleContinue}
          >

            <Text style={styles.continueText}>
              View My Result
            </Text>

            <View style={styles.arrowCircle}>

              <Text style={styles.arrow}>
                ›
              </Text>

            </View>

          </Pressable>

          <Text style={styles.footerText}>
            Your wellbeing journey starts with a small moment.
          </Text>

        </ScrollView>

      </Animated.View>
    </SafeAreaView>
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

  screen: {
    flex: 1,
    backgroundColor: CREAM,
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  /* HEADER */

  header: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerSpacer: {
    width: 42,
  },

  backIcon: {
    width: 19,
    height: 19,
    position: 'relative',
  },

  backLine: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: DARK,
    borderRadius: 2,
    left: 2,
    top: 9,
  },

  backArrowTop: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: DARK,
    borderRadius: 2,
    left: 1,
    top: 6,
    transform: [{ rotate: '-42deg' }],
  },

  backArrowBottom: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: DARK,
    borderRadius: 2,
    left: 1,
    top: 12,
    transform: [{ rotate: '42deg' }],
  },

  /* UWELL LOGO */

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

  /* TITLE */

  titleSection: {
    marginTop: 7,
  },

  smallTitle: {
    color: CORAL,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 7,
  },

  title: {
    color: DARK,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.4,
  },

  subtitle: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },

  /* PROGRESS */

  progressSection: {
    marginTop: 18,
    marginBottom: 13,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  progressLabel: {
    color: '#78645D',
    fontSize: 10,
    fontWeight: '600',
  },

  progressCount: {
    color: '#8B7770',
    fontSize: 10,
    fontWeight: '600',
  },

  progressTrack: {
    height: 5,
    backgroundColor: '#F0DDD6',
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: 5,
    backgroundColor: CORAL,
    borderRadius: 5,
  },

  progressHint: {
    color: '#A18E87',
    fontSize: 9,
    marginTop: 4,
  },

  /* PRIVACY */

  privacyCard: {
    backgroundColor: '#FFF0EB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F4D9D1',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  privacyIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  privacyHeart: {
    color: WHITE,
    fontSize: 22,
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    color: DARK,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },

  privacyText: {
    color: '#806F68',
    fontSize: 10,
    lineHeight: 14,
  },

  /* QUESTION CARD */

  card: {
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 13,
  },

  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  questionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  questionNumberText: {
    color: CORAL,
    fontSize: 10,
    fontWeight: '700',
  },

  questionStep: {
    color: '#99857E',
    fontSize: 10,
    fontWeight: '600',
  },

  question: {
    color: DARK,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
  },

  questionHint: {
    color: '#96837C',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
    marginBottom: 12,
  },

  /* MOOD BUTTON */

  moodContainer: {
    gap: 7,
  },

  moodButton: {
    minHeight: 64,
    borderWidth: 1,
    borderColor: '#E8DDD7',
    borderRadius: 16,
    backgroundColor: '#FFFDFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  selectedMood: {
    backgroundColor: '#FFF1EC',
    borderColor: CORAL,
    borderWidth: 1.5,
  },

  moodPressed: {
    transform: [{ scale: 0.985 }],
  },

  /* CHARACTER */

  characterWrapper: {
    width: 72,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  characterArea: {
    width: 67,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  characterAreaSelected: {
    transform: [{ scale: 1.06 }],
  },

  characterGlow: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
  },

  characterShadow: {
    position: 'absolute',
    width: 38,
    height: 6,
    borderRadius: 10,
    bottom: 3,
    opacity: 0.18,
  },

  /* 3D FACE */

  character: {
    width: 51,
    height: 51,
    borderRadius: 27,
    position: 'relative',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 6,
  },

  bigHighlight: {
    position: 'absolute',
    width: 21,
    height: 13,
    borderRadius: 12,
    left: 7,
    top: 5,
    opacity: 0.6,
    transform: [{ rotate: '-25deg' }],
  },

  glossyDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: WHITE,
    left: 13,
    top: 8,
    opacity: 0.9,
  },

  /* EYES */

  eyeLeft: {
    position: 'absolute',
    width: 19,
    height: 21,
    borderRadius: 11,
    backgroundColor: WHITE,
    left: 7,
    top: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyeRight: {
    position: 'absolute',
    width: 19,
    height: 21,
    borderRadius: 11,
    backgroundColor: WHITE,
    right: 7,
    top: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyePupil: {
    width: 10,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#403A46',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },

  eyeShineLarge: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: WHITE,
  },

  eyeShineSmall: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: WHITE,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },

  /* BROWS */

  browNormalLeft: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 2,
    left: 9,
    top: 14,
  },

  browNormalRight: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 2,
    right: 9,
    top: 14,
  },

  browHappyLeft: {
    position: 'absolute',
    width: 10,
    height: 6,
    borderTopWidth: 2,
    borderRadius: 8,
    left: 9,
    top: 12,
    transform: [{ rotate: '8deg' }],
  },

  browHappyRight: {
    position: 'absolute',
    width: 10,
    height: 6,
    borderTopWidth: 2,
    borderRadius: 8,
    right: 9,
    top: 12,
    transform: [{ rotate: '-8deg' }],
  },

  browSadLeft: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 2,
    left: 9,
    top: 14,
    transform: [{ rotate: '-15deg' }],
  },

  browSadRight: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 2,
    right: 9,
    top: 14,
    transform: [{ rotate: '15deg' }],
  },

  /* CHEEKS */

  cheekLeft: {
    position: 'absolute',
    width: 7,
    height: 4,
    borderRadius: 5,
    left: 5,
    top: 36,
    opacity: 0.4,
  },

  cheekRight: {
    position: 'absolute',
    width: 7,
    height: 4,
    borderRadius: 5,
    right: 5,
    top: 36,
    opacity: 0.4,
  },

  /* MOUTH */

  happyMouth: {
    position: 'absolute',
    width: 14,
    height: 8,
    borderBottomWidth: 2,
    borderRadius: 9,
    left: 18,
    top: 36,
  },

  goodMouth: {
    position: 'absolute',
    width: 12,
    height: 7,
    borderBottomWidth: 2,
    borderRadius: 8,
    left: 19,
    top: 36,
  },

  neutralMouth: {
    position: 'absolute',
    width: 11,
    height: 2,
    borderRadius: 2,
    left: 20,
    top: 39,
  },

  sadMouth: {
    position: 'absolute',
    width: 13,
    height: 8,
    borderTopWidth: 2,
    borderRadius: 9,
    left: 19,
    top: 39,
  },

  /* SPARKLES */

  sparkle: {
    position: 'absolute',
    borderRadius: 5,
  },

  sparkleOne: {
    width: 5,
    height: 5,
    left: 3,
    top: 7,
    opacity: 0.7,
  },

  sparkleTwo: {
    width: 4,
    height: 4,
    right: 3,
    top: 18,
    opacity: 0.6,
  },

  /* LABEL */

  moodLabel: {
    flex: 1,
    color: '#5F4D47',
    fontSize: 13,
    fontWeight: '500',
  },

  selectedMoodLabel: {
    color: '#C85F4E',
    fontWeight: '700',
  },

  /* CHECK */

  checkCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkOne: {
    position: 'absolute',
    width: 6,
    height: 2,
    backgroundColor: WHITE,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
    left: 5,
    top: 12,
  },

  checkTwo: {
    position: 'absolute',
    width: 10,
    height: 2,
    backgroundColor: WHITE,
    borderRadius: 2,
    transform: [{ rotate: '-45deg' }],
    left: 8,
    top: 10,
  },

  /* ENCOURAGEMENT */

  encouragement: {
    flexDirection: 'row',
    backgroundColor: '#F5EFE9',
    borderRadius: 17,
    padding: 12,
    marginTop: 13,
  },

  encouragementIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  encouragementHeart: {
    color: CORAL,
    fontSize: 22,
  },

  encouragementContent: {
    flex: 1,
  },

  encouragementTitle: {
    color: DARK,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },

  encouragementText: {
    color: '#806F68',
    fontSize: 10,
    lineHeight: 15,
  },

  /* CONTINUE */

  continueButton: {
    height: 54,
    backgroundColor: CORAL,
    borderRadius: 27,
    marginTop: 17,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: CORAL,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.16,
    shadowRadius: 9,
    elevation: 3,
  },

  disabledButton: {
    backgroundColor: '#DCCBC5',
    shadowOpacity: 0,
    elevation: 0,
  },

  continuePressed: {
    transform: [{ scale: 0.985 }],
  },

  continueText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '700',
  },

  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  arrow: {
    color: WHITE,
    fontSize: 22,
    lineHeight: 24,
    marginTop: -2,
  },

  footerText: {
    textAlign: 'center',
    color: '#A18E87',
    fontSize: 9.5,
    marginTop: 12,
    lineHeight: 14,
  },

  pressed: {
    opacity: 0.82,
  },
});