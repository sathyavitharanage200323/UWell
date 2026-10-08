import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, updateUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName]   = useState(user?.lastName  || '');
  const [phone, setPhone]         = useState(user?.phone     || '');
  const [loading, setLoading]     = useState(false);

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Missing Information', 'Please enter your first name.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Missing Information', 'Please enter your last name.');
      return;
    }

    try {
      setLoading(true);

      // PUT /api/student/profile — update backend
      const res = await studentService.updateProfile({
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        phone:     phone.trim(),
      });

      // Update local AuthContext so UI reflects immediately
      if (res?.data) {
        await updateUser({
          ...res.data,
          name: `${res.data.firstName} ${res.data.lastName}`,
        });
      }

      Alert.alert(
        'Profile Updated ✓',
        'Your personal information has been updated successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update profile. Please try again.';
      Alert.alert('Update Failed', msg);
    } finally {
      setLoading(false);
    }
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
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Avatar */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.profileName}>Update Your Profile</Text>
          <Text style={styles.profileSubtitle}>
            Keep your personal information up to date
          </Text>
        </View>

        {/* Form */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.formCard}>

          {/* First Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor="#B5A49E"
              style={styles.input}
            />
          </View>

          {/* Last Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor="#B5A49E"
              style={styles.input}
            />
          </View>

          {/* Email — read only */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>University Email</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>
                {user?.email || 'student@university.edu'}
              </Text>
            </View>
            <Text style={styles.helperText}>Email cannot be changed.</Text>
          </View>

          {/* Student ID — read only */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Student ID</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>
                {user?.studentId || 'N/A'}
              </Text>
            </View>
            <Text style={styles.helperText}>Student ID cannot be changed.</Text>
          </View>

          {/* Phone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor="#B5A49E"
              keyboardType="phone-pad"
              style={styles.input}
            />
          </View>

          {/* Role — read only */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.readOnlyInput}>
              <Text style={styles.readOnlyText}>University Student</Text>
            </View>
            <Text style={styles.helperText}>
              Your role cannot be changed from your profile.
            </Text>
          </View>

        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyIconBox}>
            <Text style={styles.privacyIcon}>🔒</Text>
          </View>
          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>Your Privacy Matters</Text>
            <Text style={styles.privacyText}>
              Your personal information is kept private and protected within UWell.
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </Pressable>

        {/* Cancel */}
        <Pressable
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: '#FFF9F3' },
  container: { paddingHorizontal: 20, paddingBottom: 35 },

  header: {
    height: 60, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  backButton: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
  },
  backText:     { fontSize: 32, color: '#3B2925', marginTop: -4 },
  headerTitle:  { fontSize: 18, fontWeight: '700', color: '#3B2925' },
  headerSpacer: { width: 42 },

  profileCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 22,
    alignItems: 'center', marginTop: 15, marginBottom: 25,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatar: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#FFF1EC', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText:      { fontSize: 37 },
  profileName:     { fontSize: 18, fontWeight: '800', color: '#3B2925' },
  profileSubtitle: { fontSize: 12, color: '#806F69', textAlign: 'center', marginTop: 5 },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#3B2925', marginBottom: 11 },

  formCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 7, elevation: 2,
  },
  fieldContainer: { marginBottom: 17 },
  label:          { fontSize: 12, fontWeight: '700', color: '#3B2925', marginBottom: 7 },
  input: {
    height: 48, borderWidth: 1, borderColor: '#E9DDD7',
    borderRadius: 13, paddingHorizontal: 14,
    backgroundColor: '#FFFDFC', fontSize: 13, color: '#3B2925',
  },
  readOnlyInput: {
    height: 48, borderWidth: 1, borderColor: '#E9DDD7',
    borderRadius: 13, paddingHorizontal: 14,
    backgroundColor: '#F7F3EF', justifyContent: 'center',
  },
  readOnlyText: { fontSize: 13, color: '#806F69' },
  helperText:   { fontSize: 10, color: '#95847E', marginTop: 5 },

  privacyCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#F7F3EF', borderRadius: 18, padding: 16, marginTop: 20,
  },
  privacyIconBox: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#FFFFFF', alignItems: 'center',
    justifyContent: 'center', marginRight: 11,
  },
  privacyIcon:    { fontSize: 20 },
  privacyContent: { flex: 1 },
  privacyTitle:   { fontSize: 14, fontWeight: '700', color: '#3B2925', marginBottom: 4 },
  privacyText:    { fontSize: 11, lineHeight: 17, color: '#806F69' },

  saveButton: {
    height: 52, backgroundColor: '#F47F69', borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginTop: 20,
  },
  saveButtonDisabled: { backgroundColor: '#D4B3AB' },
  saveButtonText:     { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

  cancelButton: {
    height: 50, backgroundColor: '#FFFFFF', borderWidth: 1,
    borderColor: '#E9DDD7', borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
  },
  cancelButtonText: { fontSize: 14, fontWeight: '700', color: '#806F69' },
});
