import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import NavigationHeader from '../../components/navigation/Header';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { resolveProfileImageUrl } from '../../services/welfareService';

export default function DashboardScreen({ navigation }) {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    totalCounselors: 0,
    totalWelfareOfficers: 0,
    totalPendingRequests: 0,
    pendingCounselors: 0,
    pendingWelfare: 0,
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [activeRoleFilter, setActiveRoleFilter] = useState('all'); // 'all' | 'counselor' | 'welfare'
  const [feedback, setFeedback] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [pendingRes, statsRes] = await Promise.allSettled([
        authService.getPendingRequests(),
        authService.getDashboardStats(),
      ]);

      if (pendingRes.status === 'fulfilled' && pendingRes.value?.success) {
        setRequests(pendingRes.value.requests || []);
        if (pendingRes.value.totalPending !== undefined) {
          setStats((prev) => ({
            ...prev,
            totalPendingRequests: pendingRes.value.totalPending,
            pendingCounselors: pendingRes.value.counselorsPending || 0,
            pendingWelfare: pendingRes.value.welfarePending || 0,
          }));
        }
      }

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setStats((prev) => ({
          ...prev,
          ...statsRes.value.stats,
        }));
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleApprove = async (item) => {
    try {
      setActionLoading((p) => ({ ...p, [item.id]: 'approving' }));
      const res = await authService.approveRequest(item.id, item.role);

      // Remove approved item from list
      setRequests((prev) => prev.filter((r) => r.id !== item.id));

      // Update counters
      setStats((prev) => ({
        ...prev,
        totalPendingRequests: Math.max(0, prev.totalPendingRequests - 1),
        pendingCounselors: item.role === 'counselor' ? Math.max(0, prev.pendingCounselors - 1) : prev.pendingCounselors,
        pendingWelfare: item.role === 'welfare' ? Math.max(0, prev.pendingWelfare - 1) : prev.pendingWelfare,
        totalCounselors: item.role === 'counselor' ? prev.totalCounselors + 1 : prev.totalCounselors,
        totalWelfareOfficers: item.role === 'welfare' ? prev.totalWelfareOfficers + 1 : prev.totalWelfareOfficers,
      }));

      setFeedback({
        type: 'success',
        message: `✅ ${item.fullName} (${item.role}) approved! They can now log in.`,
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch (error) {
      Alert.alert('Approval Failed', error.response?.data?.message || error.message);
    } finally {
      setActionLoading((p) => ({ ...p, [item.id]: null }));
    }
  };

  const handleReject = async (item) => {
    Alert.alert(
      'Confirm Rejection',
      `Are you sure you want to reject the registration request for ${item.fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading((p) => ({ ...p, [item.id]: 'rejecting' }));
              await authService.rejectRequest(item.id, item.role, 'Rejected by management review');

              setRequests((prev) => prev.filter((r) => r.id !== item.id));
              setStats((prev) => ({
                ...prev,
                totalPendingRequests: Math.max(0, prev.totalPendingRequests - 1),
                pendingCounselors: item.role === 'counselor' ? Math.max(0, prev.pendingCounselors - 1) : prev.pendingCounselors,
                pendingWelfare: item.role === 'welfare' ? Math.max(0, prev.pendingWelfare - 1) : prev.pendingWelfare,
              }));

              setFeedback({
                type: 'info',
                message: `Registration for ${item.fullName} has been rejected.`,
              });
              setTimeout(() => setFeedback(null), 5000);
            } catch (error) {
              Alert.alert('Rejection Failed', error.response?.data?.message || error.message);
            } finally {
              setActionLoading((p) => ({ ...p, [item.id]: null }));
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of the Management Portal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
            } catch (e) { }
            if (logout) {
              await logout();
            }
          },
        },
      ]
    );
  };

  const filteredRequests = requests.filter((r) => {
    if (activeRoleFilter === 'counselor') return r.role === 'counselor';
    if (activeRoleFilter === 'welfare') return r.role === 'welfare';
    return true;
  });

  const counselorCount = requests.filter((r) => r.role === 'counselor').length;
  const welfareCount = requests.filter((r) => r.role === 'welfare').length;

  return (
    <View style={styles.container}>
      <NavigationHeader title="Management Dashboard" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {/* ── Greeting Header ────────────────────────────────────────── */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.greetingTitle}>Administration Portal 👋</Text>
            <Text style={styles.greetingSub}>Review & approve counselor and welfare officer accounts</Text>
          </View>
          <View style={styles.headerBtnsRow}>
            <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} disabled={refreshing} accessibilityLabel="Refresh">
              <Feather name="refresh-cw" size={16} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutHeaderBtn} onPress={handleLogout} accessibilityLabel="Log out">
              <Feather name="log-out" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Feedback Banner ────────────────────────────────────────── */}
        {feedback && (
          <View style={[styles.feedbackBox, feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackInfo]}>
            <Text style={[styles.feedbackText, feedback.type === 'success' ? styles.feedbackSuccessText : styles.feedbackInfoText]}>
              {feedback.message}
            </Text>
          </View>
        )}

        {/* ── Pending Requests Alert Banner ──────────────────────────── */}
        <View style={styles.approvalAlertCard}>
          <View style={styles.alertIconCircle}>
            <Feather name="shield" size={24} color="#B45309" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.alertCardTitle}>
              {requests.length} Pending Approval {requests.length === 1 ? 'Request' : 'Requests'}
            </Text>
            <Text style={styles.alertCardSub}>
              {requests.length > 0
                ? 'Counselors and Welfare Officers require management approval before they can log in.'
                : 'All staff accounts are up to date! No registrations awaiting review.'}
            </Text>
          </View>
        </View>

        {/* ── System Overview Stats Grid ─────────────────────────────── */}
        <Text style={styles.sectionHeader}>System Overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
            <Text style={[styles.statNumber, { color: '#D97706' }]}>{requests.length}</Text>
            <Text style={styles.statLabel}>Pending Requests</Text>
            <Text style={styles.statMeta}>{counselorCount} Counselors • {welfareCount} Welfare</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: colors.primary }]}>
            <Text style={styles.statNumber}>{stats.activeStudents || 0}</Text>
            <Text style={styles.statLabel}>Registered Students</Text>
            <Text style={styles.statMeta}>Auto-verified</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#7C5CBF' }]}>
            <Text style={[styles.statNumber, { color: '#7C5CBF' }]}>{stats.totalCounselors || 0}</Text>
            <Text style={styles.statLabel}>Active Counselors</Text>
            <Text style={styles.statMeta}>Approved clinical staff</Text>
          </View>

          <View style={[styles.statCard, { borderLeftColor: '#397052' }]}>
            <Text style={[styles.statNumber, { color: '#397052' }]}>{stats.totalWelfareOfficers || 0}</Text>
            <Text style={styles.statLabel}>Welfare Officers</Text>
            <Text style={styles.statMeta}>Approved support team</Text>
          </View>
        </View>

        {/* ── Requests Section Header & Filter Tabs ─────────────────── */}
        <View style={styles.requestsHeaderRow}>
          <View>
            <Text style={styles.sectionHeader}>Registration Requests</Text>
            <Text style={styles.sectionSub}>Review submitted registration form details</Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, activeRoleFilter === 'all' && styles.filterPillActive]}
            onPress={() => setActiveRoleFilter('all')}
          >
            <Text style={[styles.filterPillText, activeRoleFilter === 'all' && styles.filterPillTextActive]}>
              All ({requests.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeRoleFilter === 'counselor' && styles.filterPillActive]}
            onPress={() => setActiveRoleFilter('counselor')}
          >
            <Text style={[styles.filterPillText, activeRoleFilter === 'counselor' && styles.filterPillTextActive]}>
              🏥 Counselors ({counselorCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, activeRoleFilter === 'welfare' && styles.filterPillActive]}
            onPress={() => setActiveRoleFilter('welfare')}
          >
            <Text style={[styles.filterPillText, activeRoleFilter === 'welfare' && styles.filterPillTextActive]}>
              🛡️ Welfare Officers ({welfareCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Pending Requests List ──────────────────────────────────── */}
        {loading && !refreshing ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Fetching registration requests…</Text>
          </View>
        ) : filteredRequests.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyCircle}>
              <Feather name="check-circle" size={40} color={colors.statusGreenText} />
            </View>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptySub}>
              {requests.length === 0
                ? 'No pending registration requests. All new counselors and welfare officers have been reviewed.'
                : `No pending ${activeRoleFilter} requests right now.`}
            </Text>
          </View>
        ) : (
          filteredRequests.map((item) => {
            const isCounselor = item.role === 'counselor';
            const isApproving = actionLoading[item.id] === 'approving';
            const isRejecting = actionLoading[item.id] === 'rejecting';
            const isBusy = isApproving || isRejecting;

            return (
              <View key={item.id} style={styles.requestCard}>
                {/* Card Top: Name, Badge, Date */}
                <View style={styles.cardTopRow}>
                  <View style={styles.applicantAvatarBox}>
                    {resolveProfileImageUrl(item.profilePicture) ? (
                      <Image
                        source={{ uri: resolveProfileImageUrl(item.profilePicture) }}
                        style={styles.applicantAvatarImg}
                      />
                    ) : (
                      <Text style={styles.applicantAvatarInitials}>
                        {((item.firstName || '')[0] || 'U') + ((item.lastName || '')[0] || '')}
                      </Text>
                    )}
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.applicantName}>{item.fullName}</Text>
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.roleTag,
                          isCounselor
                            ? { backgroundColor: '#F3EEFF', borderColor: '#D8B4FE' }
                            : { backgroundColor: '#E8F8EF', borderColor: '#A7F3D0' },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={isCounselor ? 'doctor' : 'shield-account'}
                          size={13}
                          color={isCounselor ? '#7C5CBF' : '#397052'}
                          style={{ marginRight: 4 }}
                        />
                        <Text style={[styles.roleTagText, { color: isCounselor ? '#7C5CBF' : '#397052' }]}>
                          {isCounselor ? 'COUNSELOR' : 'WELFARE OFFICER'}
                        </Text>
                      </View>

                      <View style={styles.statusTagPending}>
                        <Feather name="clock" size={11} color="#B45309" style={{ marginRight: 3 }} />
                        <Text style={styles.statusTagPendingText}>Pending Approval</Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.submissionDate}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                  </Text>
                </View>

                {/* Form Details Table */}
                <View style={styles.detailsBox}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Staff ID:</Text>
                    <Text style={styles.detailHighlight}>{item.staffId}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{item.email}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{item.phone || 'N/A'}</Text>
                  </View>

                  {item.officeLocation ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Office Location:</Text>
                      <Text style={styles.detailValue}>{item.officeLocation}</Text>
                    </View>
                  ) : null}

                  {/* Role Specific Credentials */}
                  {isCounselor ? (
                    <>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Qualification:</Text>
                        <Text style={styles.detailValue}>{item.qualification}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Specialization:</Text>
                        <Text style={styles.detailValue}>{item.specialization}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Experience:</Text>
                        <Text style={styles.detailValue}>{item.yearsOfExperience}</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Department:</Text>
                        <Text style={styles.detailValue}>{item.department}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Position:</Text>
                        <Text style={styles.detailValue}>{item.position}</Text>
                      </View>
                    </>
                  )}
                </View>

                {/* Card Actions: Approve / Reject */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.rejectBtn, isBusy && { opacity: 0.6 }]}
                    onPress={() => handleReject(item)}
                    disabled={isBusy}
                    activeOpacity={0.8}
                  >
                    {isRejecting ? (
                      <ActivityIndicator size="small" color={colors.statusRedText} />
                    ) : (
                      <>
                        <Feather name="x" size={16} color={colors.statusRedText} style={{ marginRight: 6 }} />
                        <Text style={styles.rejectBtnText}>Reject</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.approveBtn, isBusy && { opacity: 0.6 }]}
                    onPress={() => handleApprove(item)}
                    disabled={isBusy}
                    activeOpacity={0.8}
                  >
                    {isApproving ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <>
                        <Feather name="check" size={16} color={colors.white} style={{ marginRight: 6 }} />
                        <Text style={styles.approveBtnText}>Approve Account</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 40,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.darkText,
  },
  greetingSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerBtnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackBox: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: '#DEF7EC',
    borderColor: '#31C48D',
  },
  feedbackInfo: {
    backgroundColor: '#E1EFFE',
    borderColor: '#76A9FA',
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
  },
  feedbackSuccessText: {
    color: '#03543F',
  },
  feedbackInfoText: {
    color: '#1E429F',
  },
  approvalAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  alertIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  alertCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  alertCardSub: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.darkText,
    marginTop: 2,
  },
  statMeta: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 4,
  },
  requestsHeaderRow: {
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterPillTextActive: {
    color: colors.white,
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 10,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 10,
  },
  emptyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DEF7EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  requestCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  applicantAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E8DDD7',
  },
  applicantAvatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  applicantAvatarInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  applicantName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTagPending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusTagPendingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  submissionDate: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailsBox: {
    backgroundColor: '#FDFCF9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F0ECE6',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F5F1EB',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: colors.darkText,
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  detailHighlight: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#FDF2F2',
    borderWidth: 1,
    borderColor: '#F98080',
  },
  rejectBtnText: {
    color: colors.statusRedText,
    fontSize: 13,
    fontWeight: '700',
  },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#0E9F6E',
    shadowColor: '#0E9F6E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  approveBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
