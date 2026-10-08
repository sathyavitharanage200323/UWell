import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => navigation.navigate('Login'),
        },
      ],
    );
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
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Settings
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Account Settings */}
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.card}>
          <Pressable
            style={styles.menuRow}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>👤</Text>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                Profile
              </Text>

              <Text style={styles.menuSubtitle}>
                View your personal information
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Privacy & Security */}
        <Text style={styles.sectionTitle}>
          Privacy & Security
        </Text>

        <View style={styles.card}>
          {/* Privacy & Confidentiality */}
          <Pressable
            style={styles.menuRow}
              onPress={() =>
              navigation.navigate('PrivacyInformation')
            }
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🔒</Text>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                Privacy & Confidentiality
              </Text>

              <Text style={styles.menuSubtitle}>
                Learn how your information is protected
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* Security */}
          <Pressable
            style={styles.menuRow}
            onPress={() => navigation.navigate('Security')}
          >
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🛡️</Text>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                Security
              </Text>

              <Text style={styles.menuSubtitle}>
                Manage your account security
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>
          Notifications
        </Text>

        <View style={styles.card}>
          <View style={styles.menuRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🔔</Text>
            </View>

            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>
                Appointment Reminders
              </Text>

              <Text style={styles.menuSubtitle}>
                Receive reminders before your appointments
              </Text>
            </View>

            {/* ON / OFF Switch */}
            <Switch
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              trackColor={{
                false: '#D8CCC7',
                true: '#F6B7A8',
              }}
              thumbColor={
                remindersEnabled ? '#C85F4D' : '#FFFFFF'
              }
            />
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyIconBox}>
            <Text style={styles.privacyIcon}>🔐</Text>
          </View>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Your Privacy Matters
            </Text>

            <Text style={styles.privacyText}>
              UWell keeps your personal information and
              counseling-related information private and
              confidential.
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate('PrivacyInformation')
              }
            >
              <Text style={styles.learnMore}>
                Learn more →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutIcon}>↪</Text>

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>

        {/* App Information */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>
            UWell
          </Text>

          <Text style={styles.version}>
            Mental Health & Wellbeing
          </Text>
        </View>

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

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
    marginTop: 18,
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

  menuRow: {
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
    marginRight: 12,
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
    fontSize: 12,
    lineHeight: 18,
    color: '#806F69',
  },

  learnMore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C85F4D',
    marginTop: 8,
  },

  logoutButton: {
    height: 52,
    backgroundColor: '#FFF1F1',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  logoutIcon: {
    fontSize: 21,
    color: '#C94C4C',
    marginRight: 8,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C94C4C',
  },

  appInfo: {
    alignItems: 'center',
    marginTop: 25,
  },

  appName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#C85F4D',
  },

  version: {
    fontSize: 11,
    color: '#95847E',
    marginTop: 3,
  },
});