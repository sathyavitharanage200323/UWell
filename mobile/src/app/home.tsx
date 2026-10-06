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

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning ☀️</Text>
            <Text style={styles.title}>Welcome to UWell</Text>
          </View>

          {/* Profile Button */}
          <Pressable
            style={styles.profileCircle}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </Pressable>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.cardTitle}>
            How are you feeling today?
          </Text>

          <Text style={styles.cardText}>
            Take a moment to check in with yourself
            and understand your wellbeing.
          </Text>

          <Pressable
            style={styles.checkInButton}
            onPress={() => router.push('/mood-checkin')}
          >
            <Text style={styles.checkInText}>
              Daily Mood Check-In
            </Text>

            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.actionRow}>

          {/* Mental Health */}
          <Pressable
            style={styles.actionCard}
            onPress={() => router.push('/mental-health-tips')}
          >
            <Text style={styles.actionIcon}>🧠</Text>

            <Text style={styles.actionTitle}>
              Mental Health
            </Text>

            <Text style={styles.actionText}>
              Tips & support
            </Text>
          </Pressable>

          {/* Find Counselor */}
          <Pressable
            style={styles.actionCard}
            onPress={() => router.push('/counselor-search')}
          >
            <Text style={styles.actionIcon}>👩‍⚕️</Text>

            <Text style={styles.actionTitle}>
              Find Counselor
            </Text>

            <Text style={styles.actionText}>
              Book a session
            </Text>
          </Pressable>

        </View>

        {/* Appointment */}
        <Text style={styles.sectionTitle}>
          My Appointment
        </Text>

        <Pressable
          style={styles.appointmentCard}
          onPress={() => router.push('/my-appointments')}
        >
          <View style={styles.appointmentIcon}>
            <Text>📅</Text>
          </View>

          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentTitle}>
              My Appointments
            </Text>

            <Text style={styles.appointmentText}>
              View and manage your upcoming counseling
              sessions.
            </Text>
          </View>

          <Text style={styles.appointmentArrow}>›</Text>
        </Pressable>

        {/* Wellness Resources */}
        <Text style={styles.sectionTitle}>
          Wellness Resources
        </Text>

        <Pressable
          style={styles.resourceCard}
          onPress={() => router.push('/wellness-resources')}
        >
          <Text style={styles.resourceIcon}>🌿</Text>

          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>
              Explore Wellness Resources
            </Text>

            <Text style={styles.resourceText}>
              Discover helpful mental health tips
              and wellbeing resources.
            </Text>
          </View>

          <Text style={styles.resourceArrow}>›</Text>
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
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    marginBottom: 22,
  },

  greeting: {
    fontSize: 13,
    color: '#8A7770',
    marginBottom: 4,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#3B2925',
  },

  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FAD9D0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileIcon: {
    fontSize: 22,
  },

  welcomeCard: {
    backgroundColor: '#F47F69',
    borderRadius: 22,
    padding: 22,
    marginBottom: 24,
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 8,
  },

  cardText: {
    color: '#FFF5F1',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },

  checkInButton: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkInText: {
    color: '#EF806B',
    fontSize: 13,
    fontWeight: '700',
  },

  arrow: {
    color: '#EF806B',
    fontSize: 20,
    marginLeft: 8,
  },

  sectionTitle: {
    color: '#3B2925',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 4,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  actionIcon: {
    fontSize: 28,
    marginBottom: 10,
  },

  actionTitle: {
    color: '#3B2925',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  actionText: {
    color: '#8A7770',
    fontSize: 11,
  },

  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
    marginBottom: 24,
  },

  appointmentIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FCE3DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  appointmentInfo: {
    flex: 1,
  },

  appointmentTitle: {
    color: '#3B2925',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  appointmentText: {
    color: '#8A7770',
    fontSize: 11,
    lineHeight: 17,
  },

  appointmentArrow: {
    color: '#EF806B',
    fontSize: 28,
    marginLeft: 8,
  },

  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  resourceIcon: {
    fontSize: 30,
    marginRight: 12,
  },

  resourceInfo: {
    flex: 1,
  },

  resourceTitle: {
    color: '#3B2925',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  resourceText: {
    color: '#8A7770',
    fontSize: 11,
    lineHeight: 17,
  },

  resourceArrow: {
    color: '#EF806B',
    fontSize: 28,
    marginLeft: 8,
  },
});