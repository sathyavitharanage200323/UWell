import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { welfareService } from '../../services/welfareService';

const ServicesScreen = ({ navigation }) => {
  const [counselors, setCounselors] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [serviceDemand, setServiceDemand] = useState([]);
  const [serviceInfo, setServiceInfo] = useState({
    serviceAvailability: 'Open',
    dutyStatus: 'On Duty Today',
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // User-friendly UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [counselorFilter, setCounselorFilter] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'IN_SESSION'
  const [sessionFilter, setSessionFilter] = useState('ALL'); // 'ALL' | 'IN_SESSION' | 'SCHEDULED'
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch actual data from backend API
  const fetchData = useCallback(async () => {
    try {
      setErrorMsg(null);
      const res = await welfareService.getCounselingServices();
      if (res?.success) {
        setCounselors(Array.isArray(res.counselors) ? res.counselors : []);
        setLiveSessions(Array.isArray(res.liveSessions) ? res.liveSessions : []);
        setServiceDemand(Array.isArray(res.upcomingServiceDemand) ? res.upcomingServiceDemand : []);
        if (res.serviceAvailability) {
          setServiceInfo({
            serviceAvailability: res.serviceAvailability,
            dutyStatus: res.dutyStatus || 'On Duty Today',
          });
        }
      } else {
        throw new Error(res?.message || 'Failed to fetch counseling services from backend');
      }
    } catch (err) {
      console.error('Error fetching counseling services:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Unable to connect to backend server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Toggle counselor status between Available and In Session
  const handleToggleStatus = async (counselor) => {
    const counselorId = counselor.id || counselor._id;
    if (!counselorId) return;

    const nextStatus = counselor.status === 'Available' ? 'In Session' : 'Available';
    try {
      setUpdatingStatus(true);
      await welfareService.updateCounselorStatus(counselorId, nextStatus);
      setCounselors((prev) =>
        prev.map((c) =>
          (c.id === counselorId || c._id === counselorId) ? { ...c, status: nextStatus } : c
        )
      );
      if (selectedCounselor) {
        setSelectedCounselor({ ...selectedCounselor, status: nextStatus });
      }
    } catch (err) {
      Alert.alert('Update Failed', err.response?.data?.message || 'Could not update counselor status on backend.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filtered counselors based on search and status tab
  const filteredCounselors = useMemo(() => {
    return counselors.filter((c) => {
      // Status filter
      if (counselorFilter === 'AVAILABLE' && c.status !== 'Available') return false;
      if (counselorFilter === 'IN_SESSION' && c.status !== 'In Session') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const name = (c.name || '').toLowerCase();
        const spec = (c.specialization || '').toLowerCase();
        const staff = (c.staffId || '').toLowerCase();
        const loc = (c.officeLocation || '').toLowerCase();
        return name.includes(q) || spec.includes(q) || staff.includes(q) || loc.includes(q);
      }
      return true;
    });
  }, [counselors, counselorFilter, searchQuery]);

  // Filtered live sessions based on status tab
  const filteredSessions = useMemo(() => {
    return liveSessions.filter((s) => {
      if (sessionFilter === 'IN_SESSION' && s.status !== 'In Session') return false;
      if (sessionFilter === 'SCHEDULED' && s.status !== 'Scheduled') return false;
      return true;
    });
  }, [liveSessions, sessionFilter]);

  // Stats computation from actual data
  const availableCount = counselors.filter((c) => c.status === 'Available').length;
  const inSessionCount = counselors.filter((c) => c.status === 'In Session').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        {navigation.canGoBack() ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
        ) : null}
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Counseling Services</Text>
          <Text style={styles.headerSubtitle}>Live Campus Clinical Support & Case Sessions</Text>
        </View>
        <TouchableOpacity style={styles.syncBtn} onPress={onRefresh} disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="sync-outline" size={19} color={colors.primaryDark} />
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading actual counseling services data...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
        >
          {/* Error Banner if connection failed */}
          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.statusRedText} style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.errorTitle}>Backend Connection Error</Text>
                <Text style={styles.errorSub}>{errorMsg}</Text>
              </View>
              <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* ---------- Service Status Banner ---------- */}
          <View style={styles.banner}>
            <View style={styles.bannerLeft}>
              <View style={styles.statusDotGreen} />
              <View>
                <Text style={styles.bannerTitle}>Service Availability: {serviceInfo.serviceAvailability}</Text>
                <Text style={styles.bannerSub}>
                  {counselors.length} Verified Counselors • {availableCount} Available • {inSessionCount} In Session
                </Text>
              </View>
            </View>
            <View style={styles.dutyBadge}>
              <Text style={styles.dutyBadgeText}>{serviceInfo.dutyStatus}</Text>
            </View>
          </View>

          {/* ---------- CARD 1: Available Counselors Today ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <MaterialCommunityIcons name="account-clock-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Available Counselors Today</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{counselors.length} Total</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              Registered university clinical counselors and psychologists currently on campus
            </Text>

            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={17} color={colors.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by name, specialization, staff ID..."
                placeholderTextColor={colors.textMuted}
              />
              {searchQuery.length > 0 ? (
                <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                  <Ionicons name="close-circle" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterChip, counselorFilter === 'ALL' && styles.filterChipActive]}
                onPress={() => setCounselorFilter('ALL')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, counselorFilter === 'ALL' && styles.filterChipTextActive]}>
                  All ({counselors.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterChip, counselorFilter === 'AVAILABLE' && styles.filterChipActive]}
                onPress={() => setCounselorFilter('AVAILABLE')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, counselorFilter === 'AVAILABLE' && styles.filterChipTextActive]}>
                  Available ({availableCount})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterChip, counselorFilter === 'IN_SESSION' && styles.filterChipActive]}
                onPress={() => setCounselorFilter('IN_SESSION')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, counselorFilter === 'IN_SESSION' && styles.filterChipTextActive]}>
                  In Session ({inSessionCount})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Counselor Items List */}
            {filteredCounselors.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="people-outline" size={28} color={colors.mutedRose} style={{ marginBottom: 6 }} />
                <Text style={styles.emptyTitle}>No Counselors Found</Text>
                <Text style={styles.emptySub}>
                  {searchQuery ? 'No counselors matched your search keyword.' : 'No counselor records exist in the database.'}
                </Text>
              </View>
            ) : (
              filteredCounselors.map((c, index) => {
                const isAvailable = c.status === 'Available';
                const isLast = index === filteredCounselors.length - 1;
                const initials = c.name
                  ? c.name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
                  : 'CN';

                return (
                  <TouchableOpacity
                    key={c.id || c._id || index}
                    style={[styles.counselorItem, isLast && styles.counselorItemLast]}
                    onPress={() => setSelectedCounselor(c)}
                    activeOpacity={0.7}
                  >
                    {/* Avatar Initials */}
                    <View style={styles.counselorAvatar}>
                      <Text style={styles.counselorAvatarText}>{initials}</Text>
                    </View>

                    {/* Counselor Info */}
                    <View style={styles.counselorInfo}>
                      <View style={styles.counselorNameRow}>
                        <Text style={styles.counselorName}>{c.name}</Text>
                        {c.staffId ? (
                          <View style={styles.staffIdBadge}>
                            <Text style={styles.staffIdText}>{c.staffId}</Text>
                          </View>
                        ) : null}
                      </View>

                      <Text style={styles.counselorSpecialization}>{c.specialization || 'Clinical Counseling'}</Text>

                      <View style={styles.counselorLocationRow}>
                        <Ionicons name="location-outline" size={13} color={colors.textSecondary} style={{ marginRight: 4 }} />
                        <Text style={styles.counselorLocationText}>{c.officeLocation || 'Main Welfare Centre'}</Text>
                        {c.yearsOfExperience ? (
                          <>
                            <Text style={styles.bulletSeparator}>•</Text>
                            <Text style={styles.counselorExpText}>{c.yearsOfExperience}</Text>
                          </>
                        ) : null}
                      </View>
                    </View>

                    {/* Availability Status Badge */}
                    <TouchableOpacity
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: isAvailable ? colors.statusGreenBg : colors.statusYellowBg,
                        },
                      ]}
                      onPress={() => handleToggleStatus(c)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor: isAvailable ? colors.statusGreenText : colors.statusYellowText,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusPillText,
                          {
                            color: isAvailable ? colors.statusGreenText : colors.statusYellowText,
                          },
                        ]}
                      >
                        {c.status}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* ---------- CARD 2: Today's Live Sessions ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Today's Live Sessions</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{liveSessions.length} Scheduled</Text>
              </View>
            </View>
            <Text style={styles.cardSubtitle}>
              Actual student appointments fetched from the central booking database
            </Text>

            {/* Session Filter Tabs */}
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterChip, sessionFilter === 'ALL' && styles.filterChipActive]}
                onPress={() => setSessionFilter('ALL')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, sessionFilter === 'ALL' && styles.filterChipTextActive]}>
                  All ({liveSessions.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterChip, sessionFilter === 'IN_SESSION' && styles.filterChipActive]}
                onPress={() => setSessionFilter('IN_SESSION')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, sessionFilter === 'IN_SESSION' && styles.filterChipTextActive]}>
                  Live Now ({liveSessions.filter((s) => s.status === 'In Session').length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterChip, sessionFilter === 'SCHEDULED' && styles.filterChipActive]}
                onPress={() => setSessionFilter('SCHEDULED')}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, sessionFilter === 'SCHEDULED' && styles.filterChipTextActive]}>
                  Scheduled ({liveSessions.filter((s) => s.status === 'Scheduled').length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Live Sessions List */}
            {filteredSessions.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="calendar-clear-outline" size={28} color={colors.mutedRose} style={{ marginBottom: 6 }} />
                <Text style={styles.emptyTitle}>No Sessions Found</Text>
                <Text style={styles.emptySub}>No student sessions match the selected filter at this time.</Text>
              </View>
            ) : (
              filteredSessions.map((s, index) => {
                const isLast = index === filteredSessions.length - 1;
                const isInSession = s.status === 'In Session';
                const isOnline = s.sessionType === 'Online';

                return (
                  <View key={s.id || s._id || index} style={[styles.sessionItem, isLast && styles.sessionItemLast]}>
                    <View style={styles.sessionHeaderRow}>
                      <View style={styles.studentInfoWrap}>
                        <Text style={styles.studentName}>{s.student}</Text>
                        {s.studentId ? (
                          <View style={styles.studentIdBadge}>
                            <Text style={styles.studentIdText}>{s.studentId}</Text>
                          </View>
                        ) : null}
                      </View>

                      {/* Status Tag */}
                      <View
                        style={[
                          styles.statusPill,
                          {
                            backgroundColor: isInSession ? colors.statusRedBg : colors.statusYellowBg,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor: isInSession ? colors.statusRedText : colors.statusYellowText,
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusPillText,
                            {
                              color: isInSession ? colors.statusRedText : colors.statusYellowText,
                            },
                          ]}
                        >
                          {s.status}
                        </Text>
                      </View>
                    </View>

                    {/* Counselor Assignment & Mode */}
                    <View style={styles.sessionMetaRow}>
                      <View style={styles.sessionMetaCol}>
                        <View style={styles.iconTextRow}>
                          <Ionicons name="person-outline" size={14} color={colors.textSecondary} style={{ marginRight: 5 }} />
                          <Text style={styles.sessionCounselorText}>{s.counselor}</Text>
                        </View>
                        <Text style={styles.sessionSpecText}>{s.specialization}</Text>
                      </View>

                      <View style={styles.sessionTimeCol}>
                        <View style={styles.iconTextRow}>
                          <Ionicons name="time-outline" size={14} color={colors.primaryDark} style={{ marginRight: 4 }} />
                          <Text style={styles.sessionTimeText}>{s.time}</Text>
                        </View>
                        <View style={styles.modeBadge}>
                          <Ionicons
                            name={isOnline ? 'videocam-outline' : 'business-outline'}
                            size={12}
                            color={colors.primaryDark}
                            style={{ marginRight: 4 }}
                          />
                          <Text style={styles.modeBadgeText}>{s.sessionType || 'Online'}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Notes preview if present */}
                    {s.notes ? (
                      <View style={styles.sessionNoteBox}>
                        <Text style={styles.sessionNoteText}>Note: {s.notes}</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })
            )}
          </View>

          {/* ---------- CARD 3: Upcoming Service Demand ---------- */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Ionicons name="trending-up-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.cardTitle}>Upcoming Service Demand</Text>
            </View>
            <Text style={styles.cardSubtitle}>
              Scheduled appointment workload calculated across university weekdays
            </Text>

            <View style={styles.demandRow}>
              {serviceDemand.map((d) => (
                <View key={d.id} style={styles.demandCard}>
                  <Text style={styles.demandDay}>{d.day}</Text>
                  <Text style={styles.demandCount}>{d.sessions}</Text>
                  <Text style={styles.demandUnit}>Sessions</Text>
                  <Text style={styles.demandDate}>{d.dateLabel}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {/* ---------- Counselor Detail & Status Change Modal ---------- */}
      <Modal visible={!!selectedCounselor} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            {selectedCounselor ? (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalCounselorName}>{selectedCounselor.name}</Text>
                    <Text style={styles.modalSpecialization}>{selectedCounselor.specialization || 'Clinical Counseling'}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedCounselor(null)} style={styles.modalCloseBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={22} color={colors.text} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <View style={styles.modalFieldRow}>
                    <Text style={styles.modalFieldLabel}>Staff ID</Text>
                    <Text style={styles.modalFieldVal}>{selectedCounselor.staffId || 'CNS-OFFICER'}</Text>
                  </View>

                  {selectedCounselor.qualification ? (
                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Qualifications</Text>
                      <Text style={styles.modalFieldVal}>{selectedCounselor.qualification}</Text>
                    </View>
                  ) : null}

                  {selectedCounselor.yearsOfExperience ? (
                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Experience</Text>
                      <Text style={styles.modalFieldVal}>{selectedCounselor.yearsOfExperience}</Text>
                    </View>
                  ) : null}

                  {selectedCounselor.officeLocation ? (
                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Campus Office</Text>
                      <Text style={styles.modalFieldVal}>{selectedCounselor.officeLocation}</Text>
                    </View>
                  ) : null}

                  {selectedCounselor.email ? (
                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Work Email</Text>
                      <Text style={styles.modalFieldVal}>{selectedCounselor.email}</Text>
                    </View>
                  ) : null}

                  {selectedCounselor.phone ? (
                    <View style={styles.modalFieldRow}>
                      <Text style={styles.modalFieldLabel}>Phone</Text>
                      <Text style={styles.modalFieldVal}>{selectedCounselor.phone}</Text>
                    </View>
                  ) : null}

                  <View style={styles.modalFieldRow}>
                    <Text style={styles.modalFieldLabel}>Current Status</Text>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor:
                            selectedCounselor.status === 'Available' ? colors.statusGreenBg : colors.statusYellowBg,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor:
                              selectedCounselor.status === 'Available' ? colors.statusGreenText : colors.statusYellowText,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusPillText,
                          {
                            color:
                              selectedCounselor.status === 'Available' ? colors.statusGreenText : colors.statusYellowText,
                          },
                        ]}
                      >
                        {selectedCounselor.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Status Toggle Button */}
                <TouchableOpacity
                  style={[styles.modalToggleBtn, updatingStatus && { opacity: 0.7 }]}
                  onPress={() => handleToggleStatus(selectedCounselor)}
                  disabled={updatingStatus}
                  activeOpacity={0.8}
                >
                  {updatingStatus ? (
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                  ) : (
                    <Ionicons name="swap-horizontal" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  )}
                  <Text style={styles.modalToggleBtnText}>
                    Switch Status to {selectedCounselor.status === 'Available' ? 'In Session' : 'Available'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  syncBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: 12,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scrollContent: {
    padding: spacing.md,
  },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.statusRedBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#F8B4B4',
  },
  errorTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: '700',
    color: colors.statusRedText,
  },
  errorSub: {
    fontSize: 11,
    color: colors.statusRedText,
    marginTop: 1,
  },
  retryBtn: {
    backgroundColor: colors.statusRedText,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // Availability Banner
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.statusGreenBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.statusGreenText,
    marginRight: 10,
  },
  bannerTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.statusGreenText,
  },
  bannerSub: {
    fontSize: 11,
    color: colors.statusGreenText,
    marginTop: 2,
  },
  dutyBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dutyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.statusGreenText,
  },

  // Main Card Wrapper
  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '800',
    color: colors.text,
    flex: 1,
  },
  countPill: {
    backgroundColor: colors.softCoral,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  countPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  cardSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },

  // Search Bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.creamBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    paddingVertical: 0,
  },

  // Filter Tabs
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundLight,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Counselor Item
  counselorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  counselorItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  counselorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.softCoral,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counselorAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  counselorInfo: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 8,
  },
  counselorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counselorName: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: '700',
    color: colors.text,
  },
  staffIdBadge: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    backgroundColor: colors.softCoral,
  },
  staffIdText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  counselorSpecialization: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  counselorLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  counselorLocationText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  bulletSeparator: {
    marginHorizontal: 6,
    color: colors.textMuted,
    fontSize: 10,
  },
  counselorExpText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Status Pill
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Sessions Item
  sessionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sessionItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  sessionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  studentInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentName: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: '700',
    color: colors.text,
  },
  studentIdBadge: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    backgroundColor: colors.creamBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  studentIdText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sessionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sessionMetaCol: {
    flex: 1,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionCounselorText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  sessionSpecText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginLeft: 19,
  },
  sessionTimeCol: {
    alignItems: 'flex-end',
  },
  sessionTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.softCoral,
    marginTop: 4,
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  sessionNoteBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.creamBackground,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  sessionNoteText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  // Demand Row
  demandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 6,
  },
  demandCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.creamBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demandDay: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  demandCount: {
    fontSize: typography.fontSize.md + 1,
    fontWeight: '800',
    color: colors.primaryDark,
    marginVertical: 2,
  },
  demandUnit: {
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  demandDate: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
  },

  // Empty Box
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  emptySub: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 20,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(61, 44, 46, 0.45)',
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalBox: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: 12,
    marginBottom: 12,
  },
  modalCounselorName: {
    fontSize: typography.fontSize.md + 1,
    fontWeight: '800',
    color: colors.text,
  },
  modalSpecialization: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryDark,
    fontWeight: '600',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    gap: 10,
  },
  modalFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalFieldLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalFieldVal: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  modalToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 18,
  },
  modalToggleBtnText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
  },
});