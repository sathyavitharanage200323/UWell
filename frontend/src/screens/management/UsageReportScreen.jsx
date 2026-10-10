import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme';
import NavigationHeader from '../../components/navigation/Header';
import { managementService } from '../../services/managementService';
import ConfirmModal from '../../components/management/ConfirmModal';
import useSessionGuard from '../../components/management/useSessionGuard';
import {
  ResponsiveScroll,
  SectionCard,
  Chip,
  Banner,
  LoadingState,
  EmptyState,
  ErrorState,
  ActionButton,
  useLayout,
  PAGE_BACKGROUND,
} from '../../components/management/ManagementUI';

const DATE_RANGES = ['This Week', 'This Month', 'This Quarter', 'This Year'];
const REPORT_TYPES = ['Appointments', 'User Activity', 'Department Usage', 'Counselor Performance'];

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');

// Plain-text version of a report, used by the Share button
const reportToText = (report) => {
  const lines = [
    `UWell - ${report.type} report`,
    `Period: ${report.range}`,
    `Records: ${report.totalRecords}`,
    '',
    ...report.summary.map((s) => `${s.label}: ${s.value}`),
  ];
  if (report.rows && report.rows.length) {
    lines.push('', 'Breakdown:');
    report.rows.forEach((r) => lines.push(`- ${r.label}: ${r.value}${r.detail ? ` (${r.detail})` : ''}`));
  }
  return lines.join('\n');
};

/** Summary tiles + breakdown bars for one report. */
const ReportBody = ({ report, isWide }) => {
  const max = Math.max(1, ...report.rows.map((r) => r.value));
  return (
    <View>
      <View style={styles.tileGrid}>
        {report.summary.map((item) => (
          <View key={item.label} style={[styles.tile, { width: isWide ? '24%' : '48.5%' }]}>
            <Text style={styles.tileNumber}>{item.value}</Text>
            <Text style={styles.tileLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      {report.rows.length === 0 ? (
        <Text style={styles.emptyRows}>No activity recorded in this period.</Text>
      ) : (
        report.rows.map((row) => (
          <View key={row.label} style={styles.barRow}>
            <View style={styles.barHeader}>
              <Text style={styles.barLabel} numberOfLines={1}>{row.label}</Text>
              <Text style={styles.barValue}>{row.value}</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${Math.max(4, (row.value / max) * 100)}%` }]} />
            </View>
            {row.detail ? <Text style={styles.barDetail}>{row.detail}</Text> : null}
          </View>
        ))
      )}
    </View>
  );
};

const UsageReportScreen = ({ navigation }) => {
  const handleError = useSessionGuard();
  const { isWide } = useLayout();

  const [dateRange, setDateRange] = useState('This Month');
  const [reportType, setReportType] = useState('Appointments');
  const [report, setReport] = useState(null);
  const [saved, setSaved] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 4500);
  };

  const loadSaved = useCallback(async () => {
    try {
      const res = await managementService.getSavedReports();
      setSaved(res.reports || []);
    } catch (err) {
      showBanner('error', handleError(err, 'Could not load saved reports.'));
    }
  }, [handleError]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await managementService.generateUsageReport(reportType, dateRange);
      setReport(res.report);
    } catch (err) {
      setReport(null);
      setError(handleError(err, 'Could not generate the report.'));
    } finally {
      setLoading(false);
    }
  }, [reportType, dateRange, handleError]);

  // Regenerate whenever a filter changes so the preview always matches the chips
  useEffect(() => { generate(); }, [generate]);
  useEffect(() => { loadSaved(); }, [loadSaved]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await managementService.saveUsageReport(reportType, dateRange);
      await loadSaved();
      showBanner('success', `${reportType} (${dateRange}) saved.`);
    } catch (err) {
      showBanner('error', handleError(err, 'Could not save the report.'));
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async (target) => {
    try {
      await Share.share({ message: reportToText(target), title: `UWell ${target.type} report` });
    } catch (err) {
      showBanner('error', 'Sharing is not available on this device.');
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await managementService.deleteSavedReport(toDelete._id);
      if (openId === toDelete._id) setOpenId(null);
      setToDelete(null);
      await loadSaved();
      showBanner('success', 'Saved report deleted.');
    } catch (err) {
      setToDelete(null);
      showBanner('error', handleError(err, 'Could not delete the report.'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <NavigationHeader title="Usage Report" />

      <ResponsiveScroll>
        {banner ? <Banner type={banner.type} message={banner.message} /> : null}

        <SectionCard title="Report filters" icon="sliders" iconTone="info">
          <Text style={styles.filterLabel}>Date range</Text>
          <View style={styles.chipRow}>
            {DATE_RANGES.map((r) => (
              <Chip key={r} label={r} active={dateRange === r} onPress={() => setDateRange(r)} />
            ))}
          </View>
          <Text style={[styles.filterLabel, { marginTop: 8 }]}>Report type</Text>
          <View style={styles.chipRow}>
            {REPORT_TYPES.map((t) => (
              <Chip key={t} label={t} active={reportType === t} onPress={() => setReportType(t)} />
            ))}
          </View>
        </SectionCard>

        <SectionCard
          title={report ? `${report.type} - ${report.range}` : 'Report preview'}
          icon="bar-chart-2"
          iconTone="success"
        >
          {loading ? (
            <LoadingState text="Building report..." />
          ) : error ? (
            <ErrorState message={error} onRetry={generate} />
          ) : report ? (
            <>
              <Text style={styles.recordCount}>{report.totalRecords} records</Text>
              <ReportBody report={report} isWide={isWide} />
            </>
          ) : null}
        </SectionCard>

        <View style={styles.buttonRow}>
          <ActionButton
            title="Save report"
            icon="save"
            loading={saving}
            disabled={!report || loading}
            onPress={handleSave}
            style={styles.rowButton}
          />
          <ActionButton
            title="Share"
            icon="share-2"
            variant="secondary"
            disabled={!report || loading}
            onPress={() => handleShare(report)}
            style={styles.rowButton}
          />
        </View>
        <ActionButton
          title="View usage details"
          icon="activity"
          variant="secondary"
          onPress={() => navigation.navigate('UsageDetails')}
          style={styles.fullButton}
        />

        <SectionCard title={`Saved reports (${saved.length})`} icon="folder" iconTone="warning">
          {saved.length === 0 ? (
            <EmptyState icon="file-text" title="No saved reports yet" text="Save a report to keep a snapshot you can reopen or share later." />
          ) : (
            saved.map((item) => {
              const open = openId === item._id;
              return (
                <View key={item._id} style={styles.savedItem}>
                  <TouchableOpacity
                    style={styles.savedHeader}
                    onPress={() => setOpenId(open ? null : item._id)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: open }}
                  >
                    <View style={styles.savedText}>
                      <Text style={styles.savedTitle}>{item.type}</Text>
                      <Text style={styles.savedMeta}>
                        {item.range} - {item.totalRecords} records - saved {formatDate(item.createdAt)}
                      </Text>
                    </View>
                    <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                  {open ? (
                    <View style={styles.savedBody}>
                      <ReportBody report={item} isWide={isWide} />
                      <View style={styles.buttonRow}>
                        <ActionButton
                          title="Share"
                          icon="share-2"
                          variant="secondary"
                          onPress={() => handleShare(item)}
                          style={styles.rowButton}
                        />
                        <ActionButton
                          title="Delete"
                          icon="trash-2"
                          variant="danger"
                          onPress={() => setToDelete(item)}
                          style={styles.rowButton}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              );
            })
          )}
        </SectionCard>
      </ResponsiveScroll>

      <ConfirmModal
        visible={!!toDelete}
        title="Delete saved report?"
        message={toDelete ? `${toDelete.type} - ${toDelete.range}` : ''}
        confirmLabel="Delete"
        cancelLabel="Keep"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BACKGROUND },
  filterLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  recordCount: { fontSize: 12, color: colors.textMuted, marginBottom: 10 },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    backgroundColor: '#FBF8F4',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileNumber: { fontSize: 24, fontWeight: '800', color: colors.primaryDark },
  tileLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  emptyRows: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', paddingVertical: 12 },
  barRow: { marginTop: 10 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.darkText, paddingRight: 8 },
  barValue: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },
  barTrack: { height: 8, backgroundColor: '#EFE9E2', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  barDetail: { fontSize: 11, color: colors.textMuted, marginTop: 3 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  rowButton: { flexGrow: 1, flexBasis: 140, marginRight: 8, marginBottom: 8 },
  fullButton: { marginBottom: 14 },
  savedItem: { borderTopWidth: 1, borderTopColor: colors.border },
  savedHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, minHeight: 52 },
  savedText: { flex: 1, paddingRight: 8 },
  savedTitle: { fontSize: 14, fontWeight: '700', color: colors.darkText },
  savedMeta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  savedBody: { paddingBottom: 10 },
});

export default UsageReportScreen;
