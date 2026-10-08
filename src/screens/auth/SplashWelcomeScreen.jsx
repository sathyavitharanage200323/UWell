import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  ScrollView,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const CORAL = '#EF806B';
const CREAM = '#FFF9F3';
const DARK = '#4A3833';
const MUTED = '#806F68';
const WHITE = '#FFFFFF';

/* =========================================================
   UWELL LOGO
========================================================= */

function UWellLogo({ scale }) {
  return (
    <Animated.View style={[styles.logoCircle, scale && { transform: [{ scale }] }]}>
      <View style={[styles.logoLeaf, styles.logoLeafLeft]} />
      <View style={[styles.logoLeaf, styles.logoLeafRight]} />
      <Text style={styles.logoHeart}>♡</Text>
      <View style={styles.logoStem} />
    </Animated.View>
  );
}

/* =========================================================
   ILLUSTRATION — inline character (no external image needed)
========================================================= */

function WellnessIllustration() {
  return (
    <View style={styles.illustrationCard}>
      <View style={styles.imageBackdrop} />
      <View style={styles.decorCircleOne} />
      <View style={styles.decorCircleTwo} />
      <View style={styles.decorCircleThree} />

      {/* Centered character illustration */}
      <View style={styles.charWrapper}>
        {/* Head */}
        <View style={styles.charHead}>
          <View style={styles.charEyeLeft} />
          <View style={styles.charEyeRight} />
          <View style={styles.charSmile} />
          <View style={styles.charCheekL} />
          <View style={styles.charCheekR} />
        </View>
        {/* Body */}
        <View style={styles.charBody} />
        {/* Book */}
        <View style={styles.charBook}>
          <View style={styles.charBookLeft} />
          <View style={styles.charBookRight} />
        </View>
        {/* Floating dots */}
        <View style={[styles.floatDot, { top: 8, right: 10, width: 8, height: 8 }]} />
        <View style={[styles.floatDot, { top: 30, left: 8, width: 6, height: 6, backgroundColor: '#DCE8D9' }]} />
        <View style={[styles.floatDot, { bottom: 20, right: 14, width: 5, height: 5, backgroundColor: '#EBD9CC' }]} />
      </View>

      <View style={styles.imageBottomGlow} />
    </View>
  );
}

/* =========================================================
   SPLASH SCREEN
========================================================= */

function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.78)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(15)).current;
  const bottomFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    logoScale.setValue(0.78);
    textFade.setValue(0);
    textSlide.setValue(15);
    bottomFade.setValue(0);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1.08, friction: 5, tension: 55, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(logoScale, { toValue: 1.14, duration: 180, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(logoScale, { toValue: 1.08, duration: 220, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textFade, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(textSlide, { toValue: 0, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]),
      Animated.timing(bottomFade, { toValue: 1, duration: 450, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, { toValue: 1.035, duration: 1700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(logoPulse, { toValue: 1, duration: 1700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <SafeAreaView style={styles.splashSafeArea}>
      <View style={styles.splashContainer}>
        <View style={styles.splashBlobOne} />
        <View style={styles.splashBlobTwo} />

        <Animated.View
          style={[
            styles.splashLogoWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: Animated.multiply(logoScale, logoPulse) }],
            },
          ]}
        >
          <UWellLogo />
        </Animated.View>

        <Animated.View
          style={[styles.splashTextBlock, { opacity: textFade, transform: [{ translateY: textSlide }] }]}
        >
          <Text style={styles.splashAppName}>UWell</Text>
          <Text style={styles.splashTagline}>Your wellbeing, your journey.</Text>
        </Animated.View>

        <Animated.View style={[styles.splashBottom, { opacity: bottomFade }]}>
          <View style={styles.splashDot} />
          <Text style={styles.splashBottomText}>Take a moment for yourself.</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   WELCOME SCREEN (default export)
========================================================= */

const SplashWelcomeScreen = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(18)).current;
  const imageScale = useRef(new Animated.Value(0.94)).current;
  const imageFloat = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const secondaryButtonScale = useRef(new Animated.Value(1)).current;

  // Splash timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  // Welcome entrance animation
  useEffect(() => {
    if (showSplash) return;

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 750, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(contentSlide, { toValue: 0, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.spring(imageScale, { toValue: 1, friction: 7, tension: 42, useNativeDriver: true }),
      Animated.timing(imageOpacity, { toValue: 1, duration: 850, easing: Easing.out(Easing.ease), useNativeDriver: true }),
    ]).start();

    const floatAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(imageFloat, { toValue: -4, duration: 2800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(imageFloat, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(imageFloat, { toValue: 3, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(imageFloat, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    floatAnim.start();
    return () => floatAnim.stop();
  }, [showSplash]);

  const handleGetStarted = () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.97, friction: 5, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => navigation.navigate('Consent'));
  };

  const handleLogin = () => {
    Animated.sequence([
      Animated.spring(secondaryButtonScale, { toValue: 0.97, friction: 5, useNativeDriver: true }),
      Animated.spring(secondaryButtonScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => navigation.navigate('Login'));
  };

  if (showSplash) return <SplashScreen />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Background decorations */}
          <View style={styles.topDecoration} />
          <View style={styles.bottomDecoration} />
          <View style={styles.smallDecorationOne} />
          <View style={styles.smallDecorationTwo} />

          {/* Header */}
          <Animated.View
            style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: contentSlide }] }]}
          >
            <UWellLogo />
            <Text style={styles.appName}>UWell</Text>
            <Text style={styles.tagline}>Student Wellness</Text>
          </Animated.View>

          {/* Illustration */}
          <Animated.View
            style={[
              styles.illustrationWrapper,
              { opacity: imageOpacity, transform: [{ translateY: imageFloat }, { scale: imageScale }] },
            ]}
          >
            <WellnessIllustration />
          </Animated.View>

          {/* Content */}
          <Animated.View
            style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: contentSlide }] }]}
          >
            <Text style={styles.title}>Your mental health</Text>
            <Text style={styles.titleSecondLine}>matters</Text>

            <Text style={styles.description}>
              A safe and supportive space for university students to care for their mental
              wellbeing, explore resources, and connect with support.
            </Text>

            <View style={styles.calmMessage}>
              <View style={styles.calmDot} />
              <Text style={styles.calmText}>Take a moment for yourself.</Text>
            </View>

            <View style={styles.buttonsContainer}>
              {/* Already have account */}
              <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: secondaryButtonScale }] }]}>
                <Pressable
                  style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
                  onPress={handleLogin}
                >
                  <Text style={styles.secondaryButtonText}>I already have an account</Text>
                </Pressable>
              </Animated.View>

              {/* Get Started */}
              <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: buttonScale }] }]}>
                <Pressable
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
                  onPress={handleGetStarted}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                  <View style={styles.arrowCircle}>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </Pressable>
              </Animated.View>
            </View>

            <View style={styles.privacyContainer}>
              <Text style={styles.lockIcon}>♡</Text>
              <Text style={styles.privacyText}>Your privacy and confidentiality matter to us.</Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SplashWelcomeScreen;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREAM },
  scrollContent: { flexGrow: 1 },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 22,
    position: 'relative',
    overflow: 'hidden',
  },

  // Background
  topDecoration: {
    position: 'absolute', width: 175, height: 175, borderRadius: 88,
    backgroundColor: '#FBE9E1', top: -105, right: -82, opacity: 0.65,
  },
  bottomDecoration: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#EDF3EC', bottom: -105, left: -82, opacity: 0.8,
  },
  smallDecorationOne: {
    position: 'absolute', width: 11, height: 11, borderRadius: 6,
    backgroundColor: '#E4C7B8', top: 135, left: 24, opacity: 0.55,
  },
  smallDecorationTwo: {
    position: 'absolute', width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#C9DCC7', top: 195, right: 28, opacity: 0.7,
  },

  // Header
  header: { alignItems: 'center', marginTop: 2 },

  // Logo
  logoCircle: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: CORAL,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
    shadowColor: CORAL, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14, shadowRadius: 6, elevation: 3,
  },
  logoLeaf: {
    position: 'absolute', width: 9, height: 17, backgroundColor: WHITE,
    borderTopLeftRadius: 9, borderTopRightRadius: 2,
    borderBottomLeftRadius: 2, borderBottomRightRadius: 9, opacity: 0.96,
  },
  logoLeafLeft: { transform: [{ rotate: '-38deg' }], left: 13, top: 13 },
  logoLeafRight: { transform: [{ rotate: '38deg' }], right: 13, top: 13 },
  logoHeart: { position: 'absolute', color: CORAL, fontSize: 14, fontWeight: '700', zIndex: 5, top: 16 },
  logoStem: { position: 'absolute', width: 2, height: 11, backgroundColor: WHITE, bottom: 10, borderRadius: 2 },

  appName: { fontSize: 26, fontWeight: '800', color: DARK, marginTop: 5 },
  tagline: { fontSize: 10, color: '#A18479', letterSpacing: 1, marginTop: 1 },

  // Illustration
  illustrationWrapper: {
    width: Math.min(width * 0.88, 355),
    aspectRatio: 1.42,
    marginTop: 15,
  },
  illustrationCard: {
    flex: 1, borderRadius: 28, backgroundColor: '#F7E9DF',
    overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#F0DED2',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#C9AFA0', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09, shadowRadius: 12, elevation: 3,
  },
  imageBackdrop: { position: 'absolute', width: '100%', height: '100%', backgroundColor: '#F7E9DF' },
  imageBottomGlow: {
    position: 'absolute', width: '80%', height: 35, borderRadius: 25,
    bottom: -15, backgroundColor: '#E5D3C8', opacity: 0.22, zIndex: 1,
  },
  decorCircleOne: {
    position: 'absolute', width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#DCE8D9', top: 16, left: 16, opacity: 0.8, zIndex: 3,
  },
  decorCircleTwo: {
    position: 'absolute', width: 25, height: 25, borderRadius: 13,
    backgroundColor: '#EBD9CC', top: 20, right: 18, opacity: 0.8, zIndex: 3,
  },
  decorCircleThree: {
    position: 'absolute', width: 16, height: 16, borderRadius: 8,
    backgroundColor: WHITE, bottom: 17, left: 20, opacity: 0.75, zIndex: 3,
  },

  // Inline character
  charWrapper: { width: 120, height: 130, alignItems: 'center', position: 'relative', zIndex: 2 },
  charHead: {
    width: 64, height: 62, borderRadius: 32, backgroundColor: '#F3B8AD',
    position: 'relative', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#9E5C53', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14, shadowRadius: 5, elevation: 3,
  },
  charEyeLeft: {
    position: 'absolute', width: 12, height: 16, borderRadius: 7,
    backgroundColor: WHITE, left: 13, top: 22,
  },
  charEyeRight: {
    position: 'absolute', width: 12, height: 16, borderRadius: 7,
    backgroundColor: WHITE, right: 13, top: 22,
  },
  charSmile: {
    position: 'absolute', width: 18, height: 8,
    borderBottomWidth: 2, borderRadius: 10, borderColor: '#704E58', bottom: 12,
  },
  charCheekL: {
    position: 'absolute', width: 9, height: 5, borderRadius: 5,
    backgroundColor: 'rgba(239,128,107,0.28)', left: 7, bottom: 18,
  },
  charCheekR: {
    position: 'absolute', width: 9, height: 5, borderRadius: 5,
    backgroundColor: 'rgba(239,128,107,0.28)', right: 7, bottom: 18,
  },
  charBody: {
    width: 50, height: 38, borderTopLeftRadius: 25, borderTopRightRadius: 25,
    backgroundColor: '#D9B5D9', marginTop: 2,
    shadowColor: '#7F657D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  charBook: {
    flexDirection: 'row', marginTop: 4,
    shadowColor: '#8E655D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1,
  },
  charBookLeft: {
    width: 34, height: 26, borderTopLeftRadius: 6, borderBottomLeftRadius: 4,
    backgroundColor: '#FFF9F3', borderRightWidth: 1, borderRightColor: '#E0C8BC',
  },
  charBookRight: {
    width: 34, height: 26, borderTopRightRadius: 6, borderBottomRightRadius: 4,
    backgroundColor: '#FFF9F3',
  },
  floatDot: { position: 'absolute', borderRadius: 10, backgroundColor: '#DCE8D9' },

  // Content
  content: { width: '100%', alignItems: 'center', marginTop: 1 },
  title: { fontSize: 27, lineHeight: 32, fontWeight: '800', color: DARK, textAlign: 'center', marginTop: 15 },
  titleSecondLine: { fontSize: 27, lineHeight: 32, fontWeight: '800', color: DARK, textAlign: 'center', marginTop: 0 },
  description: { fontSize: 12.5, lineHeight: 18, color: MUTED, textAlign: 'center', marginTop: 8, paddingHorizontal: 7 },

  calmMessage: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  calmDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: CORAL, marginRight: 6, opacity: 0.8 },
  calmText: { fontSize: 10.5, color: '#9A8178', fontWeight: '500' },

  // Buttons
  buttonsContainer: { width: '100%', marginTop: 18 },
  buttonWrapper: { width: '100%', marginBottom: 10 },
  secondaryButton: {
    width: '100%', height: 50, borderRadius: 25, backgroundColor: '#F3E8E2',
    borderWidth: 1, borderColor: '#E9D8D0', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#CDB8AD', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 1,
  },
  secondaryButtonPressed: { opacity: 0.82 },
  secondaryButtonText: { color: DARK, fontSize: 14.5, fontWeight: '700' },
  primaryButton: {
    width: '100%', height: 52, borderRadius: 26, backgroundColor: CORAL,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: CORAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 8, elevation: 3,
  },
  primaryButtonPressed: { opacity: 0.88 },
  primaryButtonText: { color: WHITE, fontSize: 15.5, fontWeight: '700' },
  arrowCircle: {
    width: 25, height: 25, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center', justifyContent: 'center', marginLeft: 9,
  },
  arrow: { color: WHITE, fontSize: 22, fontWeight: '400', lineHeight: 23, textAlign: 'center', marginTop: -1 },

  // Privacy
  privacyContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 2, paddingHorizontal: 8 },
  lockIcon: { fontSize: 11, color: CORAL, marginRight: 5 },
  privacyText: { fontSize: 9.5, color: '#9A8780', textAlign: 'center' },

  // Splash
  splashSafeArea: { flex: 1, backgroundColor: CREAM },
  splashContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 25, position: 'relative', overflow: 'hidden',
  },
  splashBlobOne: {
    position: 'absolute', width: 260, height: 260, borderRadius: 130,
    backgroundColor: '#FBE9E1', top: -110, right: -105, opacity: 0.6,
  },
  splashBlobTwo: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#EDF3EC', bottom: -105, left: -100, opacity: 0.75,
  },
  splashLogoWrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  splashTextBlock: { alignItems: 'center' },
  splashAppName: { fontSize: 34, fontWeight: '800', color: DARK, letterSpacing: 0.2 },
  splashTagline: { fontSize: 12, color: '#927B72', marginTop: 5, letterSpacing: 0.4 },
  splashBottom: {
    position: 'absolute',
    bottom: height < 700 ? 35 : 48,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  splashDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: CORAL, marginRight: 7 },
  splashBottomText: { fontSize: 10.5, color: '#9A8178', fontWeight: '500' },
});
