import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  Image,
  ScrollView,
  Easing,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const CORAL = '#EF806B';
const CREAM = '#FFF9F3';
const DARK = '#4A3833';
const MUTED = '#806F68';
const WHITE = '#FFFFFF';

/* =========================================================
   UWELL LOGO
   Same UWell logo design used across the app
========================================================= */

function UWellLogo() {
  return (
    <View style={styles.logoCircle}>

      {/* Left leaf */}
      <View
        style={[
          styles.logoLeaf,
          styles.logoLeafLeft,
        ]}
      />

      {/* Right leaf */}
      <View
        style={[
          styles.logoLeaf,
          styles.logoLeafRight,
        ]}
      />

      {/* Small heart */}
      <Text style={styles.logoHeart}>
        ♡
      </Text>

      {/* Stem */}
      <View style={styles.logoStem} />

    </View>
  );
}

/* =========================================================
   SPLASH SCREEN
========================================================= */

function SplashScreen() {

  /* -------------------------------------------------------
     Animation values
  ------------------------------------------------------- */

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const logoScale = useRef(
    new Animated.Value(0.78)
  ).current;

  const logoPulse = useRef(
    new Animated.Value(1)
  ).current;

  const textFade = useRef(
    new Animated.Value(0)
  ).current;

  const textSlide = useRef(
    new Animated.Value(15)
  ).current;

  const bottomFade = useRef(
    new Animated.Value(0)
  ).current;

  /* -------------------------------------------------------
     Splash animation
  ------------------------------------------------------- */

  useEffect(() => {

    /*
      Initial values
      Keeps animation consistent every time splash appears.
    */

    fadeAnim.setValue(0);
    logoScale.setValue(0.78);
    logoPulse.setValue(1);
    textFade.setValue(0);
    textSlide.setValue(15);
    bottomFade.setValue(0);

    /* -----------------------------------------------------
       Professional entrance animation

       Fade
       +
       Small jump
       +
       Bounce
       +
       Smooth settle
    ----------------------------------------------------- */

    Animated.sequence([

      /* 1. Logo fades in and grows */

      Animated.parallel([

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.spring(logoScale, {
          toValue: 1.08,
          friction: 5,
          tension: 55,
          useNativeDriver: true,
        }),

      ]),

      /* 2. Small professional bounce */

      Animated.sequence([

        Animated.timing(logoScale, {
          toValue: 1.14,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(logoScale, {
          toValue: 1.08,
          duration: 220,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

      ]),

      /* 3. UWell text appears */

      Animated.parallel([

        Animated.timing(textFade, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(textSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

      ]),

      /* 4. Bottom message appears */

      Animated.timing(bottomFade, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

    ]).start();

    /* -----------------------------------------------------
       Very subtle breathing / pulse
    ----------------------------------------------------- */

    const pulse = Animated.loop(

      Animated.sequence([

        Animated.timing(logoPulse, {
          toValue: 1.035,
          duration: 1700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 1700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

      ])

    );

    pulse.start();

    return () => {
      pulse.stop();
    };

  }, []);

  return (

    <SafeAreaView style={styles.splashSafeArea}>

      <View style={styles.splashContainer}>

        {/* =================================================
            SOFT BACKGROUND DECORATIONS
        ================================================= */}

        <View style={styles.splashBlobOne} />

        <View style={styles.splashBlobTwo} />

        {/* =================================================
            UWELL SPLASH ICON
        ================================================= */}

        <Animated.View
          style={[
            styles.splashLogoWrapper,
            {
              opacity: fadeAnim,

              transform: [
                {
                  scale: Animated.multiply(
                    logoScale,
                    logoPulse
                  ),
                },
              ],
            },
          ]}
        >

          <UWellLogo />

        </Animated.View>

        {/* =================================================
            SPLASH TEXT
        ================================================= */}

        <Animated.View
          style={[
            styles.splashTextBlock,
            {
              opacity: textFade,

              transform: [
                {
                  translateY: textSlide,
                },
              ],
            },
          ]}
        >

          <Text style={styles.splashAppName}>
            UWell
          </Text>

          <Text style={styles.splashTagline}>
            Your wellbeing, your journey.
          </Text>

        </Animated.View>

        {/* =================================================
            BOTTOM MESSAGE
        ================================================= */}

        <Animated.View
          style={[
            styles.splashBottom,
            {
              opacity: bottomFade,
            },
          ]}
        >

          <View style={styles.splashDot} />

          <Text style={styles.splashBottomText}>
            Take a moment for yourself.
          </Text>

        </Animated.View>

      </View>

    </SafeAreaView>
  );
}

/* =========================================================
   WELCOME SCREEN
========================================================= */

export default function WelcomeScreen() {

  const [showSplash, setShowSplash] = useState(true);

  /* -------------------------------------------------------
     Welcome animation values
  ------------------------------------------------------- */

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const contentSlide = useRef(
    new Animated.Value(18)
  ).current;

  const imageScale = useRef(
    new Animated.Value(0.94)
  ).current;

  const imageFloat = useRef(
    new Animated.Value(0)
  ).current;

  const imageOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const buttonScale = useRef(
    new Animated.Value(1)
  ).current;

  const secondaryButtonScale = useRef(
    new Animated.Value(1)
  ).current;

  /* -------------------------------------------------------
     Splash duration
  ------------------------------------------------------- */

  useEffect(() => {

    const timer = setTimeout(() => {

      setShowSplash(false);

    }, 3500);

    return () => {

      clearTimeout(timer);

    };

  }, []);

  /* -------------------------------------------------------
     Welcome screen entrance animation
  ------------------------------------------------------- */

  useEffect(() => {

    if (showSplash) {
      return;
    }

    Animated.parallel([

      /* Content fade */

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      /* Content slide */

      Animated.timing(contentSlide, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      /* Image entrance */

      Animated.spring(imageScale, {
        toValue: 1,
        friction: 7,
        tension: 42,
        useNativeDriver: true,
      }),

      /* Image fade */

      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

    ]).start();

    /* -----------------------------------------------------
       Soft floating image animation
    ----------------------------------------------------- */

    const floatingAnimation = Animated.loop(

      Animated.sequence([

        Animated.timing(imageFloat, {
          toValue: -4,
          duration: 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(imageFloat, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(imageFloat, {
          toValue: 3,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(imageFloat, {
          toValue: 0,
          duration: 2400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

      ])

    );

    floatingAnimation.start();

    return () => {

      floatingAnimation.stop();

    };

  }, [showSplash]);

  /* -------------------------------------------------------
     Get Started
  ------------------------------------------------------- */

  const handleGetStarted = () => {

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

      router.push('/consent');

    });

  };

  /* -------------------------------------------------------
     Already have account
  ------------------------------------------------------- */

  const handleLogin = () => {

    Animated.sequence([

      Animated.spring(secondaryButtonScale, {
        toValue: 0.97,
        friction: 5,
        useNativeDriver: true,
      }),

      Animated.spring(secondaryButtonScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),

    ]).start(() => {

      router.push('/login');

    });

  };

  /* -------------------------------------------------------
     Show Splash
  ------------------------------------------------------- */

  if (showSplash) {

    return <SplashScreen />;

  }

  /* =======================================================
     WELCOME UI
  ======================================================= */

  return (

    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.container}>

          {/* =================================================
              BACKGROUND DECORATIONS
          ================================================= */}

          <View style={styles.topDecoration} />

          <View style={styles.bottomDecoration} />

          <View style={styles.smallDecorationOne} />

          <View style={styles.smallDecorationTwo} />

          {/* =================================================
              UWELL HEADER
          ================================================= */}

          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,

                transform: [
                  {
                    translateY: contentSlide,
                  },
                ],
              },
            ]}
          >

            <UWellLogo />

            <Text style={styles.appName}>
              UWell
            </Text>

            <Text style={styles.tagline}>
              Student Wellness
            </Text>

          </Animated.View>

          {/* =================================================
              MAIN IMAGE
          ================================================= */}

          <Animated.View
            style={[
              styles.illustrationWrapper,
              {
                opacity: imageOpacity,

                transform: [

                  {
                    translateY: imageFloat,
                  },

                  {
                    scale: imageScale,
                  },

                ],
              },
            ]}
          >

            <View style={styles.illustrationCard}>

              {/* Soft image background */}

              <View style={styles.imageBackdrop} />

              {/* Decorative circles */}

              <View style={styles.decorCircleOne} />

              <View style={styles.decorCircleTwo} />

              <View style={styles.decorCircleThree} />

              {/* Student illustration */}

              <Image
                source={require('../../assets/images/welcome-student.png')}
                style={styles.studentImage}
                resizeMode="contain"
              />

              {/* Soft bottom glow */}

              <View style={styles.imageBottomGlow} />

            </View>

          </Animated.View>

          {/* =================================================
              MAIN CONTENT
          ================================================= */}

          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,

                transform: [
                  {
                    translateY: contentSlide,
                  },
                ],
              },
            ]}
          >

            {/* =================================================
                TITLE
            ================================================= */}

            <Text style={styles.title}>
              Your mental health
            </Text>

            <Text style={styles.titleSecondLine}>
              matters
            </Text>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <Text style={styles.description}>
              A safe and supportive space for university
              students to care for their mental wellbeing,
              explore resources, and connect with support.
            </Text>

            {/* =================================================
                CALM MESSAGE
            ================================================= */}

            <View style={styles.calmMessage}>

              <View style={styles.calmDot} />

              <Text style={styles.calmText}>
                Take a moment for yourself.
              </Text>

            </View>

            {/* =================================================
                BUTTONS
            ================================================= */}

            <View style={styles.buttonsContainer}>

              {/* =================================================
                  ALREADY HAVE ACCOUNT
              ================================================= */}

              <Animated.View
                style={[
                  styles.buttonWrapper,
                  {
                    transform: [
                      {
                        scale: secondaryButtonScale,
                      },
                    ],
                  },
                ]}
              >

                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryButton,

                    pressed &&
                      styles.secondaryButtonPressed,
                  ]}
                  onPress={handleLogin}
                >

                  <Text style={styles.secondaryButtonText}>
                    I already have an account
                  </Text>

                </Pressable>

              </Animated.View>

              {/* =================================================
                  GET STARTED
              ================================================= */}

              <Animated.View
                style={[
                  styles.buttonWrapper,
                  {
                    transform: [
                      {
                        scale: buttonScale,
                      },
                    ],
                  },
                ]}
              >

                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,

                    pressed &&
                      styles.primaryButtonPressed,
                  ]}
                  onPress={handleGetStarted}
                >

                  <Text style={styles.primaryButtonText}>
                    Get Started
                  </Text>

                  <View style={styles.arrowCircle}>

                    <Text style={styles.arrow}>
                      ›
                    </Text>

                  </View>

                </Pressable>

              </Animated.View>

            </View>

            {/* =================================================
                PRIVACY
            ================================================= */}

            <View style={styles.privacyContainer}>

              <Text style={styles.lockIcon}>
                ♡
              </Text>

              <Text style={styles.privacyText}>
                Your privacy and confidentiality matter to us.
              </Text>

            </View>

          </Animated.View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* =======================================================
     MAIN SCREEN
  ======================================================= */

  safeArea: {
    flex: 1,
    backgroundColor: CREAM,
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,

    alignItems: 'center',

    paddingHorizontal: 20,

    paddingTop: 2,

    paddingBottom: 22,

    position: 'relative',

    overflow: 'hidden',
  },

  /* =======================================================
     BACKGROUND
  ======================================================= */

  topDecoration: {
    position: 'absolute',

    width: 175,
    height: 175,

    borderRadius: 88,

    backgroundColor: '#FBE9E1',

    top: -105,

    right: -82,

    opacity: 0.65,
  },

  bottomDecoration: {
    position: 'absolute',

    width: 160,
    height: 160,

    borderRadius: 80,

    backgroundColor: '#EDF3EC',

    bottom: -105,

    left: -82,

    opacity: 0.8,
  },

  smallDecorationOne: {
    position: 'absolute',

    width: 11,
    height: 11,

    borderRadius: 6,

    backgroundColor: '#E4C7B8',

    top: 135,

    left: 24,

    opacity: 0.55,
  },

  smallDecorationTwo: {
    position: 'absolute',

    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: '#C9DCC7',

    top: 195,

    right: 28,

    opacity: 0.7,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    alignItems: 'center',

    marginTop: 2,
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

    shadowOpacity: 0.14,

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

    opacity: 0.96,
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

    color: CORAL,

    fontSize: 14,

    fontWeight: '700',

    zIndex: 5,

    top: 16,
  },

  logoStem: {
    position: 'absolute',

    width: 2,

    height: 11,

    backgroundColor: WHITE,

    bottom: 10,

    borderRadius: 2,
  },

  appName: {
    fontSize: 26,

    fontWeight: '800',

    color: DARK,

    marginTop: 5,
  },

  tagline: {
    fontSize: 10,

    color: '#A18479',

    letterSpacing: 1,

    marginTop: 1,
  },

  /* =======================================================
     IMAGE
  ======================================================= */

  illustrationWrapper: {
    width: Math.min(width * 0.88, 355),

    aspectRatio: 1.42,

    marginTop: 15,
  },

  illustrationCard: {
    flex: 1,

    borderRadius: 28,

    backgroundColor: '#F7E9DF',

    overflow: 'hidden',

    position: 'relative',

    borderWidth: 1,

    borderColor: '#F0DED2',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: '#C9AFA0',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.09,

    shadowRadius: 12,

    elevation: 3,
  },

  imageBackdrop: {
    position: 'absolute',

    width: '100%',

    height: '100%',

    backgroundColor: '#F7E9DF',
  },

  /* No cropping */

  studentImage: {
    width: '100%',

    height: '100%',

    zIndex: 2,
  },

  imageBottomGlow: {
    position: 'absolute',

    width: '80%',

    height: 35,

    borderRadius: 25,

    bottom: -15,

    backgroundColor: '#E5D3C8',

    opacity: 0.22,

    zIndex: 1,
  },

  /* Decorative circles */

  decorCircleOne: {
    position: 'absolute',

    width: 32,

    height: 32,

    borderRadius: 16,

    backgroundColor: '#DCE8D9',

    top: 16,

    left: 16,

    opacity: 0.8,

    zIndex: 3,
  },

  decorCircleTwo: {
    position: 'absolute',

    width: 25,

    height: 25,

    borderRadius: 13,

    backgroundColor: '#EBD9CC',

    top: 20,

    right: 18,

    opacity: 0.8,

    zIndex: 3,
  },

  decorCircleThree: {
    position: 'absolute',

    width: 16,

    height: 16,

    borderRadius: 8,

    backgroundColor: WHITE,

    bottom: 17,

    left: 20,

    opacity: 0.75,

    zIndex: 3,
  },

  /* =======================================================
     CONTENT
  ======================================================= */

  content: {
    width: '100%',

    alignItems: 'center',

    marginTop: 1,
  },

  /* =======================================================
     TITLE
  ======================================================= */

  title: {
    fontSize: 27,

    lineHeight: 32,

    fontWeight: '800',

    color: DARK,

    textAlign: 'center',

    marginTop: 15,
  },

  titleSecondLine: {
    fontSize: 27,

    lineHeight: 32,

    fontWeight: '800',

    color: DARK,

    textAlign: 'center',

    marginTop: 0,
  },

  /* =======================================================
     DESCRIPTION
  ======================================================= */

  description: {
    fontSize: 12.5,

    lineHeight: 18,

    color: MUTED,

    textAlign: 'center',

    marginTop: 8,

    paddingHorizontal: 7,
  },

  /* =======================================================
     CALM MESSAGE
  ======================================================= */

  calmMessage: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 8,
  },

  calmDot: {
    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor: CORAL,

    marginRight: 6,

    opacity: 0.8,
  },

  calmText: {
    fontSize: 10.5,

    color: '#9A8178',

    fontWeight: '500',
  },

  /* =======================================================
     BUTTONS
  ======================================================= */

  buttonsContainer: {
    width: '100%',

    marginTop: 18,
  },

  buttonWrapper: {
    width: '100%',

    marginBottom: 10,
  },

  /* =======================================================
     SECONDARY BUTTON
  ======================================================= */

  secondaryButton: {
    width: '100%',

    height: 50,

    borderRadius: 25,

    backgroundColor: '#F3E8E2',

    borderWidth: 1,

    borderColor: '#E9D8D0',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: '#CDB8AD',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.07,

    shadowRadius: 5,

    elevation: 1,
  },

  secondaryButtonPressed: {
    opacity: 0.82,
  },

  secondaryButtonText: {
    color: DARK,

    fontSize: 14.5,

    fontWeight: '700',
  },

  /* =======================================================
     PRIMARY BUTTON
  ======================================================= */

  primaryButton: {
    width: '100%',

    height: 52,

    borderRadius: 26,

    backgroundColor: CORAL,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    shadowColor: CORAL,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.16,

    shadowRadius: 8,

    elevation: 3,
  },

  primaryButtonPressed: {
    opacity: 0.88,
  },

  primaryButtonText: {
    color: WHITE,

    fontSize: 15.5,

    fontWeight: '700',
  },

  /* =======================================================
     ARROW
  ======================================================= */

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
    color: WHITE,

    fontSize: 22,

    fontWeight: '400',

    lineHeight: 23,

    textAlign: 'center',

    marginTop: -1,
  },

  /* =======================================================
     PRIVACY
  ======================================================= */

  privacyContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    marginTop: 2,

    paddingHorizontal: 8,
  },

  lockIcon: {
    fontSize: 11,

    color: CORAL,

    marginRight: 5,
  },

  privacyText: {
    fontSize: 9.5,

    color: '#9A8780',

    textAlign: 'center',
  },

  /* =======================================================
     SPLASH SCREEN
  ======================================================= */

  splashSafeArea: {
    flex: 1,

    backgroundColor: CREAM,
  },

  splashContainer: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 25,

    position: 'relative',

    overflow: 'hidden',
  },

  splashBlobOne: {
    position: 'absolute',

    width: 260,

    height: 260,

    borderRadius: 130,

    backgroundColor: '#FBE9E1',

    top: -110,

    right: -105,

    opacity: 0.6,
  },

  splashBlobTwo: {
    position: 'absolute',

    width: 220,

    height: 220,

    borderRadius: 110,

    backgroundColor: '#EDF3EC',

    bottom: -105,

    left: -100,

    opacity: 0.75,
  },

  /* -------------------------------------------------------
     Splash logo wrapper

     Slightly larger than normal page logo.
     Actual logo design is NOT changed.
  ------------------------------------------------------- */

  splashLogoWrapper: {
    alignItems: 'center',

    justifyContent: 'center',

    marginBottom: 18,

    
  },

  /* =======================================================
     SPLASH TEXT
  ======================================================= */

  splashTextBlock: {
    alignItems: 'center',
  },

  splashAppName: {
    fontSize: 34,

    fontWeight: '800',

    color: DARK,

    letterSpacing: 0.2,
  },

  splashTagline: {
    fontSize: 12,

    color: '#927B72',

    marginTop: 5,

    letterSpacing: 0.4,
  },

  /* =======================================================
     SPLASH BOTTOM
  ======================================================= */

  splashBottom: {
    position: 'absolute',

    bottom: height < 700 ? 35 : 48,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',
  },

  splashDot: {
    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor: CORAL,

    marginRight: 7,
  },

  splashBottomText: {
    fontSize: 10.5,

    color: '#9A8178',

    fontWeight: '500',
  },

});