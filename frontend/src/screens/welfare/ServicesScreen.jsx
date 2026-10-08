import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import {
  availableCounselors,
  liveSessionsToday,
  upcomingServiceDemand
} from '../../data/welfareMockData';

const counselorStatusStyles = {
  Available: { bg: '#DDF3E4', text: '#397052' },
  'In Session': { bg: '#FFF0D6', text: '#9A6818' }
};

const sessionStatusStyles = {
  Scheduled: { bg: '#FFF0D6', text: '#9A6818' },
  'In Session': { bg: '#FBE1DE', text: '#C0392B' }
};

const ServicesScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Counseling Services</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Availability Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerItem}>
            <View style={styles.dotGreen} />
            <Text style={styles.bannerTextStrong}>Service Availability: Open</Text>
          </View>
          <View style={styles.bannerItem}>
            <Text style={styles.bannerTextGreen}>On Duty Today</Text>
          </View>
        </View>

        {/* Available Counselors Today */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Available Counselors Today</Text>
          {availableCounselors.map((c, index) => {
            const s = counselorStatusStyles[c.status] || counselorStatusStyles.Available;
            const isLast = index === availableCounselors.length - 1;
            return (
              <View key={c.id} style={[styles.row, isLast && styles.rowLast]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{c.name}</Text>
                  <Text style={styles.rowSub}>{c.specialization}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: s.bg }]}>
                  <Text style={[styles.pillText, { color: s.text }]}>{c.status}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Today's Live Sessions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Live Sessions</Text>
          {liveSessionsToday.map((s, index) => {
            const st = sessionStatusStyles[s.status] || sessionStatusStyles.Scheduled;
            const isLast = index === liveSessionsToday.length - 1;
            return (
              <View key={s.id} style={[styles.row, isLast && styles.rowLast]}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle}>{s.student}</Text>
                  <Text style={styles.rowSub}>{s.counselor}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.rowTime}>{s.time}</Text>
                  <View style={[styles.pill, { backgroundColor: st.bg }]}>
                    <Text style={[styles.pillText, { color: st.text }]}>{s.status}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Upcoming Service Demand */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Service Demand</Text>
          <View style={styles.demandRow}>
            {upcomingServiceDemand.map((d) => (
              <View key={d.id} style={styles.demandItem}>
                <Text style={styles.demandDay}>{d.day}</Text>
                <Text style={styles.demandCount}>{d.sessions} Sessions</Text>
                <Text style={styles.demandDate}>{d.dateLabel}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5EC',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg
  },
  bannerItem: { flexDirection: 'row', alignItems: 'center' },
  dotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E8B57',
    marginRight: spacing.sm
  },
  bannerTextStrong: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#2E5D3F'
  },
  bannerTextGreen: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: '#397052'
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  rowLast: { borderBottomWidth: 0 },
  rowTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  rowSub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2
  },
  rowTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4
  },
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  pillText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium },

  demandRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  demandItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: colors.creamBackground,
    borderWidth: 1,
    borderColor: colors.border
  },
  demandDay: { fontSize: typography.fontSize.sm, color: colors.textSecondary },
  demandCount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginTop: 4
  },
  demandDate: { fontSize: typography.fontSize.xs, color: colors.textMuted, marginTop: 2 }
});

export default ServicesScreen;