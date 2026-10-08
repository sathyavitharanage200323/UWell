import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const BookingConfirmedScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.successIcon}>
        <Text style={styles.icon}>✓</Text>
      </View>

      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.subtitle}>Your appointment has been successfully scheduled</Text>

      <Card style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailValue}>Today</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time:</Text>
          <Text style={styles.detailValue}>2:00 PM</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Counselor:</Text>
          <Text style={styles.detailValue}>Dr. Sarah Johnson</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Confirmation #:</Text>
          <Text style={styles.detailValue}>UW-2024-001</Text>
        </View>
      </Card>

      <Card style={styles.reminderCard}>
        <Text style={styles.reminderTitle}>Reminders</Text>
        <Text style={styles.reminderText}>
          • You'll receive a reminder 24 hours before your session{'\n'}
          • Add this to your calendar{'\n'}
          • Arrive 5 minutes early
        </Text>
      </Card>

      <Button
        title="Back to Home"
        onPress={() => navigation.navigate('Home')}
        style={styles.button}
      />

      <Button
        title="View My Sessions"
        onPress={() => navigation.navigate('MySessions')}
        variant="outline"
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight
  },
  contentContainer: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center'
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl
  },
  icon: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  title: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    marginBottom: spacing.md,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.textLight,
    marginBottom: spacing.xl,
    textAlign: 'center'
  },
  detailsCard: {
    width: '100%',
    marginBottom: spacing.lg
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.md
  },
  detailLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: 140
  },
  detailValue: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  reminderCard: {
    width: '100%',
    backgroundColor: colors.backgroundLight,
    marginBottom: spacing.xl
  },
  reminderTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  reminderText: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    lineHeight: typography.lineHeight.relaxed
  },
  button: {
    width: '100%',
    marginTop: spacing.md
  }
});

export default BookingConfirmedScreen;
