import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { welfareAppointments, appointmentDetailsMap } from '../../data/welfareMockData';

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const aptId = route?.params?.id || 'apt-1';
  const apt = welfareAppointments.find((a) => a.id === aptId) || welfareAppointments[0];
  const details = appointmentDetailsMap[aptId] || appointmentDetailsMap['apt-1'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Info Card */}
        <View style={styles.topCard}>
          <View style={styles.topRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>{apt.status}</Text>
            </View>
            <View style={styles.welfareLog}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.welfareLogText}>Welfare Log</Text>
            </View>
          </View>
          <Text style={styles.dateText}>{apt.date} • {apt.time}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <InfoRow label="STUDENT REF" value={details.studentRef} />
          <InfoRow label="COUNSELOR" value={details.counselor} />
          <InfoRow label="SERVICE TYPE" value={details.serviceType} />
          <InfoRow label="DURATION" value={details.duration} />
          <InfoRow label="LOCATION" value={details.location} last />
        </View>

        {/* Notes Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Officer Session Notes</Text>
          <Text style={styles.bodyText}>{details.notes}</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.7}>
          <Text style={styles.outlineButtonText}>Reschedule Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.7}>
          <Text style={styles.outlineButtonText}>Cancel Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
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
  statusBadge: {
    backgroundColor: '#FBE1DE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  statusBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#C0392B'
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
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  bodyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22
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
  }
});

export default AppointmentDetailsScreen;