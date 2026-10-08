import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function MyAppointmentsScreen() {
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
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            My Appointments
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Upcoming Appointment */}
        <Text style={styles.sectionTitle}>
          Upcoming Appointment
        </Text>

        <Pressable
          style={styles.appointmentCard}
          onPress={() => router.push('/appointment-details')}
        >
          <View style={styles.dateBox}>
            <Text style={styles.dateDay}>12</Text>
            <Text style={styles.dateMonth}>OCT</Text>
          </View>

          <View style={styles.appointmentInfo}>
            <Text style={styles.counselorName}>
              Dr. Sarah Perera
            </Text>

            <Text style={styles.specialization}>
              Student Counselling
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🕐</Text>
              <Text style={styles.infoText}>
                09:00 AM
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>💻</Text>
              <Text style={styles.infoText}>
                Online Session
              </Text>
            </View>
          </View>

          <Text style={styles.chevron}>›</Text>
        </Pressable>

        {/* Reminder */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderIcon}>
            <Text>🔔</Text>
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

        {/* Appointment Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusDot} />

          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>
              Appointment Confirmed
            </Text>

            <Text style={styles.statusText}>
              Your counseling appointment is confirmed.
            </Text>
          </View>
        </View>

        {/* Previous Appointments */}
        <Text style={styles.sectionTitle}>
          Previous Appointments
        </Text>

        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Text>📋</Text>
          </View>

          <Text style={styles.emptyTitle}>
            No previous appointments
          </Text>

          <Text style={styles.emptyText}>
            Your completed or cancelled appointments
            will appear here.
          </Text>
        </View>

        {/* Booking Button */}
        <Pressable
          style={styles.bookButton}
          onPress={() => router.push('/counselor-search')}
        >
          <Text style={styles.bookButtonText}>
            Book a New Appointment
          </Text>

          <Text style={styles.bookArrow}>→</Text>
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2925',
    marginTop: 18,
    marginBottom: 12,
  },

  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  dateBox: {
    width: 58,
    height: 66,
    borderRadius: 16,
    backgroundColor: '#FCE3DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  dateDay: {
    fontSize: 23,
    fontWeight: '800',
    color: '#C85F4D',
  },

  dateMonth: {
    fontSize: 10,
    fontWeight: '800',
    color: '#C85F4D',
    marginTop: 2,
  },

  appointmentInfo: {
    flex: 1,
  },

  counselorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 3,
  },

  specialization: {
    fontSize: 11,
    color: '#8A7770',
    marginBottom: 7,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  infoIcon: {
    fontSize: 12,
    marginRight: 5,
  },

  infoText: {
    fontSize: 11,
    color: '#6F605B',
  },

  chevron: {
    fontSize: 28,
    color: '#B39D96',
    marginLeft: 5,
  },

  reminderCard: {
    backgroundColor: '#FFF0EA',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
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
    marginBottom: 3,
  },

  reminderText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#806F69',
  },

  statusCard: {
    backgroundColor: '#EAF7EC',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  statusDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#4E9B5C',
    marginRight: 11,
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 3,
  },

  statusText: {
    fontSize: 11,
    color: '#687268',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  emptyIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#F7F3EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#8A7770',
    textAlign: 'center',
  },

  bookButton: {
    height: 52,
    backgroundColor: '#F47F69',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  bookButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  bookArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});