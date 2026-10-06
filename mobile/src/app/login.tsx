import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    'Student',
    'Counselor',
    'Student Affairs / Welfare Officer',
    'University Management',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <Text style={styles.portal}>
          CAMPUS PORTAL
        </Text>

        <Text style={styles.title}>
          Welcome Back
        </Text>

        <Text style={styles.subtitle}>
          Log in with your university credentials
        </Text>

        <Text style={styles.subtitle}>
          Select your role to continue.
        </Text>

        {/* Role */}
        <Text style={styles.sectionTitle}>
          Sign in as
        </Text>

        <View style={styles.roleContainer}>
          {roles.map((role) => (
            <Pressable
              key={role}
              onPress={() => setSelectedRole(role)}
              style={[
                styles.roleButton,
                selectedRole === role && styles.selectedRole,
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  selectedRole === role && styles.selectedRoleText,
                ]}
              >
                {role}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Email */}
        <Text style={styles.label}>
          Email / University ID
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="student@university.edu"
          placeholderTextColor="#A99A94"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password */}
        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••••••"
          placeholderTextColor="#A99A94"
          style={styles.input}
          secureTextEntry
        />

        {/* Forgot Password */}
        <Pressable
          style={styles.forgotButton}
          onPress={() => {}}
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </Pressable>

        {/* Login */}
        <Pressable
          style={styles.loginButton}
          onPress={() => {
            if (selectedRole === 'Student') {
              router.push('/home');
            }
          }}
        >
          <Text style={styles.loginText}>
            Log In
          </Text>
        </Pressable>

        {/* Register */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Don't have an account?
          </Text>

          <Pressable
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerLink}>
              {' '}Register
            </Text>
          </Pressable>
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
    flexGrow: 1,
    backgroundColor: '#FFF9F3',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },

  portal: {
    color: '#EF806B',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 8,
  },

  title: {
    color: '#3B2925',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    color: '#8A7770',
    fontSize: 13,
    lineHeight: 19,
  },

  sectionTitle: {
    color: '#4A3833',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 10,
  },

  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 22,
  },

  roleButton: {
    borderWidth: 1,
    borderColor: '#E6D9D2',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  selectedRole: {
    backgroundColor: '#EF806B',
    borderColor: '#EF806B',
  },

  roleText: {
    color: '#6F5E58',
    fontSize: 11,
  },

  selectedRoleText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  label: {
    color: '#4A3833',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 5,
  },

  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7DCD6',
    borderRadius: 10,
    paddingHorizontal: 14,
    color: '#3B2925',
    fontSize: 13,
    marginBottom: 14,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -5,
    marginBottom: 24,
  },

  forgotText: {
    color: '#EF806B',
    fontSize: 11,
    fontWeight: '600',
  },

  loginButton: {
    height: 50,
    backgroundColor: '#EF806B',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },

  registerText: {
    color: '#8A7770',
    fontSize: 11,
  },

  registerLink: {
    color: '#EF806B',
    fontSize: 11,
    fontWeight: '600',
  },
});