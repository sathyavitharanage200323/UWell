import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const UsageReportScreen = ({ navigation }) => {
  const [dateRange, setDateRange] = useState('This Month');
  const [reportType, setReportType] = useState('Appointments');

  const dateRanges = ['This Week', 'This Month', 'This Quarter', 'This Year'];
  const reportTypes = ['Appointments', 'User Activity', 'Department Usage', 'Counselor Performance'];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Generate Report" />
      
      <View style={styles.content}>
        <Card style={styles.filterCard}>
          <Text style={styles.sectionTitle}>Report Filters</Text>
          
          <Text style={styles.filterLabel}>Date Range</Text>
          <View style={styles.filterOptions}>
            {dateRanges.map((range) => (
              <Button
                key={range}
                title={range}
                variant={dateRange === range ? 'primary' : 'outline'}
                onPress={() => setDateRange(range)}
                style={styles.filterButton}
              />
            ))}
          </View>

          <Text style={[styles.filterLabel, styles.filterLabelTop]}>Report Type</Text>
          <View style={styles.filterOptions}>
            {reportTypes.map((type) => (
              <Button
                key={type}
                title={type}
                variant={reportType === type ? 'primary' : 'outline'}
                onPress={() => setReportType(type)}
                style={styles.filterButton}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.previewCard}>
          <Text style={styles.sectionTitle}>Report Preview</Text>
          <View style={styles.previewContent}>
            <Text style={styles.previewTitle}>{reportType} Report</Text>
            <Text style={styles.previewSubtitle}>Date Range: {dateRange}</Text>
            
            <View style={styles.previewStats}>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatNumber}>156</Text>
                <Text style={styles.previewStatLabel}>Total Records</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatNumber}>89%</Text>
                <Text style={styles.previewStatLabel}>Completion Rate</Text>
              </View>
              <View style={styles.previewStat}>
                <Text style={styles.previewStatNumber}>4.8</Text>
                <Text style={styles.previewStatLabel}>Avg Rating</Text>
              </View>
            </View>
          </View>
        </Card>

        <Button
          title="Generate PDF Report"
          onPress={() => {}}
          style={styles.button}
        />

        <Button
          title="Export to Excel"
          variant="outline"
          onPress={() => {}}
          style={styles.button}
        />

        <Button
          title="Email Report"
          variant="outline"
          onPress={() => {}}
          style={styles.button}
        />
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
  filterCard: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg
  },
  filterLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.md
  },
  filterLabelTop: {
    marginTop: spacing.lg
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  filterButton: {
    flex: 1,
    minWidth: '45%',
    marginRight: spacing.sm,
    marginBottom: spacing.sm
  },
  previewCard: {
    marginBottom: spacing.xl
  },
  previewContent: {
    alignItems: 'center'
  },
  previewTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  previewSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.lg
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%'
  },
  previewStat: {
    alignItems: 'center'
  },
  previewStatNumber: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs
  },
  previewStatLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight
  },
  button: {
    marginTop: spacing.md
  }
});

export default UsageReportScreen;
