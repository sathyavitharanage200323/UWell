import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme';
import NavigationHeader from '../../components/navigation/Header';
import { managementService } from '../../services/managementService';
import ConfirmModal from '../../components/management/ConfirmModal';
import useSessionGuard from '../../components/management/useSessionGuard';
import {
  ResponsiveScroll,
  SectionCard,
  StatusPill,
  Chip,
  Banner,
  LoadingState,
  EmptyState,
  ErrorState,
  InfoRow,
  ActionButton,
  useLayout,
  PAGE_BACKGROUND,
} from '../../components/management/ManagementUI';

const PAGE_SIZE = 20;

const FILTERS = [
  { key: 'all', label: 'All', countKey: 'total' },
  { key: 'upcoming', label: 'Upcoming', countKey: 'upcoming' },
  { key: 'in session', label: 'In session', countKey: 'in session' },
  { key: 'completed', label: 'Completed', countKey: 'completed' },
  { key: 'cancelled', label: 'Cancelled', countKey: 'cancelled' },
];

const STATUS_LABEL = { upcoming: 'Upcoming', 'in session': 'In session', completed: 'Completed', cancelled: 'Cancelled' };
const STATUS_TONE = { upcoming: 'warning', 'in session': 'info', completed: 'success', cancelled: 'danger' };

const initialOf = (name = '') => (name.trim()[0] || 'S').toUpperCase();

const AppointmentsScreen = () => {
  const handleError = useSessionGuard();
  const { isWide } = useLayout();

  const [appointments, setAppointments] = useState([]);
  const [summary, setSummary] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(null);

  const [selected, setSelected] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      const res = await managementService.getAppointments({ status: statusFilter, search: search.trim() });
      setAppointments(res.appointments || []);
      setSummary(res.summary || {});
    } catch (err) {
      setError(handleError(err, 'Could not load appointments.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, search, handleError]);

  useEffect(() => {
    // Wait briefly while typing so each keystroke does not hit the server
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [statusFilter, search]);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 4500);
  };

  const openDetails = (appointment) => {
    setSelected(appointment);
    setNotesDraft(appointment.notes || '');
  };

  const closeDetails = () => { setSelected(null); setConfirmCancel(false); };

  const applyChange = async (changes, successMessage) => {
    setSaving(true);
    try {
      const res = await managementService.updateAppointment(selected.id, changes);
      setSelected(res.appointment);
      setNotesDraft(res.appointment.notes || '');
      showBanner('success', successMessage);
      await load();
    } catch (err) {
      showBanner('error', handleError(err, 'The appointment could not be updated.'));
    } finally {
      setSaving(false);
      setConfirmCancel(false);
    }
  };

  const shown = appointments.slice(0, visibleCount);
  const notesChanged = selected && notesDraft.trim() !== (selected.notes || '').trim();

  return (
    <View style={styles.container}>
      <NavigationHeader title="Appointments" />

      <ResponsiveScroll refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }}>
        {banner ? <Banner type={banner.type} message={banner.message} /> : null}

        <View style={styles.searchBox}>
          <Feather name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search student, counselor or service"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            returnKeyType="search"
            accessibilityLabel="Search appointments"
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')} accessibilityLabel="Clear search" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Feather name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              label={`${f.label} (${summary[f.countKey] ?? 0})`}
              active={statusFilter === f.key}
              onPress={() => setStatusFilter(f.key)}
            />
          ))}
        </View>

        {loading ? (
          <LoadingState text="Loading appointments..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); load(); }} />
        ) : appointments.length === 0 ? (
          <EmptyState icon="calendar" title="No appointments found" text="Try a different search or filter." />
        ) : (
          <>
            <Text style={styles.resultCount}>
              Showing {shown.length} of {appointments.length} appointments
            </Text>
            <View style={isWide ? styles.twoColumn : null}>
              {shown.map((a) => (
                <TouchableOpacity
                  key={a.id}
                  style={isWide ? styles.twoColumnItem : null}
                  onPress={() => openDetails(a)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={`Appointment for ${a.studentName}, ${STATUS_LABEL[a.status]}`}
                >
                  <SectionCard style={a.status === 'cancelled' ? styles.cancelledCard : null}>
                    <View style={styles.cardTop}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initialOf(a.studentName)}</Text>
                      </View>
                      <View style={styles.cardTitleBox}>
                        <Text style={styles.studentName} numberOfLines={1}>{a.studentName}</Text>
                        <Text style={styles.counselorName} numberOfLines={1}>with {a.counselorName}</Text>
                      </View>
                      <StatusPill label={STATUS_LABEL[a.status]} tone={STATUS_TONE[a.status]} />
                    </View>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Feather name="calendar" size={13} color={colors.textMuted} />
                        <Text style={styles.metaText}>{a.date}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Feather name="clock" size={13} color={colors.textMuted} />
                        <Text style={styles.metaText}>{a.time}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Feather name="tag" size={13} color={colors.textMuted} />
                        <Text style={styles.metaText} numberOfLines={1}>{a.specialization}</Text>
                      </View>
                    </View>
                  </SectionCard>
                </TouchableOpacity>
              ))}
            </View>
            {shown.length < appointments.length ? (
              <ActionButton
                title={`Show ${Math.min(PAGE_SIZE, appointments.length - shown.length)} more`}
                variant="secondary"
                onPress={() => setVisibleCount((c) => c + PAGE_SIZE)}
              />
            ) : null}
          </>
        )}
      </ResponsiveScroll>

      {/* ── Appointment details ───────────────────────────────────────── */}
      <Modal visible={!!selected && !confirmCancel} transparent animationType="slide" onRequestClose={closeDetails}>
        <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <TouchableWithoutFeedback onPress={closeDetails}>
            <View style={styles.overlay}>
              <TouchableWithoutFeedback>
                <View style={styles.sheet}>
                  {selected ? (
                    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                      <View style={styles.sheetHeader}>
                        <View style={styles.cardTitleBox}>
                          <Text style={styles.sheetTitle}>{selected.studentName}</Text>
                          <StatusPill label={STATUS_LABEL[selected.status]} tone={STATUS_TONE[selected.status]} />
                        </View>
                        <TouchableOpacity onPress={closeDetails} accessibilityLabel="Close details" style={styles.closeBtn}>
                          <Feather name="x" size={20} color={colors.darkText} />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.detailBox}>
                        <InfoRow label="Counselor" value={selected.counselorName} />
                        <InfoRow label="Service" value={selected.specialization} />
                        <InfoRow label="Date" value={selected.date} />
                        <InfoRow label="Time" value={selected.time} />
                        <InfoRow label="Session type" value={selected.sessionType} />
                      </View>

                      <Text style={styles.fieldLabel}>Management notes</Text>
                      <TextInput
                        style={styles.notesInput}
                        value={notesDraft}
                        onChangeText={setNotesDraft}
                        placeholder="Add a note about this appointment"
                        placeholderTextColor={colors.textMuted}
                        multiline
                        maxLength={500}
                      />
                      <Text style={styles.counter}>{notesDraft.length}/500</Text>
                      <ActionButton
                        title="Save notes"
                        icon="save"
                        variant="secondary"
                        disabled={!notesChanged}
                        loading={saving}
                        onPress={() => applyChange({ notes: notesDraft.trim() }, 'Notes saved.')}
                      />

                      <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Change status</Text>
                      <View style={styles.statusActions}>
                        {selected.status !== 'completed' && (
                          <ActionButton
                            title="Mark completed"
                            icon="check"
                            disabled={saving}
                            onPress={() => applyChange({ status: 'completed' }, 'Marked as completed. The student was notified.')}
                            style={styles.statusBtn}
                          />
                        )}
                        {selected.status !== 'cancelled' && (
                          <ActionButton
                            title="Cancel appointment"
                            icon="x-circle"
                            variant="danger"
                            disabled={saving}
                            onPress={() => setConfirmCancel(true)}
                            style={styles.statusBtn}
                          />
                        )}
                        {selected.status !== 'upcoming' && (
                          <ActionButton
                            title="Reopen as upcoming"
                            icon="rotate-ccw"
                            variant="secondary"
                            disabled={saving}
                            onPress={() => applyChange({ status: 'upcoming' }, 'Set back to upcoming. The student was notified.')}
                            style={styles.statusBtn}
                          />
                        )}
                      </View>
                      <Text style={styles.hint}>Status changes send a notification to the student.</Text>
                    </ScrollView>
                  ) : null}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      <ConfirmModal
        visible={confirmCancel}
        title="Cancel this appointment?"
        message={selected ? `${selected.studentName} with ${selected.counselorName} on ${selected.date}. The student will be notified.` : ''}
        confirmLabel="Cancel appointment"
        cancelLabel="Keep"
        destructive
        loading={saving}
        onConfirm={() => applyChange({ status: 'cancelled' }, 'Appointment cancelled. The student was notified.')}
        onCancel={() => setConfirmCancel(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BACKGROUND },
  fill: { flex: 1 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 46,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.darkText, marginLeft: 8, paddingVertical: 10 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 4 },
  resultCount: { fontSize: 12, color: colors.textMuted, marginBottom: 10 },
  twoColumn: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  twoColumnItem: { width: '49%' },
  cancelledCard: { opacity: 0.65 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: { fontSize: 15, fontWeight: '700', color: colors.primaryDark },
  cardTitleBox: { flex: 1, paddingRight: 8 },
  studentName: { fontSize: 15, fontWeight: '700', color: colors.darkText },
  counselorName: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14, marginBottom: 4, maxWidth: '100%' },
  metaText: { fontSize: 12, color: colors.textSecondary, marginLeft: 5, flexShrink: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(61,44,46,0.45)', justifyContent: 'flex-end', alignItems: 'center' },
  sheet: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '90%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 28,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  sheetTitle: { fontSize: 20, fontWeight: '700', color: colors.darkText, marginBottom: 6 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3EEE8', alignItems: 'center', justifyContent: 'center' },
  detailBox: { backgroundColor: '#FBF8F4', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  notesInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 84,
    textAlignVertical: 'top',
    fontSize: 14,
    color: colors.darkText,
    backgroundColor: '#FBF8F4',
  },
  counter: { fontSize: 11, color: colors.textMuted, textAlign: 'right', marginVertical: 4 },
  statusActions: { flexDirection: 'row', flexWrap: 'wrap' },
  statusBtn: { flexGrow: 1, flexBasis: 150, marginRight: 8, marginBottom: 8 },
  hint: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
});

export default AppointmentsScreen;
