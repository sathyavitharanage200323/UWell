import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState('Wasana');
  const [email, setEmail] = useState('student@example.com');
  const [studentId, setStudentId] = useState('STU001');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    if (!fullName.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your full name.',
      );
      return;
    }

    if (!email.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your email address.',
      );
      return;
    }

    Alert.alert(
      'Profile Updated',
      'Your personal information has been updated successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            Edit Profile
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Avatar */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>

          <Text style={styles.profileName}>
            Update Your Profile
          </Text>

          <Text style={styles.profileSubtitle}>
            Keep your personal information up to date
          </Text>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionTitle}>
          Personal Information
        </Text>

        <View style={styles.formCard}>

          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Full Name
            </Text>

            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#B5A49E"
              style={styles.input}
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              University Email
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your university email"
              placeholderTextColor="#B5A49E"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          {/* Student ID */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Student ID
            </Text>

            <TextInput
              value={studentId}
              onChangeText={setStudentId}
              placeholder="Enter your student ID"
              placeholderTextColor="#B5A49E"
              style={styles.input}
            />
          </View>

          {/* Phone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Phone Number
            </Text>

            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#B5A49E"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          {/* Role - Read Only */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Role
            </Text>

            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>
                University Student
              </Text>
            </View>

            <Text style={styles.helperText}>
              Your role cannot be changed from your profile.
            </Text>
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyIconBox}>
            <Text style={styles.privacyIcon}>
              🔒
            </Text>
          </View>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Your Privacy Matters
            </Text>

            <Text style={styles.privacyText}>
              Your personal information is kept private
              and protected within UWell.
            </Text>
          </View>
        </View>

        {/* Save Changes */}
        <Pressable
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>
            Save Changes
          </Text>
        </Pressable>

        {/* Cancel */}
        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>
            Cancel
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
    padding: 22,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  avatarText: {
    fontSize: 37,
  },

  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3B2925',
  },

  profileSubtitle: {
    fontSize: 12,
    color: '#806F69',
    textAlign: 'center',
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 11,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
  },

  fieldContainer: {
    marginBottom: 17,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 7,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E9DDD7',
    borderRadius: 13,
    paddingHorizontal: 14,
    backgroundColor: '#FFFDFC',
    fontSize: 13,
    color: '#3B2925',
  },

  readOnlyInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E9DDD7',
    borderRadius: 13,
    paddingHorizontal: 14,
    backgroundColor: '#F7F3EF',
    justifyContent: 'center',
  },

  readOnlyText: {
    fontSize: 13,
    color: '#806F69',
  },

  helperText: {
    fontSize: 10,
    color: '#95847E',
    marginTop: 5,
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
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  privacyIcon: {
    fontSize: 20,
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
    fontSize: 11,
    lineHeight: 17,
    color: '#806F69',
  },

  saveButton: {
    height: 52,
    backgroundColor: '#F47F69',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  cancelButton: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9DDD7',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#806F69',
  },
});