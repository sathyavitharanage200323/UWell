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

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleChangePassword = () => {
    if (!currentPassword.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your current password.',
      );
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter a new password.',
      );
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        'Invalid Password',
        'Your new password must contain at least 8 characters.',
      );
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert(
        'Missing Information',
        'Please confirm your new password.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'New password and confirm password do not match.',
      );
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        'Invalid Password',
        'Your new password must be different from your current password.',
      );
      return;
    }

    Alert.alert(
      'Password Updated',
      'Your password has been updated successfully.',
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
            Change Password
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Intro */}
        <View style={styles.introCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.largeIcon}>🔑</Text>
          </View>

          <Text style={styles.introTitle}>
            Update Your Password
          </Text>

          <Text style={styles.introText}>
            Create a strong password to help keep your
            UWell account secure.
          </Text>
        </View>

        {/* Password Form */}
        <Text style={styles.sectionTitle}>
          Password Information
        </Text>

        <View style={styles.formCard}>

          {/* Current Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Current Password
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#B5A49E"
                secureTextEntry={!showCurrentPassword}
                style={styles.passwordInput}
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() =>
                  setShowCurrentPassword(
                    !showCurrentPassword,
                  )
                }
              >
                <Text style={styles.eyeText}>
                  {showCurrentPassword ? '🙈' : '👁️'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              New Password
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#B5A49E"
                secureTextEntry={!showNewPassword}
                style={styles.passwordInput}
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() =>
                  setShowNewPassword(
                    !showNewPassword,
                  )
                }
              >
                <Text style={styles.eyeText}>
                  {showNewPassword ? '🙈' : '👁️'}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.helperText}>
              Use at least 8 characters.
            </Text>
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Confirm New Password
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#B5A49E"
                secureTextEntry={!showConfirmPassword}
                style={styles.passwordInput}
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword,
                  )
                }
              >
                <Text style={styles.eyeText}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Password Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>
            🔐 Password Tips
          </Text>

          <Text style={styles.tipText}>
            • Use at least 8 characters
          </Text>

          <Text style={styles.tipText}>
            • Avoid using easily guessed information
          </Text>

          <Text style={styles.tipText}>
            • Do not share your password with anyone
          </Text>
        </View>

        {/* Security Notice */}
        <View style={styles.noticeCard}>
          <Text style={styles.noticeIcon}>
            🛡️
          </Text>

          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>
              Security Notice
            </Text>

            <Text style={styles.noticeText}>
              Your password helps protect your personal
              information and counseling-related data.
            </Text>
          </View>
        </View>

        {/* Change Password Button */}
        <Pressable
          style={styles.changeButton}
          onPress={handleChangePassword}
        >
          <Text style={styles.changeButtonText}>
            Change Password
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

  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  largeIcon: {
    fontSize: 30,
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
    marginBottom: 18,
  },

  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 7,
  },

  passwordContainer: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9DDD7',
    borderRadius: 13,
    backgroundColor: '#FFFDFC',
  },

  passwordInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#3B2925',
  },

  eyeButton: {
    width: 45,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyeText: {
    fontSize: 17,
  },

  helperText: {
    fontSize: 10,
    color: '#95847E',
    marginTop: 5,
  },

  tipsCard: {
    backgroundColor: '#F7F3EF',
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
  },

  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 8,
  },

  tipText: {
    fontSize: 11,
    lineHeight: 19,
    color: '#806F69',
  },

  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF1EC',
    borderRadius: 18,
    padding: 16,
    marginTop: 14,
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
    fontSize: 11,
    lineHeight: 17,
    color: '#806F69',
  },

  changeButton: {
    height: 52,
    backgroundColor: '#F47C68',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  changeButtonText: {
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