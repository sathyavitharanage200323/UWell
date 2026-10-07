import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';
import { counselorService } from '../../services/counselorService';

const { width } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────
const DAYS_LIST  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAYS_SHORT = ['MON',    'TUE',     'WED',       'THU',      'FRI',     'SAT',      'SUN'];

// All possible hourly slots shown in the "Active Hourly Slots" section
const ALL_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM',
];

// ─── Day Row Component ────────────────────────────────────────────────────
const DayRow = ({ item, shortName, onToggle, onEdit }) => {
  const isActive = item.active;
  return (
    <View style={[styles.dayRow, !isActive && styles.dayRowInactive]}>
      {/* Day badge */}
      <View style={[styles.dayBadge, !isActive && styles.dayBadgeInactive]}>
        <Text style={[styles.dayBadgeText, !isActive && styles.dayBadgeTextInactive]}>
          {shortName}
        </Text>
      </View>

      {/* Time / unavailable */}
      <TouchableOpacity
        style={styles.dayTimeRow}
        onPress={() => isActive && onEdit(item)}
        activeOpacity={isActive ? 0.7 : 1}
      >
        {isActive ? (
          <>
            <Feather name="clock" size={14} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.dayTimeText}>
              {item.startTime} - {item.endTime}
            </Text>
          </>
        ) : (
          <>
            <Feather name="slash" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
            <Text style={styles.dayUnavailText}>Unavailable</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Status label */}
      <View style={[styles.statusLabel, isActive ? styles.statusLabelActive : styles.statusLabelInactive]}>
        <Text style={[styles.statusLabelText, isActive ? styles.statusLabelTextActive : styles.statusLabelTextInactive]}>
          {isActive ? 'Available' : 'Unavailable'}
        </Text>
      </View>

      {/* Toggle */}
      <Switch
        value={isActive}
        onValueChange={() => onToggle(item.id, item.active)}
        trackColor={{ false: '#D8D0CB', true: 'rgba(232,131,107,0.35)' }}
        thumbColor={isActive ? colors.primary : '#F0EBE6'}
        ios_backgroundColor="#D8D0CB"
        style={{ marginLeft: 8 }}
      />
    </View>
  );
};

// ─── Slot Chip Component ─────────────────────────────────────────────────
const SlotChip = ({ time, active, onPress }) => (
  <TouchableOpacity
    style={[styles.slotChip, active && styles.slotChipActive]}
    onPress={onPress}
    activeOpacity={0.75}
    accessibilityLabel={`${time} slot ${active ? 'selected' : 'unselected'}`}
  >
    <View style={[styles.slotDot, active && styles.slotDotActive]}>
      {active && <Feather name="check" size={9} color={colors.white} />}
    </View>
    <Text style={[styles.slotText, active && styles.slotTextActive]}>{time}</Text>
  </TouchableOpacity>
);

// ─── Main Screen ─────────────────────────────────────────────────────────
const AvailabilityScreen = ({ navigation }) => {
  const [schedule, setSchedule]         = useState([]);
  const [activeSlots, setActiveSlots]   = useState(['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM']);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem]   = useState(null);
  const [startTime, setStartTime]       = useState('09:00 AM');
  const [endTime, setEndTime]           = useState('05:00 PM');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadAvailability();
    Animated.timing(fadeAnim, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, []);

  const loadAvailability = async () => {
    const data = await counselorService.getAvailability();
    // Ensure all 5 weekdays exist in the list
    const merged = DAYS_LIST.slice(0, 5).map(day => {
      const found = data.find(d => d.day === day);
      return found || { id: `av-${day}`, day, active: false, startTime: '09:00 AM', endTime: '05:00 PM', slots: [] };
    });
    setSchedule(merged);
  };

  const handleToggle = async (id, current) => {
    await counselorService.updateAvailability(id, { active: !current });
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, active: !current } : item));
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setModalVisible(true);
  };

  const handleSaveModal = async () => {
    if (!startTime || !endTime) {
      Alert.alert('Required', 'Please enter both start and end times.');
      return;
    }
    await counselorService.updateAvailability(editingItem.id, { startTime, endTime });
    setSchedule(prev => prev.map(item =>
      item.id === editingItem.id ? { ...item, startTime, endTime } : item
    ));
    setModalVisible(false);
  };

  const toggleSlot = (slot) => {
    setActiveSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = () => {
    Alert.alert('✅ Saved', 'Your active schedule has been updated successfully.');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />

      {/* ── Header ───────────────────────────────────────────── */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={22} color={colors.darkText} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bellBtn} accessibilityLabel="Notifications">
          <Feather name="bell" size={20} color={colors.primary} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Section ─────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Availability</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>CLINICIAN STAFF</Text>
            </View>
            <Text style={styles.heroSub}>
              Set your weekly availability{'\n'}for student appointments
            </Text>
          </View>

          {/* Decorative calendar illustration */}
          <View style={styles.heroIllus}>
            <View style={styles.illustCalendar}>
              <View style={styles.illustCalTop} />
              <View style={styles.illustCalBody}>
                <Feather name="check-circle" size={20} color={colors.primary} />
              </View>
            </View>
            <View style={styles.illustClock}>
              <Ionicons name="time-outline" size={22} color={colors.primary} />
            </View>
            {/* Leaf dots */}
            <View style={[styles.leafDot, { top: 8, right: 8 }]} />
            <View style={[styles.leafDot, { bottom: 12, left: 10, width: 8, height: 8 }]} />
          </View>
        </View>

        {/* ── Weekly Days Active ───────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconCircle}>
              <MaterialCommunityIcons name="calendar-clock" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>WEEKLY DAYS ACTIVE</Text>
              <Text style={styles.cardSub}>Set the days and time ranges you are available</Text>
            </View>
          </View>

          <View style={styles.daysList}>
            {schedule.map((item, i) => (
              <View key={item.id}>
                <DayRow
                  item={item}
                  shortName={DAYS_SHORT[i]}
                  onToggle={handleToggle}
                  onEdit={openEditModal}
                />
                {i < schedule.length - 1 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── Active Hourly Slots ──────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconCircle, { backgroundColor: '#FDF1EC' }]}>
              <Feather name="clock" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>ACTIVE HOURLY SLOTS</Text>
              <Text style={styles.cardSub}>Select the time slots you want to offer for appointments</Text>
            </View>
          </View>

          <View style={styles.slotsGrid}>
            {ALL_SLOTS.map(slot => (
              <SlotChip
                key={slot}
                time={slot}
                active={activeSlots.includes(slot)}
                onPress={() => toggleSlot(slot)}
              />
            ))}
          </View>
        </View>

        {/* ── Save Button ──────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
          accessibilityLabel="Save Active Schedule"
        >
          <MaterialCommunityIcons name="content-save-outline" size={20} color={colors.white} style={{ marginRight: 10 }} />
          <Text style={styles.saveBtnText}>Save Active Schedule</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </Animated.ScrollView>

      {/* ── Edit Time Modal ──────────────────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Handle bar */}
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>
              Edit Hours — {editingItem?.day}
            </Text>
            <Text style={styles.modalSub}>Tap a time to select from presets</Text>

            {/* Start time presets */}
            <Text style={styles.modalFieldLabel}>Start Time</Text>
            <View style={styles.presetRow}>
              {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.presetChip, startTime === t && styles.presetChipActive]}
                  onPress={() => setStartTime(t)}
                >
                  <Text style={[styles.presetChipText, startTime === t && styles.presetChipTextActive]}>
                    {t.replace(':00', '')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* End time presets */}
            <Text style={styles.modalFieldLabel}>End Time</Text>
            <View style={styles.presetRow}>
              {['12:00 PM', '01:00 PM', '03:00 PM', '05:00 PM'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.presetChip, endTime === t && styles.presetChipActive]}
                  onPress={() => setEndTime(t)}
                >
                  <Text style={[styles.presetChipText, endTime === t && styles.presetChipTextActive]}>
                    {t.replace(':00', '')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Summary */}
            <View style={styles.modalSummary}>
              <Feather name="clock" size={14} color={colors.primary} />
              <Text style={styles.modalSummaryText}>
                {'  '}{startTime}  →  {endTime}
              </Text>
            </View>

            <View style={styles.modalBtnsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveModal}
              >
                <Text style={styles.modalSaveText}>Save Hours</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // ── Header bar ──────────────────────────────────────────────
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.creamBackground,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  // ── Hero ─────────────────────────────────────────────────────
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: 4,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.darkText,
    lineHeight: 34,
    marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.softCoral,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  heroSub: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  heroIllus: {
    width: 110,
    height: 110,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustCalendar: {
    width: 72,
    height: 78,
    borderRadius: 14,
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  illustCalTop: {
    height: 18,
    backgroundColor: colors.primary,
  },
  illustCalBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustClock: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leafDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(80,200,120,0.35)',
  },

  // ── Cards ────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.md,
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.darkText,
    letterSpacing: 0.5,
  },
  cardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // ── Day rows ─────────────────────────────────────────────────
  daysList: {
    gap: 0,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 0,
  },
  dayRowInactive: {
    opacity: 0.7,
  },
  dayBadge: {
    width: 52,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  dayBadgeInactive: {
    backgroundColor: '#F0EBE6',
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  dayBadgeTextInactive: {
    color: colors.textSecondary,
  },
  dayTimeRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayTimeText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.darkText,
  },
  dayUnavailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statusLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 4,
    flexShrink: 0,
  },
  statusLabelActive: {
    backgroundColor: colors.statusGreenBg,
  },
  statusLabelInactive: {
    backgroundColor: '#F0EBE6',
  },
  statusLabelText: {
    fontSize: 10,
    fontWeight: '600',
  },
  statusLabelTextActive: {
    color: colors.statusGreenText,
  },
  statusLabelTextInactive: {
    color: colors.textSecondary,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 64,
  },

  // ── Hourly slots ─────────────────────────────────────────────
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  slotChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.softCoral,
  },
  slotDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  slotDotActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  slotTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  // ── Save button ──────────────────────────────────────────────
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Edit modal ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  modalFieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  presetChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.creamBackground,
  },
  presetChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.softCoral,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  presetChipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  modalSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    borderRadius: 12,
    padding: 12,
    marginBottom: spacing.md,
  },
  modalSummaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  modalBtnsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.creamBackground,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modalSaveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});

export default AvailabilityScreen;
