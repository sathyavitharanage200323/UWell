import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleRegister = async () => {
    const newErrors = {};

    if (!validateRequired(formData.firstName)) {
      newErrors.firstName = 'First name is required';
    }
    if (!validateRequired(formData.lastName)) {
      newErrors.lastName = 'Last name is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.role === 'student' && !validateRequired(formData.studentId)) {
      newErrors.studentId = 'Student ID is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await authService.register(formData);
      await login(response.user);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: null });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subtitle}>Create your account</Text>

      <View style={styles.roleSelector}>
        <Button
          title="Student"
          variant={formData.role === 'student' ? 'primary' : 'outline'}
          onPress={() => updateField('role', 'student')}
          style={styles.roleButton}
        />
        <Button
          title="Counselor"
          variant={formData.role === 'counselor' ? 'primary' : 'outline'}
          onPress={() => updateField('role', 'counselor')}
          style={styles.roleButton}
        />
        <Button
          title="Welfare"
          variant={formData.role === 'welfare' ? 'primary' : 'outline'}
          onPress={() => updateField('role', 'welfare')}
          style={styles.roleButton}
        />
        <Button
          title="Management"
          variant={formData.role === 'management' ? 'primary' : 'outline'}
          onPress={() => updateField('role', 'management')}
          style={styles.roleButton}
        />
      </View>

      <Input
        label="First Name"
        value={formData.firstName}
        onChangeText={(value) => updateField('firstName', value)}
        placeholder="Enter your first name"
        error={errors.firstName}
      />

      <Input
        label="Last Name"
        value={formData.lastName}
        onChangeText={(value) => updateField('lastName', value)}
        placeholder="Enter your last name"
        error={errors.lastName}
      />

      <Input
        label="Email"
        value={formData.email}
        onChangeText={(value) => updateField('email', value)}
        placeholder="Enter your email"
        keyboardType="email-address"
        error={errors.email}
      />

      <Input
        label="Password"
        value={formData.password}
        onChangeText={(value) => updateField('password', value)}
        placeholder="Create a password"
        secureTextEntry
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => updateField('confirmPassword', value)}
        placeholder="Confirm your password"
        secureTextEntry
        error={errors.confirmPassword}
      />

      {formData.role === 'student' && (
        <Input
          label="Student ID"
          value={formData.studentId}
          onChangeText={(value) => updateField('studentId', value)}
          placeholder="Enter your student ID"
          error={errors.studentId}
        />
      )}

      {errors.general && (
        <Text style={styles.errorText}>{errors.general}</Text>
      )}

      <Button
        title="Register"
        onPress={handleRegister}
        loading={loading}
        style={styles.button}
      />

      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
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

export default RegisterScreen;
