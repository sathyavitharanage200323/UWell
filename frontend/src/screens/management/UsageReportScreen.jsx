import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';
import { managementService } from '../../services/managementService';

const DATE_RANGES = ['This Week', 'This Month', 'This Quarter', 'This Year'];
const REPORT_TYPES = ['Appointments', 'User Activity', 'Department Usage', 'Counselor Performance'];

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');

const UsageReportScreen = ({ navigation }) => {
  const [dateRange, setDateRange] = useState('This Month');
  const [reportType, setReportType] = useState('Appointments');
  const [report, setReport] = useState(null);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadSaved = useCallback(async () => {
    try {
      const res = await managementService.getSavedReports();
      setSaved(res.reports || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load saved reports.');
    }
  }, []);

  // Regenerate whenever the filters change, so the preview always matches the buttons
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await managementService.generateUsageReport(reportType, dateRange);
        if (!cancelled) setReport(res.report);
      } catch (err) {
        if (!cancelled) {
          setReport(null);
          setError(err.response?.data?.message || 'Could not generate the report. Check your connection.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [reportType, dateRange]);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await managementService.saveUsageReport(reportType, dateRange);
      await loadSaved();
      Alert.alert('Report saved', `${reportType} (${dateRange}) was added to your saved reports.`);
    } catch (err) {
      Alert.alert('Save failed', err.response?.data?.message || 'Could not save the report.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item) => {
    Alert.alert('Delete saved report?', `${item.type} - ${item.range}`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await managementService.deleteSavedReport(item._id);
            await loadSaved();
          } catch (err) {
            Alert.alert('Delete failed', err.response?.data?.message || 'Could not delete the report.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Generate Report" />

      <View style={styles.content}>
        <Card style={styles.filterCard}>
          <Text style={styles.sectionTitle}>Report Filters</Text>

          <Text style={styles.filterLabel}>Date Range</Text>
          <View style={styles.filterOptions}>
            {DATE_RANGES.map((range) => (
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
            {REPORT_TYPES.map((type) => (
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
          {loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : report ? (
            <View style={styles.previewContent}>
              <Text style={styles.previewTitle}>{report.type} Report</Text>
              <Text style={styles.previewSubtitle}>
                Date Range: {report.range} - {report.totalRecords} records
              </Text>

              <View style={styles.previewStats}>
                {report.summary.map((item) => (
                  <View key={item.label} style={styles.previewStat}>
                    <Text style={styles.previewStatNumber}>{item.value}</Text>
                    <Text style={styles.previewStatLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>

              {report.rows.length > 0 && (
                <View style={styles.rows}>
                  {report.rows.map((row) => (
                    <View key={row.label} style={styles.row}>
                      <View style={styles.rowText}>
                        <Text style={styles.rowLabel}>{row.label}</Text>
                        {!!row.detail && <Text style={styles.rowDetail}>{row.detail}</Text>}
                      </View>
                      <Text style={styles.rowValue}>{row.value}</Text>
                    </View>
                  ))}
                </View>
              )}
              {report.rows.length === 0 && (
                <Text style={styles.emptyText}>No activity recorded in this period.</Text>
              )}
            </View>
          ) : null}
        </Card>

        <Button
          title="Save Report"
          onPress={handleSave}
          loading={saving}
          disabled={!report || loading}
          style={styles.button}
        />

        <Button
          title="View Usage Details"
          variant="outline"
          onPress={() => navigation.navigate('UsageDetails')}
          style={styles.button}
        />

        <Card style={styles.savedCard}>
          <Text style={styles.sectionTitle}>Saved Reports</Text>
          {saved.length === 0 ? (
            <Text style={styles.emptyText}>No saved reports yet.</Text>
          ) : (
            saved.map((item) => (
              <View key={item._id} style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={styles.rowLabel}>{item.type}</Text>
                  <Text style={styles.rowDetail}>
                    {item.range} - {item.totalRecords} records - {formatDate(item.createdAt)}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </Card>
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
  filterCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  filterLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.md,
  },
  filterLabelTop: {
    marginTop: spacing.lg,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    flex: 1,
    minWidth: '45%',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  previewCard: {
    marginBottom: spacing.lg,
  },
  previewContent: {
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  previewSubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  previewStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  previewStat: {
    alignItems: 'center',
    minWidth: '30%',
    marginBottom: spacing.md,
  },
  previewStatNumber: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  previewStatLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    textAlign: 'center',
  },
  rows: {
    width: '100%',
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowText: {
    flex: 1,
    paddingRight: spacing.md,
  },
  rowLabel: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  rowDetail: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
  },
  rowValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: typography.fontSize.md,
    textAlign: 'center',
  },
  button: {
    marginBottom: spacing.lg,
  },
  savedCard: {
    marginBottom: spacing.xl,
  },
  deleteText: {
    color: colors.error,
    fontWeight: typography.fontWeight.bold,
  },
});

export default UsageReportScreen;
