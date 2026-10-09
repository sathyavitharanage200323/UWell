import React, { useEffect, useRef } from 'react';

import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

export default function WellbeingRecommendation() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const route = useRoute();
  const params = route.params as {
    email?: string; feeling?: string; stress?: string;
    sleep?: string; energy?: string; support?: string;
    fromRegistration?: boolean;
    registeredUser?: any;
    registeredToken?: string;
  } || {};
  const { email, feeling, stress, sleep, energy, support, fromRegistration, registeredUser, registeredToken } = params;

  const isNewUser = !!fromRegistration;

  // ====================================
  // Animations
  // ====================================

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const slideAnim = useRef(
    new Animated.Value(18)
  ).current;

  const logoScale = useRef(
    new Animated.Value(0.92)
  ).current;

  const characterFloat = useRef(
    new Animated.Value(0)
  ).current;

  const buttonScale = useRef(
    new Animated.Value(1)
  ).current;

  // ====================================
  // Save wellbeing completion
  // ====================================

  useEffect(() => {
    const saveWellbeingCompletion = async () => {
      try {
        if (!email) {
          console.log('ERROR: No email received');
          return;
        }

        const normalizedEmail = String(email)
          .trim()
          .toLowerCase();

        const wellbeingKey =
          `wellbeingCompleted:${normalizedEmail}`;

        await AsyncStorage.setItem(
          wellbeingKey,
          'true'
        );

        const savedValue =
          await AsyncStorage.getItem(
            wellbeingKey
          );

        console.log('================================');
        console.log(
          'EMAIL:',
          normalizedEmail
        );
        console.log(
          'KEY:',
          wellbeingKey
        );
        console.log(
          'SAVED VALUE:',
          savedValue
        );
        console.log('================================');
      } catch (error) {
        console.log(
          'SAVE ERROR:',
          error
        );
      }
    };

    saveWellbeingCompletion();
  }, [email]);

  // ====================================
  // Entrance Animation
  // ====================================

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
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

  // ====================================
  // Character Floating Animation
  // ====================================

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(characterFloat, {
          toValue: -5,
          duration: 1400,
          useNativeDriver: true,
        }),

        Animated.timing(characterFloat, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ====================================
  // Auto-login after registration + wellbeing
  // ====================================

  const handleLoginAndNavigate = async () => {
    if (registeredUser && registeredToken) {
      await login({ ...registeredUser, token: registeredToken });
      // AuthNavigator will automatically switch to StudentNavigator
    } else {
      navigation.navigate('Login');
    }
  };

  // ====================================
  // Recommendation Logic
  // ====================================

  const getRecommendation = () => {
    if (
      support === 'Stress & Anxiety' ||
      stress === 'High' ||
      stress === 'Very High'
    ) {
      return {
        theme: 'stress',
        title: 'Focus on Stress Management',
        description:
          'It looks like stress management may be helpful for you right now.',
        action: 'Explore Stress Management',
      };
    }

    if (support === 'Academic Pressure') {
      return {
        theme: 'academic',
        title: 'Support for Academic Pressure',
        description:
          'Managing academic pressure can be challenging. A few simple strategies may help you feel more balanced.',
        action: 'Explore Academic Support',
      };
    }

    if (
      support === 'Sleep' ||
      sleep === 'Poor' ||
      sleep === 'Very Poor'
    ) {
      return {
        theme: 'sleep',
        title: 'Improve Your Sleep',
        description:
          'Better sleep can support your mood, energy and overall wellbeing.',
        action: 'Explore Sleep Tips',
      };
    }

    if (
      support === 'Talking to Someone' ||
      feeling === 'Low' ||
      feeling === 'Very Low'
    ) {
      return {
        theme: 'support',
        title: "You Don't Have to Handle It Alone",
        description:
          'Talking with someone you trust or a counselor can be a helpful step when you are not feeling your best.',
        action: 'Find a Counselor',
      };
    }

    return {
      theme: 'wellness',
      title: 'Keep Supporting Your Wellbeing',
      description:
        'You seem to be doing reasonably well. Keep building healthy habits and checking in with yourself regularly.',
      action: 'Explore Wellness Resources',
    };
  };

  const recommendation = getRecommendation();

  // ====================================
  // Recommendation Action
  // ====================================

  const handleAction = () => {
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
    ]).start();

    if (
      recommendation.action ===
      'Find a Counselor'
    ) {
      if (isNewUser) {
        handleLoginAndNavigate();
      } else {
        navigation.getParent()?.navigate('Counselors');
      }
      return;
    }

    if (isNewUser) {
      handleLoginAndNavigate();
    } else {
      navigation.getParent()?.navigate('Resources');
    }
  };

  // ====================================
  // UWell Logo
  // Fixed 50 x 50 standard
  // ====================================

  const UWellLogo = () => {
    return (
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
    );
  };

  // ====================================
  // Recommendation Character
  // ====================================

  const RecommendationCharacter = ({
    type,
  }: {
    type: string;
  }) => {
    const isStress = type === 'stress';
    const isAcademic = type === 'academic';
    const isSleep = type === 'sleep';
    const isSupport = type === 'support';
    const isWellness = type === 'wellness';

    let bodyColor = '#F7C7C7';
    let borderColor = '#E7A5A5';
    let innerColor = '#E99C9C';

    if (isAcademic) {
      bodyColor = '#F8D3A8';
      borderColor = '#E4B27D';
      innerColor = '#EAB986';
    }

    if (isSleep) {
      bodyColor = '#D9D5EF';
      borderColor = '#B7B0D7';
      innerColor = '#B9B0D9';
    }

    if (isSupport) {
      bodyColor = '#F5C6B7';
      borderColor = '#E1A291';
      innerColor = '#E6A191';
    }

    if (isWellness) {
      bodyColor = '#D5E4D1';
      borderColor = '#AFC5A8';
      innerColor = '#AFC6A9';
    }

    return (
      <Animated.View
        style={[
          styles.characterContainer,
          {
            transform: [
              {
                translateY: characterFloat,
              },
            ],
          },
        ]}
      >
        {/* Floating decoration */}

        {isSleep && (
          <>
            <Text style={styles.moonSymbol}>
              ☾
            </Text>

            <Text style={styles.sleepZLarge}>
              Z
            </Text>

            <Text style={styles.sleepZSmall}>
              z
            </Text>
          </>
        )}

        {isStress && (
          <>
            <Text style={styles.stressSpark}>
              ✦
            </Text>

            <Text style={styles.stressSparkSmall}>
              ·
            </Text>
          </>
        )}

        {isAcademic && (
          <View style={styles.graduationCap}>
            <View style={styles.capTop} />
            <View style={styles.capBase} />
            <View style={styles.capTassel} />
          </View>
        )}

        {isSupport && (
          <View style={styles.chatBubble}>
            <View style={styles.chatDot} />
            <View style={styles.chatDot} />
            <View style={styles.chatDot} />
          </View>
        )}

        {isWellness && (
          <Text style={styles.leafSymbol}>
            ✦
          </Text>
        )}

        {/* Character */}

        <View style={styles.character}>

          {/* Left Ear */}

          <View
            style={[
              styles.ear,
              styles.leftEar,
              {
                backgroundColor: bodyColor,
                borderColor: borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.innerEar,
                {
                  backgroundColor:
                    innerColor,
                },
              ]}
            />
          </View>

          {/* Right Ear */}

          <View
            style={[
              styles.ear,
              styles.rightEar,
              {
                backgroundColor: bodyColor,
                borderColor: borderColor,
              },
            ]}
          >
            <View
              style={[
                styles.innerEar,
                {
                  backgroundColor:
                    innerColor,
                },
              ]}
            />
          </View>

          {/* Body */}

          <View
            style={[
              styles.body,
              {
                backgroundColor: bodyColor,
                borderColor: borderColor,
              },
            ]}
          >
            {/* Highlight */}

            <View style={styles.bodyHighlight} />

            {/* Eyes */}

            <View
              style={[
                styles.eyeLeft,
                isSleep &&
                  styles.sleepEyeLeft,
              ]}
            >
              <View
                style={[
                  styles.eyeCurve,
                  isSleep &&
                    styles.sleepEyeCurve,
                ]}
              />
            </View>

            <View
              style={[
                styles.eyeRight,
                isSleep &&
                  styles.sleepEyeRight,
              ]}
            >
              <View
                style={[
                  styles.eyeCurve,
                  isSleep &&
                    styles.sleepEyeCurve,
                ]}
              />
            </View>

            {/* Nose */}

            <View style={styles.nose} />

            {/* Mouth */}

            <View
              style={[
                styles.mouth,
                isSupport &&
                  styles.supportMouth,
                isWellness &&
                  styles.wellnessMouth,
              ]}
            />

            {/* Blush */}

            <View
              style={[
                styles.blush,
                styles.blushLeft,
              ]}
            />

            <View
              style={[
                styles.blush,
                styles.blushRight,
              ]}
            />

            {/* Stress heart */}

            {isStress && (
              <Text style={styles.tinyHeart}>
                ♡
              </Text>
            )}

            {/* Academic Book */}

            {isAcademic && (
              <View style={styles.book}>
                <View style={styles.bookLine} />
                <View style={styles.bookLine} />
              </View>
            )}

            {/* Support heart */}

            {isSupport && (
              <Text style={styles.supportHeart}>
                ♡
              </Text>
            )}

            {/* Wellness leaf */}

            {isWellness && (
              <View style={styles.smallLeaf}>
                <View style={styles.smallLeafLine} />
              </View>
            )}

            {/* Left Arm */}

            <View
              style={[
                styles.arm,
                styles.leftArm,
                {
                  backgroundColor:
                    bodyColor,
                  borderColor:
                    borderColor,
                },
              ]}
            />

            {/* Right Arm */}

            <View
              style={[
                styles.arm,
                styles.rightArm,
                {
                  backgroundColor:
                    bodyColor,
                  borderColor:
                    borderColor,
                },
              ]}
            />

            {/* Left Foot */}

            <View
              style={[
                styles.foot,
                styles.leftFoot,
                {
                  backgroundColor:
                    bodyColor,
                  borderColor:
                    borderColor,
                },
              ]}
            />

            {/* Right Foot */}

            <View
              style={[
                styles.foot,
                styles.rightFoot,
                {
                  backgroundColor:
                    bodyColor,
                  borderColor:
                    borderColor,
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    );
  };

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
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>
              ‹
            </Text>
          </Pressable>

          {/* Centered UWell Logo */}

          <UWellLogo />

          {/* Balance spacer */}

          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* =================================
            Header Text
        ================================= */}

        <Animated.View
          style={[
            styles.headerTextSection,
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
            WELLBEING RECOMMENDATION
          </Text>

          <Text style={styles.title}>
            Your wellbeing matters
          </Text>

          <Text style={styles.subtitle}>
            Based on your answers, here is a
            support recommendation for you.
          </Text>
        </Animated.View>

        {/* =================================
            Recommendation Card
        ================================= */}

        <Animated.View
          style={[
            styles.recommendationCard,
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
          {/* Character */}

          <View
            style={[
              styles.characterArea,

              recommendation.theme ===
                'stress' &&
                styles.stressArea,

              recommendation.theme ===
                'academic' &&
                styles.academicArea,

              recommendation.theme ===
                'sleep' &&
                styles.sleepArea,

              recommendation.theme ===
                'support' &&
                styles.supportArea,

              recommendation.theme ===
                'wellness' &&
                styles.wellnessArea,
            ]}
          >
            <RecommendationCharacter
              type={
                recommendation.theme
              }
            />
          </View>

          {/* Label */}

          <View style={styles.labelContainer}>
            <View style={styles.labelDot} />

            <Text style={styles.recommendationLabel}>
              PERSONALIZED RECOMMENDATION
            </Text>
          </View>

          {/* Title */}

          <Text
            style={styles.recommendationTitle}
          >
            {recommendation.title}
          </Text>

          {/* Description */}

          <Text
            style={
              styles.recommendationDescription
            }
          >
            {recommendation.description}
          </Text>

          {/* Primary Button */}

          <Animated.View
            style={{
              width: '100%',
              transform: [
                {
                  scale: buttonScale,
                },
              ],
            }}
          >
            <Pressable
              style={styles.primaryButton}
              onPress={handleAction}
            >
              <Text
                style={styles.primaryButtonText}
              >
                {recommendation.action}
              </Text>

              <View
                style={styles.arrowCircle}
              >
                <Text style={styles.arrow}>
                  ›
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* =================================
            Remember Card
        ================================= */}

        <Animated.View
          style={[
            styles.supportCard,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.supportIcon}>
            <Text style={styles.supportIconText}>
              ♡
            </Text>
          </View>

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Remember
            </Text>

            <Text style={styles.supportText}>
              This check-in is not a medical
              diagnosis. It is only a simple way
              to help you discover useful
              wellbeing support.
            </Text>
          </View>
        </Animated.View>

        {/* =================================
            Check-In Summary
        ================================= */}

        <Animated.View
          style={[
            styles.summaryCard,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.summaryHeader}>
            <View>
              <Text
                style={styles.summaryEyebrow}
              >
                YOUR RESPONSES
              </Text>

              <Text style={styles.summaryTitle}>
                Check-In Summary
              </Text>
            </View>

            <View style={styles.summaryCheck}>
              <Text
                style={styles.summaryCheckText}
              >
                ✓
              </Text>
            </View>
          </View>

          {/* Feeling */}

          <View style={styles.summaryRow}>
            <View
              style={
                styles.summaryLabelContainer
              }
            >
              <View
                style={[
                  styles.summaryDot,
                  styles.dotCoral,
                ]}
              />

              <Text style={styles.summaryLabel}>
                Feeling
              </Text>
            </View>

            <Text style={styles.summaryValue}>
              {feeling || 'Not answered'}
            </Text>
          </View>

          {/* Stress */}

          <View style={styles.summaryRow}>
            <View
              style={
                styles.summaryLabelContainer
              }
            >
              <View
                style={[
                  styles.summaryDot,
                  styles.dotPeach,
                ]}
              />

              <Text style={styles.summaryLabel}>
                Stress
              </Text>
            </View>

            <Text style={styles.summaryValue}>
              {stress || 'Not answered'}
            </Text>
          </View>

          {/* Sleep */}

          <View style={styles.summaryRow}>
            <View
              style={
                styles.summaryLabelContainer
              }
            >
              <View
                style={[
                  styles.summaryDot,
                  styles.dotSage,
                ]}
              />

              <Text style={styles.summaryLabel}>
                Sleep
              </Text>
            </View>

            <Text style={styles.summaryValue}>
              {sleep || 'Not answered'}
            </Text>
          </View>

          {/* Energy */}

          <View style={styles.summaryRow}>
            <View
              style={
                styles.summaryLabelContainer
              }
            >
              <View
                style={[
                  styles.summaryDot,
                  styles.dotLavender,
                ]}
              />

              <Text style={styles.summaryLabel}>
                Energy
              </Text>
            </View>

            <Text style={styles.summaryValue}>
              {energy || 'Not answered'}
            </Text>
          </View>

          {/* Support */}

          <View
            style={[
              styles.summaryRow,
              styles.lastRow,
            ]}
          >
            <View
              style={
                styles.summaryLabelContainer
              }
            >
              <View
                style={[
                  styles.summaryDot,
                  styles.dotCoral,
                ]}
              />

              <Text style={styles.summaryLabel}>
                Support
              </Text>
            </View>

            <Text style={styles.summaryValue}>
              {support || 'Not answered'}
            </Text>
          </View>
        </Animated.View>

        {/* =================================
            Continue Home
        ================================= */}

        <Pressable
          style={styles.secondaryButton}
          onPress={() => isNewUser
            ? handleLoginAndNavigate()
            : navigation.getParent()?.navigate('Home')
          }
        >
          <Text
            style={styles.secondaryButtonText}
          >
            Continue to Home
          </Text>

          <View
            style={
              styles.secondaryArrowCircle
            }
          >
            <Text
              style={styles.secondaryArrow}
            >
              ›
            </Text>
          </View>
        </Pressable>

        {/* =================================
            Footer
        ================================= */}

        <View style={styles.footerContainer}>
          <View style={styles.footerDot} />

          <Text style={styles.footerText}>
            You can return to UWell anytime to
            check in, explore resources or
            connect with a counselor.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ======================================================
// STYLES
// ======================================================

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
    paddingTop: 4,
    paddingBottom: 38,
    position: 'relative',
    overflow: 'hidden',
  },

  // ====================================
  // Background
  // ====================================

  topDecoration: {
    position: 'absolute',
    width: 165,
    height: 165,
    borderRadius: 83,
    backgroundColor: '#FBE9E1',
    top: -95,
    right: -80,
    opacity: 0.55,
  },

  bottomDecoration: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#EDF3EC',
    bottom: -80,
    left: -80,
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
  // SAME 50 x 50 STANDARD
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
  // Header Text
  // ====================================

  headerTextSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 17,
  },

  smallTitle: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#EF806B',
    letterSpacing: 1.35,
    marginBottom: 5,
    textAlign: 'center',
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
    paddingHorizontal: 8,
  },

  // ====================================
  // Recommendation Card
  // ====================================

  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 17,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E4DE',
    marginBottom: 15,

    shadowColor: '#C6AEA1',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  // ====================================
  // Character Area
  // ====================================

  characterArea: {
    width: '100%',
    height: 170,
    borderRadius: 20,
    backgroundColor: '#FFF3EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F8E4DC',
  },

  stressArea: {
    backgroundColor: '#FFF1ED',
  },

  academicArea: {
    backgroundColor: '#FFF5E8',
  },

  sleepArea: {
    backgroundColor: '#F3F0FB',
  },

  supportArea: {
    backgroundColor: '#FFF0EA',
  },

  wellnessArea: {
    backgroundColor: '#F0F6EE',
  },

  // ====================================
  // Character Container
  // ====================================

  characterContainer: {
    width: 175,
    height: 155,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  character: {
    width: 132,
    height: 128,
    position: 'relative',
    alignItems: 'center',
  },

  // ====================================
  // Body
  // ====================================

  body: {
    position: 'absolute',
    bottom: 7,
    width: 116,
    height: 105,
    borderRadius: 56,
    borderWidth: 2,

    shadowColor: '#8F7770',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.16,
    shadowRadius: 9,
    elevation: 7,
  },

  bodyHighlight: {
    position: 'absolute',
    width: 53,
    height: 29,
    borderRadius: 20,
    backgroundColor:
      'rgba(255,255,255,0.30)',
    top: 11,
    left: 17,
    transform: [
      {
        rotate: '-18deg',
      },
    ],
  },

  // ====================================
  // Ears
  // ====================================

  ear: {
    position: 'absolute',
    width: 46,
    height: 49,
    borderRadius: 19,
    borderWidth: 2,
    top: 7,
    zIndex: 0,
  },

  leftEar: {
    left: 4,
    transform: [
      {
        rotate: '-20deg',
      },
    ],
  },

  rightEar: {
    right: 4,
    transform: [
      {
        rotate: '20deg',
      },
    ],
  },

  innerEar: {
    width: 24,
    height: 27,
    borderRadius: 13,
    alignSelf: 'center',
    marginTop: 9,
    opacity: 0.85,
  },

  // ====================================
  // Eyes
  // ====================================

  eyeLeft: {
    position: 'absolute',
    left: 27,
    top: 49,
    width: 23,
    height: 10,
  },

  eyeRight: {
    position: 'absolute',
    right: 27,
    top: 49,
    width: 23,
    height: 10,
  },

  eyeCurve: {
    width: 20,
    height: 7,
    borderBottomWidth: 3,
    borderColor: '#652828',
    borderRadius: 20,
  },

  sleepEyeLeft: {
    transform: [
      {
        rotate: '-8deg',
      },
    ],
  },

  sleepEyeRight: {
    transform: [
      {
        rotate: '8deg',
      },
    ],
  },

  sleepEyeCurve: {
    borderColor: '#51496E',
  },

  // ====================================
  // Face
  // ====================================

  nose: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#A85A5A',
    top: 67,
    left: 55,
  },

  mouth: {
    position: 'absolute',
    width: 14,
    height: 7,
    borderBottomWidth: 2.5,
    borderColor: '#652828',
    borderRadius: 12,
    top: 70,
    left: 51,
  },

  supportMouth: {
    width: 16,
    height: 8,
    borderBottomWidth: 3,
  },

  wellnessMouth: {
    width: 17,
    height: 8,
    borderBottomWidth: 3,
  },

  blush: {
    position: 'absolute',
    width: 17,
    height: 8,
    borderRadius: 9,
    backgroundColor: '#E99B9B',
    opacity: 0.50,
    top: 68,
  },

  blushLeft: {
    left: 16,
  },

  blushRight: {
    right: 16,
  },

  // ====================================
  // Arms
  // ====================================

  arm: {
    position: 'absolute',
    width: 30,
    height: 19,
    borderRadius: 15,
    bottom: 18,
    borderWidth: 2,
    zIndex: 2,
  },

  leftArm: {
    left: -9,
    transform: [
      {
        rotate: '25deg',
      },
    ],
  },

  rightArm: {
    right: -9,
    transform: [
      {
        rotate: '-25deg',
      },
    ],
  },

  // ====================================
  // Feet
  // ====================================

  foot: {
    position: 'absolute',
    width: 39,
    height: 25,
    borderRadius: 20,
    bottom: -3,
    borderWidth: 2,
    zIndex: 3,
  },

  leftFoot: {
    left: 18,
    transform: [
      {
        rotate: '15deg',
      },
    ],
  },

  rightFoot: {
    right: 18,
    transform: [
      {
        rotate: '-15deg',
      },
    ],
  },

  // ====================================
  // Stress Character
  // ====================================

  stressSpark: {
    position: 'absolute',
    top: 5,
    right: 28,
    fontSize: 22,
    color: '#EF806B',
    fontWeight: '800',
    zIndex: 10,
  },

  stressSparkSmall: {
    position: 'absolute',
    top: 31,
    right: 53,
    fontSize: 20,
    color: '#E9A091',
    fontWeight: '900',
    zIndex: 10,
  },

  tinyHeart: {
    position: 'absolute',
    top: 82,
    left: 51,
    fontSize: 13,
    color: '#D46D61',
  },

  // ====================================
  // Academic Character
  // ====================================

  graduationCap: {
    position: 'absolute',
    top: 0,
    left: 65,
    width: 46,
    height: 35,
    zIndex: 20,
    alignItems: 'center',
  },

  capTop: {
    width: 42,
    height: 18,
    backgroundColor: '#806F68',
    transform: [
      {
        rotate: '45deg',
      },
    ],
    borderRadius: 4,
  },

  capBase: {
    position: 'absolute',
    top: 12,
    width: 30,
    height: 12,
    backgroundColor: '#6C5A54',
    borderRadius: 3,
  },

  capTassel: {
    position: 'absolute',
    width: 2,
    height: 18,
    backgroundColor: '#EF806B',
    right: 2,
    top: 15,
    transform: [
      {
        rotate: '18deg',
      },
    ],
  },

  book: {
    position: 'absolute',
    width: 35,
    height: 25,
    backgroundColor: '#EF806B',
    borderRadius: 4,
    left: 41,
    top: 76,
    transform: [
      {
        rotate: '-5deg',
      },
    ],
    borderWidth: 1,
    borderColor: '#D66E5B',
    zIndex: 4,
  },

  bookLine: {
    width: 20,
    height: 2,
    backgroundColor:
      'rgba(255,255,255,0.65)',
    marginLeft: 7,
    marginTop: 7,
    borderRadius: 2,
  },

  // ====================================
  // Sleep Character
  // ====================================

  moonSymbol: {
    position: 'absolute',
    top: 3,
    left: 30,
    fontSize: 30,
    color: '#9B92C1',
    zIndex: 10,
  },

  sleepZLarge: {
    position: 'absolute',
    top: 3,
    right: 28,
    fontSize: 27,
    fontWeight: '900',
    color: '#8D84B5',
    transform: [
      {
        rotate: '8deg',
      },
    ],
    zIndex: 10,
  },

  sleepZSmall: {
    position: 'absolute',
    top: 31,
    right: 53,
    fontSize: 17,
    fontWeight: '800',
    color: '#AAA2CB',
    transform: [
      {
        rotate: '5deg',
      },
    ],
    zIndex: 10,
  },

  // ====================================
  // Support Character
  // ====================================

  chatBubble: {
    position: 'absolute',
    width: 50,
    height: 35,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    top: 5,
    right: 16,
    borderWidth: 2,
    borderColor: '#E3B3A5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    zIndex: 15,
  },

  chatDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D77D6D',
  },

  supportHeart: {
    position: 'absolute',
    top: 80,
    left: 50,
    fontSize: 14,
    color: '#D46D61',
  },

  // ====================================
  // Wellness Character
  // ====================================

  leafSymbol: {
    position: 'absolute',
    top: 5,
    right: 28,
    fontSize: 27,
    color: '#8EAA88',
    zIndex: 10,
  },

  smallLeaf: {
    position: 'absolute',
    width: 23,
    height: 15,
    backgroundColor: '#86A57D',
    borderTopLeftRadius: 18,
    borderBottomRightRadius: 18,
    left: 47,
    top: 78,
    transform: [
      {
        rotate: '-20deg',
      },
    ],
    zIndex: 4,
  },

  smallLeafLine: {
    position: 'absolute',
    width: 2,
    height: 17,
    backgroundColor: '#DCE9D7',
    left: 11,
    top: -1,
    transform: [
      {
        rotate: '40deg',
      },
    ],
  },

  // ====================================
  // Recommendation Label
  // ====================================

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  labelDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#EF806B',
    marginRight: 6,
  },

  recommendationLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1.15,
    color: '#C86250',
    textAlign: 'center',
  },

  // ====================================
  // Recommendation Text
  // ====================================

  recommendationTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#4A3833',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 9,
    paddingHorizontal: 8,
  },

  recommendationDescription: {
    fontSize: 12.5,
    lineHeight: 20,
    color: '#6F5D55',
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 5,
  },

  // ====================================
  // Primary Button
  // ====================================

  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 17,
    backgroundColor: '#EF806B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#EF806B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },

  arrowCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor:
      'rgba(255,255,255,0.20)',
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
  // Remember Card
  // ====================================

  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EA',
    borderRadius: 18,
    padding: 13,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F5DED5',
  },

  supportIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#EF806B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  supportIconText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '500',
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#5B433B',
    marginBottom: 3,
  },

  supportText: {
    fontSize: 10.5,
    lineHeight: 16,
    color: '#806F68',
  },

  // ====================================
  // Summary
  // ====================================

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: '#F0E4DE',
    marginBottom: 15,

    shadowColor: '#C6AEA1',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 1,
  },

  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },

  summaryEyebrow: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#EF806B',
    letterSpacing: 1.15,
    marginBottom: 3,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4A3833',
  },

  summaryCheck: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: '#EDF3EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryCheckText: {
    color: '#718C72',
    fontSize: 14,
    fontWeight: '800',
  },

  summaryRow: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1E8E3',
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  summaryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 8,
  },

  dotCoral: {
    backgroundColor: '#EF806B',
  },

  dotPeach: {
    backgroundColor: '#E7A07F',
  },

  dotSage: {
    backgroundColor: '#9BAE98',
  },

  dotLavender: {
    backgroundColor: '#B4A5B8',
  },

  summaryLabel: {
    fontSize: 12.5,
    color: '#806F68',
    fontWeight: '500',
  },

  summaryValue: {
    maxWidth: '57%',
    fontSize: 12.5,
    fontWeight: '700',
    color: '#4A3833',
    textAlign: 'right',
  },

  // ====================================
  // Secondary Button
  // ====================================

  secondaryButton: {
    height: 52,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: '#EF806B',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#B85C4A',
    fontSize: 13.5,
    fontWeight: '700',
  },

  secondaryArrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  secondaryArrow: {
    color: '#C86250',
    fontSize: 19,
    lineHeight: 20,
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
