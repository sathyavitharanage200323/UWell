import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import NavigationHeader from '../../components/navigation/Header';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/management/ConfirmModal';
import useSessionGuard from '../../components/management/useSessionGuard';
import {
  ResponsiveScroll,
  SectionCard,
  StatusPill,
  Chip,
  Banner,
  LoadingState,
  EmptyState,
  ErrorState,
  InfoRow,
  ActionButton,
  useLayout,
  PAGE_BACKGROUND,
} from '../../components/management/ManagementUI';

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const ROLE_FILTERS = [
  { key: 'all', label: 'All roles' },
  { key: 'counselor', label: 'Counselors' },
  { key: 'welfare', label: 'Welfare officers' },
];

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '');

const DashboardScreen = () => {
  const { logout } = useAuth();
  const handleError = useSessionGuard();
  const { isWide } = useLayout();

  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ activeStudents: 0, totalCounselors: 0, totalWelfareOfficers: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [banner, setBanner] = useState(null);
  const [tab, setTab] = useState('pending');
  const [roleFilter, setRoleFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);

  // Which dialog is open: { kind: 'approve' | 'reject' | 'logout', item? }
  const [dialog, setDialog] = useState(null);
  const [reason, setReason] = useState('');

  const load = useCallback(async () => {
    setLoadError('');
    const [reqRes, statsRes] = await Promise.allSettled([
      authService.getAllRequests(),
      authService.getDashboardStats(),
    ]);

    if (reqRes.status === 'fulfilled' && reqRes.value?.success) {
      setRequests(reqRes.value.requests || []);
    } else {
      setLoadError(handleError(reqRes.reason, 'Could not load registration requests.'));
    }
    if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
      setStats(statsRes.value.stats || {});
    }
    setLoading(false);
    setRefreshing(false);
  }, [handleError]);

  useEffect(() => { load(); }, [load]);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 5000);
  };

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    requests.forEach((r) => { if (c[r.approvalStatus] !== undefined) c[r.approvalStatus] += 1; });
    return c;
  }, [requests]);

  const visible = useMemo(
    () => requests.filter((r) => r.approvalStatus === tab && (roleFilter === 'all' || r.role === roleFilter)),
    [requests, tab, roleFilter]
  );

  const closeDialog = () => { setDialog(null); setReason(''); };

  const runReview = async () => {
    const { kind, item } = dialog;
    setBusyId(item.id);
    try {
      if (kind === 'approve') {
        await authService.approveRequest(item.id, item.role);
        showBanner('success', `${item.fullName} approved. They can now log in.`);
      } else {
        await authService.rejectRequest(item.id, item.role, reason.trim());
        showBanner('info', `${item.fullName}'s access was ${item.approvalStatus === 'approved' ? 'revoked' : 'rejected'}.`);
      }
      closeDialog();
      await load();
    } catch (err) {
      closeDialog();
      showBanner('error', handleError(err, 'The decision could not be saved.'));
    } finally {
      setBusyId(null);
    }
  };

  const confirmLogout = async () => {
    try { await authService.logout(); } catch (e) { /* local sign-out is enough */ }
    closeDialog();
    if (logout) await logout();
  };

  const statItems = [
    { label: 'Pending requests', value: counts.pending, meta: 'Waiting for review', color: '#D97706' },
    { label: 'Registered students', value: stats.activeStudents || 0, meta: 'Auto-verified', color: colors.primary },
    { label: 'Active counselors', value: stats.totalCounselors || 0, meta: 'Approved clinical staff', color: '#7C5CBF' },
    { label: 'Welfare officers', value: stats.totalWelfareOfficers || 0, meta: 'Approved support team', color: '#397052' },
  ];

  const renderRequest = (item) => {
    const isCounselor = item.role === 'counselor';
    const busy = busyId === item.id;
    const status = item.approvalStatus;

    return (
      <SectionCard key={item.id} style={styles.requestCard}>
        <View style={styles.cardTop}>
          <View style={styles.cardTopText}>
            <Text style={styles.applicantName}>{item.fullName}</Text>
            <View style={styles.tagRow}>
              <View style={[styles.roleTag, isCounselor ? styles.roleCounselor : styles.roleWelfare]}>
                <MaterialCommunityIcons
                  name={isCounselor ? 'doctor' : 'shield-account'}
                  size={13}
                  color={isCounselor ? '#7C5CBF' : '#397052'}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.roleTagText, { color: isCounselor ? '#7C5CBF' : '#397052' }]}>
                  {isCounselor ? 'Counselor' : 'Welfare officer'}
                </Text>
              </View>
              <StatusPill
                label={status === 'pending' ? 'Pending' : status === 'approved' ? 'Approved' : 'Rejected'}
                tone={status === 'pending' ? 'warning' : status === 'approved' ? 'success' : 'danger'}
              />
            </View>
          </View>
          <Text style={styles.dateText}>{formatDate(status === 'approved' ? item.approvedAt || item.createdAt : item.createdAt)}</Text>
        </View>

        <View style={styles.details}>
          <InfoRow label="Staff ID" value={item.staffId} bold />
          <InfoRow label="Email" value={item.email} />
          <InfoRow label="Phone" value={item.phone || 'Not provided'} />
          {item.officeLocation ? <InfoRow label="Office" value={item.officeLocation} /> : null}
          {isCounselor ? (
            <>
              <InfoRow label="Qualification" value={item.qualification} />
              <InfoRow label="Specialization" value={item.specialization} />
              <InfoRow label="Experience" value={`${item.yearsOfExperience} years`} />
            </>
          ) : (
            <>
              <InfoRow label="Department" value={item.department} />
              <InfoRow label="Position" value={item.position} />
            </>
          )}
          {status === 'rejected' && item.rejectionReason ? (
            <InfoRow label="Reason" value={item.rejectionReason} />
          ) : null}
        </View>

        <View style={styles.actions}>
          {status !== 'rejected' && (
            <ActionButton
              title={status === 'approved' ? 'Revoke access' : 'Reject'}
              icon="x"
              variant="danger"
              disabled={busy}
              onPress={() => setDialog({ kind: 'reject', item })}
              style={styles.actionBtn}
            />
          )}
          {status !== 'approved' && (
            <ActionButton
              title={status === 'rejected' ? 'Approve instead' : 'Approve account'}
              icon="check"
              loading={busy}
              onPress={() => setDialog({ kind: 'approve', item })}
              style={styles.actionBtn}
            />
          )}
        </View>
      </SectionCard>
    );
  };

  const emptyText = {
    pending: 'No registrations are waiting for review.',
    approved: 'No staff accounts have been approved yet.',
    rejected: 'No registrations have been rejected.',
  }[tab];

  return (
    <View style={styles.container}>
      <NavigationHeader title="Management Dashboard" />

      <ResponsiveScroll refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }}>
        <View style={styles.greetingRow}>
          <View style={styles.greetingText}>
            <Text style={styles.greetingTitle}>Administration Portal</Text>
            <Text style={styles.greetingSub}>Review and manage counselor and welfare officer accounts</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn} onPress={() => { setRefreshing(true); load(); }} accessibilityLabel="Refresh">
            <Feather name="refresh-cw" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconBtn, styles.logoutBtn]}
            onPress={() => setDialog({ kind: 'logout' })}
            accessibilityLabel="Log out"
          >
            <Feather name="log-out" size={16} color={colors.statusRedText} />
          </TouchableOpacity>
        </View>

        {banner ? <Banner type={banner.type} message={banner.message} /> : null}

        <View style={[styles.statusCard, counts.pending > 0 ? styles.statusPending : styles.statusClear]}>
          <View style={[styles.statusIcon, { backgroundColor: counts.pending > 0 ? '#FDE68A' : colors.statusGreenBg }]}>
            <Feather
              name={counts.pending > 0 ? 'shield' : 'check-circle'}
              size={22}
              color={counts.pending > 0 ? '#B45309' : colors.statusGreenText}
            />
          </View>
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>
              {counts.pending} pending {counts.pending === 1 ? 'request' : 'requests'}
            </Text>
            <Text style={styles.statusSub}>
              {counts.pending > 0
                ? 'These staff members cannot log in until you approve them.'
                : 'All staff accounts are up to date.'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>System overview</Text>
        <View style={styles.statsGrid}>
          {statItems.map((s) => (
            <View key={s.label} style={[styles.statCard, { width: isWide ? '24%' : '48.5%', borderLeftColor: s.color }]}>
              <Text style={[styles.statNumber, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statMeta}>{s.meta}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Registration requests</Text>
        <View style={styles.tabRow} accessibilityRole="tablist">
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, tab === t.key && styles.tabActive]}
              onPress={() => setTab(t.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected: tab === t.key }}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
                {t.label} ({counts[t.key]})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterRow}>
          {ROLE_FILTERS.map((f) => (
            <Chip key={f.key} label={f.label} active={roleFilter === f.key} onPress={() => setRoleFilter(f.key)} />
          ))}
        </View>

        {loading ? (
          <LoadingState text="Loading registration requests..." />
        ) : loadError ? (
          <ErrorState message={loadError} onRetry={() => { setLoading(true); load(); }} />
        ) : visible.length === 0 ? (
          <EmptyState icon="check-circle" title="Nothing here" text={emptyText} />
        ) : (
          <View style={isWide ? styles.twoColumn : null}>
            {visible.map((item) => (
              <View key={item.id} style={isWide ? styles.twoColumnItem : null}>{renderRequest(item)}</View>
            ))}
          </View>
        )}
      </ResponsiveScroll>

      <ConfirmModal
        visible={dialog?.kind === 'approve'}
        title="Approve this account?"
        message={dialog?.item ? `${dialog.item.fullName} will be able to log in as a ${dialog.item.role === 'counselor' ? 'counselor' : 'welfare officer'}.` : ''}
        confirmLabel="Approve"
        loading={!!busyId}
        onConfirm={runReview}
        onCancel={closeDialog}
      />
      <ConfirmModal
        visible={dialog?.kind === 'reject'}
        title={dialog?.item?.approvalStatus === 'approved' ? 'Revoke access?' : 'Reject this registration?'}
        message={dialog?.item ? `${dialog.item.fullName} will not be able to log in.` : ''}
        confirmLabel={dialog?.item?.approvalStatus === 'approved' ? 'Revoke' : 'Reject'}
        destructive
        loading={!!busyId}
        inputLabel="Reason (optional, shown to the applicant)"
        inputPlaceholder="e.g. Staff ID could not be verified"
        inputValue={reason}
        onChangeInput={setReason}
        onConfirm={runReview}
        onCancel={closeDialog}
      />
      <ConfirmModal
        visible={dialog?.kind === 'logout'}
        title="Log out?"
        message="You will need to sign in again to use the management portal."
        confirmLabel="Log out"
        destructive
        onConfirm={confirmLogout}
        onCancel={closeDialog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BACKGROUND },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  greetingText: { flex: 1, paddingRight: 10 },
  greetingTitle: { fontSize: 22, fontWeight: '700', color: colors.darkText },
  greetingSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2, lineHeight: 18 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  logoutBtn: { backgroundColor: colors.statusRedBg, borderColor: '#F5B7B1' },
  statusCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 18, borderWidth: 1.5 },
  statusPending: { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  statusClear: { backgroundColor: colors.statusGreenBg, borderColor: '#B7E1C5' },
  statusIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  statusText: { flex: 1 },
  statusTitle: { fontSize: 15, fontWeight: '700', color: colors.darkText },
  statusSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 17 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: colors.darkText, marginBottom: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
  },
  statNumber: { fontSize: 26, fontWeight: '800', color: colors.darkText },
  statLabel: { fontSize: 13, fontWeight: '600', color: colors.darkText, marginTop: 2 },
  statMeta: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  tabRow: { flexDirection: 'row', backgroundColor: '#EFE9E2', borderRadius: 12, padding: 4, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center', minHeight: 40, justifyContent: 'center' },
  tabActive: { backgroundColor: colors.white },
  tabText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.darkText, fontWeight: '700' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  twoColumn: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  twoColumnItem: { width: '49%' },
  requestCard: { marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  cardTopText: { flex: 1, paddingRight: 8 },
  applicantName: { fontSize: 16, fontWeight: '700', color: colors.darkText, marginBottom: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  roleCounselor: { backgroundColor: '#F3EEFF' },
  roleWelfare: { backgroundColor: '#E8F8EF' },
  roleTagText: { fontSize: 11, fontWeight: '700' },
  dateText: { fontSize: 12, color: colors.textMuted },
  details: { backgroundColor: '#FBF8F4', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap' },
  actionBtn: { flexGrow: 1, flexBasis: 140, marginRight: 8, marginTop: 4 },
});

export default DashboardScreen;
