import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const AppointmentsScreen = ({ navigation }) => {
  const appointments = [
    {
      id: 1,
      student: 'John Smith',
      counselor: 'Dr. Sarah Johnson',
      date: 'Today',
      time: '2:00 PM',
      status: 'confirmed',
      department: 'Counseling'
    },
    {
      id: 2,
      student: 'Emily Davis',
      counselor: 'Dr. Michael Chen',
      date: 'Today',
      time: '3:00 PM',
      status: 'confirmed',
      department: 'Counseling'
    },
    {
      id: 3,
      student: 'Michael Brown',
      counselor: 'Dr. Emily Williams',
      date: 'Tomorrow',
      time: '10:00 AM',
      status: 'pending',
      department: 'Welfare'
    },
    {
      id: 4,
      student: 'Sarah Wilson',
      counselor: 'Dr. Sarah Johnson',
      date: 'Oct 5, 2024',
      time: '11:00 AM',
      status: 'confirmed',
      department: 'Counseling'
    },
    {
      id: 5,
      student: 'David Lee',
      counselor: 'Dr. Michael Chen',
      date: 'Oct 6, 2024',
      time: '2:00 PM',
      status: 'cancelled',
      department: 'Counseling'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="All Appointments" />
      
      <View style={styles.content}>
        {appointments.map((appointment) => (
          <TouchableOpacity key={appointment.id}>
            <Card style={[
              styles.appointmentCard,
              appointment.status === 'cancelled' && styles.cancelledCard
            ]}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.studentName}>{appointment.student}</Text>
                <View style={[
                  styles.statusBadge,
                  appointment.status === 'confirmed' && styles.confirmedBadge,
                  appointment.status === 'pending' && styles.pendingBadge,
                  appointment.status === 'cancelled' && styles.cancelledBadge
                ]}>
                  <Text style={styles.statusText}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.detail}>👨‍⚕️ {appointment.counselor}</Text>
                <Text style={styles.detail}>📅 {appointment.date}</Text>
                <Text style={styles.detail}>⏰ {appointment.time}</Text>
                <Text style={styles.detail}>🏢 {appointment.department}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
  appointmentCard: {
    marginBottom: spacing.md
  },
  cancelledCard: {
    opacity: 0.6
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  studentName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4
  },
  confirmedBadge: {
    backgroundColor: colors.success
  },
  pendingBadge: {
    backgroundColor: colors.warning
  },
  cancelledBadge: {
    backgroundColor: colors.error
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  appointmentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  detail: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: '48%',
    marginBottom: spacing.xs
  }
});

export default AppointmentsScreen;
