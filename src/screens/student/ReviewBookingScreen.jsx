import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const ReviewBookingScreen = ({ route, navigation }) => {
  const { counselorId, slot, notes, sessionType } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Review Booking" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Card style={styles.reviewCard}>
          <Text style={styles.reviewTitle}>Review Your Booking</Text>
          
          <View style={styles.reviewSection}>
            <Text style={styles.sectionLabel}>Counselor</Text>
            <Text style={styles.sectionValue}>Dr. Sarah Johnson</Text>
          </View>

          <View style={styles.reviewSection}>
            <Text style={styles.sectionLabel}>Date & Time</Text>
            <Text style={styles.sectionValue}>Today at 2:00 PM</Text>
          </View>

          <View style={styles.reviewSection}>
            <Text style={styles.sectionLabel}>Session Type</Text>
            <Text style={styles.sectionValue}>{sessionType === 'individual' ? 'Individual Session' : 'Group Session'}</Text>
          </View>

          <View style={styles.reviewSection}>
            <Text style={styles.sectionLabel}>Duration</Text>
            <Text style={styles.sectionValue}>50 minutes</Text>
          </View>

          {notes && (
            <View style={styles.reviewSection}>
              <Text style={styles.sectionLabel}>Notes</Text>
              <Text style={styles.sectionValue}>{notes}</Text>
            </View>
          )}
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Important Information</Text>
          <Text style={styles.infoText}>
            • Please arrive 5 minutes early{'\n'}
            • Sessions are confidential{'\n'}
            • Cancellations require 24-hour notice{'\n'}
            • Contact support if you need to reschedule
          </Text>
        </Card>

        <Button
          title="Confirm Booking"
          onPress={() => navigation.navigate('BookingConfirmed')}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight
  },
  content: {
    padding: spacing.lg
  },
  reviewCard: {
    marginBottom: spacing.lg
  },
  reviewTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg
  },
  reviewSection: {
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    marginBottom: spacing.xs
  },
  sectionValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  infoCard: {
    backgroundColor: colors.backgroundLight,
    marginBottom: spacing.xl
  },
  infoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  infoText: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    lineHeight: typography.lineHeight.relaxed
  },
  button: {
    marginTop: spacing.lg
  }
});

export default ReviewBookingScreen;
