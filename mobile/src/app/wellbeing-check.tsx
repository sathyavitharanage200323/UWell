import React, { useEffect, useRef, useState } from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const feelings = [
  'Very Good',
  'Good',
  'Okay',
  'Low',
  'Very Low',
];

const stressLevels = [
  'Very Low',
  'Low',
  'Moderate',
  'High',
  'Very High',
];

const sleepLevels = [
  'Very Good',
  'Good',
  'Okay',
  'Poor',
  'Very Poor',
];

const energyLevels = [
  'High',
  'Good',
  'Moderate',
  'Low',
  'Very Low',
];

const supportOptions = [
  'Stress & Anxiety',
  'Academic Pressure',
  'Sleep',
  'Personal Wellbeing',
  'Talking to Someone',
];

export default function WellbeingCheck() {
  // ------------------------------------
  // Student email from Login
  // ------------------------------------

  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  // ------------------------------------
  // Answers
  // ------------------------------------

  const [feeling, setFeeling] = useState('');
  const [stress, setStress] = useState('');
  const [sleep, setSleep] = useState('');
  const [energy, setEnergy] = useState('');
  const [support, setSupport] = useState('');

  // ------------------------------------
  // Animation values
  // ------------------------------------

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const slideAnim = useRef(
    new Animated.Value(18)
  ).current;

  const logoScale = useRef(
    new Animated.Value(0.92)
  ).current;

  const buttonScale = useRef(
    new Animated.Value(1)
  ).current;

  // Progress animation
  const progressAnim = useRef(
    new Animated.Value(0)
  ).current;

  // ------------------------------------
  // Calculate answered questions
  // ------------------------------------

  const answeredCount = [
    feeling,
    stress,
    sleep,
    energy,
    support,
  ].filter(Boolean).length;

  const progressPercentage =
    (answeredCount / 5) * 100;

  // ------------------------------------
  // Entrance animation
  // ------------------------------------

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),

      Animated.spring(logoScale, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ------------------------------------
  // Animate progress bar
  // ------------------------------------

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  // ------------------------------------
  // Continue
  // ------------------------------------

  const handleContinue = () => {
    if (
      !feeling ||
      !stress ||
      !sleep ||
      !energy ||
      !support
    ) {
      Alert.alert(
        'Complete Check',
        'Please answer all questions before continuing.'
      );

      return;
    }

    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.97,
        friction: 5,
        useNativeDriver: true,
      }),

      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Preserve student email and all answers
      router.push({
        pathname: '/wellbeing-recommendation',
        params: {
          email: email || '',
          feeling,
          stress,
          sleep,
          energy,
          support,
        },
      });
    });
  };

  // ------------------------------------
  // Reusable option button
  // ------------------------------------

  const OptionButton = ({
    option,
    selected,
    onPress,
  }: {
    option: string;
    selected: boolean;
    onPress: () => void;
  }) => {
    const scaleAnim = useRef(
      new Animated.Value(1)
    ).current;

    const handlePress = () => {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 0.98,
          friction: 5,
          useNativeDriver: true,
        }),

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      onPress();
    };

    return (
      <Animated.View
        style={{
          transform: [
            {
              scale: scaleAnim,
            },
          ],
        }}
      >
        <Pressable
          onPress={handlePress}
          style={[
            styles.option,
            selected && styles.optionSelected,
          ]}
        >
          <View
            style={[
              styles.radio,
              selected && styles.radioSelected,
            ]}
          >
            {selected && (
              <View style={styles.radioInner} />
            )}
          </View>

          <Text
            style={[
              styles.optionText,
              selected &&
                styles.optionTextSelected,
            ]}
          >
            {option}
          </Text>

          {selected && (
            <View style={styles.selectedCheck}>
              <Text style={styles.selectedCheckText}>
                ✓
              </Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  // ------------------------------------
  // Progress fill width
  // ------------------------------------

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* =================================
            Background Decorations
        ================================= */}

        <View style={styles.topDecoration} />

        <View style={styles.bottomDecoration} />

        {/* =================================
            Header
        ================================= */}

        <Animated.View
          style={[
            styles.header,
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
          {/* Back */}

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          {/* UWell logo */}

          <Animated.View
            style={[
              styles.logoCircle,
              {
                transform: [
                  {
                    scale: logoScale,
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.logoLeaf,
                styles.logoLeafLeft,
              ]}
            />

            <View
              style={[
                styles.logoLeaf,
                styles.logoLeafRight,
              ]}
            />

            <Text style={styles.logoHeart}>
              ♡
            </Text>

            <View style={styles.logoStem} />
          </Animated.View>

          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* =================================
            Title
        ================================= */}

        <Animated.View
          style={[
            styles.titleSection,
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
          <Text style={styles.smallTitle}>
            WELLBEING CHECK
          </Text>

          <Text style={styles.title}>
            How are you doing?
          </Text>

          <Text style={styles.subtitle}>
            Take a moment to check in with yourself.
            {'\n'}
            There are no right or wrong answers.
          </Text>
        </Animated.View>

        {/* =================================
            Dynamic Progress
        ================================= */}

        <Animated.View
          style={[
            styles.progressSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>
              Your wellbeing check
            </Text>

            <Text style={styles.progressCount}>
              {answeredCount} of 5 answered
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>

          <View style={styles.progressBottom}>
            <Text style={styles.progressStatus}>
              {answeredCount === 0
                ? 'Let’s get started'
                : answeredCount === 5
                ? 'All questions completed'
                : `${answeredCount} of 5 questions completed`}
            </Text>

            <Text style={styles.progressPercentage}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
        </Animated.View>

        {/* =================================
            Privacy Notice
        ================================= */}

        <Animated.View
          style={[
            styles.privacyCard,
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
          <View style={styles.privacyIconCircle}>
            <Text style={styles.privacyIcon}>
              ♡
            </Text>
          </View>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              A private space for you
            </Text>

            <Text style={styles.privacyText}>
              Your responses help UWell provide
              relevant wellbeing recommendations.
            </Text>
          </View>
        </Animated.View>

        {/* =================================
            Question 01
        ================================= */}

        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.numberCircle}>
              <Text style={styles.questionNumber}>
                01
              </Text>
            </View>

            <Text style={styles.questionProgress}>
              1 / 5
            </Text>
          </View>

          <Text style={styles.question}>
            How have you been feeling recently?
          </Text>

          {feelings.map((option) => (
            <OptionButton
              key={option}
              option={option}
              selected={feeling === option}
              onPress={() =>
                setFeeling(option)
              }
            />
          ))}
        </View>

        {/* =================================
            Question 02
        ================================= */}

        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.numberCircle}>
              <Text style={styles.questionNumber}>
                02
              </Text>
            </View>

            <Text style={styles.questionProgress}>
              2 / 5
            </Text>
          </View>

          <Text style={styles.question}>
            How stressed have you been feeling?
          </Text>

          {stressLevels.map((option) => (
            <OptionButton
              key={option}
              option={option}
              selected={stress === option}
              onPress={() =>
                setStress(option)
              }
            />
          ))}
        </View>

        {/* =================================
            Question 03
        ================================= */}

        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.numberCircle}>
              <Text style={styles.questionNumber}>
                03
              </Text>
            </View>

            <Text style={styles.questionProgress}>
              3 / 5
            </Text>
          </View>

          <Text style={styles.question}>
            How has your sleep been?
          </Text>

          {sleepLevels.map((option) => (
            <OptionButton
              key={option}
              option={option}
              selected={sleep === option}
              onPress={() =>
                setSleep(option)
              }
            />
          ))}
        </View>

        {/* =================================
            Question 04
        ================================= */}

        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.numberCircle}>
              <Text style={styles.questionNumber}>
                04
              </Text>
            </View>

            <Text style={styles.questionProgress}>
              4 / 5
            </Text>
          </View>

          <Text style={styles.question}>
            How is your energy level?
          </Text>

          {energyLevels.map((option) => (
            <OptionButton
              key={option}
              option={option}
              selected={energy === option}
              onPress={() =>
                setEnergy(option)
              }
            />
          ))}
        </View>

        {/* =================================
            Question 05
        ================================= */}

        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.numberCircle}>
              <Text style={styles.questionNumber}>
                05
              </Text>
            </View>

            <Text style={styles.questionProgress}>
              5 / 5
            </Text>
          </View>

          <Text style={styles.question}>
            What would you like support with?
          </Text>

          {supportOptions.map((option) => (
            <OptionButton
              key={option}
              option={option}
              selected={support === option}
              onPress={() =>
                setSupport(option)
              }
            />
          ))}
        </View>

        {/* =================================
            Continue
        ================================= */}

        <Animated.View
          style={{
            transform: [
              {
                scale: buttonScale,
              },
            ],
          }}
        >
          <Pressable
            style={[
              styles.continueButton,
              answeredCount === 5 &&
                styles.continueButtonComplete,
            ]}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>
              View My Recommendation
            </Text>

            <View style={styles.arrowCircle}>
              <Text style={styles.arrow}>
                ›
              </Text>
            </View>
          </Pressable>
        </Animated.View>

        {/* =================================
            Footer
        ================================= */}

        <View style={styles.footerContainer}>
          <View style={styles.footerDot} />

          <Text style={styles.footerText}>
            You can explore wellbeing resources and
            counselor support anytime.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ====================================
  // Screen
  // ====================================

  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 38,
    position: 'relative',
    overflow: 'hidden',
  },

  // ====================================
  // Background
  // ====================================

  topDecoration: {
    position: 'absolute',
    width: 155,
    height: 155,
    borderRadius: 78,
    backgroundColor: '#FBE9E1',
    top: -90,
    right: -75,
    opacity: 0.55,
  },

  bottomDecoration: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: '#EDF3EC',
    bottom: -75,
    left: -75,
    opacity: 0.65,
  },

  // ====================================
  // Header
  // ====================================

  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F0E3DD',
  },

  backText: {
    fontSize: 29,
    color: '#8B7770',
    fontWeight: '400',
    marginTop: -3,
  },

  headerSpacer: {
    width: 40,
  },

  // ====================================
  // UWell Logo
  // ====================================

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
    transform: [
      {
        rotate: '-38deg',
      },
    ],
    left: 13,
    top: 13,
  },

  logoLeafRight: {
    transform: [
      {
        rotate: '38deg',
      },
    ],
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

  // ====================================
  // Title
  // ====================================

  titleSection: {
    alignItems: 'center',
    marginTop: 9,
    marginBottom: 16,
  },

  smallTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#EF806B',
    letterSpacing: 1.4,
    marginBottom: 5,
  },

  title: {
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '800',
    color: '#4A3833',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 12.5,
    lineHeight: 19,
    color: '#806F68',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },

  // ====================================
  // Progress
  // ====================================

  progressSection: {
    marginBottom: 13,
    paddingHorizontal: 2,
  },

  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  progressLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#806F68',
  },

  progressCount: {
    fontSize: 10,
    color: '#A28E86',
    fontWeight: '600',
  },

  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F0E4DE',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#EF806B',
    borderRadius: 3,
  },

  progressBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },

  progressStatus: {
    fontSize: 9.5,
    color: '#A28E86',
    fontWeight: '500',
  },

  progressPercentage: {
    fontSize: 9.5,
    color: '#C86250',
    fontWeight: '700',
  },

  // ====================================
  // Privacy
  // ====================================

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EA',
    borderRadius: 18,
    padding: 13,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5DED5',
  },

  privacyIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#EF806B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  privacyIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B433B',
    marginBottom: 3,
  },

  privacyText: {
    fontSize: 10.5,
    lineHeight: 16,
    color: '#806F68',
  },

  // ====================================
  // Question Card
  // ====================================

  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F0E4DE',

    shadowColor: '#C6AEA1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 1,
  },

  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  questionNumber: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#EF806B',
  },

  questionProgress: {
    fontSize: 9.5,
    color: '#A18D85',
    fontWeight: '500',
  },

  question: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A3833',
    lineHeight: 22,
    marginBottom: 12,
  },

  // ====================================
  // Options
  // ====================================

  option: {
    minHeight: 46,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E8DCD6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    marginBottom: 8,
    backgroundColor: '#FFFEFD',
  },

  optionSelected: {
    borderColor: '#EF806B',
    backgroundColor: '#FFF0EA',
  },

  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B9AAA2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  radioSelected: {
    borderColor: '#EF806B',
  },

  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EF806B',
  },

  optionText: {
    flex: 1,
    fontSize: 12.5,
    color: '#665650',
    fontWeight: '500',
  },

  optionTextSelected: {
    fontWeight: '700',
    color: '#C86250',
  },

  selectedCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF806B',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },

  selectedCheckText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    marginTop: -1,
  },

  // ====================================
  // Continue
  // ====================================

  continueButton: {
    height: 52,
    borderRadius: 17,
    backgroundColor: '#EF806B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,

    shadowColor: '#EF806B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },

  continueButtonComplete: {
    shadowOpacity: 0.22,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },

  arrowCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 21,
    lineHeight: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: -1,
  },

  // ====================================
  // Footer
  // ====================================

  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
  },

  footerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#EF806B',
    marginRight: 6,
    opacity: 0.75,
  },

  footerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 9.5,
    lineHeight: 15,
    color: '#9A8780',
  },
});