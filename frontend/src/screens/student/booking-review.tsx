import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { studentService } from '../../services/studentService';

const CORAL = '#EF806B';
const CREAM = '#FFF9F3';
const DARK  = '#4A3833';
const MUTED = '#8A7770';
const WHITE = '#FFFFFF';

/* ── Inline Icons ─────────────────────────────────────────────────────────── */
function PersonIcon() {
  return (
    <View style={{ width: 18, height: 20, alignItems: 'center' }}>
      <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: CORAL }} />
      <View style={{ width: 16, height: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: CORAL, marginTop: 1 }} />
    </View>
  );
}

function CalendarIcon() {
  return (
    <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 16, height: 13, borderWidth: 1.5, borderColor: CORAL, borderRadius: 3 }} />
      <View style={{ position: 'absolute', top: 1, width: 1.5, height: 5, backgroundColor: CORAL, left: 5 }} />
      <View style={{ position: 'absolute', top: 1, width: 1.5, height: 5, backgroundColor: CORAL, right: 5 }} />
    </View>
  );
}

function ClockIcon() {
  return (
    <View style={{ width: 17, height: 17, borderWidth: 1.5, borderColor: CORAL, borderRadius: 9 }}>
      <View style={{ position: 'absolute', width: 1.5, height: 5, backgroundColor: CORAL, bottom: 8, right: 7.25 }} />
      <View style={{ position: 'absolute', width: 4, height: 1.5, backgroundColor: CORAL, left: 8, top: 7.25 }} />
    </View>
  );
}

function MonitorIcon() {
  return (
    <View style={{ width: 19, height: 17, alignItems: 'center' }}>
      <View style={{ width: 17, height: 12, borderWidth: 1.5, borderColor: CORAL, borderRadius: 3 }} />
      <View style={{ width: 7, height: 1.5, backgroundColor: CORAL, marginTop: 1 }} />
      <View style={{ width: 11, height: 1.5, backgroundColor: CORAL, marginTop: 1 }} />
    </View>
  );
}

function BellIcon() {
  return (
    <View style={{ width: 16, height: 18, alignItems: 'center' }}>
      <View style={{ width: 12, height: 12, borderWidth: 1.5, borderColor: CORAL, borderRadius: 6, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
      <View style={{ width: 1.5, height: 4, backgroundColor: CORAL, position: 'absolute', top: 0 }} />
      <View style={{ width: 6, height: 2, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, backgroundColor: CORAL, position: 'absolute', bottom: 2 }} />
    </View>
  );
}

function LockIcon() {
  return (
    <View style={{ width: 16, height: 18, alignItems: 'center' }}>
      <View style={{ width: 12, height: 9, borderWidth: 1.5, borderColor: CORAL, borderRadius: 3, position: 'absolute', bottom: 0 }} />
      <View style={{ width: 8, height: 6, borderWidth: 1.5, borderColor: CORAL, borderRadius: 4, borderBottomWidth: 0, position: 'absolute', top: 0 }} />
    </View>
  );
}

/* ── Main Screen ──────────────────────────────────────────────────────────── */
export default function BookingReviewScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as {
    counselorId?: string;
    date?: string;
    time?: string;
    sessionType?: string;
    notes?: string;
    counselorName?: string;
    appointmentId?: string;
  } || {};
  const { date, time, sessionType, notes, counselorName, appointmentId } = params;
  const isReschedule = !!appointmentId;

  const [loading, setLoading] = useState(false);

  const handleConfirmBooking = async () => {
    const dateStr = String(date || 'Mon, Oct 12');
    const timeStr = String(time || '09:00 AM');
    const sessionTypeStr = String(sessionType || 'Online');
    const notesStr = String(notes || '');

    try {
      setLoading(true);

      if (isReschedule && appointmentId) {
        await studentService.updateAppointment(appointmentId, {
          date: dateStr,
          time: timeStr,
          sessionType: sessionTypeStr,
          notes: notesStr,
        });
        Alert.alert(
          'Appointment Rescheduled',
          'Your appointment has been updated with the new date and time.',
          [{
            text: 'OK',
            onPress: () => navigation.navigate('AppointmentDetails', { appointmentId }),
          }],
        );
        return;
      }

      const res = await studentService.bookAppointment({
        counselorName: counselorName || 'Dr. Sarah Perera',
        counselorSpecialization: 'Student Counselling',
        date: dateStr,
        time: timeStr,
        sessionType: sessionTypeStr,
        notes: notesStr,
      });
      navigation.navigate('BookingConfirmed', {
        appointmentId: res?.data?._id || '',
        date: dateStr,
        time: timeStr,
        sessionType: sessionTypeStr,
      });
    } catch (err: any) {
      Alert.alert(
        isReschedule ? 'Reschedule Failed' : 'Booking Failed',
        err?.response?.data?.message
          || (isReschedule
            ? 'Could not reschedule appointment. Please try again.'
            : 'Could not book appointment. Please try again.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {isReschedule ? 'Confirm Reschedule' : 'Review Booking'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* ── Intro ── */}
        <Text style={styles.pageTitle}>
          {isReschedule ? 'Review New Time' : 'Review Your Appointment'}
        </Text>
        <Text style={styles.pageSub}>
          {isReschedule
            ? 'Please confirm your updated appointment details.'
            : 'Please check your details before confirming.'}
        </Text>

        {/* ── Appointment Details ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointment Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.iconBox}><PersonIcon /></View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Counselor</Text>
              <Text style={styles.detailValue}>{counselorName || 'Dr. Sarah Perera'}</Text>
              <Text style={styles.detailSub}>Student Counselling</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}><CalendarIcon /></View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{String(date || 'Mon, Oct 12')}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}><ClockIcon /></View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{String(time || '09:00 AM')}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.iconBox}><MonitorIcon /></View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Session Type</Text>
              <Text style={styles.detailValue}>{String(sessionType || 'Online')}</Text>
            </View>
          </View>
        </View>

        {/* ── Notes ── */}
        {!!notes && String(notes).trim().length > 0 && (
          <View style={styles.notesCard}>
            <Text style={styles.cardTitle}>Notes for Counselor</Text>
            <Text style={styles.notesText}>{String(notes)}</Text>
          </View>
        )}

        {/* ── Reminder ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}><BellIcon /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Appointment Reminder</Text>
            <Text style={styles.infoText}>You will receive a reminder 1 day before your session.</Text>
          </View>
        </View>

        {/* ── Privacy ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconBox}><LockIcon /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Privacy & Confidentiality</Text>
            <Text style={styles.infoText}>Your appointment information is kept private and confidential.</Text>
          </View>
        </View>

        {/* ── Confirm Button ── */}
        <Pressable
          style={({ pressed }) => [styles.confirmBtn, loading && { opacity: 0.75 }, pressed && { opacity: 0.85 }]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={WHITE} />
            : (
              <Text style={styles.confirmBtnText}>
                {isReschedule ? 'Confirm Reschedule' : 'Confirm Booking'}
              </Text>
            )
          }
        </Pressable>

        {/* ── Edit ── */}
        <Pressable style={styles.editBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.editBtnText}>← Edit Appointment</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: CREAM },
  container:   { paddingHorizontal: 20, paddingBottom: 40 },

  header:      { height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0E4DE' },
  backArrow:   { fontSize: 28, color: MUTED, fontWeight: '400', marginTop: -2 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: DARK },
  headerSpacer:{ width: 40 },

  pageTitle:   { fontSize: 26, fontWeight: '800', color: DARK, marginTop: 10 },
  pageSub:     { fontSize: 13, color: MUTED, lineHeight: 19, marginTop: 6, marginBottom: 20 },

  card: {
    backgroundColor: WHITE, borderRadius: 18, padding: 18, marginBottom: 14,
    borderWidth: 1, borderColor: '#F0E2DC',
    shadowColor: '#C6AEA1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 7, elevation: 1,
  },
  cardTitle:   { fontSize: 15, fontWeight: '700', color: DARK, marginBottom: 16 },

  detailRow:     { flexDirection: 'row', alignItems: 'center' },
  iconBox:       { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFF1EC', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  detailContent: { flex: 1 },
  detailLabel:   { fontSize: 10.5, color: MUTED, marginBottom: 2 },
  detailValue:   { fontSize: 14, fontWeight: '700', color: DARK },
  detailSub:     { fontSize: 11, color: MUTED, marginTop: 1 },
  divider:       { height: 1, backgroundColor: '#F1E8E3', marginVertical: 14 },

  notesCard: { backgroundColor: WHITE, borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#F0E2DC' },
  notesText: { fontSize: 13.5, lineHeight: 20, color: DARK },

  infoCard:    { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F7F3EF', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#EFE5DE' },
  infoIconBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  infoTitle:   { fontSize: 13, fontWeight: '700', color: DARK, marginBottom: 3 },
  infoText:    { fontSize: 11.5, lineHeight: 17, color: MUTED },

  confirmBtn:     { height: 54, backgroundColor: CORAL, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8, shadowColor: CORAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  confirmBtnText: { fontSize: 15, fontWeight: '700', color: WHITE },

  editBtn:     { height: 48, backgroundColor: WHITE, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderWidth: 1, borderColor: '#E9DDD7' },
  editBtnText: { fontSize: 14, fontWeight: '600', color: CORAL },
});
