import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ConsentScreen() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataAccepted, setDataAccepted] = useState(false);

  const canContinue = termsAccepted && dataAccepted;

  const handleContinue = () => {
    if (!canContinue) {
      return;
    }

    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Privacy & Consent
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Intro */}
        <View style={styles.introCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>

          <Text style={styles.introTitle}>
            Your privacy matters
          </Text>

          <Text style={styles.introText}>
            Before you continue, please review how
            UWell uses and protects your information.
            Your wellbeing and confidentiality are
            important to us.
          </Text>
        </View>

        {/* Consent Section */}
        <Text style={styles.sectionTitle}>
          Required Consent
        </Text>

        <View style={styles.card}>

          {/* Terms */}
          <View style={styles.consentRow}>
            <View style={styles.consentIconBox}>
              <Text style={styles.consentIcon}>📄</Text>
            </View>

            <View style={styles.consentContent}>
              <Text style={styles.consentTitle}>
                Terms & Conditions
              </Text>

              <Text style={styles.consentText}>
                I agree to use UWell according to its
                terms and conditions.
              </Text>

              <Pressable>
                <Text style={styles.linkText}>
                  Read terms →
                </Text>
              </Pressable>
            </View>

            <Switch
              value={termsAccepted}
              onValueChange={setTermsAccepted}
              trackColor={{
                false: '#D8CCC7',
                true: '#F6B7A8',
              }}
              thumbColor={
                termsAccepted
                  ? '#C85F4D'
                  : '#FFFFFF'
              }
            />
          </View>

          <View style={styles.divider} />

          {/* Personal Data */}
          <View style={styles.consentRow}>
            <View style={styles.consentIconBox}>
              <Text style={styles.consentIcon}>🔐</Text>
            </View>

            <View style={styles.consentContent}>
              <Text style={styles.consentTitle}>
                Personal Information
              </Text>

              <Text style={styles.consentText}>
                I agree to the processing of my personal
                information to provide UWell services.
              </Text>

              <Pressable>
                <Text style={styles.linkText}>
                  Learn about privacy →
                </Text>
              </Pressable>
            </View>

            <Switch
              value={dataAccepted}
              onValueChange={setDataAccepted}
              trackColor={{
                false: '#D8CCC7',
                true: '#F6B7A8',
              }}
              thumbColor={
                dataAccepted
                  ? '#C85F4D'
                  : '#FFFFFF'
              }
            />
          </View>
        </View>

        {/* Counseling Privacy */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyIconBox}>
            <Text style={styles.privacyIcon}>
              🛡️
            </Text>
          </View>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Counseling Confidentiality
            </Text>

            <Text style={styles.privacyText}>
              Counseling-related information is treated
              as private and is only accessible to
              authorized users based on their role.
            </Text>
          </View>
        </View>

        {/* Continue */}
        <Pressable
          style={[
            styles.continueButton,
            !canContinue && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Text
            style={[
              styles.continueText,
              !canContinue && styles.disabledText,
            ]}
          >
            Continue
          </Text>
        </Pressable>

        {/* Privacy Information */}
        <Pressable
          style={styles.infoButton}
          onPress={() =>
            router.push('/privacy-information')
          }
        >
          <Text style={styles.infoText}>
            View UWell Privacy Information
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 32,
    color: '#3B2925',
    marginTop: -4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2925',
  },

  headerSpacer: {
    width: 42,
  },

  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
  },

  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  lockIcon: {
    fontSize: 32,
  },

  introTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3B2925',
  },

  introText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#806F69',
    textAlign: 'center',
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
    marginTop: 22,
    marginBottom: 11,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
  },

  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  consentIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  consentIcon: {
    fontSize: 20,
  },

  consentContent: {
    flex: 1,
    paddingRight: 8,
  },

  consentTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
  },

  consentText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#806F69',
    marginTop: 4,
  },

  linkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C85F4D',
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#F1E8E3',
    marginVertical: 16,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7F3EF',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },

  privacyIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  privacyIcon: {
    fontSize: 21,
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 5,
  },

  privacyText: {
    fontSize: 11,
    lineHeight: 18,
    color: '#806F69',
  },

  continueButton: {
    height: 52,
    backgroundColor: '#F47C68',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  disabledButton: {
    backgroundColor: '#E9DFDA',
  },

  continueText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  disabledText: {
    color: '#A99C96',
  },

  infoButton: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 8,
  },

  infoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C85F4D',
  },
});