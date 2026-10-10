import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../../theme';
import NavigationHeader from '../../components/navigation/Header';
import { managementService } from '../../services/managementService';
import ConfirmModal from '../../components/management/ConfirmModal';
import useSessionGuard from '../../components/management/useSessionGuard';
import {
  ResponsiveScroll,
  SectionCard,
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

const NOTE_MAX = 300;

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');

const UsageDetailsScreen = ({ navigation }) => {
  const handleError = useSessionGuard();
  const { isWide } = useLayout();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(null);

  const [noteDepartment, setNoteDepartment] = useState('');
  const [noteText, setNoteText] = useState('');
  const [adding, setAdding] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 4500);
  };

  const load = useCallback(async () => {
    try {
      setError('');
      const res = await managementService.getUsageDetails();
      setData(res);
      setNoteDepartment((current) => current || res.departments[0]?.department || '');
    } catch (err) {
      setError(handleError(err, 'Could not load usage details.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [handleError]);

  useEffect(() => { load(); }, [load]);

  const handleAddNote = async () => {
    if (!noteDepartment) {
      showBanner('error', 'Choose a service for the note first.');
      return;
    }
    if (!noteText.trim()) {
      showBanner('error', 'Write the note text before adding it.');
      return;
    }
    setAdding(true);
    try {
      await managementService.addServiceNote(noteDepartment, noteText.trim());
      setNoteText('');
      showBanner('success', 'Note added.');
      await load();
    } catch (err) {
      showBanner('error', handleError(err, 'Could not add the note.'));
    } finally {
      setAdding(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await managementService.deleteServiceNote(toDelete.id);
      setToDelete(null);
      showBanner('success', 'Note deleted.');
      await load();
    } catch (err) {
      setToDelete(null);
      showBanner('error', handleError(err, 'Could not delete the note.'));
    } finally {
      setDeleting(false);
    }
  };

  const tileWidth = isWide ? '32%' : '48.5%';

  return (
    <View style={styles.container}>
      <NavigationHeader title="Usage Details" onBack={() => navigation.goBack()} />

      <ResponsiveScroll refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }}>
        {banner ? <Banner type={banner.type} message={banner.message} /> : null}

        {loading ? (
          <LoadingState text="Loading usage details..." />
        ) : error || !data ? (
          <ErrorState message={error || 'No data available.'} onRetry={() => { setLoading(true); load(); }} />
        ) : (
          <>
            <View style={styles.tileGrid}>
              {[
                { label: 'Total users', value: data.overview.totalUsers },
                { label: 'Active students', value: data.overview.activeStudents },
                { label: 'New students this month', value: data.overview.newStudentsThisMonth },
                { label: 'Total appointments', value: data.overview.totalAppointments },
                { label: 'Appointments per student', value: data.overview.avgAppointmentsPerStudent },
              ].map((t) => (
                <View key={t.label} style={[styles.tile, { width: tileWidth }]}>
                  <Text style={styles.tileNumber}>{t.value}</Text>
                  <Text style={styles.tileLabel}>{t.label}</Text>
                </View>
              ))}
            </View>

            <SectionCard title="Key insights" icon="zap" iconTone="warning">
              <InfoRow label="Most active service" value={data.insights.mostActiveDepartment} bold />
              <InfoRow label="Most booked time" value={data.insights.peakTime} bold />
            </SectionCard>

            <SectionCard title="Service usage" icon="pie-chart" iconTone="info">
              {data.departments.length === 0 ? (
                <Text style={styles.emptyText}>No appointments recorded yet.</Text>
              ) : (
                data.departments.map((dept) => (
                  <View key={dept.department} style={styles.deptRow}>
                    <View style={styles.deptHeader}>
                      <Text style={styles.deptName}>{dept.department}</Text>
                      <Text style={styles.deptPercent}>{dept.percentage}%</Text>
                    </View>
                    <View style={styles.track}>
                      <View style={[styles.fill, { width: `${Math.max(3, dept.percentage)}%` }]} />
                    </View>
                    <Text style={styles.deptMeta}>
                      {dept.sessions} sessions - {dept.completed} completed - {dept.cancelled} cancelled
                    </Text>
                  </View>
                ))
              )}
            </SectionCard>

            <SectionCard title="Service notes" icon="edit-3" iconTone="success">
              <Text style={styles.fieldLabel}>Service</Text>
              <View style={styles.chipRow}>
                {data.departments.map((dept) => (
                  <Chip
                    key={dept.department}
                    label={dept.department}
                    active={noteDepartment === dept.department}
                    onPress={() => setNoteDepartment(dept.department)}
                  />
                ))}
              </View>

              <TextInput
                style={styles.noteInput}
                placeholder="Add a note, e.g. demand spike during exam week"
                placeholderTextColor={colors.textMuted}
                value={noteText}
                onChangeText={setNoteText}
                maxLength={NOTE_MAX}
                multiline
                accessibilityLabel="Note text"
              />
              <Text style={styles.counter}>{noteText.length}/{NOTE_MAX}</Text>
              <ActionButton
                title="Add note"
                icon="plus"
                loading={adding}
                disabled={!data.departments.length}
                onPress={handleAddNote}
              />

              {data.notes.length === 0 ? (
                <Text style={[styles.emptyText, { marginTop: 14 }]}>No notes yet.</Text>
              ) : (
                data.notes.map((note) => (
                  <View key={note.id} style={styles.noteRow}>
                    <View style={styles.noteBody}>
                      <Text style={styles.noteDept}>{note.department}</Text>
                      <Text style={styles.noteText}>{note.text}</Text>
                      <Text style={styles.noteMeta}>
                        {note.authorName ? `${note.authorName} - ` : ''}{formatDate(note.createdAt)}
                      </Text>
                    </View>
                    {note.mine ? (
                      <TouchableOpacity
                        onPress={() => setToDelete(note)}
                        style={styles.deleteBtn}
                        accessibilityRole="button"
                        accessibilityLabel="Delete note"
                      >
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ))
              )}
            </SectionCard>
          </>
        )}
      </ResponsiveScroll>

      <ConfirmModal
        visible={!!toDelete}
        title="Delete this note?"
        message={toDelete ? toDelete.text : ''}
        confirmLabel="Delete"
        cancelLabel="Keep"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BACKGROUND },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 4 },
  tile: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileNumber: { fontSize: 26, fontWeight: '800', color: colors.primaryDark },
  tileLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  emptyText: { fontSize: 13, color: colors.textSecondary },
  deptRow: { marginBottom: 14 },
  deptHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  deptName: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.darkText, paddingRight: 8 },
  deptPercent: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },
  track: { height: 8, backgroundColor: '#EFE9E2', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  deptMeta: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  noteInput: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: colors.darkText,
    backgroundColor: '#FBF8F4',
  },
  counter: { fontSize: 11, color: colors.textMuted, textAlign: 'right', marginVertical: 4 },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 14,
    paddingTop: 12,
  },
  noteBody: { flex: 1, paddingRight: 10 },
  noteDept: { fontSize: 11, fontWeight: '700', color: colors.primaryDark, textTransform: 'uppercase' },
  noteText: { fontSize: 14, color: colors.darkText, marginVertical: 4, lineHeight: 20 },
  noteMeta: { fontSize: 11, color: colors.textMuted },
  deleteBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: colors.statusRedBg },
  deleteText: { fontSize: 12, fontWeight: '700', color: colors.statusRedText },
});

export default UsageDetailsScreen;
