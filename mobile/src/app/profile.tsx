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

export default function ProfileScreen() {
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

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>

          <Text style={styles.name}>Wasana</Text>

          <Text style={styles.role}>University Student</Text>

          <Text style={styles.email}>
            student@example.com
          </Text>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>👤</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>Wasana</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>✉️</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>
                student@example.com
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>🎓</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Role</Text>
              <Text style={styles.value}>
                University Student
              </Text>
            </View>
          </View>
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.card}>

          {/* Edit Profile */}
          <Pressable
            style={styles.menuRow}
            onPress={() => router.push('/edit-profile')}
          >
            <View style={styles.menuIcon}>
              <Text>✏️</Text>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                Edit Profile
              </Text>

              <Text style={styles.menuSubtitle}>
                Update your personal information
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* Settings */}
          <Pressable
            style={styles.menuRow}
            onPress={() => router.push('/settings')}
          >
            <View style={styles.menuIcon}>
              <Text>⚙️</Text>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                Settings
              </Text>

              <Text style={styles.menuSubtitle}>
                Privacy, security and account settings
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* My Appointments */}
          <Pressable
            style={styles.menuRow}
            onPress={() => router.push('/my-appointments')}
          >
            <View style={styles.menuIcon}>
              <Text>📅</Text>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                My Appointments
              </Text>

              <Text style={styles.menuSubtitle}>
                View and manage your appointments
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Your Privacy Matters
            </Text>

            <Text style={styles.privacyText}>
              Your personal information and counseling
              records are kept private and confidential.
            </Text>
          </View>
        </View>

        {/* Back Home */}
        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace('/home')}
        >
          <Text style={styles.homeButtonText}>
            Back to Home
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

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 25,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 40,
  },

  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B2925',
  },

  role: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C85F4D',
    marginTop: 4,
  },

  email: {
    fontSize: 12,
    color: '#806F69',
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 11,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
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

  infoContent: {
    flex: 1,
  },

  label: {
    fontSize: 11,
    color: '#95847E',
    marginBottom: 3,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B2925',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1E8E3',
    marginVertical: 14,
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
  },

  menuSubtitle: {
    fontSize: 11,
    color: '#806F69',
    marginTop: 3,
  },

  chevron: {
    fontSize: 26,
    color: '#B39D96',
    marginLeft: 8,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7F3EF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },

  privacyIcon: {
    fontSize: 21,
    marginRight: 12,
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  privacyText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#806F69',
  },

  homeButton: {
    height: 52,
    backgroundColor: '#F47F69',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});