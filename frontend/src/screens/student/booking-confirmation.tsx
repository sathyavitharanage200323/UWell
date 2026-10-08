import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BookingConfirmationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as {
    counselorId?: string; date?: string; time?: string;
    sessionType?: string; notes?: string;
  } || {};
  const { counselorId, date, time, sessionType, notes } = params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Booking Confirmed!</Text>

        <Text style={styles.subtitle}>
          Your counseling appointment has been successfully booked.
        </Text>

        {/* Confirmation Number */}
        <View style={styles.confirmationCard}>
          <Text style={styles.confirmationLabel}>
            Appointment Confirmed
          </Text>

          <Text style={styles.confirmationText}>
            Your appointment is scheduled with your selected counselor.
          </Text>
        </View>

        {/* Appointment Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointment Details</Text>

          {/* Counselor */}
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>👩‍⚕️</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.label}>Counselor</Text>
              <Text style={styles.value}>Dr. Sarah Perera</Text>
              <Text style={styles.secondaryValue}>
                Student Counselling
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Date */}
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>📅</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>
                {String(date || 'Mon, Oct 12')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Time */}
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>🕐</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.label}>Time</Text>
              <Text style={styles.value}>
                {String(time || '09:00 AM')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Session Type */}
          <View style={styles.detailRow}>
            <View style={styles.iconBox}>
              <Text style={styles.icon}>💻</Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.label}>Session Type</Text>
              <Text style={styles.value}>
                {String(sessionType || 'Online')}
              </Text>
            </View>
          </View>
        </View>

        {/* Reminder */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderIcon}>
            <Text style={styles.reminderEmoji}>🔔</Text>
          </View>

          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>
              Appointment Reminder
            </Text>

            <Text style={styles.reminderText}>
              Reminder set: 1 day before your appointment.
            </Text>
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Your Privacy Matters
            </Text>

            <Text style={styles.privacyText}>
              Your counseling appointment and personal information
              are kept private and confidential.
            </Text>
          </View>
        </View>

        {/* View Appointment */}
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate('AppointmentDetails')}
        >
          <Text style={styles.primaryButtonText}>
            View Appointment
          </Text>

          <Text style={styles.arrow}>→</Text>
        </Pressable>

        {/* My Appointments */}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.getParent()?.getParent()?.navigate('Sessions')}
        >
          <Text style={styles.secondaryButtonText}>
            My Appointments
          </Text>
        </Pressable>

        {/* Home */}
        <Pressable
          style={styles.homeLink}
          onPress={() => navigation.getParent()?.getParent()?.navigate('Home')}
        >
          <Text style={styles.homeLinkText}>
            Back to Home
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
    paddingTop: 25,
    paddingBottom: 35,
  },

  successCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#E7F6EA',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 18,
  },

  checkmark: {
    fontSize: 45,
    fontWeight: '700',
    color: '#4E9B5C',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3B2925',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#806F69',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
    paddingHorizontal: 15,
  },

  confirmationCard: {
    backgroundColor: '#FFF0EA',
    borderRadius: 18,
    padding: 17,
    marginBottom: 15,
    alignItems: 'center',
  },

  confirmationLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C85F4D',
    marginBottom: 6,
  },

  confirmationText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#806F69',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 15,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  icon: {
    fontSize: 20,
  },

  detailContent: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: '#95847E',
    marginBottom: 3,
  },

  value: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B2925',
  },

  secondaryValue: {
    fontSize: 12,
    color: '#806F69',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#F1E8E3',
    marginVertical: 14,
  },

  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EA',
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
  },

  reminderIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  reminderEmoji: {
    fontSize: 21,
  },

  reminderContent: {
    flex: 1,
  },

  reminderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  reminderText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#806F69',
  },

  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F7F3EF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },

  privacyIcon: {
    fontSize: 21,
    marginRight: 12,
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  privacyText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#806F69',
  },

  primaryButton: {
    height: 56,
    backgroundColor: '#F47F69',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  arrow: {
    fontSize: 22,
    color: '#FFFFFF',
    marginLeft: 10,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  secondaryButton: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F47F69',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C85F4D',
  },

  homeLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },

  homeLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#806F69',
  },
});