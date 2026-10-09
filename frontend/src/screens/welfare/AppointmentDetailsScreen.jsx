import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useWelfare } from '../../context/WelfareContext';
import { welfareService } from '../../services/welfareService';

// ── Status helpers ─────────────────────────────────────────────────────────────
const normalizeStatus = (raw = '') => {
  const s = raw.toLowerCase();
  if (s === 'upcoming' || s === 'scheduled') return 'Upcoming';
  if (s === 'completed' || s === 'done') return 'Completed';
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  if (s === 'in-session' || s === 'in session') return 'In Session';
  return raw;
};

const statusStyles = {
  Upcoming:     { bg: colors.statusRedBg,    text: colors.statusRedText },
  'In Session': { bg: colors.statusYellowBg, text: colors.statusYellowText },
  Completed:    { bg: colors.statusGreenBg,  text: colors.statusGreenText },
  Cancelled:    { bg: '#EAE1D7',             text: colors.textSecondary },
};

// ── Time slot options ──────────────────────────────────────────────────────────
const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM',
];

// ── Session type options ───────────────────────────────────────────────────────
const SESSION_TYPES = ['Online', 'In Person', 'Phone'];

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const {
    appointments,
    getAppointmentById,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    refreshAppointments
  } = useWelfare();

  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newSessionType, setNewSessionType] = useState('');
  const [saving, setSaving] = useState(false);

  // Load appointment (try backend first, fallback to context)
  useEffect(() => {
    const fetchApt = async () => {
      setLoading(true);
      try {
        const res = await welfareService.getAppointmentDetails(id);
        if (res?.appointment) {
          setApt(res.appointment);
        } else {
          setApt(getAppointmentById(id) || null);
        }
      } catch {
        setApt(getAppointmentById(id) || null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApt();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Details</Text>
        </View>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!apt) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Details</Text>
        </View>
        <View style={styles.emptyBox}>
          <Ionicons name="alert-circle-outline" size={42} color={colors.textMuted} />
          <Text style={styles.emptyText}>Appointment not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayStatus = normalizeStatus(apt.status);
  const st = statusStyles[displayStatus] || statusStyles.Upcoming;
  const aptId = apt._id || apt.id;

  // ── Mark Completed ────────────────────────────────────────────────────────
  const handleMarkCompleted = () => {
    Alert.alert(
      'Mark as Completed',
      'Mark this appointment as completed? Both the student and counselor will be notified.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Complete',
          onPress: async () => {
            setSaving(true);
            await updateAppointment(aptId, { status: 'completed' });
            setApt((prev) => ({ ...prev, status: 'completed' }));
            setSaving(false);
            Alert.alert('✅ Done', 'Appointment marked as completed. Notifications sent.');
          },
        },
      ]
    );
  };

  // ── Officer Notes ─────────────────────────────────────────────────────────
  const handleOpenNote = () => {
    setNoteText(apt.notes || '');
    setNoteModalVisible(true);
  };

  const handleSaveNote = async () => {
    setSaving(true);
    await updateAppointment(aptId, { officerNotes: noteText });
    setApt((prev) => ({ ...prev, notes: (prev.notes ? prev.notes + '\n[Officer] ' : '[Officer] ') + noteText }));
    setSaving(false);
    setNoteModalVisible(false);
    Alert.alert('Saved', 'Officer note added successfully.');
  };

  // ── Reschedule ────────────────────────────────────────────────────────────
  const handleOpenReschedule = () => {
    setNewDate(apt.date || '');
    setNewTime(apt.time || '');
    setNewSessionType(apt.sessionType || 'Online');
    setRescheduleModalVisible(true);
  };

  const handleSaveReschedule = async () => {
    if (!newDate.trim() || !newTime.trim()) {
      Alert.alert('Validation', 'Please fill in both date and time.');
      return;
    }
    setSaving(true);
    const changes = { date: newDate.trim(), time: newTime.trim(), sessionType: newSessionType };
    await updateAppointment(aptId, changes);
    setApt((prev) => ({ ...prev, ...changes }));
    setSaving(false);
    setRescheduleModalVisible(false);
    Alert.alert(
      '📅 Rescheduled',
      `Appointment moved to ${newDate} at ${newTime}.\nStudent and counselor have been notified.`
    );
  };

  // ── Cancel ────────────────────────────────────────────────────────────────
  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Cancel this appointment? Both the student and counselor will be notified immediately.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            await cancelAppointment(aptId);
            setApt((prev) => ({ ...prev, status: 'cancelled' }));
            setSaving(false);
            Alert.alert('Cancelled', 'The appointment has been cancelled and notifications have been sent.');
          },
        },
      ]
    );
  };

  // ── Hard Delete ───────────────────────────────────────────────────────────
  const handleDelete = () => {
    Alert.alert(
      'Delete Appointment',
      'This will permanently remove the appointment record. Student and counselor will be notified. Continue?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            await deleteAppointment(aptId);
            setSaving(false);
            Alert.alert('Deleted', 'Appointment removed. Notifications sent.');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
        {saving && <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: spacing.sm }} />}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Status banner ───────────────────────────────────────────────── */}
        <View style={[styles.bannerCard, { borderLeftColor: st.text }]}>
          <View style={styles.bannerRow}>
            <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
              <Text style={[styles.statusBadgeText, { color: st.text }]}>{displayStatus}</Text>
            </View>
            <View style={styles.welfareLog}>
              <Ionicons name="shield-checkmark-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.welfareLogText}>Welfare Officer Record</Text>
            </View>
          </View>
          <Text style={styles.bannerDate}>{apt.date}</Text>
          <Text style={styles.bannerTime}>{apt.time} • {apt.sessionType || 'Online'}</Text>
        </View>

        {/* ── Student details ─────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>Student</Text>
          </View>
          <InfoRow label="Name" value={apt.studentName || '—'} />
          {apt.studentRegNo ? <InfoRow label="Reg. No." value={apt.studentRegNo} /> : null}
          {apt.studentEmail ? <InfoRow label="Email" value={apt.studentEmail} /> : null}
          {apt.studentPhone ? <InfoRow label="Phone" value={apt.studentPhone} /> : null}
          {apt.studentFaculty ? <InfoRow label="Faculty" value={apt.studentFaculty} /> : null}
          {apt.studentDegree ? <InfoRow label="Programme" value={apt.studentDegree} /> : null}
          {apt.studentYear ? <InfoRow label="Year" value={apt.studentYear} last /> : null}
        </View>

        {/* ── Counselor details ───────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>Counselor</Text>
          </View>
          <InfoRow label="Name" value={apt.counselorName || '—'} />
          {apt.counselorSpecialization ? <InfoRow label="Specialization" value={apt.counselorSpecialization} /> : null}
          {apt.counselorEmail ? <InfoRow label="Email" value={apt.counselorEmail} /> : null}
          {apt.counselorPhone ? <InfoRow label="Phone" value={apt.counselorPhone} /> : null}
          {apt.counselorOffice ? <InfoRow label="Office" value={apt.counselorOffice} last /> : null}
        </View>

        {/* ── Officer notes ───────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={16} color={colors.primary} />
              <Text style={styles.sectionTitle}>Officer Notes</Text>
            </View>
            <TouchableOpacity onPress={handleOpenNote} style={styles.editChip}>
              <Ionicons name="pencil-outline" size={13} color={colors.primary} />
              <Text style={styles.editChipText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.notesText}>
            {apt.notes || 'No notes yet. Tap Edit to add observations or follow-up notes.'}
          </Text>
        </View>

        {/* ── Notification hint ───────────────────────────────────────────── */}
        <View style={styles.notifHint}>
          <Ionicons name="notifications-outline" size={14} color={colors.primary} />
          <Text style={styles.notifHintText}>
            Any changes will automatically notify the student and counselor.
          </Text>
        </View>

        {/* ── Actions for Upcoming ────────────────────────────────────────── */}
        {displayStatus === 'Upcoming' && (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleMarkCompleted}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.textWhite} />
              <Text style={styles.primaryButtonText}>Mark as Completed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              onPress={handleOpenReschedule}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={17} color={colors.primary} />
              <Text style={styles.outlineButtonText}>Reschedule Appointment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerOutlineButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle-outline" size={17} color={colors.error} />
              <Text style={styles.dangerOutlineButtonText}>Cancel Appointment</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Delete for non-upcoming ─────────────────────────────────────── */}
        {displayStatus !== 'Upcoming' && (
          <TouchableOpacity
            style={styles.dangerOutlineButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={17} color={colors.error} />
            <Text style={styles.dangerOutlineButtonText}>Delete Record</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* ── Officer Note Modal ─────────────────────────────────────────────── */}
      <Modal visible={noteModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Officer Note</Text>
              <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>
              This note will be appended to the appointment record.
            </Text>
            <TextInput
              style={styles.modalInput}
              multiline
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Add your observations or follow-up notes…"
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, saving && { opacity: 0.6 }]}
                onPress={handleSaveNote}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.textWhite} />
                ) : (
                  <Text style={styles.modalSaveText}>Save Note</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Reschedule Modal ───────────────────────────────────────────────── */}
      <Modal visible={rescheduleModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reschedule Appointment</Text>
              <TouchableOpacity onPress={() => setRescheduleModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>
              Student and counselor will be notified of the new schedule.
            </Text>

            {/* Date input */}
            <Text style={styles.modalFieldLabel}>New Date</Text>
            <TextInput
              style={styles.modalFieldInput}
              value={newDate}
              onChangeText={setNewDate}
              placeholder="e.g. 2024-11-15 or Nov 15, 2024"
              placeholderTextColor={colors.textMuted}
            />

            {/* Time slots */}
            <Text style={styles.modalFieldLabel}>Select Time</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.timeSlotScroll}
            >
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={[styles.timeChip, newTime === slot && styles.timeChipActive]}
                  onPress={() => setNewTime(slot)}
                >
                  <Text style={[styles.timeChipText, newTime === slot && styles.timeChipTextActive]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Session type */}
            <Text style={styles.modalFieldLabel}>Session Type</Text>
            <View style={styles.typeRow}>
              {SESSION_TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeChip, newSessionType === t && styles.typeChipActive]}
                  onPress={() => setNewSessionType(t)}
                >
                  <Text style={[styles.typeChipText, newSessionType === t && styles.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setRescheduleModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, saving && { opacity: 0.6 }]}
                onPress={handleSaveReschedule}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={colors.textWhite} />
                ) : (
                  <Text style={styles.modalSaveText}>Confirm Reschedule</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ── Info Row Component ─────────────────────────────────────────────────────────
const InfoRow = ({ label, value, last }) => (
  <View style={[styles.infoRow, last && styles.infoRowLast]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: {
    flex: 1,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyBox: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { fontSize: typography.fontSize.md, color: colors.textMuted, marginTop: spacing.md },

  scrollContent: { padding: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xxl },

  // ── Banner ──────────────────────────────────────────────────────────────────
  bannerCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold },
  welfareLog: { flexDirection: 'row', alignItems: 'center' },
  welfareLogText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  bannerDate: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  bannerTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ── Section cards ────────────────────────────────────────────────────────────
  sectionCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginLeft: 6,
  },

  // Info row
  infoRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 0.4,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },

  // Edit chip
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  editChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    marginLeft: 3,
  },

  // Notes
  notesText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // Notification hint
  notifHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notifHintText: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
    flex: 1,
    marginLeft: 6,
    lineHeight: 16,
  },

  // ── Action buttons ───────────────────────────────────────────────────────────
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    color: colors.textWhite,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.sm,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  outlineButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  dangerOutlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.error,
    borderRadius: 14,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  dangerOutlineButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    marginLeft: spacing.sm,
  },

  // ── Modal ────────────────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.backgroundLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  modalSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  modalInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    textAlignVertical: 'top',
    backgroundColor: colors.creamBackground,
  },
  modalFieldLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  modalFieldInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    backgroundColor: colors.creamBackground,
  },
  timeSlotScroll: { marginVertical: spacing.xs },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    backgroundColor: colors.backgroundLight,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  timeChipTextActive: { color: colors.textWhite, fontWeight: typography.fontWeight.bold },
  typeRow: { flexDirection: 'row', marginTop: 4 },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    backgroundColor: colors.backgroundLight,
  },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  typeChipTextActive: { color: colors.textWhite, fontWeight: typography.fontWeight.bold },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
  },
  modalCancel: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
  },
  modalCancelText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  modalSave: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    minWidth: 130,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: typography.fontSize.md,
    color: colors.textWhite,
    fontWeight: typography.fontWeight.bold,
  },
});

export default AppointmentDetailsScreen;