import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function PrivacyInformationScreen() {
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
            Privacy & Confidentiality
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.lockCircle}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>

          <Text style={styles.introTitle}>
            Your Privacy Matters
          </Text>

          <Text style={styles.introText}>
            UWell is designed to provide a safe and supportive
            space for students. Your personal information and
            counseling-related information should be handled
            with privacy and confidentiality.
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>👤</Text>
            </View>

            <Text style={styles.cardTitle}>
              Personal Information
            </Text>
          </View>

          <Text style={styles.cardText}>
            Your account information such as your name, email
            address and other profile details should only be
            accessed for appropriate UWell services.
          </Text>
        </View>

        {/* Counseling Information */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>💬</Text>
            </View>

            <Text style={styles.cardTitle}>
              Counseling Information
            </Text>
          </View>

          <Text style={styles.cardText}>
            Counseling appointments and related information
            are treated as confidential. Access should be
            limited to authorized users based on their role.
          </Text>
        </View>

        {/* Data Protection */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🛡️</Text>
            </View>

            <Text style={styles.cardTitle}>
              Data Protection
            </Text>
          </View>

          <Text style={styles.cardText}>
            UWell should protect user information from
            unauthorized access, modification or disclosure.
            Only authorized users should be able to access
            information relevant to their role.
          </Text>
        </View>

        {/* Role Based Access */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🔐</Text>
            </View>

            <Text style={styles.cardTitle}>
              Role-Based Access
            </Text>
          </View>

          <Text style={styles.cardText}>
            Different users have different access levels.
            Students, counselors, welfare officers and
            university management should only access the
            information required for their responsibilities.
          </Text>
        </View>

        {/* Student Privacy */}
        <View style={styles.importantCard}>
          <Text style={styles.importantTitle}>
            Student Confidentiality
          </Text>

          <Text style={styles.importantText}>
            Mental health and counseling information can be
            sensitive. UWell aims to maintain confidentiality
            and provide students with a safe environment when
            using counseling services.
          </Text>
        </View>

        {/* Security Notice */}
        <View style={styles.securityCard}>
          <Text style={styles.securityIcon}>✓</Text>

          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>
              Privacy & Security
            </Text>

            <Text style={styles.securityText}>
              Keep your account credentials private and use
              the logout option when you finish using UWell.
            </Text>
          </View>
        </View>

        {/* Back to Settings */}
        <Pressable
          style={styles.backSettingsButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backSettingsText}>
            Back to Settings
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
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
  },

  headerSpacer: {
    width: 42,
  },

  introCard: {
    backgroundColor: '#F47F69',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
  },

  lockCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  lockIcon: {
    fontSize: 28,
  },

  introTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  introText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#FFF5F1',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 20,
  },

  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#3B2925',
  },

  cardText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#806F69',
  },

  importantCard: {
    backgroundColor: '#FFF0EA',
    borderRadius: 18,
    padding: 18,
    marginTop: 5,
    marginBottom: 14,
  },

  importantTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C85F4D',
    marginBottom: 7,
  },

  importantText: {
    fontSize: 12,
    lineHeight: 19,
    color: '#806F69',
  },

  securityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EAF7EC',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },

  securityIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    color: '#4E9B5C',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 11,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  securityText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#687268',
  },

  backSettingsButton: {
    height: 52,
    backgroundColor: '#F47F69',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backSettingsText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});