import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { validateEmail, validatePassword } from '../../utils/validation';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');
  const { login } = useAuth();

  const handleLogin = async () => {
    const newErrors = {};
    
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(email, password, role);
      await login(response.user);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>

      <View style={styles.roleSelector}>
        <Button
          title="Student"
          variant={role === 'student' ? 'primary' : 'outline'}
          onPress={() => setRole('student')}
          style={styles.roleButton}
        />
        <Button
          title="Counselor"
          variant={role === 'counselor' ? 'primary' : 'outline'}
          onPress={() => setRole('counselor')}
          style={styles.roleButton}
        />
        <Button
          title="Welfare"
          variant={role === 'welfare' ? 'primary' : 'outline'}
          onPress={() => setRole('welfare')}
          style={styles.roleButton}
        />
        <Button
          title="Management"
          variant={role === 'management' ? 'primary' : 'outline'}
          onPress={() => setRole('management')}
          style={styles.roleButton}
        />
      </View>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        error={errors.email}
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        error={errors.password}
      />

      {errors.general && (
        <Text style={styles.errorText}>{errors.general}</Text>
      )}

      <Button
        title="Login"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      />

      <Button
        title="Don't have an account? Register"
        onPress={() => navigation.navigate('Register')}
        variant="outline"
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  contentContainer: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center'
  },
  title: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.textLight,
    marginBottom: spacing.xl
  },
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg
  },
  roleButton: {
    flex: 1,
    minWidth: '45%',
    marginRight: spacing.sm,
    marginBottom: spacing.sm
  },
  button: {
    marginTop: spacing.md
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    marginBottom: spacing.md
  }
});

export default LoginScreen;
