import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { welfareAppointments } from '../../data/welfareMockData';

const TABS = ['All', 'Upcoming', 'Completed'];

const statusStyles = {
  Upcoming: { bg: '#FBE1DE', text: '#C0392B' },
  Completed: { bg: '#DDF3E4', text: '#397052' },
  Cancelled: { bg: '#EAE1D7', text: '#756A67' }
};

const AppointmentsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const filtered = useMemo(() => {
    if (activeTab === 'All') return welfareAppointments;
    return welfareAppointments.filter((a) => a.status === activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
              {active && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>No {activeTab.toLowerCase()} appointments.</Text>
        ) : (
          filtered.map((apt) => {
            const st = statusStyles[apt.status] || statusStyles.Upcoming;
            return (
              <TouchableOpacity
                key={apt.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('AppointmentDetails', { id: apt.id })}
              >
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardDate}>
                    {apt.date} <Text style={styles.cardTime}>• {apt.time}</Text>
                  </Text>
                  <View style={[styles.pill, { backgroundColor: st.bg }]}>
                    <Text style={[styles.pillText, { color: st.text }]}>{apt.status}</Text>
                  </View>
                </View>

                <View style={styles.cardBodyRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{apt.studentName}</Text>
                    <Text style={styles.cardSub}>
                      {apt.counselorName} • {apt.service}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
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

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  tab: { marginRight: spacing.xl, paddingBottom: spacing.sm, alignItems: 'center' },
  tabText: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium
  },
  tabTextActive: { color: colors.primary, fontWeight: typography.fontWeight.bold },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    height: 2,
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 1
  },

  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl
  },

  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  cardDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium
  },
  cardTime: { color: colors.textMuted },
  pill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  pillText: { fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium },

  cardBodyRow: { flexDirection: 'row', alignItems: 'center' },
  cardName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  cardSub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2
  }
});

export default AppointmentsScreen;