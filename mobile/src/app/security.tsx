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

export default function SecurityScreen() {
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
            Security
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Security Intro */}
        <View style={styles.introCard}>
          <View style={styles.largeIconBox}>
            <Text style={styles.largeIcon}>🛡️</Text>
          </View>

          <Text style={styles.introTitle}>
            Your Account Security
          </Text>

          <Text style={styles.introText}>
            UWell helps protect your account and personal
            information using secure access and
            role-based protection.
          </Text>
        </View>

        {/* Security Options */}
        <Text style={styles.sectionTitle}>
          Security Options
        </Text>

        <View style={styles.card}>
          {/* Change Password */}
          <Pressable
            style={styles.optionRow}
            onPress={() => router.push('/change-password')}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🔑</Text>
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                Change Password
              </Text>

              <Text style={styles.optionSubtitle}>
                Update your account password
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* Account Protection */}
          <View style={styles.optionRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🔐</Text>
            </View>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                Account Protection
              </Text>

              <Text style={styles.optionSubtitle}>
                Your account is protected with secure
                authentication
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                Protected
              </Text>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>ℹ️</Text>

          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>
              Security Notice
            </Text>

            <Text style={styles.noticeText}>
              Never share your password or account
              credentials with anyone. UWell uses
              role-based access to help protect
              sensitive counseling information.
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <Pressable
          style={styles.backHomeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backHomeText}>
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
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2925',
  },

  headerSpacer: {
    width: 42,
  },

  introCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
  },

  largeIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  largeIcon: {
    fontSize: 31,
  },

  introTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
  },

  introText: {
    fontSize: 12,
    lineHeight: 18,
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

  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 20,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
  },

  optionSubtitle: {
    fontSize: 11,
    lineHeight: 17,
    color: '#806F69',
    marginTop: 3,
  },

  chevron: {
    fontSize: 27,
    color: '#B39D96',
    marginLeft: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#F1E8E3',
    marginVertical: 14,
  },

  statusBadge: {
    backgroundColor: '#EAF7EC',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4E9B5C',
  },

  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7F3EF',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },

  noticeIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  noticeContent: {
    flex: 1,
  },

  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 5,
  },

  noticeText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#806F69',
  },

  backHomeButton: {
    height: 52,
    backgroundColor: '#F47C68',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  backHomeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});