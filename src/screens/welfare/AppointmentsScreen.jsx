import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useWelfare } from '../../context/WelfareContext';

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const statusStyles = {
  Upcoming: { bg: '#FBE1DE', text: '#C0392B' },
  Completed: { bg: '#DDF3E4', text: '#397052' },
  Cancelled: { bg: '#EAE1D7', text: '#756A67' }
};

const AppointmentsScreen = ({ navigation }) => {
  const { getAppointments } = useWelfare();
  const [activeTab, setActiveTab] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const list = getAppointments(activeTab);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleBack = () => {
    const parent = navigation.getParent();
    if (parent) parent.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointments</Text>
        <Text style={styles.headerCount}>{list.length}</Text>
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {list.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="calendar-outline" size={42} color={colors.textMuted} />
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} appointments.</Text>
          </View>
        ) : (
          list.map((apt) => {
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
    flex: 1,
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  headerCount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    backgroundColor: colors.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10
  },

  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  tab: { marginRight: spacing.lg, paddingBottom: spacing.sm, alignItems: 'center' },
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

  emptyBox: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: {
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.md
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