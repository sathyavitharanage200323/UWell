import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const UsageDetailsScreen = ({ navigation }) => {
  const usageData = {
    totalUsers: 312,
    activeUsers: 289,
    newUsersThisMonth: 45,
    averageSessionsPerUser: 5.2,
    mostActiveDepartment: 'Counseling',
    peakUsageTime: '2:00 PM - 4:00 PM'
  };

  const departmentUsage = [
    { department: 'Counseling', sessions: 890, percentage: 57 },
    { department: 'Welfare', sessions: 456, percentage: 29 },
    { department: 'Management', sessions: 221, percentage: 14 }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Usage Details" />
      
      <View style={styles.content}>
        <Card style={styles.overviewCard}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Users:</Text>
            <Text style={styles.statValue}>{usageData.totalUsers}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Active Users:</Text>
            <Text style={styles.statValue}>{usageData.activeUsers}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>New This Month:</Text>
            <Text style={styles.statValue}>{usageData.newUsersThisMonth}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Avg Sessions/User:</Text>
            <Text style={styles.statValue}>{usageData.averageSessionsPerUser}</Text>
          </View>
        </Card>

        <Card style={styles.insightsCard}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Most Active Department:</Text>
            <Text style={styles.insightValue}>{usageData.mostActiveDepartment}</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Peak Usage Time:</Text>
            <Text style={styles.insightValue}>{usageData.peakUsageTime}</Text>
          </View>
        </Card>

        <Card style={styles.departmentCard}>
          <Text style={styles.sectionTitle}>Department Usage</Text>
          {departmentUsage.map((dept, index) => (
            <View key={index} style={styles.departmentRow}>
              <View style={styles.departmentInfo}>
                <Text style={styles.departmentName}>{dept.department}</Text>
                <Text style={styles.departmentSessions}>{dept.sessions} sessions</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${dept.percentage}%` }]} />
              </View>
              <Text style={styles.percentage}>{dept.percentage}%</Text>
            </View>
          ))}
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
  overviewCard: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: spacing.md
  },
  statLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: 150
  },
  statValue: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  insightsCard: {
    marginBottom: spacing.lg
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: spacing.md
  },
  insightLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: 150
  },
  insightValue: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary
  },
  departmentCard: {
    marginBottom: spacing.lg
  },
  departmentRow: {
    marginBottom: spacing.lg
  },
  departmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  departmentName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  departmentSessions: {
    fontSize: typography.fontSize.md,
    color: colors.textLight
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary
  },
  percentage: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    textAlign: 'right'
  }
});

export default UsageDetailsScreen;
