import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  ScrollView, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { studentService } from '../../services/studentService';

const CORAL = '#EF806B';
const CREAM = '#FFF9F3';
const DARK  = '#4A3833';
const MUTED = '#8A7770';
const WHITE = '#FFFFFF';

/* ── Inline Icons ─────────────────────────────────────────────────────────── */
function CalendarIcon({ color = CORAL, size = 16 }: { color?: string; size?: number }) {
  return (
    <View style={{ width: size + 4, height: size + 4, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size, height: size - 2, borderWidth: 1.5, borderColor: color, borderRadius: 3 }} />
      <View style={{ position: 'absolute', top: 0, width: 1.5, height: 5, backgroundColor: color, left: (size + 4) / 2 - 4 }} />
      <View style={{ position: 'absolute', top: 0, width: 1.5, height: 5, backgroundColor: color, right: (size + 4) / 2 - 4 }} />
    </View>
  );
}

function ClockIcon({ color = MUTED, size = 14 }: { color?: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderWidth: 1.5, borderColor: color, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', width: 1.5, height: size * 0.3, backgroundColor: color, bottom: size / 2, right: size / 2 - 0.75 }} />
      <View style={{ position: 'absolute', width: size * 0.3, height: 1.5, backgroundColor: color, left: size / 2, top: size / 2 - 0.75 }} />
    </View>
  );
}

function PersonIcon({ color = CORAL, size = 18 }: { color?: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View style={{ width: size * 0.45, height: size * 0.45, borderRadius: size * 0.225, backgroundColor: color }} />
      <View style={{ width: size * 0.8, height: size * 0.4, borderTopLeftRadius: size * 0.4, borderTopRightRadius: size * 0.4, backgroundColor: color, marginTop: 1 }} />
    </View>
  );
}

function ChevronRight({ color = '#B39D96' }: { color?: string }) {
  return (
    <View style={{ width: 8, height: 14, justifyContent: 'center' }}>
      <View style={{ width: 8, height: 1.5, backgroundColor: color, transform: [{ rotate: '45deg' }, { translateY: -3 }] }} />
      <View style={{ width: 8, height: 1.5, backgroundColor: color, transform: [{ rotate: '-45deg' }, { translateY: 3 }] }} />
    </View>
  );
}

function PlusIcon({ color = WHITE, size = 16 }: { color?: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size, height: 2, backgroundColor: color, borderRadius: 1 }} />
      <View style={{ width: 2, height: size, backgroundColor: color, borderRadius: 1, position: 'absolute' }} />
    </View>
  );
}

/* ── Main Screen ──────────────────────────────────────────────────────────── */
export default function MyAppointmentsScreen() {
  const navigation = useNavigation<any>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await studentService.getAppointments();
      setAppointments(res?.data || []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchAppointments();
    }, [])
  );

  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const past     = appointments.filter(a => a.status !== 'upcoming');

  const formatDay = (dateStr: string) => {
    // e.g. "Mon, Oct 12" → "12"
    const match = dateStr?.match(/\d+/);
    return match ? match[0] : '—';
  };

  const formatMonth = (dateStr: string) => {
    // e.g. "Mon, Oct 12" → "OCT"
    const match = dateStr?.match(/[A-Za-z]{3,}/g);
    return match ? match[match.length - 1].toUpperCase() : '—';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchAppointments(); }}
            colors={[CORAL]}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>My Appointments</Text>
          <View style={styles.headerSpacer} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={CORAL} />
            <Text style={styles.loadingText}>Loading appointments...</Text>
          </View>
        ) : (
          <>
            {/* ── Upcoming ── */}
            <Text style={styles.sectionLabel}>UPCOMING</Text>

            {upcoming.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconWrap}>
                  <CalendarIcon color={MUTED} size={28} />
                </View>
                <Text style={styles.emptyTitle}>No upcoming appointments</Text>
                <Text style={styles.emptyText}>
                  Book a session with a counselor to get started.
                </Text>
              </View>
            ) : (
              upcoming.map(appt => (
                <Pressable
                  key={appt._id}
                  style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
                  onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: appt._id })}
                >
                  <View style={styles.cardLeft}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateNum}>{formatDay(appt.date)}</Text>
                      <Text style={styles.dateMon}>{formatMonth(appt.date)}</Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.statusPill}>
                      <View style={styles.statusDot} />
                      <Text style={styles.statusPillText}>Upcoming</Text>
                    </View>
                    <Text style={styles.counselorName}>{appt.counselorName}</Text>
                    <Text style={styles.counselorSpec}>{appt.counselorSpecialization}</Text>
                    <View style={styles.metaRow}>
                      <ClockIcon color={MUTED} size={12} />
                      <Text style={styles.metaText}>{appt.time}</Text>
                      <View style={styles.metaDot} />
                      <Text style={styles.metaText}>{appt.sessionType}</Text>
                    </View>
                  </View>
                  <ChevronRight />
                </Pressable>
              ))
            )}

            {/* ── Past ── */}
            <Text style={[styles.sectionLabel, { marginTop: 28 }]}>PREVIOUS</Text>

            {past.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No previous appointments</Text>
                <Text style={styles.emptyText}>
                  Completed or cancelled appointments will appear here.
                </Text>
              </View>
            ) : (
              past.map(appt => (
                <Pressable
                  key={appt._id}
                  style={({ pressed }) => [styles.card, styles.cardPast, pressed && { opacity: 0.75 }]}
                  onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: appt._id })}
                >
                  <View style={styles.cardLeft}>
                    <View style={[styles.dateBox, styles.dateBoxPast]}>
                      <Text style={[styles.dateNum, styles.dateNumPast]}>{formatDay(appt.date)}</Text>
                      <Text style={[styles.dateMon, styles.dateMonPast]}>{formatMonth(appt.date)}</Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={[styles.statusPill, appt.status === 'cancelled' ? styles.pillCancelled : styles.pillCompleted]}>
                      <Text style={[styles.statusPillText, appt.status === 'cancelled' ? styles.pillTextCancelled : styles.pillTextCompleted]}>
                        {appt.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                      </Text>
                    </View>
                    <Text style={styles.counselorName}>{appt.counselorName}</Text>
                    <Text style={styles.counselorSpec}>{appt.counselorSpecialization}</Text>
                    <View style={styles.metaRow}>
                      <ClockIcon color={MUTED} size={12} />
                      <Text style={styles.metaText}>{appt.time}</Text>
                    </View>
                  </View>
                </Pressable>
              ))
            )}

            {/* ── Book new ── */}
            <Pressable
              style={({ pressed }) => [styles.bookBtn, pressed && { opacity: 0.85 }]}
              onPress={() => navigation.getParent()?.navigate('Counselors')}
            >
              <PlusIcon />
              <Text style={styles.bookBtnText}>Book a New Appointment</Text>
            </Pressable>
          </>
        )}
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

  loadingWrap: { alignItems: 'center', paddingTop: 60 },
  loadingText: { marginTop: 12, color: MUTED, fontSize: 13 },

  sectionLabel:{ fontSize: 10, fontWeight: '800', color: MUTED, letterSpacing: 1.2, marginBottom: 12, marginTop: 8 },

  card: {
    backgroundColor: WHITE, borderRadius: 18, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#F0E2DC', marginBottom: 10,
    shadowColor: '#C6AEA1', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 1,
  },
  cardPast:    { opacity: 0.75 },
  cardLeft:    { marginRight: 14 },

  dateBox:     { width: 52, height: 60, borderRadius: 14, backgroundColor: '#FCE3DD', alignItems: 'center', justifyContent: 'center' },
  dateBoxPast: { backgroundColor: '#F0E8E4' },
  dateNum:     { fontSize: 20, fontWeight: '800', color: '#C85F4D', lineHeight: 24 },
  dateMon:     { fontSize: 9,  fontWeight: '800', color: '#C85F4D' },
  dateNumPast: { color: MUTED },
  dateMonPast: { color: MUTED },

  cardBody:    { flex: 1 },

  statusPill:      { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#E8F5EC', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 5 },
  statusDot:       { width: 5, height: 5, borderRadius: 3, backgroundColor: '#4E9B5C', marginRight: 5 },
  statusPillText:  { fontSize: 9.5, fontWeight: '700', color: '#4E9B5C' },
  pillCancelled:   { backgroundColor: '#FBE1DE' },
  pillCompleted:   { backgroundColor: '#E8F5EC' },
  pillTextCancelled: { color: '#C94C4C', fontSize: 9.5, fontWeight: '700' },
  pillTextCompleted: { color: '#4E9B5C', fontSize: 9.5, fontWeight: '700' },

  counselorName: { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 2 },
  counselorSpec: { fontSize: 11, color: MUTED, marginBottom: 6 },
  metaRow:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaDot:       { width: 3, height: 3, borderRadius: 2, backgroundColor: MUTED },
  metaText:      { fontSize: 11, color: MUTED },

  emptyCard:    { backgroundColor: WHITE, borderRadius: 18, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: '#F0E2DC', marginBottom: 10 },
  emptyIconWrap:{ marginBottom: 12 },
  emptyTitle:   { fontSize: 14, fontWeight: '700', color: DARK, marginBottom: 5 },
  emptyText:    { fontSize: 11.5, lineHeight: 17, color: MUTED, textAlign: 'center' },

  bookBtn:      { height: 52, backgroundColor: CORAL, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, shadowColor: CORAL, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 3 },
  bookBtnText:  { fontSize: 14, fontWeight: '700', color: WHITE },
});
