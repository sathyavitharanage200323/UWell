import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const { appointmentId } = route.params || {};

  const appointment = {
    student: 'John Smith',
    studentId: 'STU001',
    counselor: 'Dr. Sarah Johnson',
    date: 'Today',
    time: '2:00 PM',
    status: 'confirmed',
    type: 'Individual',
    notes: 'Student requested help with anxiety management'
  };

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Appointment Details" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Appointment Information</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Student:</Text>
            <Text style={styles.detailValue}>{appointment.student}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Student ID:</Text>
            <Text style={styles.detailValue}>{appointment.studentId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Counselor:</Text>
            <Text style={styles.detailValue}>{appointment.counselor}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time:</Text>
            <Text style={styles.detailValue}>{appointment.date} at {appointment.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>{appointment.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, styles.statusConfirmed]}>{appointment.status}</Text>
          </View>
        </Card>

        <Card style={styles.notesCard}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notesText}>{appointment.notes}</Text>
        </Card>

        <Button
          title="View Student Profile"
          onPress={() => navigation.navigate('StudentDetails', { studentId: appointment.studentId })}
          style={styles.button}
        />

        <Button
          title="Reschedule Appointment"
          variant="outline"
          onPress={() => {}}
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
  detailsCard: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: spacing.md
  },
  detailLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: 120
  },
  detailValue: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text
  },
  statusConfirmed: {
    color: colors.success,
    fontWeight: typography.fontWeight.bold
  },
  notesCard: {
    marginBottom: spacing.xl
  },
  notesText: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    lineHeight: typography.lineHeight.relaxed
  },
  button: {
    marginTop: spacing.md
  }
});

export default AppointmentDetailsScreen;
