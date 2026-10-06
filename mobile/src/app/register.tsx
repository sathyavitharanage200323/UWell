import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !studentId.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill in all fields.'
      );
      return;
    }

    if (!email.includes('@')) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid university email address.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Weak Password',
        'Password should contain at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Password and confirm password do not match.'
      );
      return;
    }

    Alert.alert(
      'Account Created',
      'Your UWell student account has been created successfully.',
      [
        {
          text: 'Continue to Login',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.smallTitle}>WELCOME TO UWELL</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Create your student account to access wellbeing
              support and counseling services.
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#A8958E"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          {/* Email */}
          <Text style={styles.label}>University Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your university email"
            placeholderTextColor="#A8958E"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Student ID */}
          <Text style={styles.label}>Student ID</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your student ID"
            placeholderTextColor="#A8958E"
            value={studentId}
            onChangeText={setStudentId}
            autoCapitalize="characters"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#A8958E"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            placeholderTextColor="#A8958E"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Privacy Notice */}
          <View style={styles.privacyCard}>
            <Text style={styles.privacyIcon}>🔒</Text>

            <Text style={styles.privacyText}>
              Your personal information and counseling
              information are protected and kept confidential.
            </Text>
          </View>

          {/* Create Account */}
          <Pressable
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>
              Create Account
            </Text>

            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <Pressable onPress={() => router.replace('/login')}>
            <Text style={styles.loginLink}> Login</Text>
          </Pressable>
        </View>

        {/* Bottom Note */}
        <Text style={styles.bottomText}>
          By creating an account, you agree to use UWell
          responsibly and protect your account information.
        </Text>
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
    paddingTop: 12,
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FAD9D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },

  backIcon: {
    fontSize: 31,
    color: '#3B2925',
    marginTop: -3,
  },

  headerText: {
    flex: 1,
  },

  smallTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#EF806B',
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 7,
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#806F69',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 7,
    marginTop: 5,
  },

  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EADBD5',
    backgroundColor: '#FFF9F6',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#3B2925',
    marginBottom: 12,
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3EE',
    borderRadius: 14,
    padding: 12,
    marginTop: 5,
    marginBottom: 18,
  },

  privacyIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  privacyText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: '#806F69',
  },

  registerButton: {
    height: 50,
    backgroundColor: '#F47F69',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 8,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  loginText: {
    color: '#806F69',
    fontSize: 13,
  },

  loginLink: {
    color: '#EF806B',
    fontSize: 13,
    fontWeight: '700',
  },

  bottomText: {
    textAlign: 'center',
    color: '#A8958E',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 18,
    paddingHorizontal: 15,
  },
});