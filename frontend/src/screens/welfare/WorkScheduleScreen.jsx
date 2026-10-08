import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useWelfare } from '../../context/WelfareContext';
import { useAuth } from '../../context/AuthContext';
import { welfareService } from '../../services/welfareService';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

// Pre-defined schedule template changing list
const SCHEDULE_TEMPLATES = [
  {
    id: 'full_time',
    title: 'Full-time On Campus',
    badge: 'Standard 40h',
    icon: 'business-outline',
    description: 'Daily presence at the university welfare office for student walk-ins and scheduled sessions.',
    defaultHours: 'Monday – Friday, 8:30 AM – 4:30 PM',
    defaultDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    defaultMode: 'In-Person & Online',
    defaultNote: 'Office is open for both drop-ins and prior bookings.',
  },
  {
    id: 'hybrid',
    title: 'Hybrid (Campus & Remote)',
    badge: 'Flexible Support',
    icon: 'laptop-outline',
    description: 'On-campus presence 3 days a week with 2 days dedicated to telehealth and online student support.',
    defaultHours: 'Monday – Friday, 9:00 AM – 5:00 PM',
    defaultDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    defaultMode: 'In-Person & Online',
    defaultNote: 'Mon/Wed/Fri on campus; Tue/Thu remote consultations via MS Teams.',
  },
  {
    id: 'morning_shift',
    title: 'Morning Shift',
    badge: 'Early Triage',
    icon: 'sunny-outline',
    description: 'Focused early morning hours for urgent student intake, triage, and morning counseling appointments.',
    defaultHours: 'Monday – Friday, 8:00 AM – 2:00 PM',
    defaultDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    defaultMode: 'In-Person Only',
    defaultNote: 'Ideal for urgent morning walk-ins before classes begin.',
  },
  {
    id: 'afternoon_evening',
    title: 'Afternoon & Evening Shift',
    badge: 'Late Sessions',
    icon: 'moon-outline',
    description: 'Afternoon and evening hours accommodating evening students, hostel residents, and after-class appointments.',
    defaultHours: 'Monday – Friday, 12:00 PM – 6:30 PM',
    defaultDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    defaultMode: 'In-Person & Online',
    defaultNote: 'Available during afternoon and evening class breaks.',
  },
  {
    id: 'part_time',
    title: 'Part-Time Service (3 Days/Week)',
    badge: 'Part-Time',
    icon: 'calendar-outline',
    description: 'Dedicated 3-day weekly schedule for welfare advising, bursary applications, and counseling sessions.',
    defaultHours: 'Mon, Wed, Fri: 9:00 AM – 3:30 PM',
    defaultDays: ['Monday', 'Wednesday', 'Friday'],
    defaultMode: 'In-Person & Online',
    defaultNote: 'Consultations available exclusively on Monday, Wednesday, and Friday.',
  },
  {
    id: 'emergency_oncall',
    title: 'Emergency On-Call Coverage',
    badge: '24/7 Crisis',
    icon: 'alert-circle-outline',
    description: 'Active emergency triage and crisis hotline responder for urgent campus welfare incidents.',
    defaultHours: '24/7 Urgent Crisis Hotline Coverage',
    defaultDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    defaultMode: 'Online & On-Call',
    defaultNote: 'Direct phone & emergency hotline triage always forwarded.',
  },
  {
    id: 'custom',
    title: 'Custom Schedule',
    badge: 'Personalized',
    icon: 'options-outline',
    description: 'Manually specify custom working days, office hours, and consultation instructions for students.',
    defaultHours: 'Monday – Friday, 8:30 AM – 4:30 PM',
    defaultDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    defaultMode: 'In-Person & Online',
    defaultNote: 'Please refer to schedule details before visiting.',
  },
];

// Live availability status presets
const AVAILABILITY_STATUSES = [
  {
    id: 'Available Today',
    label: 'Available Today',
    sub: 'Accepting walk-ins & appointments',
    color: '#15803D',
    bgColor: '#DCFCE7',
    icon: 'checkmark-circle',
  },
  {
    id: 'In Consultation',
    label: 'In Consultation',
    sub: 'Engaged in confidential student session',
    color: '#B45309',
    bgColor: '#FEF3C7',
    icon: 'time',
  },
  {
    id: 'Remote Duty',
    label: 'Remote Duty',
    sub: 'Available via Teams / Zoom / Email only',
    color: '#1D4ED8',
    bgColor: '#DBEAFE',
    icon: 'videocam',
  },
  {
    id: 'Out of Office',
    label: 'Out of Office / Leave',
    sub: 'Unavailable for new sessions today',
    color: '#B91C1C',
    bgColor: '#FEE2E2',
    icon: 'close-circle',
  },
];

// Day options
const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Modes
const CONSULTATION_MODES = ['In-Person & Online', 'In-Person Only', 'Online via Teams/Zoom Only'];

const WorkScheduleScreen = ({ navigation }) => {
  const { profile, updateSchedule } = useWelfare();
  const { user } = useAuth();

  const officer = profile || user || {};

  // Form State
  const [selectedTemplate, setSelectedTemplate] = useState('full_time');
  const [workingSchedule, setWorkingSchedule] = useState('Full-time On Campus');
  const [availabilityStatus, setAvailabilityStatus] = useState('Available Today');
  const [officeHours, setOfficeHours] = useState('Monday – Friday, 8:30 AM – 4:30 PM');
  const [officeLocation, setOfficeLocation] = useState('Main Welfare Office, Block C');
  const [workingDays, setWorkingDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [consultationMode, setConsultationMode] = useState('In-Person & Online');
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);
  const [availabilityNote, setAvailabilityNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Initialize from current officer data
  useEffect(() => {
    if (officer) {
      if (officer.workingSchedule) {
        setWorkingSchedule(officer.workingSchedule);
        // Find matching template if any
        const match = SCHEDULE_TEMPLATES.find(
          (t) => t.title.toLowerCase() === officer.workingSchedule.toLowerCase()
        );
        if (match) setSelectedTemplate(match.id);
        else setSelectedTemplate('custom');
      }
      if (officer.availabilityStatus) setAvailabilityStatus(officer.availabilityStatus);
      if (officer.officeHours) setOfficeHours(officer.officeHours);
      if (officer.officeLocation) setOfficeLocation(officer.officeLocation);
      if (Array.isArray(officer.workingDays) && officer.workingDays.length > 0) {
        setWorkingDays(officer.workingDays);
      }
      if (officer.consultationMode) setConsultationMode(officer.consultationMode);
      if (officer.emergencyAvailable !== undefined) {
        setEmergencyAvailable(Boolean(officer.emergencyAvailable));
      }
      if (officer.availabilityNote) setAvailabilityNote(officer.availabilityNote);
    }
  }, [officer.workingSchedule, officer.availabilityStatus, officer.officeHours]);

  // When a template is selected from changing list
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id);
    setWorkingSchedule(template.title);
    setOfficeHours(template.defaultHours);
    setWorkingDays(template.defaultDays);
    setConsultationMode(template.defaultMode);
    if (!availabilityNote || availabilityNote.trim() === '') {
      setAvailabilityNote(template.defaultNote);
    }
  };

  // Toggle day
  const handleToggleDay = (day) => {
    if (workingDays.includes(day)) {
      if (workingDays.length === 1) {
        Alert.alert('Notice', 'At least one working day must remain selected.');
        return;
      }
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  // Refresh latest from backend
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const res = await welfareService.getProfile();
      if (res?.user) {
        const u = res.user;
        if (u.workingSchedule) setWorkingSchedule(u.workingSchedule);
        if (u.availabilityStatus) setAvailabilityStatus(u.availabilityStatus);
        if (u.officeHours) setOfficeHours(u.officeHours);
        if (u.officeLocation) setOfficeLocation(u.officeLocation);
        if (Array.isArray(u.workingDays)) setWorkingDays(u.workingDays);
        if (u.consultationMode) setConsultationMode(u.consultationMode);
        if (u.emergencyAvailable !== undefined) setEmergencyAvailable(Boolean(u.emergencyAvailable));
        if (u.availabilityNote) setAvailabilityNote(u.availabilityNote);
        Alert.alert('Refreshed', 'Latest availability data loaded from backend.');
      }
    } catch {
      Alert.alert('Offline', 'Could not refresh from server. Using cached data.');
    } finally {
      setRefreshing(false);
    }
  };

  // Save to backend database
  const handleSave = async () => {
    if (!workingSchedule.trim()) {
      Alert.alert('Validation', 'Please provide a working schedule title.');
      return;
    }
    if (!officeHours.trim()) {
      Alert.alert('Validation', 'Please provide office hours.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        workingSchedule: workingSchedule.trim(),
        availabilityStatus: availabilityStatus.trim(),
        officeHours: officeHours.trim(),
        officeLocation: officeLocation.trim(),
        workingDays,
        consultationMode,
        emergencyAvailable,
        availabilityNote: availabilityNote.trim(),
      };

      if (updateSchedule) {
        await updateSchedule(payload);
      } else {
        await welfareService.updateSchedule(payload);
      }

      Alert.alert(
        'Schedule Updated',
        'Your working schedule and availability details have been saved to the database. Students can now see your updated hours and status.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error('Failed to save schedule:', err);
      Alert.alert('Save Failed', err.response?.data?.message || 'Could not update schedule on backend.');
    } finally {
      setSaving(false);
    }
  };

  const currentStatusObj =
    AVAILABILITY_STATUSES.find((s) => s.id === availabilityStatus) || AVAILABILITY_STATUSES[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Work Schedule & Availability</Text>
          <Text style={styles.headerSub}>
            Staff ID: {officer.staffId || 'STF-OFFICER'} • {officer.name || `${officer.firstName || ''} ${officer.lastName || ''}`.trim() || 'Officer'}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="sync-outline" size={20} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ---------- Card 1: Live Status Switcher ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="broadcast" size={18} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Live Officer Status</Text>
            <View style={[styles.statusIndicatorBadge, { backgroundColor: currentStatusObj.bgColor }]}>
              <View style={[styles.statusDot, { backgroundColor: currentStatusObj.color }]} />
              <Text style={[styles.statusIndicatorText, { color: currentStatusObj.color }]}>
                {currentStatusObj.label}
              </Text>
            </View>
          </View>
          <Text style={styles.cardSubtitle}>
            Tap a status to quickly update your availability in the student directory:
          </Text>

          <View style={styles.statusGrid}>
            {AVAILABILITY_STATUSES.map((status) => {
              const isActive = availabilityStatus === status.id;
              return (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.statusPill,
                    isActive && { borderColor: status.color, backgroundColor: status.bgColor },
                  ]}
                  onPress={() => setAvailabilityStatus(status.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={status.icon}
                    size={16}
                    color={isActive ? status.color : colors.textSecondary}
                    style={{ marginRight: 6 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.statusPillLabel,
                        isActive && { color: status.color, fontWeight: '700' },
                      ]}
                    >
                      {status.label}
                    </Text>
                    <Text style={styles.statusPillSub}>{status.sub}</Text>
                  </View>
                  {isActive ? (
                    <Ionicons name="checkmark-circle" size={18} color={status.color} />
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Emergency Crisis Toggle */}
          <View style={styles.emergencyRow}>
            <View style={styles.emergencyIconWrap}>
              <Ionicons name="call-outline" size={18} color="#C0392B" />
            </View>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.emergencyTitle}>Emergency Crisis Coverage</Text>
              <Text style={styles.emergencySub}>Forward 24/7 urgent suicide & safety calls to officer hotline</Text>
            </View>
            <Switch
              value={emergencyAvailable}
              onValueChange={setEmergencyAvailable}
              trackColor={{ false: '#E5E7EB', true: '#FCA5A5' }}
              thumbColor={emergencyAvailable ? '#DC2626' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* ---------- Card 2: Schedule Presets (Changing List) ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Working Schedule Changing List</Text>
          </View>
          <Text style={styles.cardSubtitle}>
            Select a schedule template to quickly apply pre-configured hours and working days:
          </Text>

          <View style={styles.templateList}>
            {SCHEDULE_TEMPLATES.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <TouchableOpacity
                  key={tpl.id}
                  style={[styles.templateCard, isSelected && styles.templateCardSelected]}
                  onPress={() => handleSelectTemplate(tpl)}
                  activeOpacity={0.7}
                >
                  <View style={styles.templateTopRow}>
                    <View
                      style={[
                        styles.templateIconWrap,
                        isSelected && { backgroundColor: colors.primary },
                      ]}
                    >
                      <Ionicons
                        name={tpl.icon}
                        size={18}
                        color={isSelected ? '#FFFFFF' : colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.templateTitle, isSelected && styles.templateTitleSelected]}>
                          {tpl.title}
                        </Text>
                        <View style={styles.templateBadge}>
                          <Text style={styles.templateBadgeText}>{tpl.badge}</Text>
                        </View>
                      </View>
                      <Text style={styles.templateDesc}>{tpl.description}</Text>
                    </View>
                  </View>

                  <View style={styles.templateMetaRow}>
                    <View style={styles.templateMetaItem}>
                      <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                      <Text style={styles.templateMetaText}>{tpl.defaultHours}</Text>
                    </View>
                    <View style={styles.templateMetaItem}>
                      <Ionicons name="business-outline" size={13} color={colors.textSecondary} />
                      <Text style={styles.templateMetaText}>{tpl.defaultMode}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ---------- Card 3: Detailed Schedule Settings ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="options-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Schedule Details & Customization</Text>
          </View>

          {/* Schedule Title */}
          <Text style={styles.fieldLabel}>Schedule Title</Text>
          <TextInput
            style={styles.input}
            value={workingSchedule}
            onChangeText={setWorkingSchedule}
            placeholder="e.g. Full-time On Campus"
            placeholderTextColor={colors.textMuted}
          />

          {/* Office Hours */}
          <Text style={styles.fieldLabel}>Daily Office Hours</Text>
          <TextInput
            style={styles.input}
            value={officeHours}
            onChangeText={setOfficeHours}
            placeholder="e.g. Monday – Friday, 8:30 AM – 4:30 PM"
            placeholderTextColor={colors.textMuted}
          />

          {/* Campus Location */}
          <Text style={styles.fieldLabel}>Campus Office Room / Desk</Text>
          <TextInput
            style={styles.input}
            value={officeLocation}
            onChangeText={setOfficeLocation}
            placeholder="e.g. Main Welfare Office, Block C, Room 04"
            placeholderTextColor={colors.textMuted}
          />

          {/* Working Days Multi-Select */}
          <Text style={styles.fieldLabel}>Active Working Days</Text>
          <View style={styles.daysRow}>
            {ALL_DAYS.map((day) => {
              const active = workingDays.includes(day);
              const shortDay = day.substring(0, 3);
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                  onPress={() => handleToggleDay(day)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayChipText, active && styles.dayChipTextActive]}>
                    {shortDay}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Consultation Mode */}
          <Text style={styles.fieldLabel}>Consultation Mode</Text>
          <View style={styles.modeRow}>
            {CONSULTATION_MODES.map((mode) => {
              const active = consultationMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[styles.modeChip, active && styles.modeChipActive]}
                  onPress={() => setConsultationMode(mode)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modeChipText, active && styles.modeChipTextActive]}>
                    {mode}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Availability Note */}
          <Text style={styles.fieldLabel}>Message / Instructions for Students</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={availabilityNote}
            onChangeText={setAvailabilityNote}
            placeholder="e.g. Walk-ins welcome in the morning; pre-book appointments via UWell for afternoon consultations."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* ---------- Card 4: Live Student Preview Card ---------- */}
        <View style={styles.cardPreview}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="eye-outline" size={18} color="#0D9488" style={{ marginRight: 6 }} />
            <Text style={[styles.cardTitle, { color: '#0F766E' }]}>
              Student View: Live Availability Preview
            </Text>
          </View>
          <Text style={styles.previewSubtitle}>
            This is how your current working schedule and availability is displayed to students:
          </Text>

          <View style={styles.previewBadgeCard}>
            <View style={styles.previewTop}>
              <View style={styles.previewAvatar}>
                <Text style={styles.previewAvatarText}>
                  {officer.avatarInitials || 'WO'}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.previewOfficerName}>
                  {officer.name || `${officer.firstName || ''} ${officer.lastName || ''}`.trim() || 'Welfare Officer'}
                </Text>
                <Text style={styles.previewOfficerRole}>
                  {officer.position || 'Welfare Officer'} • Staff ID: {officer.staffId || 'STF01'}
                </Text>
              </View>
              <View style={[styles.previewStatusChip, { backgroundColor: currentStatusObj.bgColor }]}>
                <View style={[styles.previewDot, { backgroundColor: currentStatusObj.color }]} />
                <Text style={[styles.previewStatusText, { color: currentStatusObj.color }]}>
                  {currentStatusObj.label}
                </Text>
              </View>
            </View>

            <View style={styles.previewDivider} />

            <View style={styles.previewGrid}>
              <View style={styles.previewGridItem}>
                <Ionicons name="calendar" size={14} color="#0D9488" style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.previewItemLabel}>Schedule</Text>
                  <Text style={styles.previewItemVal}>{workingSchedule}</Text>
                </View>
              </View>

              <View style={styles.previewGridItem}>
                <Ionicons name="time" size={14} color="#0D9488" style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.previewItemLabel}>Hours</Text>
                  <Text style={styles.previewItemVal}>{officeHours}</Text>
                </View>
              </View>

              <View style={styles.previewGridItem}>
                <Ionicons name="location" size={14} color="#0D9488" style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.previewItemLabel}>Office Location</Text>
                  <Text style={styles.previewItemVal}>{officeLocation || 'Campus Welfare Office'}</Text>
                </View>
              </View>

              <View style={styles.previewGridItem}>
                <Ionicons name="chatbubbles" size={14} color="#0D9488" style={{ marginRight: 6 }} />
                <View>
                  <Text style={styles.previewItemLabel}>Mode</Text>
                  <Text style={styles.previewItemVal}>{consultationMode}</Text>
                </View>
              </View>
            </View>

            <View style={styles.previewDaysRow}>
              <Text style={styles.previewDaysLabel}>Days Available: </Text>
              <Text style={styles.previewDaysVal}>
                {workingDays.map((d) => d.substring(0, 3)).join(', ')}
              </Text>
            </View>

            {emergencyAvailable ? (
              <View style={styles.previewEmergencyBadge}>
                <Ionicons name="shield-checkmark" size={13} color="#15803D" />
                <Text style={styles.previewEmergencyText}>
                  Emergency On-Call Duty Active for Student Crises
                </Text>
              </View>
            ) : null}

            {availabilityNote ? (
              <View style={styles.previewNoteBox}>
                <Text style={styles.previewNoteText}>"{availabilityNote}"</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ---------- Save Action Button ---------- */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
          ) : (
            <Ionicons name="checkmark-done" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          )}
          <Text style={styles.saveBtnText}>
            {saving ? 'Saving to Database...' : 'Save Schedule & Availability'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: typography.fontSize.md + 1,
    fontWeight: '800',
    color: colors.text,
  },
  headerSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.softCoral,
  },

  scrollContent: {
    padding: spacing.md,
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: typography.fontSize.sm + 1,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  cardSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginBottom: spacing.sm + 4,
    lineHeight: 18,
  },

  // Status Indicator
  statusIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  statusIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Status Grid
  statusGrid: {
    gap: 8,
    marginBottom: spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#FAFAFA',
  },
  statusPillLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.text,
  },
  statusPillSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Emergency row
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: spacing.sm,
  },
  emergencyIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  emergencyTitle: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: '700',
    color: '#991B1B',
  },
  emergencySub: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 2,
  },

  // Template List
  templateList: {
    gap: 10,
  },
  templateCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#FCFCFC',
  },
  templateCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.softCoral,
  },
  templateTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  templateIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3E8E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  templateTitleSelected: {
    color: colors.primaryDark,
  },
  templateBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#EBE5DF',
  },
  templateBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textDark,
  },
  templateDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
  templateMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  templateMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  templateMetaText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Form Fields
  fieldLabel: {
    fontSize: typography.fontSize.xs + 1,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FBFBFB',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  // Days chips
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FAFAFA',
  },
  dayChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  dayChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dayChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Mode Chips
  modeRow: {
    gap: 6,
  },
  modeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FAFAFA',
  },
  modeChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.softCoral,
  },
  modeChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modeChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },

  // Preview Card
  cardPreview: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: '#99F6E4',
  },
  previewSubtitle: {
    fontSize: typography.fontSize.xs,
    color: '#0F766E',
    marginBottom: spacing.sm,
  },
  previewBadgeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  previewTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  previewOfficerName: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
  previewOfficerRole: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  previewStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  previewStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  previewGrid: {
    gap: 8,
  },
  previewGridItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewItemLabel: {
    fontSize: 10,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  previewItemVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  previewDaysRow: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  previewDaysLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },
  previewDaysVal: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  previewEmergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  previewEmergencyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  previewNoteBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0D9488',
  },
  previewNoteText: {
    fontSize: 11,
    color: '#475569',
    fontStyle: 'italic',
  },

  // Save Button
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: typography.fontSize.md,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
