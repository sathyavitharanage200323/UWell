import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const DashboardScreen = ({ navigation }) => {
  const stats = {
    totalUsers: 312,
    activeStudents: 245,
    totalCounselors: 12,
    totalAppointments: 1567,
    monthlySessions: 234,
    satisfactionRate: '4.8/5.0'
  };

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Management Dashboard" />
      
      <View style={styles.content}>
        <Text style={styles.greeting}>Welcome, Administration! 👋</Text>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeStudents}</Text>
            <Text style={styles.statLabel}>Active Students</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalCounselors}</Text>
            <Text style={styles.statLabel}>Counselors</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalAppointments}</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.monthlySessions}</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.satisfactionRate}</Text>
            <Text style={styles.statLabel}>Satisfaction</Text>
          </Card>
        </View>

        <Card style={styles.chartCard}>
          <Text style={styles.cardTitle}>Monthly Usage Overview</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartText}>📊 Usage Chart Placeholder</Text>
            <Text style={styles.chartSubtext}>Appointments per month</Text>
          </View>
        </Card>

        <Card style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠️ System Alerts</Text>
          <View style={styles.alertItem}>
            <Text style={styles.alertText}>• Server maintenance scheduled for Oct 15</Text>
          </View>
          <View style={styles.alertItem}>
            <Text style={styles.alertText}>• 3 counselor accounts pending approval</Text>
          </View>
          <View style={styles.alertItem}>
            <Text style={styles.alertText}>• Database backup completed successfully</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight
  },
  content: {
    padding: spacing.lg
  },
  greeting: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xl
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg
  },
  statCard: {
    width: '45%',
    alignItems: 'center',
    padding: spacing.lg,
    marginRight: spacing.sm,
    marginBottom: spacing.sm
  },
  statNumber: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    textAlign: 'center'
  },
  chartCard: {
    marginBottom: spacing.lg
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  chartText: {
    fontSize: typography.fontSize.xl,
    color: colors.textLight
  },
  chartSubtext: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    marginTop: spacing.sm
  },
  alertCard: {
    backgroundColor: colors.info
  },
  alertTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite,
    marginBottom: spacing.md
  },
  alertItem: {
    marginBottom: spacing.sm
  },
  alertText: {
    fontSize: typography.fontSize.md,
    color: colors.textWhite
  }
});

export default DashboardScreen;
