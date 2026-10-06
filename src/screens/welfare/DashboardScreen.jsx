import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const DashboardScreen = ({ navigation }) => {
  const stats = {
    totalStudents: 245,
    activeCounselors: 12,
    totalAppointments: 156,
    pendingRequests: 8
  };

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Welfare Dashboard" />
      
      <View style={styles.content}>
        <Text style={styles.greeting}>Welcome, Welfare Team! 👋</Text>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalStudents}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeCounselors}</Text>
            <Text style={styles.statLabel}>Active Counselors</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalAppointments}</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pendingRequests}</Text>
            <Text style={styles.statLabel}>Pending Requests</Text>
          </Card>
        </View>

        <Card style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠️ Alerts</Text>
          <View style={styles.alertItem}>
            <Text style={styles.alertText}>• 5 students flagged for urgent attention</Text>
          </View>
          <View style={styles.alertItem}>
            <Text style={styles.alertText}>• 2 counselors at maximum capacity</Text>
          </View>
          <View style={styles.alertItem}>
            <Text style={styles.alertText}>• 3 service requests pending approval</Text>
          </View>
        </Card>

        <Card style={styles.activityCard}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>New student registration: Emily Davis</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Service updated: Stress Management Workshop</Text>
            <Text style={styles.activityTime}>5 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityText}>Counselor availability updated: Dr. Johnson</Text>
            <Text style={styles.activityTime}>1 day ago</Text>
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
    marginBottom: spacing.xl
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
  alertCard: {
    backgroundColor: colors.warning,
    marginBottom: spacing.lg
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
  },
  activityCard: {
    marginBottom: spacing.lg
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  activityItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  activityText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs
  },
  activityTime: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight
  }
});

export default DashboardScreen;
