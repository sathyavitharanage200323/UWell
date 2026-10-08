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

export default function BookingReviewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as {
    counselorId?: string; date?: string; time?: string;
    sessionType?: string; notes?: string;
  } || {};
  const { counselorId, date, time, sessionType, notes } = params;

  const handleConfirmBooking = () => {
    navigation.navigate('BookingConfirmed', {
      counselorId: String(counselorId || '1'),
      date: String(date || 'Mon, Oct 12'),
      time: String(time || '09:00 AM'),
      sessionType: String(sessionType || 'Online'),
      notes: String(notes || ''),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Review Booking</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Intro */}
        <Text style={styles.title}>Review Your Appointment</Text>
        <Text style={styles.subtitle}>
          Please check your appointment details before confirming.
        </Text>

        {/* Appointment Card */}
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

        {/* Notes */}
        <View style={styles.notesCard}>
          <Text style={styles.cardTitle}>Your Notes</Text>

          <Text style={styles.notesText}>
            {notes && String(notes).trim().length > 0
              ? String(notes)
              : 'No additional notes added.'}
          </Text>
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
              Reminder set: 1 day before your appointment
            </Text>
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Privacy & Confidentiality
            </Text>

            <Text style={styles.privacyText}>
              Your appointment information is kept private and
              confidential.
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.confirmButtonText}>
            Confirm Booking
          </Text>

          <Text style={styles.arrow}>→</Text>
        </Pressable>

        {/* Back */}
        <Pressable
          style={styles.backLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backLinkText}>
            ← Edit Appointment
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
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2925',
  },

  headerSpacer: {
    width: 42,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#3B2925',
    marginTop: 12,
  },

  subtitle: {
    fontSize: 14,
    color: '#806F69',
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 20,
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

  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 7,
    elevation: 2,
  },

  notesText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6F5F59',
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

  confirmButton: {
    height: 56,
    backgroundColor: '#F47F69',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  arrow: {
    fontSize: 22,
    color: '#FFFFFF',
    marginLeft: 10,
  },

  backLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },

  backLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C85F4D',
  },
});