import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { studentService } from '../../services/studentService';

// Day-of-week name from a date string like "Mon, Oct 12" → "Monday"
const DAY_MAP: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday',
  Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

// Fallback static slots used when the API returns nothing for a day
const FALLBACK_SLOTS: Record<string, string[]> = {
  Monday:    ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
  Tuesday:   ['09:00 AM', '10:00 AM', '02:00 PM', '03:30 PM'],
  Wednesday: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],
  Thursday:  [],
  Friday:    ['09:00 AM', '10:00 AM', '11:00 AM'],
};

export default function AvailabilityScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as {
    counselorId?: string;
    counselorName?: string;
    counselorSpecialization?: string;
    counselorExperience?: string;
    appointmentId?: string;
  } || {};
  const { counselorId, counselorName, counselorSpecialization, counselorExperience, appointmentId } = params;
  const isReschedule = !!appointmentId;

  // Generate next 5 working days from today
  const buildDates = () => {
    const days = [];
    const d = new Date();
    while (days.length < 5) {
      const dow = d.getDay(); // 0=Sun,6=Sat
      if (dow !== 0 && dow !== 6) {
        const dayAbbr = d.toLocaleDateString('en-US', { weekday: 'short' }); // Mon
        const date    = d.getDate().toString();
        const month   = d.toLocaleDateString('en-US', { month: 'short' });   // Oct
        days.push({ day: dayAbbr, date, month });
      }
      d.setDate(d.getDate() + 1);
    }
    return days;
  };

  const dates = buildDates();
  const defaultDate = `${dates[0].day}, ${dates[0].month} ${dates[0].date}`;

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await studentService.getCounselorAvailability(
          counselorId ? String(counselorId) : undefined
        );
        const data: any[] = res?.data || [];
        const map: Record<string, string[]> = {};
        data.forEach((entry: any) => {
          if (entry.active && Array.isArray(entry.slots) && entry.slots.length > 0) {
            map[entry.day] = entry.slots;
          }
        });
        if (Object.keys(map).length > 0) {
          // Fill only missing days from fallback — preserve real DB data for present days
          const merged: Record<string, string[]> = { ...FALLBACK_SLOTS, ...map };
          setAvailabilityMap(merged);
        } else {
          setAvailabilityMap(FALLBACK_SLOTS);
        }
      } catch {
        setAvailabilityMap(FALLBACK_SLOTS);
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    setSelectedTime(null);
    load();
  }, [counselorId]);

  // Slots for the currently selected date
  const selectedDayAbbr = selectedDate.split(',')[0]?.trim(); // "Mon"
  const selectedDayFull = DAY_MAP[selectedDayAbbr] || '';
  const slots = availabilityMap[selectedDayFull] || [];

  const handleContinue = () => {
    if (!selectedTime) return;
    navigation.navigate('BookAppointment', {
      counselorId,
      counselorName:             counselorName || '',
      counselorSpecialization:   counselorSpecialization || '',
      counselorExperience:       counselorExperience || '',
      date:                      selectedDate,
      time:                      selectedTime,
      appointmentId,
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
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Header */}
        <Text style={styles.smallTitle}>
          APPOINTMENT
        </Text>

        <Text style={styles.title}>
          {isReschedule ? 'Pick a New Date & Time' : 'Choose a Date & Time'}
        </Text>

        <Text style={styles.subtitle}>
          {isReschedule
            ? 'Choose a new slot for your existing appointment.'
            : 'Select an available date and time for your counseling session.'}
        </Text>

        {/* Selected Counselor */}
        <View style={styles.counselorCard}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitials}>
              {counselorName
                ? counselorName.split(' ').map((p: string) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
                : '?'}
            </Text>
          </View>

          <View style={styles.counselorInfo}>
            <Text style={styles.counselorName}>
              {counselorName || 'Counselor'}
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

        {loading ? (
          <ActivityIndicator color="#EF806B" style={{ marginBottom: 20 }} />
        ) : slots.length === 0 ? (
          <View style={styles.noSlotsCard}>
            <Text style={styles.noSlotsText}>
              No available slots for this day. Please choose another date.
            </Text>
          </View>
        ) : (
          <View style={styles.timeGrid}>
            {slots.map((time) => {
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
                  <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
                    {time}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

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

  profileInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: '#EF806B',
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

  noSlotsCard: {
    backgroundColor: '#F7F3EF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  noSlotsText: {
    color: '#806F68',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
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