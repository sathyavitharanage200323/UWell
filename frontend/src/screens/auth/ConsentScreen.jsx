import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConsentScreen = ({ navigation }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataAccepted, setDataAccepted] = useState(false);

  const canContinue = termsAccepted && dataAccepted;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;
  const iconScale = useRef(new Animated.Value(0.9)).current;
  const iconFloat = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 650, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1, friction: 7, tension: 45, useNativeDriver: true }),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(iconFloat, { toValue: -2, duration: 1800, useNativeDriver: true }),
        Animated.timing(iconFloat, { toValue: 2, duration: 1800, useNativeDriver: true }),
        Animated.timing(iconFloat, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, []);

  const handleContinue = () => {
    if (!canContinue) return;

    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.97, friction: 5, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => navigation.navigate('Login'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Background decorations */}
        <View style={styles.topDecoration} />
        <View style={styles.bottomDecoration} />

        {/* Header */}
        <Animated.View
          style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Privacy & Consent</Text>
          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* Intro card */}
        <Animated.View
          style={[styles.introCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <Animated.View
            style={[
              styles.iconCircle,
              { transform: [{ scale: iconScale }, { translateY: iconFloat }] },
            ]}
          >
            <View style={styles.privacyShield}>
              <Text style={styles.privacyHeart}>♡</Text>
            </View>
          </Animated.View>

          <Text style={styles.introTitle}>Your privacy matters</Text>
          <Text style={styles.introText}>
            Before you continue, please review how UWell uses and protects your
            information. Your wellbeing and confidentiality are important to us.
          </Text>

          <View style={styles.reassurance}>
            <View style={styles.reassuranceDot} />
            <Text style={styles.reassuranceText}>Your information is handled with care.</Text>
          </View>
        </Animated.View>

        {/* Required Consent */}
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionTitle}>Required Consent</Text>

          <View style={styles.card}>
            {/* Terms */}
            <View style={styles.consentRow}>
              <View style={[styles.consentIconBox, termsAccepted && styles.consentIconBoxActive]}>
                <Text style={styles.consentIcon}>✓</Text>
              </View>
              <View style={styles.consentContent}>
                <Text style={styles.consentTitle}>Terms & Conditions</Text>
                <Text style={styles.consentText}>
                  I agree to use UWell according to its terms and conditions.
                </Text>
                <Pressable>
                  <Text style={styles.linkText}>Read terms ›</Text>
                </Pressable>
              </View>
              <Switch
                value={termsAccepted}
                onValueChange={setTermsAccepted}
                trackColor={{ false: '#E5D9D3', true: '#F5B5A7' }}
                thumbColor={termsAccepted ? '#EF806B' : '#FFFFFF'}
                ios_backgroundColor="#E5D9D3"
              />
            </View>

            <View style={styles.divider} />

            {/* Personal Data */}
            <View style={styles.consentRow}>
              <View style={[styles.consentIconBox, dataAccepted && styles.consentIconBoxActive]}>
                <Text style={styles.consentIcon}>♡</Text>
              </View>
              <View style={styles.consentContent}>
                <Text style={styles.consentTitle}>Personal Information</Text>
                <Text style={styles.consentText}>
                  I agree to the processing of my personal information to provide UWell services.
                </Text>
                <Pressable>
                  <Text style={styles.linkText}>Learn about privacy ›</Text>
                </Pressable>
              </View>
              <Switch
                value={dataAccepted}
                onValueChange={setDataAccepted}
                trackColor={{ false: '#E5D9D3', true: '#F5B5A7' }}
                thumbColor={dataAccepted ? '#EF806B' : '#FFFFFF'}
                ios_backgroundColor="#E5D9D3"
              />
            </View>
          </View>
        </Animated.View>

        {/* Counseling Confidentiality */}
        <Animated.View
          style={[styles.privacyCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.privacyIconBox}>
            <View style={styles.privacyShieldSmall}>
              <Text style={styles.smallHeart}>♡</Text>
            </View>
          </View>
          <View style={styles.privacyContentBlock}>
            <Text style={styles.privacyTitle}>Counseling Confidentiality</Text>
            <Text style={styles.privacyText}>
              Counseling-related information is treated as private and is only accessible to
              authorized users based on their role.
            </Text>
          </View>
        </Animated.View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, canContinue && styles.statusDotComplete]} />
          <Text style={styles.statusText}>
            {canContinue
              ? 'All required consent has been provided.'
              : 'Please review and accept both items to continue.'}
          </Text>
        </View>

        {/* Continue button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            style={[styles.continueButton, !canContinue && styles.disabledButton]}
            onPress={handleContinue}
            disabled={!canContinue}
          >
            <Text style={[styles.continueText, !canContinue && styles.disabledText]}>
              Continue
            </Text>
            {canContinue && (
              <View style={styles.arrowCircle}>
                <Text style={styles.arrow}>›</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* Privacy info link */}
        <Pressable style={styles.infoButton}>
          <Text style={styles.infoText}>View UWell Privacy Information</Text>
        </Pressable>

        <Text style={styles.bottomText}>
          You can review your privacy information again from your profile settings.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ConsentScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9F3' },
  container: { paddingHorizontal: 20, paddingBottom: 34, position: 'relative', overflow: 'hidden' },

  // Background
  topDecoration: {
    position: 'absolute', width: 155, height: 155, borderRadius: 78,
    backgroundColor: '#FBE9E1', top: -92, right: -75, opacity: 0.55,
  },
  bottomDecoration: {
    position: 'absolute', width: 145, height: 145, borderRadius: 73,
    backgroundColor: '#EDF3EC', bottom: -75, left: -75, opacity: 0.7,
  },

  // Header
  header: {
    height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0E4DE',
  },
  backText: { fontSize: 29, color: '#8B7770', fontWeight: '400', marginTop: -3 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#4A3833' },
  headerSpacer: { width: 40 },

  // Intro card
  introCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 20,
    alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#F0E4DE',
    shadowColor: '#C5AFA2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 2,
  },
  iconCircle: {
    width: 66, height: 66, borderRadius: 23, backgroundColor: '#FFF0EA',
    alignItems: 'center', justifyContent: 'center', marginBottom: 11,
  },
  privacyShield: {
    width: 43, height: 48, borderRadius: 20, backgroundColor: '#EF806B',
    alignItems: 'center', justifyContent: 'center', transform: [{ scaleY: 1.05 }],
  },
  privacyHeart: { color: '#FFFFFF', fontSize: 25, fontWeight: '500', marginTop: -2 },
  introTitle: { fontSize: 20, fontWeight: '800', color: '#4A3833', textAlign: 'center' },
  introText: {
    fontSize: 12, lineHeight: 19, color: '#806F68', textAlign: 'center',
    marginTop: 8, paddingHorizontal: 3,
  },
  reassurance: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  reassuranceDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF806B', marginRight: 6, opacity: 0.8 },
  reassuranceText: { fontSize: 10.5, color: '#9A8178', fontWeight: '500' },

  // Section title
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#4A3833', marginTop: 21, marginBottom: 10 },

  // Consent card
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 21, padding: 17,
    borderWidth: 1, borderColor: '#F0E4DE',
    shadowColor: '#C5AFA2', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
  },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start' },
  consentIconBox: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: '#FFF0EA',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  consentIconBoxActive: { backgroundColor: '#FCE1D9' },
  consentIcon: { fontSize: 20, color: '#EF806B', fontWeight: '700' },
  consentContent: { flex: 1, paddingRight: 7 },
  consentTitle: { fontSize: 13.5, fontWeight: '700', color: '#4A3833' },
  consentText: { fontSize: 10.8, lineHeight: 17, color: '#806F68', marginTop: 4 },
  linkText: { fontSize: 10.8, fontWeight: '700', color: '#D66F5D', marginTop: 6 },
  divider: { height: 1, backgroundColor: '#F2E8E3', marginVertical: 15 },

  // Counseling confidentiality
  privacyCard: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F7F3EF',
    borderRadius: 19, padding: 15, marginTop: 17,
    borderWidth: 1, borderColor: '#EFE5DE',
  },
  privacyIconBox: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  privacyShieldSmall: {
    width: 27, height: 30, borderRadius: 12, backgroundColor: '#EF806B',
    alignItems: 'center', justifyContent: 'center',
  },
  smallHeart: { color: '#FFFFFF', fontSize: 16, marginTop: -1 },
  privacyContentBlock: { flex: 1 },
  privacyTitle: { fontSize: 13.5, fontWeight: '700', color: '#4A3833', marginBottom: 5 },
  privacyText: { fontSize: 10.8, lineHeight: 17, color: '#806F68' },

  // Status
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 13, paddingHorizontal: 3 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D7CCC6', marginRight: 7 },
  statusDotComplete: { backgroundColor: '#EF806B' },
  statusText: { flex: 1, fontSize: 10.5, color: '#94817A', lineHeight: 16 },

  // Continue button
  continueButton: {
    height: 52, backgroundColor: '#EF806B', borderRadius: 17,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 17,
    shadowColor: '#EF806B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 7, elevation: 3,
  },
  disabledButton: { backgroundColor: '#E9DFDA', shadowOpacity: 0, elevation: 0 },
  continueText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  disabledText: { color: '#A99C96' },
  arrowCircle: {
    width: 25, height: 25, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center', justifyContent: 'center', marginLeft: 9,
  },
  arrow: { color: '#FFFFFF', fontSize: 21, lineHeight: 22, fontWeight: '400', textAlign: 'center', marginTop: -1 },

  // Info
  infoButton: { alignItems: 'center', marginTop: 12, paddingVertical: 7 },
  infoText: { fontSize: 11.5, fontWeight: '600', color: '#D66F5D' },
  bottomText: {
    fontSize: 9.5, lineHeight: 15, color: '#A08E87',
    textAlign: 'center', paddingHorizontal: 25, marginTop: 3,
  },
});
