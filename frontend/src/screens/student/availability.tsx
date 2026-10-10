import React, { useState, useEffect, useMemo } from 'react';
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

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const timeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const sortSlots = (slots: string[]) =>
  [...slots].sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

const formatDateLabel = (d: Date) =>
  `${WEEKDAY_SHORT[d.getDay()]}, ${MONTH_SHORT[d.getMonth()]} ${d.getDate()}`;

export default function AvailabilityScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as {
    counselorId?: string;
    counselorName?: string;
    appointmentId?: string;
  } || {};
  const { counselorId, counselorName, appointmentId } = params;
  const isReschedule = !!appointmentId;
  const id = String(counselorId || 'c1');

  const [availability, setAvailability] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [counselorLabel, setCounselorLabel] = useState(counselorName || '');

  useEffect(() => {
    let active = true;

    const loadAvailability = async () => {
      try {
        setLoading(true);
        const data = await studentService.getCounselorAvailability(id);
        const list = Array.isArray(data) ? data : (data?.data || []);
        if (active) setAvailability(list);
      } catch (error) {
        if (active) setAvailability([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAvailability();

    if (!counselorName) {
      studentService
        .getCounselorById(id)
        .then((c: any) => {
          if (active && c?.name) setCounselorLabel(c.name);
        })
        .catch(() => {});
    }

    return () => {
      active = false;
    };
  }, [id]);

  const activeDays = useMemo(() => {
    const map: Record<string, string[]> = {};
    availability.forEach((item) => {
      if (item?.active && Array.isArray(item?.slots) && item.slots.length > 0) {
        map[item.day] = sortSlots([...new Set(item.slots as string[])]);
      }
    });
    return map;
  }, [availability]);

  const upcomingDays = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 21 && days.length < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (activeDays[WEEKDAY_NAMES[d.getDay()]]) days.push(d);
    }
    return days;
  }, [activeDays]);

  useEffect(() => {
    if (upcomingDays.length > 0 && !selectedDate) {
      setSelectedDate(upcomingDays[0]);
    }
  }, [upcomingDays, selectedDate]);

  const selectedDayName = selectedDate ? WEEKDAY_NAMES[selectedDate.getDay()] : '';
  const slots = selectedDate && activeDays[selectedDayName] ? activeDays[selectedDayName] : [];
  const hasAvailability = !!selectedDate && slots.length > 0;

  const handleContinue = () => {
    if (!selectedTime || !selectedDate) return;

    navigation.navigate('BookAppointment', {
      counselorId: id,
      counselorName: counselorLabel || 'Counselor',
      date: formatDateLabel(selectedDate),
      time: selectedTime,
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
            <Text style={styles.profileIcon}>
              👩‍⚕️
            </Text>
          </View>

          <View style={styles.counselorInfo}>
            <Text style={styles.counselorName}>
              {counselorLabel || 'Counselor'}
            </Text>

            <Text style={styles.counselorText}>
              Selected counselor
            </Text>
          </View>

          <View style={[styles.availableBadge, !hasAvailability && styles.unavailableBadge]}>
            <View style={[styles.availableDot, !hasAvailability && styles.unavailableDot]} />

            <Text style={[styles.availableText, !hasAvailability && styles.unavailableText]}>
              {hasAvailability ? 'Available' : 'No slots'}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color="#EF806B" />
            <Text style={styles.stateText}>Loading availability…</Text>
          </View>
        ) : upcomingDays.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateEmoji}>📅</Text>
            <Text style={styles.stateTitle}>No availability yet</Text>
            <Text style={styles.stateText}>
              This counselor hasn’t published any open slots. Please check back later.
            </Text>
          </View>
        ) : (
          <>
            {/* Date */}
            <Text style={styles.sectionTitle}>
              Select Date
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateContainer}
            >
              {upcomingDays.map((date) => {
                const dateValue = formatDateLabel(date);
                const isSelected = selectedDate
                  ? formatDateLabel(selectedDate) === dateValue
                  : false;

                return (
                  <Pressable
                    key={dateValue}
                    style={[
                      styles.dateCard,
                      isSelected && styles.selectedDateCard,
                    ]}
                    onPress={() => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.selectedDateText,
                      ]}
                    >
                      {WEEKDAY_SHORT[date.getDay()]}
                    </Text>

                    <Text
                      style={[
                        styles.dateText,
                        isSelected && styles.selectedDateText,
                      ]}
                    >
                      {date.getDate()}
                    </Text>

                    <Text
                      style={[
                        styles.monthText,
                        isSelected && styles.selectedDateText,
                      ]}
                    >
                      {MONTH_SHORT[date.getMonth()]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Time */}
            <Text style={styles.sectionTitle}>
              Available Time Slots
            </Text>

            {slots.length === 0 ? (
              <Text style={styles.noSlotsText}>
                No slots available on this date. Please pick another day.
              </Text>
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
            )}
          </>
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

  unavailableBadge: {
    backgroundColor: '#F0EBE6',
  },

  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#65B87A',
    marginRight: 5,
  },

  unavailableDot: {
    backgroundColor: '#B39D96',
  },

  availableText: {
    color: '#65A870',
    fontSize: 9,
    fontWeight: '700',
  },

  unavailableText: {
    color: '#8A7770',
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

  noSlotsText: {
    color: '#8A7770',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },

  stateBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
    marginBottom: 22,
  },

  stateEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },

  stateTitle: {
    color: '#3B2925',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },

  stateText: {
    color: '#8A7770',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
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
