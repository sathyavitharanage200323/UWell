import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

export default function BookAppointmentScreen() {
  const { counselorId, date, time } = useLocalSearchParams();

  const [sessionType, setSessionType] = useState('Online');
  const [notes, setNotes] = useState('');

  const handleReviewBooking = () => {
    router.push({
      pathname: '/booking-review',
      params: {
        counselorId: String(counselorId || '1'),
        date: String(date || 'Mon, Oct 12'),
        time: String(time || '09:00 AM'),
        sessionType,
        notes,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Back */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Header */}
        <Text style={styles.smallTitle}>
          BOOKING
        </Text>

        <Text style={styles.title}>
          Book an Appointment
        </Text>

        <Text style={styles.subtitle}>
          Review your appointment details and
          provide any information you would like
          your counselor to know.
        </Text>

        {/* Counselor */}
        <Text style={styles.sectionTitle}>
          Counselor
        </Text>

        <View style={styles.counselorCard}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileIcon}>
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

        {/* Appointment Details */}
        <Text style={styles.sectionTitle}>
          Appointment Details
        </Text>

        <View style={styles.detailsCard}>

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Text style={styles.detailIcon}>
                📅
              </Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Date
              </Text>

              <Text style={styles.detailValue}>
                {String(date || 'Mon, Oct 12')}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Text style={styles.detailIcon}>
                🕐
              </Text>
            </View>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Time
              </Text>

              <Text style={styles.detailValue}>
                {String(time || '09:00 AM')}
              </Text>
            </View>
          </View>

        </View>

        {/* Session Type */}
        <Text style={styles.sectionTitle}>
          Session Type
        </Text>

        <View style={styles.sessionRow}>

          <Pressable
            style={[
              styles.sessionButton,
              sessionType === 'Online' &&
                styles.selectedSession,
            ]}
            onPress={() => setSessionType('Online')}
          >
            <Text style={styles.sessionIcon}>
              💻
            </Text>

            <Text
              style={[
                styles.sessionText,
                sessionType === 'Online' &&
                  styles.selectedSessionText,
              ]}
            >
              Online
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.sessionButton,
              sessionType === 'In Person' &&
                styles.selectedSession,
            ]}
            onPress={() => setSessionType('In Person')}
          >
            <Text style={styles.sessionIcon}>
              🏢
            </Text>

            <Text
              style={[
                styles.sessionText,
                sessionType === 'In Person' &&
                  styles.selectedSessionText,
              ]}
            >
              In Person
            </Text>
          </Pressable>

        </View>

        {/* Notes */}
        <Text style={styles.sectionTitle}>
          Notes for Counselor
          <Text style={styles.optional}>
            {' '} (Optional)
          </Text>
        </Text>

        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Briefly describe what you would like support with..."
          placeholderTextColor="#A99A94"
          style={styles.notesInput}
          multiline
          textAlignVertical="top"
          maxLength={300}
        />

        <Text style={styles.characterCount}>
          {notes.length}/300
        </Text>

        {/* Privacy */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>
            🔒
          </Text>

          <View style={styles.privacyContent}>
            <Text style={styles.privacyTitle}>
              Your information is confidential
            </Text>

            <Text style={styles.privacyText}>
              Your appointment information and notes
              are handled privately and securely.
            </Text>
          </View>
        </View>

        {/* Reminder */}
        <View style={styles.reminderCard}>
          <Text style={styles.reminderIcon}>
            🔔
          </Text>

          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>
              Appointment Reminder
            </Text>

            <Text style={styles.reminderText}>
              Reminder set: 1 day before your
              appointment.
            </Text>
          </View>
        </View>

        {/* Review Button */}
        <Pressable
          style={styles.reviewButton}
          onPress={handleReviewBooking}
        >
          <Text style={styles.reviewText}>
            Review Booking
          </Text>

          <Text style={styles.arrow}>
            →
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
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  backArrow: {
    color: '#3B2925',
    fontSize: 30,
    lineHeight: 30,
    marginRight: 5,
  },

  backText: {
    color: '#6F5E58',
    fontSize: 13,
  },

  smallTitle: {
    color: '#EF806B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    color: '#3B2925',
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700',
    marginBottom: 9,
  },

  subtitle: {
    color: '#8A7770',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 23,
  },

  sectionTitle: {
    color: '#3B2925',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 11,
    marginTop: 3,
  },

  optional: {
    color: '#A99A94',
    fontSize: 10,
    fontWeight: '400',
  },

  counselorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
    marginBottom: 22,
  },

  profileCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FCE3DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  profileIcon: {
    fontSize: 30,
  },

  counselorInfo: {
    flex: 1,
  },

  counselorName: {
    color: '#3B2925',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  specialization: {
    color: '#EF806B',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 3,
  },

  experience: {
    color: '#8A7770',
    fontSize: 10,
  },

  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0E2DC',
    marginBottom: 22,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FCEAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  detailIcon: {
    fontSize: 19,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    color: '#9A8982',
    fontSize: 10,
    marginBottom: 3,
  },

  detailValue: {
    color: '#4A3833',
    fontSize: 13,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1E7E2',
    marginVertical: 13,
  },

  sessionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },

  sessionButton: {
    flex: 1,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8DDD7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedSession: {
    backgroundColor: '#FCE0D9',
    borderColor: '#EF806B',
    borderWidth: 2,
  },

  sessionIcon: {
    fontSize: 19,
    marginRight: 7,
  },

  sessionText: {
    color: '#5F4D47',
    fontSize: 12,
    fontWeight: '600',
  },

  selectedSessionText: {
    color: '#C85F4E',
    fontWeight: '700',
  },

  notesInput: {
    height: 105,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD7',
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingTop: 13,
    paddingBottom: 10,
    color: '#3B2925',
    fontSize: 12,
    lineHeight: 18,
  },

  characterCount: {
    color: '#A99A94',
    fontSize: 9,
    textAlign: 'right',
    marginTop: 5,
    marginBottom: 20,
  },

  privacyCard: {
    backgroundColor: '#F5EFE9',
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 12,
  },

  privacyIcon: {
    fontSize: 22,
    marginRight: 11,
  },

  privacyContent: {
    flex: 1,
  },

  privacyTitle: {
    color: '#3B2925',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },

  privacyText: {
    color: '#806F68',
    fontSize: 10,
    lineHeight: 16,
  },

  reminderCard: {
    backgroundColor: '#FCEAE5',
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 20,
  },

  reminderIcon: {
    fontSize: 22,
    marginRight: 11,
  },

  reminderContent: {
    flex: 1,
  },

  reminderTitle: {
    color: '#3B2925',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },

  reminderText: {
    color: '#806F68',
    fontSize: 10,
    lineHeight: 16,
  },

  reviewButton: {
    height: 54,
    backgroundColor: '#EF806B',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  reviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 21,
    marginLeft: 9,
  },
});