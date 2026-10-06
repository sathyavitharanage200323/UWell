import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

export default function AvailabilityScreen() {
  const { id } = useLocalSearchParams();

  const [selectedDate, setSelectedDate] = useState('Mon, Oct 12');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const dates = [
    {
      day: 'Mon',
      date: '12',
      month: 'Oct',
    },
    {
      day: 'Tue',
      date: '13',
      month: 'Oct',
    },
    {
      day: 'Wed',
      date: '14',
      month: 'Oct',
    },
    {
      day: 'Thu',
      date: '15',
      month: 'Oct',
    },
    {
      day: 'Fri',
      date: '16',
      month: 'Oct',
    },
  ];

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
  ];

  const handleContinue = () => {
    if (!selectedTime) return;

    router.push({
      pathname: '/book-appointment',
      params: {
        counselorId: String(id || '1'),
        date: selectedDate,
        time: selectedTime,
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
          APPOINTMENT
        </Text>

        <Text style={styles.title}>
          Choose a Date & Time
        </Text>

        <Text style={styles.subtitle}>
          Select an available date and time for
          your counseling session.
        </Text>

        {/* Selected Counselor */}
        <View style={styles.counselorCard}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileIcon}>
              👩‍⚕️
            </Text>
          </View>

          <View style={styles.counselorInfo}>
            <Text style={styles.counselorName}>
              Counselor
            </Text>

            <Text style={styles.counselorText}>
              Selected counselor
            </Text>
          </View>

          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />

            <Text style={styles.availableText}>
              Available
            </Text>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.sectionTitle}>
          Select Date
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateContainer}
        >
          {dates.map((date) => {
            const dateValue = `${date.day}, ${date.month} ${date.date}`;
            const isSelected = selectedDate === dateValue;

            return (
              <Pressable
                key={dateValue}
                style={[
                  styles.dateCard,
                  isSelected && styles.selectedDateCard,
                ]}
                onPress={() => {
                  setSelectedDate(dateValue);
                  setSelectedTime(null);
                }}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDateText,
                  ]}
                >
                  {date.day}
                </Text>

                <Text
                  style={[
                    styles.dateText,
                    isSelected && styles.selectedDateText,
                  ]}
                >
                  {date.date}
                </Text>

                <Text
                  style={[
                    styles.monthText,
                    isSelected && styles.selectedDateText,
                  ]}
                >
                  {date.month}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Time */}
        <Text style={styles.sectionTitle}>
          Available Time Slots
        </Text>

        <View style={styles.timeGrid}>
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;

            return (
              <Pressable
                key={time}
                style={[
                  styles.timeButton,
                  isSelected && styles.selectedTimeButton,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    isSelected && styles.selectedTimeText,
                  ]}
                >
                  {time}
                </Text>
              </Pressable>
            );
          })}
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
              A reminder will be set for 1 day before
              your appointment.
            </Text>
          </View>
        </View>

        {/* Continue */}
        <Pressable
          style={[
            styles.continueButton,
            !selectedTime && styles.disabledButton,
          ]}
          disabled={!selectedTime}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>
            Continue
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
    marginBottom: 20,
  },

  counselorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
    marginBottom: 25,
  },

  profileCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FCE3DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  profileIcon: {
    fontSize: 27,
  },

  counselorInfo: {
    flex: 1,
  },

  counselorName: {
    color: '#3B2925',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },

  counselorText: {
    color: '#8A7770',
    fontSize: 10,
  },

  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF6EC',
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#65B87A',
    marginRight: 5,
  },

  availableText: {
    color: '#65A870',
    fontSize: 9,
    fontWeight: '700',
  },

  sectionTitle: {
    color: '#3B2925',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },

  dateContainer: {
    gap: 9,
    paddingBottom: 8,
  },

  dateCard: {
    width: 67,
    height: 83,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E8DDD7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedDateCard: {
    backgroundColor: '#EF806B',
    borderColor: '#EF806B',
  },

  dayText: {
    color: '#8A7770',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },

  dateText: {
    color: '#3B2925',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },

  monthText: {
    color: '#8A7770',
    fontSize: 9,
  },

  selectedDateText: {
    color: '#FFFFFF',
  },

  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  timeButton: {
    width: '31%',
    minHeight: 45,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8DDD7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedTimeButton: {
    backgroundColor: '#FCE0D9',
    borderColor: '#EF806B',
    borderWidth: 2,
  },

  timeText: {
    color: '#5F4D47',
    fontSize: 11,
    fontWeight: '600',
  },

  selectedTimeText: {
    color: '#C85F4E',
    fontWeight: '700',
  },

  reminderCard: {
    backgroundColor: '#F5EFE9',
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 20,
  },

  reminderIcon: {
    fontSize: 23,
    marginRight: 11,
  },

  reminderContent: {
    flex: 1,
  },

  reminderTitle: {
    color: '#3B2925',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  reminderText: {
    color: '#806F68',
    fontSize: 11,
    lineHeight: 17,
  },

  continueButton: {
    height: 54,
    backgroundColor: '#EF806B',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    backgroundColor: '#DCCBC5',
  },

  continueText: {
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