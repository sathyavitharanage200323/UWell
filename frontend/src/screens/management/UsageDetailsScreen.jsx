import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import NavigationHeader from '../../components/navigation/Header';
import { managementService } from '../../services/managementService';

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');

const UsageDetailsScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [noteDepartment, setNoteDepartment] = useState('');
  const [noteText, setNoteText] = useState('');
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      const res = await managementService.getUsageDetails();
      setData(res);
      setNoteDepartment((current) => current || res.departments[0]?.department || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load usage details. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAddNote = async () => {
    if (!noteDepartment || !noteText.trim()) {
      Alert.alert('Missing details', 'Choose a department and write a note first.');
      return;
    }
    setAdding(true);
    try {
      await managementService.addServiceNote(noteDepartment, noteText.trim());
      setNoteText('');
      await load();
    } catch (err) {
      Alert.alert('Could not add note', err.response?.data?.message || 'Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteNote = (note) => {
    Alert.alert('Delete note?', note.text, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await managementService.deleteServiceNote(note.id);
            await load();
          } catch (err) {
            Alert.alert('Could not delete note', err.response?.data?.message || 'Please try again.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Usage Details" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Usage Details" onBack={() => navigation.goBack()} />
        <View style={styles.content}>
          <Card>
            <Text style={styles.errorText}>{error || 'No data available.'}</Text>
            <TouchableOpacity onPress={() => { setLoading(true); load(); }}>
              <Text style={styles.retry}>Try again</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </View>
    );
  }

  const { overview, insights, departments, notes } = data;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
      }
    >
      <NavigationHeader title="Usage Details" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <StatRow label="Total Users" value={overview.totalUsers} />
          <StatRow label="Active Students" value={overview.activeStudents} />
          <StatRow label="New Students This Month" value={overview.newStudentsThisMonth} />
          <StatRow label="Total Appointments" value={overview.totalAppointments} />
          <StatRow label="Avg Appointments / Student" value={overview.avgAppointmentsPerStudent} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <StatRow label="Most Active Service" value={insights.mostActiveDepartment} />
          <StatRow label="Most Booked Time" value={insights.peakTime} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Service Usage</Text>
          {departments.length === 0 && <Text style={styles.emptyText}>No appointments recorded yet.</Text>}
          {departments.map((dept) => (
            <View key={dept.department} style={styles.departmentRow}>
              <View style={styles.departmentInfo}>
                <Text style={styles.departmentName}>{dept.department}</Text>
                <Text style={styles.departmentSessions}>
                  {dept.sessions} sessions - {dept.completed} completed - {dept.cancelled} cancelled
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${dept.percentage}%` }]} />
              </View>
              <Text style={styles.percentage}>{dept.percentage}%</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Service Notes</Text>

          <Text style={styles.fieldLabel}>Service</Text>
          <View style={styles.chipRow}>
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept.department}
                style={[styles.chip, noteDepartment === dept.department && styles.chipActive]}
                onPress={() => setNoteDepartment(dept.department)}
              >
                <Text style={[styles.chipText, noteDepartment === dept.department && styles.chipTextActive]}>
                  {dept.department}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.noteInput}
            placeholder="Add a note, e.g. demand spike during exam week"
            placeholderTextColor={colors.textMuted}
            value={noteText}
            onChangeText={setNoteText}
            maxLength={300}
            multiline
          />
          <Button title="Add Note" onPress={handleAddNote} loading={adding} disabled={!departments.length} />

          {notes.length === 0 ? (
            <Text style={[styles.emptyText, styles.notesEmpty]}>No notes yet.</Text>
          ) : (
            notes.map((note) => (
              <View key={note.id} style={styles.noteRow}>
                <View style={styles.noteBody}>
                  <Text style={styles.noteDepartment}>{note.department}</Text>
                  <Text style={styles.noteText}>{note.text}</Text>
                  <Text style={styles.noteMeta}>
                    {note.authorName ? `${note.authorName} - ` : ''}{formatDate(note.createdAt)}
                  </Text>
                </View>
                {note.mine && (
                  <TouchableOpacity onPress={() => handleDeleteNote(note)}>
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </Card>
      </View>
    </ScrollView>
  );
};

const StatRow = ({ label, value }) => (
  <View style={styles.statRow}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    padding: spacing.lg,
  },
  loader: {
    marginTop: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
  },
  retry: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.sm,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: typography.fontSize.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    flex: 1,
  },
  statValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  departmentRow: {
    marginBottom: spacing.md,
  },
  departmentInfo: {
    marginBottom: spacing.xs,
  },
  departmentName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  departmentSessions: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  percentage: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  fieldLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  chipTextActive: {
    color: colors.textWhite,
    fontWeight: typography.fontWeight.bold,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    minHeight: 70,
    textAlignVertical: 'top',
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.md,
  },
  notesEmpty: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
  },
  noteBody: {
    flex: 1,
    paddingRight: spacing.md,
  },
  noteDepartment: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  noteText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  noteMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  deleteText: {
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
  },
});

export default UsageDetailsScreen;
