import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const { counselorId, slot } = route.params || {};
  const [notes, setNotes] = useState('');
  const [sessionType, setSessionType] = useState('individual');

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Appointment Details" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Appointment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Counselor:</Text>
            <Text style={styles.summaryValue}>Dr. Sarah Johnson</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>Today</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time:</Text>
            <Text style={styles.summaryValue}>2:00 PM</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration:</Text>
            <Text style={styles.summaryValue}>50 minutes</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Session Type</Text>
        <View style={styles.typeSelector}>
          <Button
            title="Individual"
            variant={sessionType === 'individual' ? 'primary' : 'outline'}
            onPress={() => setSessionType('individual')}
            style={styles.typeButton}
          />
          <Button
            title="Group"
            variant={sessionType === 'group' ? 'primary' : 'outline'}
            onPress={() => setSessionType('group')}
            style={styles.typeButton}
          />
        </View>

        <Input
          label="Notes for Counselor (Optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any specific concerns or topics you'd like to discuss..."
          multiline
        />

        <Button
          title="Review Booking"
          onPress={() => navigation.navigate('ReviewBooking', { counselorId, slot, notes, sessionType })}
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
  summaryCard: {
    marginBottom: spacing.xl
  },
  summaryTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm
  },
  summaryLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: 120
  },
  summaryValue: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: spacing.xl
  },
  typeButton: {
    flex: 1,
    marginRight: spacing.sm
  },
  button: {
    marginTop: spacing.lg
  }
});

export default AppointmentDetailsScreen;
