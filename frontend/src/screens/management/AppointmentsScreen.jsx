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
import NavigationHeader from '../../components/navigation/Header';
import { managementService } from '../../services/managementService';

const FILTERS = [
  { key: 'all', label: 'All', countKey: 'total' },
  { key: 'upcoming', label: 'Upcoming', countKey: 'upcoming' },
  { key: 'completed', label: 'Completed', countKey: 'completed' },
  { key: 'cancelled', label: 'Cancelled', countKey: 'cancelled' },
];

const STATUS_LABELS = {
  upcoming: 'Upcoming',
  'in session': 'In Session',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const AppointmentsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [summary, setSummary] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const res = await managementService.getAppointments({
        status: statusFilter,
        search: search.trim(),
      });
      setAppointments(res.appointments || []);
      setSummary(res.summary || {});
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load appointments. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    // Wait briefly while typing so each keystroke does not hit the server
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const changeStatus = async (appointment, status) => {
    setUpdatingId(appointment.id);
    try {
      await managementService.updateAppointment(appointment.id, { status });
      await load();
    } catch (err) {
      Alert.alert('Update failed', err.response?.data?.message || 'Could not update the appointment.');
    } finally {
      setUpdatingId(null);
    }
  };

  const openActions = (appointment) => {
    const options = [];
    if (appointment.status !== 'completed') {
      options.push({ text: 'Mark as completed', onPress: () => changeStatus(appointment, 'completed') });
    }
    if (appointment.status !== 'cancelled') {
      options.push({
        text: 'Cancel appointment',
        style: 'destructive',
        onPress: () =>
          Alert.alert(
            'Cancel appointment?',
            `${appointment.studentName} with ${appointment.counselorName} on ${appointment.date}.`,
            [
              { text: 'Keep', style: 'cancel' },
              { text: 'Cancel appointment', style: 'destructive', onPress: () => changeStatus(appointment, 'cancelled') },
            ]
          ),
      });
    }
    if (appointment.status !== 'upcoming') {
      options.push({ text: 'Reopen as upcoming', onPress: () => changeStatus(appointment, 'upcoming') });
    }
    options.push({ text: 'Close', style: 'cancel' });
    Alert.alert(appointment.studentName, `Status: ${STATUS_LABELS[appointment.status]}`, options);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
      }
    >
      <NavigationHeader title="All Appointments" />

      <View style={styles.content}>
        <TextInput
          style={styles.search}
          placeholder="Search student, counselor or department"
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, statusFilter === f.key && styles.filterChipActive]}
              onPress={() => setStatusFilter(f.key)}
            >
              <Text style={[styles.filterText, statusFilter === f.key && styles.filterTextActive]}>
                {f.label} ({summary[f.countKey] ?? 0})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : error ? (
          <Card>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => { setLoading(true); load(); }}>
              <Text style={styles.retry}>Try again</Text>
            </TouchableOpacity>
          </Card>
        ) : appointments.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No appointments match this filter.</Text>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              onPress={() => openActions(appointment)}
              disabled={updatingId === appointment.id}
            >
              <Card style={[styles.appointmentCard, appointment.status === 'cancelled' && styles.cancelledCard]}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.studentName}>{appointment.studentName}</Text>
                  {updatingId === appointment.id ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <View
                      style={[
                        styles.statusBadge,
                        appointment.status === 'completed' && styles.completedBadge,
                        (appointment.status === 'upcoming' || appointment.status === 'in session') && styles.upcomingBadge,
                        appointment.status === 'cancelled' && styles.cancelledBadge,
                      ]}
                    >
                      <Text style={styles.statusText}>{STATUS_LABELS[appointment.status]}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.appointmentDetails}>
                  <Text style={styles.detail}>Counselor: {appointment.counselorName}</Text>
                  <Text style={styles.detail}>Date: {appointment.date}</Text>
                  <Text style={styles.detail}>Time: {appointment.time}</Text>
                  <Text style={styles.detail}>Dept: {appointment.specialization}</Text>
                </View>
                <Text style={styles.hint}>Tap to update status</Text>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    padding: spacing.lg,
  },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  filterTextActive: {
    color: colors.textWhite,
    fontWeight: typography.fontWeight.bold,
  },
  loader: {
    marginTop: spacing.xl,
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
    textAlign: 'center',
  },
  appointmentCard: {
    marginBottom: spacing.md,
  },
  cancelledCard: {
    opacity: 0.6,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  studentName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flexShrink: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  completedBadge: {
    backgroundColor: colors.success,
  },
  upcomingBadge: {
    backgroundColor: colors.warning,
  },
  cancelledBadge: {
    backgroundColor: colors.error,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite,
  },
  appointmentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detail: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: '48%',
    marginBottom: spacing.xs,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});

export default AppointmentsScreen;
