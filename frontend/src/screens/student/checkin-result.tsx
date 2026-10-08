import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

type MoodType =
  | 'Very Good'
  | 'Good'
  | 'Okay'
  | 'Low'
  | 'Very Low';

/* =========================================================
   UWELL LOGO — SAME AS MOOD CHECK-IN
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

export default function CheckInResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as { mood?: string } || {};
  const { mood } = params;

  const selectedMood = Array.isArray(mood) ? mood[0] : mood;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const characterScale = useRef(new Animated.Value(0.85)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }),

      Animated.spring(characterScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -4,
          duration: 1800,
          useNativeDriver: true,
        }),

        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getMessage = () => {
    switch (selectedMood) {
      case 'Very Good':
        return 'That is wonderful! Keep taking care of yourself and enjoy the positive moments in your day.';

      case 'Good':
        return 'It is great to hear that you are feeling good today. Keep doing the little things that support your wellbeing.';

      case 'Okay':
        return 'It is okay to have an average day. Be kind to yourself and give yourself the space you need.';

      case 'Low':
        return 'Thank you for checking in. Remember, you do not have to face difficult moments alone.';

      case 'Very Low':
        return 'We are glad you checked in. Consider reaching out to someone you trust for support when you need it.';

      default:
        return 'Thank you for taking a moment to check in with yourself.';
    }
  };

  const getMoodColors = () => {
    switch (selectedMood) {
      case 'Very Good':
        return {
          main: '#AFCF9B',
          light: '#DDEBD2',
          shadow: '#7FA66D',
          face: '#55714B',
          cheeks: '#DCE9DF',
        };

      case 'Good':
        return {
          main: '#C7DDB0',
          light: '#E7F0DC',
          shadow: '#9CB985',
          face: '#617652',
          cheeks: '#DCE9DF',
        };

      case 'Okay':
        return {
          main: '#D8C7BE',
          light: '#F0E3DD',
          shadow: '#B49D94',
          face: '#76625A',
          cheeks: '#E9DAD4',
        };

      case 'Low':
        return {
          main: '#E6A9A0',
          light: '#F6D1CA',
          shadow: '#C87E75',
          face: '#82534E',
          cheeks: '#F3C4BC',
        };

      case 'Very Low':
        return {
          main: '#D98F87',
          light: '#EDBBB4',
          shadow: '#B66D67',
          face: '#754844',
          cheeks: '#F3C4BC',
        };

      default:
        return {
          main: '#D8C7BE',
          light: '#F0E3DD',
          shadow: '#B49D94',
          face: '#76625A',
          cheeks: '#E9DAD4',
        };
    }
  };

  const colors = getMoodColors();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.headerRow}>

          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          {/* SAME UWELL LOGO AS MOOD CHECK-IN */}
          <UWellLogo />

          <View style={styles.headerSpacer} />

        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >

          {/* Heading */}

          <Text style={styles.smallTitle}>
            CHECK-IN RESULT
          </Text>

          <Text style={styles.title}>
            Thank you for checking in
          </Text>

          <Text style={styles.subtitle}>
            Here is a gentle reflection of how you
            are feeling today.
          </Text>

          {/* Result Card */}

          <View style={styles.resultCard}>

            <Animated.View
              style={[
                styles.characterArea,
                {
                  transform: [
                    { scale: characterScale },
                    { translateY: floatAnim },
                  ],
                },
              ]}
            >

              <MoodCharacter
                mood={selectedMood as MoodType}
                colors={colors}
              />

            </Animated.View>

            <View style={styles.resultDivider} />

            <Text style={styles.feelingText}>
              You are feeling
            </Text>

            <Text style={styles.moodText}>
              {selectedMood || 'Not selected'}
            </Text>

            <Text style={styles.message}>
              {getMessage()}
            </Text>

          </View>

          {/* Support Card */}

          <View style={styles.supportCard}>

            <View style={styles.supportIcon}>

              <View style={styles.supportLeafOne} />

              <View style={styles.supportLeafTwo} />

            </View>

            <View style={styles.supportContent}>

              <Text style={styles.supportTitle}>
                Your wellbeing matters
              </Text>

              <Text style={styles.supportText}>
                Small steps can make a difference.
                Take some time for yourself today.
              </Text>

            </View>

          </View>

          {/* Main Button */}

          <Pressable
            style={styles.tipsButton}
            onPress={() => navigation.navigate('MentalHealthTips')}
          >

            <Text style={styles.tipsText}>
              View Mental Health Tips
            </Text>

            <View style={styles.arrowCircle}>

              <Text style={styles.arrow}>
                ›
              </Text>

            </View>

          </Pressable>

          {/* Home Button */}

          <Pressable
            style={styles.homeButton}
            onPress={() => navigation.getParent()?.navigate('Home')}
          >

            <Text style={styles.homeText}>
              Back to Home
            </Text>

          </Pressable>

        </Animated.View>

      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   MOOD CHARACTER
========================================================= */

function MoodCharacter({
  mood,
  colors,
}: {
  mood: MoodType;
  colors: {
    main: string;
    light: string;
    shadow: string;
    face: string;
    cheeks: string;
  };
}) {
  const isVeryGood = mood === 'Very Good';
  const isGood = mood === 'Good';
  const isOkay = mood === 'Okay';
  const isLow = mood === 'Low';
  const isVeryLow = mood === 'Very Low';

  return (
    <View
      style={[
        styles.characterWrapper,
        {
          backgroundColor: colors.light,
        },
      ]}
    >

      {/* Soft shadow */}

      <View
        style={[
          styles.characterShadow,
          {
            backgroundColor: colors.shadow,
          },
        ]}
      />

      {/* Main head */}

      <View
        style={[
          styles.characterHead,
          {
            backgroundColor: colors.main,
          },
        ]}
      >

        {/* Glossy highlight */}

        <View style={styles.headHighlight} />

        {/* Left Eye */}

        <View style={styles.eye}>

          <View style={styles.eyeWhite}>

            <View
              style={[
                styles.pupil,
                {
                  backgroundColor: colors.face,
                },
              ]}
            />

            <View style={styles.eyeHighlight} />

          </View>

        </View>

        {/* Right Eye */}

        <View style={styles.eyeRight}>

          <View style={styles.eyeWhite}>

            <View
              style={[
                styles.pupil,
                {
                  backgroundColor: colors.face,
                },
              ]}
            />

            <View style={styles.eyeHighlight} />

          </View>

        </View>

        {/* Eyebrows */}

        {(isLow || isVeryLow) && (
          <>
            <View
              style={[
                styles.browLeftSad,
                {
                  backgroundColor: colors.face,
                },
              ]}
            />

            <View
              style={[
                styles.browRightSad,
                {
                  backgroundColor: colors.face,
                },
              ]}
            />
          </>
        )}

        {isVeryGood && (
          <>
            <View
              style={[
                styles.browLeftHappy,
                {
                  backgroundColor: colors.face,
                },
              ]}
            />

            <View
              style={[
                styles.browRightHappy,
                {
                  backgroundColor: colors.face,
                },
              ]}
            />
          </>
        )}

        {/* Cheeks */}

        <View
          style={[
            styles.cheekLeft,
            {
              backgroundColor: colors.cheeks,
            },
          ]}
        />

        <View
          style={[
            styles.cheekRight,
            {
              backgroundColor: colors.cheeks,
            },
          ]}
        />

        {/* Mouth */}

        {isVeryGood && (
          <View
            style={[
              styles.happyMouth,
              {
                borderColor: colors.face,
              },
            ]}
          />
        )}

        {isGood && (
          <View
            style={[
              styles.goodMouth,
              {
                borderColor: colors.face,
              },
            ]}
          />
        )}

        {isOkay && (
          <View
            style={[
              styles.okayMouth,
              {
                backgroundColor: colors.face,
              },
            ]}
          />
        )}

        {isLow && (
          <View
            style={[
              styles.lowMouth,
              {
                borderColor: colors.face,
              },
            ]}
          />
        )}

        {isVeryLow && (
          <View
            style={[
              styles.veryLowMouth,
              {
                borderColor: colors.face,
              },
            ]}
          />
        )}

      </View>

      {/* Small decorative leaf */}

      {(isVeryGood || isGood) && (
        <View style={styles.miniLeaf}>

          <View
            style={[
              styles.miniLeafShape,
              {
                backgroundColor: colors.shadow,
              },
            ]}
          />

        </View>
      )}

      {/* Small tear */}

      {(isLow || isVeryLow) && (
        <View style={styles.smallTear}>

          <View
            style={[
              styles.tearShape,
              {
                backgroundColor: colors.shadow,
              },
            ]}
          />

        </View>
      )}

    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
  },

  /* HEADER */

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

  backArrow: {
    color: '#4A3833',
    fontSize: 30,
    lineHeight: 30,
    marginRight: 4,
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
     SAME AS MOOD CHECK-IN
  ======================================================= */

  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EF806B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',

    shadowColor: '#EF806B',
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
    backgroundColor: '#FFFFFF',
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
    color: '#EF806B',
    fontSize: 14,
    fontWeight: '700',
    top: 16,
    zIndex: 5,
  },

  logoStem: {
    position: 'absolute',
    width: 2,
    height: 11,
    backgroundColor: '#FFFFFF',
    bottom: 10,
    borderRadius: 2,
  },

  /* CONTENT */

  content: {
    flex: 1,
  },

  smallTitle: {
    color: '#EF806B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 7,
  },

  title: {
    color: '#4A3833',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    color: '#8A7770',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },

  /* RESULT */

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',

    shadowColor: '#C9B5AE',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  characterArea: {
    marginBottom: 7,
  },

  characterWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  characterShadow: {
    position: 'absolute',
    width: 67,
    height: 12,
    borderRadius: 10,
    bottom: 9,
    opacity: 0.18,
  },

  characterHead: {
    width: 72,
    height: 72,
    borderRadius: 36,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#5E4C47',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },

  headHighlight: {
    position: 'absolute',
    width: 19,
    height: 11,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    opacity: 0.45,
    top: 8,
    left: 14,
    transform: [{ rotate: '-25deg' }],
  },

  /* EYES */

  eye: {
    position: 'absolute',
    left: 15,
    top: 25,
  },

  eyeRight: {
    position: 'absolute',
    right: 15,
    top: 25,
  },

  eyeWhite: {
    width: 17,
    height: 21,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pupil: {
    width: 9,
    height: 12,
    borderRadius: 6,
  },

  eyeHighlight: {
    position: 'absolute',
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    top: 4,
    left: 3,
  },

  /* EYEBROWS */

  browLeftSad: {
    position: 'absolute',
    width: 14,
    height: 3,
    borderRadius: 2,
    left: 14,
    top: 18,
    transform: [{ rotate: '15deg' }],
  },

  browRightSad: {
    position: 'absolute',
    width: 14,
    height: 3,
    borderRadius: 2,
    right: 14,
    top: 18,
    transform: [{ rotate: '-15deg' }],
  },

  browLeftHappy: {
    position: 'absolute',
    width: 13,
    height: 3,
    borderRadius: 2,
    left: 14,
    top: 17,
    transform: [{ rotate: '-8deg' }],
  },

  browRightHappy: {
    position: 'absolute',
    width: 13,
    height: 3,
    borderRadius: 2,
    right: 14,
    top: 17,
    transform: [{ rotate: '8deg' }],
  },

  /* CHEEKS */

  cheekLeft: {
    position: 'absolute',
    width: 10,
    height: 5,
    borderRadius: 6,
    left: 10,
    bottom: 23,
    opacity: 0.75,
  },

  cheekRight: {
    position: 'absolute',
    width: 10,
    height: 5,
    borderRadius: 6,
    right: 10,
    bottom: 23,
    opacity: 0.75,
  },

  /* MOUTH */

  happyMouth: {
    position: 'absolute',
    width: 17,
    height: 9,
    borderBottomWidth: 3,
    borderRadius: 10,
    bottom: 16,
  },

  goodMouth: {
    position: 'absolute',
    width: 13,
    height: 6,
    borderBottomWidth: 2,
    borderRadius: 8,
    bottom: 17,
  },

  okayMouth: {
    position: 'absolute',
    width: 13,
    height: 3,
    borderRadius: 3,
    bottom: 18,
  },

  lowMouth: {
    position: 'absolute',
    width: 16,
    height: 8,
    borderTopWidth: 3,
    borderRadius: 10,
    bottom: 13,
  },

  veryLowMouth: {
    position: 'absolute',
    width: 18,
    height: 9,
    borderTopWidth: 3,
    borderRadius: 10,
    bottom: 12,
  },

  /* DECORATIONS */

  miniLeaf: {
    position: 'absolute',
    right: 7,
    top: 17,
    transform: [{ rotate: '20deg' }],
  },

  miniLeafShape: {
    width: 12,
    height: 20,
    borderRadius: 12,
  },

  smallTear: {
    position: 'absolute',
    right: 17,
    bottom: 21,
  },

  tearShape: {
    width: 6,
    height: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    transform: [{ rotate: '20deg' }],
    opacity: 0.7,
  },

  resultDivider: {
    width: 42,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#F2E5DF',
    marginTop: 2,
    marginBottom: 12,
  },

  feelingText: {
    color: '#8A7770',
    fontSize: 12,
    marginBottom: 3,
  },

  moodText: {
    color: '#EF806B',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 9,
  },

  message: {
    color: '#66534D',
    fontSize: 12.5,
    lineHeight: 19,
    textAlign: 'center',
  },

  /* SUPPORT */

  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4EEE8',
    borderRadius: 17,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#EEE2DB',
  },

  supportIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DDEBD2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    position: 'relative',
  },

  supportLeafOne: {
    width: 9,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#7FA66D',
    position: 'absolute',
    left: 10,
    top: 9,
    transform: [{ rotate: '-35deg' }],
  },

  supportLeafTwo: {
    width: 9,
    height: 15,
    borderRadius: 10,
    backgroundColor: '#9CB985',
    position: 'absolute',
    right: 9,
    top: 9,
    transform: [{ rotate: '35deg' }],
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    color: '#4A3833',
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: 3,
  },

  supportText: {
    color: '#806F68',
    fontSize: 10.5,
    lineHeight: 16,
  },

  /* BUTTONS */

  tipsButton: {
    height: 52,
    backgroundColor: '#EF806B',
    borderRadius: 26,
    marginTop: 17,
    paddingLeft: 20,
    paddingRight: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#EF806B',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },

  tipsText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },

  arrowCircle: {
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 24,
    marginTop: -2,
  },

  homeButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EF806B',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF9F3',
  },

  homeText: {
    color: '#EF806B',
    fontSize: 13.5,
    fontWeight: '800',
  },
});