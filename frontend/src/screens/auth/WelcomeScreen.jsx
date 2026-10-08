import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';

const WelcomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🌱</Text>
      </View>
      
      <Text style={styles.title}>Welcome to UWell</Text>
      <Text style={styles.subtitle}>
        Your mental wellness companion for university life
      </Text>
      
      <View style={styles.features}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>💚</Text>
          <Text style={styles.featureText}>Mood Tracking</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>👥</Text>
          <Text style={styles.featureText}>Professional Support</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📅</Text>
          <Text style={styles.featureText}>Easy Appointments</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>📚</Text>
          <Text style={styles.featureText}>Helpful Resources</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />
        <Button
          title="Register"
          onPress={() => navigation.navigate('Register')}
          variant="outline"
          style={styles.button}
        />
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl
  },
  logoContainer: {
    marginBottom: spacing.xl
  },
  logo: {
    fontSize: 80
  },
  title: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xxl
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.xxl
  },
  feature: {
    alignItems: 'center',
    width: '45%',
    marginBottom: spacing.lg
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: spacing.sm
  },
  featureText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    textAlign: 'center'
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: spacing.lg
  },
  button: {
    marginBottom: spacing.md
  }
});

export default WelcomeScreen;
