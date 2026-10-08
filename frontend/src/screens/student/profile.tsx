import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, updateUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const res = await studentService.getProfile();
      if (res?.data) {
        await updateUser({
          ...res.data,
          token: user?.token,
          role: user?.role ?? res.data.role,
          fullName: res.data.fullName
            || `${res.data.firstName || ''} ${res.data.lastName || ''}`.trim(),
        });
      }
    } catch {
      // keep cached user from auth storage
    } finally {
      setProfileLoading(false);
      setRefreshing(false);
    }
  }, [updateUser, user?.token, user?.role]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const fullName = user?.fullName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Wasana');
  const studentId = user?.studentId || 'STU20240001';
  const email = user?.email || 'student@example.com';
  const faculty = user?.faculty || 'Faculty of Computing';
  const degree = user?.degreeProgram || 'Computer Science';
  const year = user?.yearOfStudy || 'Year 1';
  const phone = user?.phone || 'Not provided';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadProfile();
            }}
            tintColor="#EF806B"
          />
        }
      >
        {profileLoading && !refreshing && (
          <View style={styles.profileLoadingRow}>
            <ActivityIndicator size="small" color="#EF806B" />
            <Text style={styles.profileLoadingText}>Syncing profile…</Text>
          </View>
        )}
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
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

          <Text style={styles.name}>{fullName}</Text>

          <Text style={styles.role}>University Student • {studentId}</Text>

          <Text style={styles.email}>
            {email}
          </Text>
        </View>

        {/* Personal & Academic Information */}
        <Text style={styles.sectionTitle}>
          Academic & Personal Information
        </Text>

        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>🪪</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Student ID</Text>
              <Text style={[styles.value, { color: '#EF806B', fontWeight: '700' }]}>{studentId}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>👤</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{fullName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>🏛️</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Faculty</Text>
              <Text style={styles.value}>{faculty}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>📚</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Degree Program</Text>
              <Text style={styles.value}>{degree}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>🎓</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Year of Study</Text>
              <Text style={styles.value}>{year}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>✉️</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Text>📞</Text>
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.label}>Phone Number</Text>
              <Text style={styles.value}>{phone}</Text>
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
            onPress={() => navigation.navigate('EditProfile')}
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
            onPress={() => navigation.navigate('Settings')}
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
            onPress={() => navigation.getParent()?.navigate('Sessions')}
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
          onPress={() => navigation.getParent()?.navigate('Home')}
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

  profileLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },

  profileLoadingText: {
    fontSize: 12,
    color: '#806E68',
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