import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Home" />
      
      <Card style={styles.welcomeCard}>
        <Text style={styles.greeting}>Hello, Student! 👋</Text>
        <Text style={styles.welcomeText}>How are you feeling today?</Text>
      </Card>

      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => navigation.navigate('MoodCheckIn')}
      >
        <Card style={styles.actionCard}>
          <Text style={styles.actionIcon}>😊</Text>
          <Text style={styles.actionTitle}>Check Your Mood</Text>
          <Text style={styles.actionSubtitle}>Track how you're feeling</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => navigation.navigate('CounselorList')}
      >
        <Card style={styles.actionCard}>
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={styles.actionTitle}>Find a Counselor</Text>
          <Text style={styles.actionSubtitle}>Book an appointment</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => navigation.navigate('MySessions')}
      >
        <Card style={styles.actionCard}>
          <Text style={styles.actionIcon}>📅</Text>
          <Text style={styles.actionTitle}>My Sessions</Text>
          <Text style={styles.actionSubtitle}>View upcoming appointments</Text>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickAction}
        onPress={() => navigation.navigate('Resources')}
      >
        <Card style={styles.actionCard}>
          <Text style={styles.actionIcon}>📚</Text>
          <Text style={styles.actionTitle}>Resources</Text>
          <Text style={styles.actionSubtitle}>Helpful articles and tips</Text>
        </Card>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight
  },
  welcomeCard: {
    backgroundColor: colors.primary,
    margin: spacing.lg
  },
  greeting: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite,
    marginBottom: spacing.sm
  },
  welcomeText: {
    fontSize: typography.fontSize.lg,
    color: colors.textWhite
  },
  quickAction: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md
  },
  actionCard: {
    alignItems: 'center',
    padding: spacing.xl
  },
  actionIcon: {
    fontSize: 48,
    marginBottom: spacing.md
  },
  actionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  actionSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    textAlign: 'center'
  }
});

export default HomeScreen;
