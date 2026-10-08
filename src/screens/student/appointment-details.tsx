import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function AppointmentDetailsScreen() {
  const navigation = useNavigation<any>();
  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: 'Keep Appointment',
          style: 'cancel',
        },
        {
          text: 'Cancel Appointment',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Appointment Cancelled',
              'Your appointment has been cancelled successfully.',
              [
                {
                  text: 'OK',
                  onPress: () =>
                    navigation.getParent()?.getParent()?.navigate('Sessions'),
                },
              ],
            );
          },
        },
      ],
    );
  };

  const handleReschedule = () => {
    navigation.navigate('Availability', { counselorId: 1 });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Appointment Details
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Text style={styles.statusIconText}>✓</Text>
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              Appointment Confirmed
            </Text>

            <Text style={styles.statusText}>
              Your counseling appointment is confirmed.
            </Text>
          </View>
        </View>

        {/* Counselor */}
        <Text style={styles.sectionTitle}>
          Counselor
        </Text>

        <View style={styles.counselorCard}>
          <View style={styles.counselorAvatar}>
            <Text style={styles.counselorEmoji}>
              👩‍⚕️
            </Text>
          </View>

          <View style={styles.counselorInfo}>
            <Text style={styles.counselorName}>
              Dr. Sarah Perera
            </Text>

            <Text style={styles.specialization}>
              Student Counselling
            </Text>

            <Text style={styles.experience}>
              8 years experience
            </Text>
          </View>
        </View>

        {/* Appointment Information */}
        <Text style={styles.sectionTitle}>
          Appointment Information
        </Text>

        <View style={styles.detailsCard}>
          {/* Date */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Text style={styles.detailIcon}>📅</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Date
              </Text>

              <Text style={styles.detailValue}>
                Monday, October 12
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Time */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Text style={styles.detailIcon}>🕐</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Time
              </Text>

              <Text style={styles.detailValue}>
                09:00 AM
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Session Type */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconBox}>
              <Text style={styles.detailIcon}>💻</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Session Type
              </Text>

              <Text style={styles.detailValue}>
                Online Session
              </Text>
            </View>
          </View>
        </View>

        {/* Reminder */}
        <Text style={styles.sectionTitle}>
          Appointment Reminder
        </Text>

        <View style={styles.reminderCard}>
          <View style={styles.reminderIcon}>
            <Text>🔔</Text>
          </View>

          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>
              Reminder set: 1 day before
            </Text>

            <Text style={styles.reminderText}>
              You will receive a reminder before your
              counseling appointment.
            </Text>
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyIcon}>
            <Text>🔒</Text>
          </View>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Privacy & Confidentiality
            </Text>

            <Text style={styles.privacyText}>
              Your counseling appointment information is
              treated as private and confidential.
            </Text>
          </View>
        </View>

        {/* Reschedule */}
        <Pressable
          style={styles.rescheduleButton}
          onPress={handleReschedule}
        >
          <Text style={styles.rescheduleIcon}>↻</Text>

          <Text style={styles.rescheduleText}>
            Reschedule Appointment
          </Text>
        </Pressable>

        {/* Cancel */}
        <Pressable
          style={styles.cancelButton}
          onPress={handleCancelAppointment}
        >
          <Text style={styles.cancelIcon}>×</Text>

          <Text style={styles.cancelText}>
            Cancel Appointment
          </Text>
        </Pressable>

        {/* Back */}
        <Pressable
          style={styles.backAppointmentsButton}
          onPress={() => navigation.getParent()?.getParent()?.navigate('Sessions')}
        >
          <Text style={styles.backAppointmentsText}>
            Back to My Appointments
          </Text>
        </Pressable>
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
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 32,
    color: '#3B2925',
    marginTop: -4,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
  },

  headerSpacer: {
    width: 42,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
    marginTop: 20,
    marginBottom: 11,
  },

  statusCard: {
    backgroundColor: '#EAF7EC',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  statusIconText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4E9B5C',
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  statusText: {
    fontSize: 11,
    color: '#687268',
  },

  counselorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  counselorAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FCE3DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  counselorEmoji: {
    fontSize: 30,
  },

  counselorInfo: {
    flex: 1,
  },

  counselorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  specialization: {
    fontSize: 12,
    color: '#C85F4D',
    marginBottom: 4,
  },

  experience: {
    fontSize: 11,
    color: '#8A7770',
  },

  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIconBox: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  detailIcon: {
    fontSize: 20,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 10,
    color: '#8A7770',
    marginBottom: 3,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B2925',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1E8E3',
    marginVertical: 14,
  },

  reminderCard: {
    backgroundColor: '#FFF0EA',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  reminderIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  reminderContent: {
    flex: 1,
  },

  reminderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  reminderText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#806F69',
  },

  privacyCard: {
    backgroundColor: '#F7F3EF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },

  privacyIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  privacyText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#806F69',
  },

  rescheduleButton: {
    height: 52,
    backgroundColor: '#F47F69',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  rescheduleIcon: {
    fontSize: 21,
    color: '#FFFFFF',
    marginRight: 8,
  },

  rescheduleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  cancelButton: {
    height: 52,
    backgroundColor: '#FFF0F0',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  cancelIcon: {
    fontSize: 24,
    color: '#C94C4C',
    marginRight: 8,
  },

  cancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C94C4C',
  },

  backAppointmentsButton: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0E2DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  backAppointmentsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6F605B',
  },
});