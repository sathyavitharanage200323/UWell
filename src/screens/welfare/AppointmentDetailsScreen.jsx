import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useWelfare } from '../../context/WelfareContext';
import { appointmentDetailsMap } from '../../data/welfareMockData';

const statusStyles = {
  Upcoming: { bg: '#FBE1DE', text: '#C0392B' },
  Completed: { bg: '#DDF3E4', text: '#397052' },
  Cancelled: { bg: '#EAE1D7', text: '#756A67' }
};

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params || {};
  const { getAppointmentById, updateAppointment, cancelAppointment, deleteAppointment } =
    useWelfare();

  const apt = getAppointmentById(id);
  const details = appointmentDetailsMap[id] || {};

  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteText, setNoteText] = useState(apt?.officerNotes || '');

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
          <Text style={styles.emptyText}>Appointment not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const st = statusStyles[apt.status] || statusStyles.Upcoming;
  const officerNotes = apt.officerNotes || details.notes || '';

  // ---------- UPDATE: mark completed ----------
  const handleMarkCompleted = () => {
    updateAppointment(apt.id, { status: 'Completed' });
    Alert.alert('Updated', 'Appointment marked as Completed.');
  };

  // ---------- UPDATE: save officer note ----------
  const handleOpenNote = () => {
    setNoteText(officerNotes);
    setNoteModalVisible(true);
  };

  const handleSaveNote = () => {
    updateAppointment(apt.id, { officerNotes: noteText });
    setNoteModalVisible(false);
    Alert.alert('Saved', 'Officer note updated.');
  };

  // ---------- UPDATE: reschedule ----------
  const handleReschedule = () => {
    Alert.alert('Reschedule Appointment', 'Choose a new time slot', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: '11:00 AM',
        onPress: () => {
          updateAppointment(apt.id, { time: '11:00 AM' });
          Alert.alert('Updated', 'Time changed to 11:00 AM.');
        }
      },
      {
        text: '02:00 PM',
        onPress: () => {
          updateAppointment(apt.id, { time: '02:00 PM' });
          Alert.alert('Updated', 'Time changed to 02:00 PM.');
        }
      },
      {
        text: '04:00 PM',
        onPress: () => {
          updateAppointment(apt.id, { time: '04:00 PM' });
          Alert.alert('Updated', 'Time changed to 04:00 PM.');
        }
      }
    ]);
  };

  // ---------- DELETE (soft): cancel ----------
  const handleCancel = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelAppointment(apt.id);
            Alert.alert('Cancelled', 'The appointment has been cancelled.');
          }
        }
      ]
    );
  };

  // ---------- DELETE (hard): remove ----------
  const handleDelete = () => {
    Alert.alert(
      'Delete Appointment',
      'This will permanently remove the appointment. Continue?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteAppointment(apt.id);
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top info card */}
        <View style={styles.topCard}>
          <View style={styles.topRow}>
            <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
              <Text style={[styles.statusBadgeText, { color: st.text }]}>{apt.status}</Text>
            </View>
            <View style={styles.welfareLog}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.welfareLogText}>Welfare Log</Text>
            </View>
          </View>
          <Text style={styles.dateText}>
            {apt.date} • {apt.time}
          </Text>
        </View>

        {/* Details card */}
        <View style={styles.card}>
          <InfoRow label="STUDENT REF" value={apt.studentName} />
          <InfoRow label="COUNSELOR" value={apt.counselorName} />
          <InfoRow label="SERVICE TYPE" value={details.serviceType || apt.service} />
          <InfoRow label="DURATION" value={details.duration || '45 minutes'} />
          <InfoRow
            label="LOCATION"
            value={details.location || 'Room 204, Student Services Building'}
            last
          />
        </View>

        {/* Officer notes card (UPDATE) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Officer Session Notes</Text>
            <TouchableOpacity onPress={handleOpenNote}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bodyText}>
            {officerNotes || 'No notes yet. Tap Edit to add notes.'}
          </Text>
        </View>

        {/* Actions */}
        {apt.status === 'Upcoming' && (
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
              onPress={handleReschedule}
              activeOpacity={0.7}
            >
              <Text style={styles.outlineButtonText}>Reschedule Appointment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerOutlineButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.dangerOutlineButtonText}>Cancel Appointment</Text>
            </TouchableOpacity>
          </>
        )}

        {apt.status !== 'Upcoming' && (
          <TouchableOpacity
            style={styles.dangerOutlineButton}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Text style={styles.dangerOutlineButtonText}>Delete Appointment</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Officer Note modal (UPDATE) */}
      <Modal visible={noteModalVisible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Officer Notes</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Add your observations or follow-up notes..."
              placeholderTextColor={colors.textMuted}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSave} onPress={handleSaveNote}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

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
    paddingVertical: spacing.md
  },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },

  scrollContent: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },

  emptyBox: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { fontSize: typography.fontSize.md, color: colors.textMuted },

  topCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold
  },
  welfareLog: { flexDirection: 'row', alignItems: 'center' },
  welfareLogText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginLeft: 4
  },
  dateText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: 4
  },

  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  editLink: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary
  },
  bodyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20
  },

  infoRow: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  infoRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4
  },
  infoValue: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium
  },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md
  },
  primaryButtonText: {
    color: colors.textWhite,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.sm
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundLight
  },
  outlineButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary
  },
  dangerOutlineButton: {
    borderWidth: 1.5,
    borderColor: '#C0392B',
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundLight
  },
  dangerOutlineButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#C0392B'
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.backgroundLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingBottom: spacing.xxl
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  modalInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
    textAlignVertical: 'top',
    backgroundColor: colors.creamBackground
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg
  },
  modalCancel: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginRight: spacing.sm
  },
  modalCancelText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium
  },
  modalSave: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12
  },
  modalSaveText: {
    fontSize: typography.fontSize.md,
    color: colors.textWhite,
    fontWeight: typography.fontWeight.bold
  }
});

export default AppointmentDetailsScreen;