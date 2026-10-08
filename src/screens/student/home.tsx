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
import { useNavigation } from '@react-navigation/native';

const CORAL = '#EF806B';
const CREAM = '#FFF9F3';
const DARK = '#4A3833';
const MUTED = '#806E68';
const WHITE = '#FFFFFF';
const PEACH = '#FCE4DC';
const SOFT_SAGE = '#DCE8DE';

/* =========================================================
   UWELL LOGO
========================================================= */

function UWellLogo({
  scaleAnim,
}: {
  scaleAnim?: Animated.Value;
}) {
  const logo = (
    <View style={styles.logoCircle}>
      <View style={[styles.logoLeaf, styles.logoLeafLeft]} />
      <View style={[styles.logoLeaf, styles.logoLeafRight]} />

      <Text style={styles.logoHeart}>♡</Text>

      <View style={styles.logoStem} />
    </View>
  );

  if (!scaleAnim) {
    return logo;
  }

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      {logo}
    </Animated.View>
  );
}

/* =========================================================
   PROFILE ICON
========================================================= */

function ProfileIcon() {
  return (
    <View style={styles.profileIcon}>
      <View style={styles.profileHead} />
      <View style={styles.profileBody} />
    </View>
  );
}

/* =========================================================
   CALM READING CHARACTER
   INSPIRED BY THE UPLOADED REFERENCE
========================================================= */

function ReadingCharacter() {
  return (
    <View style={styles.readingCharacter}>

      {/* Soft floor shadow */}
      <View style={styles.characterShadow} />

      {/* HEAD / FACE */}
      <View style={styles.characterHead}>

        {/* Soft 3D highlight */}
        <View style={styles.faceHighlight} />

        {/* Left cheek */}
        <View style={styles.faceCheekLeft} />

        {/* Right cheek */}
        <View style={styles.faceCheekRight} />

        {/* Left eye */}
        <View style={styles.characterEyeLeft}>
          <View style={styles.characterPupil} />
          <View style={styles.characterEyeShine} />
        </View>

        {/* Right eye */}
        <View style={styles.characterEyeRight}>
          <View style={styles.characterPupil} />
          <View style={styles.characterEyeShine} />
        </View>

        {/* Small eyebrows */}
        <View style={styles.characterBrowLeft} />
        <View style={styles.characterBrowRight} />

        {/* Gentle smile */}
        <View style={styles.characterSmile} />

      </View>

      {/* =================================================
          HEADPHONES
      ================================================= */}

      {/* Headphone band */}
      <View style={styles.headphoneBand} />

      {/* Left ear cup */}
      <View style={styles.headphoneLeft}>
        <View style={styles.headphoneInner} />
      </View>

      {/* Right ear cup */}
      <View style={styles.headphoneRight}>
        <View style={styles.headphoneInner} />
      </View>

      {/* Small headphone highlights */}
      <View style={styles.headphoneHighlightLeft} />
      <View style={styles.headphoneHighlightRight} />

      {/* =================================================
          BODY
      ================================================= */}

      <View style={styles.characterBody} />

      {/* Small collar */}
      <View style={styles.characterCollar} />

      {/* =================================================
          BOOK
      ================================================= */}

      <View style={styles.bookArea}>

        {/* Book shadow */}
        <View style={styles.bookShadow} />

        {/* Left page */}
        <View style={styles.bookLeftPage}>
          <View style={styles.bookLineOne} />
          <View style={styles.bookLineTwo} />
          <View style={styles.bookLineThree} />
        </View>

        {/* Right page */}
        <View style={styles.bookRightPage}>
          <View style={styles.bookLineOne} />
          <View style={styles.bookLineTwo} />
          <View style={styles.bookLineThree} />
        </View>

        {/* Book center */}
        <View style={styles.bookCenter} />

      </View>

      {/* Small hands holding book */}
      <View style={styles.handLeft} />
      <View style={styles.handRight} />

      {/* Little floating wellbeing dots */}
      <View style={styles.characterDotOne} />
      <View style={styles.characterDotTwo} />
      <View style={styles.characterDotThree} />

    </View>
  );
}

/* =========================================================
   MENTAL HEALTH ICON
========================================================= */

function MentalHealthIcon() {
  return (
    <View
      style={[
        styles.actionIconBox,
        { backgroundColor: '#FCE5DF' },
      ]}
    >
      <View style={styles.brainOuter}>
        <View style={styles.brainLineOne} />
        <View style={styles.brainLineTwo} />
        <View style={styles.brainLineThree} />
      </View>

      <View style={styles.heartSmall}>
        <View style={styles.heartSmallLeft} />
        <View style={styles.heartSmallRight} />
      </View>
    </View>
  );
}

/* =========================================================
   COUNSELOR ICON
========================================================= */

function CounselorIcon() {
  return (
    <View
      style={[
        styles.actionIconBox,
        { backgroundColor: '#E5EEE6' },
      ]}
    >
      <View style={styles.counselorHead} />
      <View style={styles.counselorBody} />

      <View style={styles.chatBubble}>
        <View style={styles.chatDot} />
        <View style={styles.chatDot} />
        <View style={styles.chatDot} />
      </View>
    </View>
  );
}

/* =========================================================
   CALENDAR ICON
========================================================= */

function CalendarIcon() {
  return (
    <View style={styles.calendarIcon}>

      <View style={styles.calendarTop}>
        <View style={styles.calendarRingLeft} />
        <View style={styles.calendarRingRight} />
      </View>

      <View style={styles.calendarBody}>
        <View style={styles.calendarLine} />

        <View style={styles.calendarGrid}>
          <View style={styles.calendarDot} />
          <View style={styles.calendarDot} />
          <View style={styles.calendarDot} />
          <View style={styles.calendarDot} />
          <View style={styles.calendarDot} />
          <View style={styles.calendarDot} />
        </View>
      </View>

    </View>
  );
}

/* =========================================================
   WELLNESS ICON
========================================================= */

function WellnessIcon() {
  return (
    <View style={styles.wellnessIcon}>
      <View style={styles.leafOne} />
      <View style={styles.leafTwo} />
      <View style={styles.leafStem} />
    </View>
  );
}

/* =========================================================
   HOME SCREEN
========================================================= */

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;
  const logoScale = useRef(new Animated.Value(0.92)).current;
  const characterFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(characterFloat, {
          toValue: -3,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(characterFloat, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>

      <Animated.View
        style={[
          styles.container,
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
          contentContainerStyle={styles.scrollContent}
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <View style={styles.header}>

            <View style={styles.headerSideSpace} />

            <UWellLogo scaleAnim={logoScale} />

            <Pressable
              style={({ pressed }) => [
                styles.profileButton,
                pressed && styles.pressed,
              ]}
              onPress={() => navigation.getParent()?.navigate('Profile')}
            >
              <ProfileIcon />
            </Pressable>

          </View>

          {/* =================================================
              GREETING
          ================================================= */}

          <View style={styles.greetingSection}>

            <Text style={styles.greeting}>
              Good Morning
            </Text>

            <Text style={styles.welcomeText}>
              Welcome back to UWell
            </Text>

            <Text style={styles.supportText}>
              Take a moment for yourself today.
            </Text>

          </View>

          {/* =================================================
              DAILY MOOD CHECK-IN HERO
          ================================================= */}

          <Pressable
            onPress={() => navigation.getParent()?.navigate('Mood')}
            style={({ pressed }) => [
              styles.heroCard,
              pressed && styles.heroPressed,
            ]}
          >

            <View style={styles.heroContent}>

              {/* LEFT CONTENT */}

              <View style={styles.heroTextSection}>

                <View style={styles.heroBadge}>

                  <View style={styles.badgeDot} />

                  <Text style={styles.heroBadgeText}>
                    DAILY WELLBEING
                  </Text>

                </View>

                <Text style={styles.heroTitle}>
                  How are you{'\n'}
                  feeling today?
                </Text>

                <Text style={styles.heroDescription}>
                  Check in with yourself and see
                  what support may help you today.
                </Text>

                <View style={styles.checkInButton}>

                  <Text style={styles.checkInButtonText}>
                    Daily Mood Check-In
                  </Text>

                  <View style={styles.arrowCircle}>
                    <Text style={styles.arrowText}>
                      ›
                    </Text>
                  </View>

                </View>

              </View>

              {/* READING CHARACTER */}

              <Animated.View
                style={[
                  styles.characterWrapper,
                  {
                    transform: [
                      {
                        translateY: characterFloat,
                      },
                    ],
                  },
                ]}
              >
                <ReadingCharacter />
              </Animated.View>

            </View>

          </Pressable>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <View style={styles.sectionHeader}>

            <View>

              <Text style={styles.sectionTitle}>
                Quick Actions
              </Text>

              <Text style={styles.sectionSubtitle}>
                Support when you need it
              </Text>

            </View>

          </View>

          <View style={styles.quickActionsRow}>

            {/* MENTAL HEALTH */}

            <Pressable
              style={({ pressed }) => [
                styles.quickCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                navigation.navigate('MentalHealthTips')
              }
            >

              <MentalHealthIcon />

              <Text style={styles.quickTitle}>
                Mental Health
              </Text>

              <Text style={styles.quickDescription}>
                Tips & guidance
              </Text>

              <View style={styles.smallArrow}>
                <Text style={styles.smallArrowText}>
                  ›
                </Text>
              </View>

            </Pressable>

            {/* COUNSELOR */}

            <Pressable
              style={({ pressed }) => [
                styles.quickCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                navigation.getParent()?.navigate('Counselors')
              }
            >

              <CounselorIcon />

              <Text style={styles.quickTitle}>
                Find Counselor
              </Text>

              <Text style={styles.quickDescription}>
                Get personal support
              </Text>

              <View style={styles.smallArrow}>
                <Text style={styles.smallArrowText}>
                  ›
                </Text>
              </View>

            </Pressable>

          </View>

          {/* =================================================
              APPOINTMENTS
          ================================================= */}

          <View style={styles.sectionHeaderAppointment}>

            <Text style={styles.sectionTitle}>
              My Appointments
            </Text>

            <Pressable
              onPress={() =>
                navigation.getParent()?.navigate('Sessions')
              }
            >

              <Text style={styles.viewAll}>
                View All
              </Text>

            </Pressable>

          </View>

          <Pressable
            style={({ pressed }) => [
              styles.appointmentCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              navigation.getParent()?.navigate('Sessions')
            }
          >

            <View style={styles.appointmentIconContainer}>
              <CalendarIcon />
            </View>

            <View style={styles.appointmentText}>

              <Text style={styles.appointmentTitle}>
                Your appointments
              </Text>

              <Text style={styles.appointmentDescription}>
                View upcoming counseling sessions
              </Text>

            </View>

            <View style={styles.appointmentArrow}>

              <Text style={styles.appointmentArrowText}>
                ›
              </Text>

            </View>

          </Pressable>

          {/* =================================================
              WELLNESS RESOURCES
          ================================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.resourceCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              navigation.getParent()?.navigate('Resources')
            }
          >

            <View style={styles.resourceIconContainer}>
              <WellnessIcon />
            </View>

            <View style={styles.resourceText}>

              <Text style={styles.resourceTitle}>
                Wellness Resources
              </Text>

              <Text style={styles.resourceDescription}>
                Explore helpful resources for your wellbeing
              </Text>

            </View>

            <View style={styles.resourceArrow}>

              <Text style={styles.resourceArrowText}>
                ›
              </Text>

            </View>

          </Pressable>

          {/* =================================================
              BOTTOM MESSAGE
          ================================================= */}

          <View style={styles.bottomMessage}>

            <View style={styles.bottomLeaf}>
              <WellnessIcon />
            </View>

            <Text style={styles.bottomMessageText}>
              Your wellbeing matters.
            </Text>

            <Text style={styles.bottomMessageSubtext}>
              Small steps can make a meaningful difference.
            </Text>

          </View>

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

  container: {
    flex: 1,
    backgroundColor: CREAM,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerSideSpace: {
    width: 46,
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
     PROFILE
  ======================================================= */

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1E5DF',
  },

  profileIcon: {
    width: 25,
    height: 25,
    alignItems: 'center',
  },

  profileHead: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: DARK,
    marginTop: 1,
  },

  profileBody: {
    width: 20,
    height: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: DARK,
    position: 'absolute',
    bottom: 1,
  },

  /* =======================================================
     GREETING
  ======================================================= */

  greetingSection: {
    marginTop: 8,
    marginBottom: 14,
  },

  greeting: {
    fontSize: 14,
    color: MUTED,
    fontWeight: '500',
    marginBottom: 3,
  },

  welcomeText: {
    fontSize: 26,
    color: DARK,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  supportText: {
    fontSize: 13,
    color: MUTED,
    marginTop: 5,
  },

  /* =======================================================
     HERO
  ======================================================= */

  heroCard: {
    backgroundColor: CORAL,
    borderRadius: 27,
    overflow: 'hidden',
    minHeight: 224,

    shadowColor: '#C96857',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 4,
  },

  heroPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },

  heroContent: {
    minHeight: 224,
    flexDirection: 'row',
    paddingLeft: 19,
    paddingTop: 16,
    paddingBottom: 14,
    position: 'relative',
  },

  heroTextSection: {
    flex: 1,
    zIndex: 5,
  },

  heroBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: WHITE,
    marginRight: 5,
  },

  heroBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    color: WHITE,
    letterSpacing: 0.9,
  },

  heroTitle: {
    color: WHITE,
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '700',
    marginTop: 11,
  },

  heroDescription: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 7,
    maxWidth: 175,
  },

  checkInButton: {
    height: 39,
    backgroundColor: WHITE,
    borderRadius: 21,
    marginTop: 12,
    paddingLeft: 12,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    minWidth: 158,
  },

  checkInButtonText: {
    color: DARK,
    fontSize: 10.5,
    fontWeight: '700',
  },

  arrowCircle: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: CORAL,
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowText: {
    color: WHITE,
    fontSize: 22,
    lineHeight: 24,
    marginTop: -2,
  },

  /* =======================================================
     READING CHARACTER
  ======================================================= */

  characterWrapper: {
    width: 126,
    height: 145,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -3,
    marginTop: 4,
  },

  readingCharacter: {
    width: 116,
    height: 132,
    position: 'relative',
    alignItems: 'center',
  },

  characterShadow: {
    position: 'absolute',
    width: 65,
    height: 9,
    borderRadius: 10,
    backgroundColor: 'rgba(100,70,65,0.15)',
    bottom: 4,
    left: 25,
  },

  /* =======================================================
     FACE
  ======================================================= */

  characterHead: {
    position: 'absolute',
    width: 70,
    height: 68,
    borderRadius: 35,
    backgroundColor: '#F3B8AD',
    top: 24,
    left: 23,
    zIndex: 5,

    shadowColor: '#9E5C53',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 4,
  },

  faceHighlight: {
    position: 'absolute',
    width: 22,
    height: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.48)',
    top: 8,
    left: 13,
    transform: [{ rotate: '-22deg' }],
  },

  faceCheekLeft: {
    position: 'absolute',
    width: 10,
    height: 6,
    borderRadius: 7,
    backgroundColor: 'rgba(239,128,107,0.28)',
    left: 9,
    bottom: 20,
  },

  faceCheekRight: {
    position: 'absolute',
    width: 10,
    height: 6,
    borderRadius: 7,
    backgroundColor: 'rgba(239,128,107,0.28)',
    right: 9,
    bottom: 20,
  },

  /* =======================================================
     EYES
  ======================================================= */

  characterEyeLeft: {
    position: 'absolute',
    width: 13,
    height: 18,
    borderRadius: 8,
    backgroundColor: WHITE,
    left: 15,
    top: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },

  characterEyeRight: {
    position: 'absolute',
    width: 13,
    height: 18,
    borderRadius: 8,
    backgroundColor: WHITE,
    right: 15,
    top: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },

  characterPupil: {
    width: 7,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5D4853',
  },

  characterEyeShine: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: WHITE,
    left: 3,
    top: 3,
  },

  /* =======================================================
     EYEBROWS
  ======================================================= */

  characterBrowLeft: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#77545A',
    left: 16,
    top: 21,
    transform: [{ rotate: '-8deg' }],
  },

  characterBrowRight: {
    position: 'absolute',
    width: 10,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#77545A',
    right: 16,
    top: 21,
    transform: [{ rotate: '8deg' }],
  },

  /* =======================================================
     SMILE
  ======================================================= */

  characterSmile: {
    position: 'absolute',
    width: 19,
    height: 9,
    borderBottomWidth: 2,
    borderRadius: 12,
    borderColor: '#704E58',
    left: 25,
    bottom: 14,
  },

  /* =======================================================
     HEADPHONES
  ======================================================= */

  headphoneBand: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 5,
    borderBottomColor: 'transparent',
    borderLeftColor: '#D9B4DE',
    borderRightColor: '#D9B4DE',
    borderTopColor: '#EF806B',
    left: 17,
    top: 4,
    zIndex: 2,
  },

  headphoneLeft: {
    position: 'absolute',
    width: 13,
    height: 28,
    borderRadius: 8,
    backgroundColor: CORAL,
    left: 11,
    top: 34,
    zIndex: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headphoneRight: {
    position: 'absolute',
    width: 13,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#B99AD0',
    right: 11,
    top: 34,
    zIndex: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headphoneInner: {
    width: 7,
    height: 18,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.30)',
  },

  headphoneHighlightLeft: {
    position: 'absolute',
    width: 4,
    height: 10,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
    left: 14,
    top: 38,
    zIndex: 10,
  },

  headphoneHighlightRight: {
    position: 'absolute',
    width: 4,
    height: 10,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
    right: 14,
    top: 38,
    zIndex: 10,
  },

  /* =======================================================
     BODY
  ======================================================= */

  characterBody: {
    position: 'absolute',
    width: 54,
    height: 40,
    borderTopLeftRadius: 27,
    borderTopRightRadius: 27,
    backgroundColor: '#D9B5D9',
    left: 31,
    top: 84,
    zIndex: 3,

    shadowColor: '#7F657D',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  characterCollar: {
    position: 'absolute',
    width: 22,
    height: 7,
    borderRadius: 6,
    backgroundColor: '#F7D7CF',
    left: 47,
    top: 84,
    zIndex: 6,
  },

  /* =======================================================
     BOOK
  ======================================================= */

  bookArea: {
    position: 'absolute',
    width: 78,
    height: 40,
    left: 19,
    top: 88,
    zIndex: 10,
  },

  bookShadow: {
    position: 'absolute',
    width: 70,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(70,50,50,0.15)',
    bottom: -3,
    left: 4,
  },

  bookLeftPage: {
    position: 'absolute',
    width: 38,
    height: 30,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 5,
    backgroundColor: '#FFF9F3',
    left: 1,
    top: 2,

    transform: [{ rotate: '-5deg' }],

    shadowColor: '#8E655D',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },

  bookRightPage: {
    position: 'absolute',
    width: 38,
    height: 30,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 5,
    backgroundColor: '#FFFDF9',
    right: 1,
    top: 2,

    transform: [{ rotate: '5deg' }],

    shadowColor: '#8E655D',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },

  bookCenter: {
    position: 'absolute',
    width: 3,
    height: 30,
    borderRadius: 2,
    backgroundColor: CORAL,
    left: 37,
    top: 5,
    zIndex: 4,
  },

  bookLineOne: {
    position: 'absolute',
    width: 20,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#E8B7AC',
    left: 8,
    top: 9,
  },

  bookLineTwo: {
    position: 'absolute',
    width: 23,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#E8B7AC',
    left: 8,
    top: 15,
  },

  bookLineThree: {
    position: 'absolute',
    width: 17,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#E8B7AC',
    left: 8,
    top: 21,
  },

  /* =======================================================
     HANDS
  ======================================================= */

  handLeft: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#F3B8AD',
    left: 20,
    top: 103,
    zIndex: 12,
  },

  handRight: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#F3B8AD',
    right: 20,
    top: 103,
    zIndex: 12,
  },

  /* =======================================================
     DECORATIVE DOTS
  ======================================================= */

  characterDotOne: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DCE8DE',
    left: 3,
    top: 27,
  },

  characterDotTwo: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FCE4DC',
    right: 4,
    top: 21,
  },

  characterDotThree: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E7D5EA',
    right: 2,
    top: 69,
  },

  /* =======================================================
     QUICK ACTIONS
  ======================================================= */

  sectionHeader: {
    marginTop: 19,
    marginBottom: 10,
  },

  sectionHeaderAppointment: {
    marginTop: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 17,
    color: DARK,
    fontWeight: '700',
  },

  sectionSubtitle: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
  },

  viewAll: {
    color: CORAL,
    fontSize: 12,
    fontWeight: '700',
  },

  quickActionsRow: {
    flexDirection: 'row',
    gap: 11,
  },

  quickCard: {
    flex: 1,
    minHeight: 139,
    backgroundColor: WHITE,
    borderRadius: 21,
    padding: 13,
    borderWidth: 1,
    borderColor: '#F0E5DF',
    position: 'relative',
  },

  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },

  actionIconBox: {
    width: 45,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  /* =======================================================
     MENTAL HEALTH ICON
  ======================================================= */

  brainOuter: {
    width: 26,
    height: 28,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: CORAL,
    position: 'relative',
  },

  brainLineOne: {
    position: 'absolute',
    width: 9,
    height: 2,
    backgroundColor: CORAL,
    top: 8,
    left: 5,
    transform: [{ rotate: '25deg' }],
  },

  brainLineTwo: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: CORAL,
    top: 15,
    left: 7,
    transform: [{ rotate: '-25deg' }],
  },

  brainLineThree: {
    position: 'absolute',
    width: 7,
    height: 2,
    backgroundColor: CORAL,
    top: 21,
    left: 9,
    transform: [{ rotate: '20deg' }],
  },

  heartSmall: {
    position: 'absolute',
    width: 12,
    height: 12,
    right: 3,
    bottom: 4,
  },

  heartSmallLeft: {
    position: 'absolute',
    width: 6,
    height: 9,
    backgroundColor: CORAL,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    transform: [{ rotate: '-45deg' }],
  },

  heartSmallRight: {
    position: 'absolute',
    width: 6,
    height: 9,
    backgroundColor: CORAL,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    transform: [{ rotate: '45deg' }],
    right: 0,
  },

  /* =======================================================
     COUNSELOR ICON
  ======================================================= */

  counselorHead: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#557B60',
    backgroundColor: WHITE,
    position: 'absolute',
    top: 7,
  },

  counselorBody: {
    width: 28,
    height: 18,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#557B60',
    position: 'absolute',
    bottom: 5,
  },

  chatBubble: {
    width: 23,
    height: 17,
    borderRadius: 8,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: '#557B60',
    position: 'absolute',
    right: 1,
    top: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },

  chatDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#557B60',
  },

  quickTitle: {
    color: DARK,
    fontSize: 13.5,
    fontWeight: '700',
  },

  quickDescription: {
    color: MUTED,
    fontSize: 10.5,
    marginTop: 4,
    lineHeight: 14,
    maxWidth: 120,
  },

  smallArrow: {
    position: 'absolute',
    right: 11,
    bottom: 11,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#FFF4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallArrowText: {
    color: CORAL,
    fontSize: 20,
    lineHeight: 21,
    marginTop: -2,
  },

  /* =======================================================
     APPOINTMENTS
  ======================================================= */

  appointmentCard: {
    backgroundColor: WHITE,
    borderRadius: 21,
    minHeight: 74,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E5DF',
  },

  appointmentIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FFF0EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  calendarIcon: {
    width: 29,
    height: 29,
  },

  calendarTop: {
    width: 29,
    height: 9,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: CORAL,
    position: 'absolute',
    top: 2,
  },

  calendarRingLeft: {
    width: 3,
    height: 7,
    borderRadius: 2,
    backgroundColor: DARK,
    position: 'absolute',
    top: -3,
    left: 7,
  },

  calendarRingRight: {
    width: 3,
    height: 7,
    borderRadius: 2,
    backgroundColor: DARK,
    position: 'absolute',
    top: -3,
    right: 7,
  },

  calendarBody: {
    width: 29,
    height: 22,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: CORAL,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    position: 'absolute',
    bottom: 1,
  },

  calendarLine: {
    position: 'absolute',
    top: 5,
    left: 4,
    right: 4,
    height: 1.5,
    backgroundColor: '#F2C0B6',
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 19,
    gap: 4,
    position: 'absolute',
    top: 9,
    left: 5,
  },

  calendarDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: CORAL,
  },

  appointmentText: {
    flex: 1,
    marginLeft: 11,
  },

  appointmentTitle: {
    color: DARK,
    fontSize: 13.5,
    fontWeight: '700',
  },

  appointmentDescription: {
    color: MUTED,
    fontSize: 10.5,
    marginTop: 3,
    lineHeight: 14,
  },

  appointmentArrow: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#FFF4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  appointmentArrowText: {
    color: CORAL,
    fontSize: 21,
    marginTop: -2,
  },

  /* =======================================================
     WELLNESS RESOURCES
  ======================================================= */

  resourceCard: {
    marginTop: 11,
    backgroundColor: SOFT_SAGE,
    borderRadius: 21,
    minHeight: 76,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  resourceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  wellnessIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  leafOne: {
    position: 'absolute',
    width: 17,
    height: 25,
    borderRadius: 17,
    backgroundColor: '#648A6C',
    transform: [{ rotate: '-35deg' }],
    left: 3,
    top: 1,
  },

  leafTwo: {
    position: 'absolute',
    width: 16,
    height: 24,
    borderRadius: 16,
    backgroundColor: '#88A88D',
    transform: [{ rotate: '40deg' }],
    right: 2,
    top: 6,
  },

  leafStem: {
    width: 2,
    height: 25,
    borderRadius: 2,
    backgroundColor: '#557B60',
    transform: [{ rotate: '10deg' }],
    position: 'absolute',
    bottom: 0,
    left: 16,
  },

  resourceText: {
    flex: 1,
    marginLeft: 11,
  },

  resourceTitle: {
    color: DARK,
    fontSize: 13.5,
    fontWeight: '700',
  },

  resourceDescription: {
    color: '#68766B',
    fontSize: 10.5,
    lineHeight: 14,
    marginTop: 3,
    paddingRight: 5,
  },

  resourceArrow: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  resourceArrowText: {
    color: '#557B60',
    fontSize: 21,
    marginTop: -2,
  },

  /* =======================================================
     BOTTOM MESSAGE
  ======================================================= */

  bottomMessage: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 4,
  },

  bottomLeaf: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PEACH,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  bottomMessageText: {
    color: DARK,
    fontSize: 12.5,
    fontWeight: '700',
  },

  bottomMessageSubtext: {
    color: MUTED,
    fontSize: 10,
    marginTop: 2,
  },

  pressed: {
    opacity: 0.85,
  },

});