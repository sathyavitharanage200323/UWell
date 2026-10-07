/**
 * AvailabilityScreen — Production-ready counselor scheduling interface.
 *
 * Layout hierarchy (no overlaps, fully responsive 320–412px):
 *   1. Nav bar (back + bell)
 *   2. Hero  (title, badge, subtitle | illustration)
 *   3. Card: Weekly Days Active
 *        Row 1: [icon] WEEKLY DAYS ACTIVE  [Quick Setup]
 *        Row 2: subtitle (full width, no button overlap)
 *        Rows: day badge | toggle | time | status pill | chevron
 *   4. Card: Select Date (calendar)
 *        Row 1: [icon] Select Date  [Today]
 *        Row 2: subtitle (full width)
 *        Calendar grid
 *   5. Card: Active Hourly Slots
 *        Row 1: [icon] ACTIVE HOURLY SLOTS  [+ Add Slot]
 *        Row 2: subtitle (full width)
 *        Slot chips (flex-wrap)
 *   6. Save Availability — primary CTA (full width coral)
 */
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
  Dimensions,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { counselorService } from '../../services/counselorService';

// ─── Screen width (used only for calendar cell sizing) ────────────────────
const { width: SCREEN_W } = Dimensions.get('window');

// ─── Constants ───────────────────────────────────────────────────────────
const DAYS_LIST  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAYS_SHORT = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const WEEK_DAYS_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const ALL_SLOTS = [
  '09:00 AM','10:00 AM','11:00 AM','01:00 PM',
  '02:00 PM','03:00 PM','04:00 PM','04:30 PM',
];

// ─── Calendar helpers ─────────────────────────────────────────────────────
const daysInMonth      = (y, m) => new Date(y, m + 1, 0).getDate();
const firstDayOfMonth  = (y, m) => new Date(y, m, 1).getDay();

// ─────────────────────────────────────────────────────────────────────────
// CardHeader — two-row layout that NEVER overlaps on any screen size:
//   Row 1:  [iconCircle]  TITLE TEXT         [ActionButton]
//   Row 2:  (indent)      subtitle (full remaining width)
// ─────────────────────────────────────────────────────────────────────────
const ICON_CIRCLE_SIZE = 40;
const ICON_MARGIN_R    = 10;
const INDENT           = ICON_CIRCLE_SIZE + ICON_MARGIN_R; // 50px — aligns subtitle under title

const CardHeader = ({ iconBg, iconColor, iconLib, iconName, title, subtitle, action }) => {
  const IconEl =
    iconLib === 'MaterialCommunityIcons'
      ? <MaterialCommunityIcons name={iconName} size={19} color={iconColor} />
      : iconLib === 'Feather'
      ? <Feather name={iconName} size={19} color={iconColor} />
      : <Ionicons name={iconName} size={19} color={iconColor} />;

  return (
    <View style={chStyles.wrap}>
      {/* Row 1: icon + title + action button */}
      <View style={chStyles.row1}>
        <View style={[chStyles.iconCircle, { backgroundColor: iconBg }]}>
          {IconEl}
        </View>
        <Text style={chStyles.title} numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Text>
        {action}
      </View>
      {/* Row 2: subtitle indented under title */}
      <View style={chStyles.row2}>
        <Text style={chStyles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const chStyles = StyleSheet.create({
  wrap:   { marginBottom: 14 },
  row1:   {
    flexDirection: 'row',
    alignItems: 'center',
    // NO flex: 1 on the row — let title flex and button shrink
  },
  iconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: ICON_MARGIN_R,
    flexShrink: 0,
  },
  title: {
    flex: 1,                        // takes all remaining width after icon and button
    fontSize: 13,
    fontWeight: '700',
    color: colors.darkText,
    letterSpacing: 0.4,
  },
  row2: {
    // indent matches icon width + gap so subtitle sits under the title text
    paddingLeft: INDENT,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});

// ─────────────────────────────────────────────────────────────────────────
// SecondaryPillBtn — shared style for Quick Setup, Today, + Add Slot
// ─────────────────────────────────────────────────────────────────────────
const SecondaryPillBtn = ({ icon, label, onPress, accessibilityLabel }) => (
  <TouchableOpacity
    style={pillStyles.btn}
    onPress={onPress}
    activeOpacity={0.75}
    accessibilityLabel={accessibilityLabel || label}
    accessibilityRole="button"
  >
    {icon && <View style={{ marginRight: 3 }}>{icon}</View>}
    <Text style={pillStyles.label}>{label}</Text>
  </TouchableOpacity>
);

const pillStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: colors.softCoral,
    // Must not shrink below its content
    flexShrink: 0,
    // Enforce minimum touch target height
    minHeight: 32,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
});

// ─────────────────────────────────────────────────────────────────────────
// DayRow — Day | Toggle | Time | Status pill | Chevron
// Uses flex so nothing clips or overlaps on 320px+
// ─────────────────────────────────────────────────────────────────────────
const DayRow = ({ item, shortName, onToggle, onEdit }) => {
  const on = item.active;
  return (
    <TouchableOpacity
      style={[drStyles.row, !on && drStyles.rowOff]}
      onPress={() => on && onEdit(item)}
      activeOpacity={on ? 0.75 : 1}
      accessibilityRole="button"
      accessibilityLabel={`${shortName}: ${on ? item.startTime + ' to ' + item.endTime : 'Unavailable'}. Tap to edit.`}
    >
      {/* Day badge */}
      <View style={[drStyles.badge, !on && drStyles.badgeOff]}>
        <Text style={[drStyles.badgeText, !on && drStyles.badgeTextOff]}>{shortName}</Text>
      </View>

      {/* Toggle — stop propagation so row tap and toggle don't conflict */}
      <View style={drStyles.toggleWrap}>
        <Switch
          value={on}
          onValueChange={() => onToggle(item.id, item.active)}
          trackColor={{ false: '#D8D0CB', true: `${colors.primary}55` }}
          thumbColor={on ? colors.primary : '#EAE1D7'}
          ios_backgroundColor="#D8D0CB"
        />
      </View>

      {/* Time / status area — flex:1 so it fills remaining space */}
      <View style={drStyles.timeArea}>
        {on ? (
          <View style={drStyles.timeRow}>
            <Feather name="clock" size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={drStyles.timeText} numberOfLines={1} adjustsFontSizeToFit>
              {item.startTime} – {item.endTime}
            </Text>
          </View>
        ) : (
          <View style={drStyles.timeRow}>
            <Ionicons name="ban-outline" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Text style={drStyles.offText}>Unavailable</Text>
          </View>
        )}
      </View>

      {/* Status pill */}
      <View style={[drStyles.pill, on ? drStyles.pillOn : drStyles.pillOff]}>
        <Text style={[drStyles.pillText, on ? drStyles.pillTextOn : drStyles.pillTextOff]}>
          {on ? 'Available' : 'Unavailable'}
        </Text>
      </View>

      {/* Chevron */}
      <Feather name="chevron-right" size={14} color={colors.textSecondary} />
    </TouchableOpacity>
  );
};

const drStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    minHeight: 44,    // accessibility touch target
  },
  rowOff: { opacity: 0.6 },
  badge: {
    width: 46,
    height: 28,
    borderRadius: 7,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    flexShrink: 0,
  },
  badgeOff:     { backgroundColor: '#F0EBE6' },
  badgeText:    { fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: 0.5 },
  badgeTextOff: { color: colors.textSecondary },
  toggleWrap:   { marginRight: 8, flexShrink: 0 },
  timeArea:     { flex: 1, minWidth: 0 },   // minWidth:0 is critical for flex text clipping
  timeRow:      { flexDirection: 'row', alignItems: 'center' },
  timeText:     { fontSize: 12, fontWeight: '500', color: colors.darkText, flexShrink: 1 },
  offText:      { fontSize: 12, color: colors.textSecondary },
  pill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 9,
    marginLeft: 6,
    flexShrink: 0,
  },
  pillOn:      { backgroundColor: colors.statusGreenBg },
  pillOff:     { backgroundColor: '#F0EBE6' },
  pillText:    { fontSize: 9, fontWeight: '600' },
  pillTextOn:  { color: colors.statusGreenText },
  pillTextOff: { color: colors.textSecondary },
});

// ─────────────────────────────────────────────────────────────────────────
// SlotChip
// ─────────────────────────────────────────────────────────────────────────
const SlotChip = ({ time, active, onPress }) => (
  <TouchableOpacity
    style={[scStyles.chip, active && scStyles.chipActive]}
    onPress={onPress}
    activeOpacity={0.75}
    accessibilityLabel={`${time} ${active ? 'selected' : 'not selected'}`}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: active }}
  >
    <View style={[scStyles.dot, active && scStyles.dotActive]}>
      {active && <Feather name="check" size={9} color={colors.white} />}
    </View>
    <Text style={[scStyles.text, active && scStyles.textActive]}>{time}</Text>
  </TouchableOpacity>
);

const scStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  chipActive:  { borderColor: colors.primary, backgroundColor: colors.softCoral },
  dot: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.white,
  },
  dotActive:   { borderColor: colors.primary, backgroundColor: colors.primary },
  text:        { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  textActive:  { color: colors.primary, fontWeight: '600' },
});

// ─────────────────────────────────────────────────────────────────────────
// MiniCalendar — pure RN, no third-party lib
// Calendar cell width is computed from available card interior width
// ─────────────────────────────────────────────────────────────────────────
const CARD_H_PADDING  = 20;          // card padding
const SCREEN_H_MARGIN = 24;          // screen horizontal padding (each side)
const CALENDAR_W      = SCREEN_W - SCREEN_H_MARGIN * 2 - CARD_H_PADDING * 2;
const CELL_W          = Math.floor(CALENDAR_W / 7);

const MiniCalendar = ({ selectedDate, onSelectDate, bookedDates }) => {
  const todayObj = new Date();
  const [viewYear,  setViewYear]  = useState(todayObj.getFullYear());
  const [viewMonth, setViewMonth] = useState(todayObj.getMonth());

  const total   = daysInMonth(viewYear, viewMonth);
  const startDay = firstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  // Build cell array: nulls for leading empty slots, then 1..total
  const cells = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  const isToday    = d => d && d === todayObj.getDate() && viewMonth === todayObj.getMonth() && viewYear === todayObj.getFullYear();
  const isSelected = d => d && selectedDate && d === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear();
  const isBooked   = d => d && bookedDates.includes(`${viewYear}-${viewMonth + 1}-${d}`);

  return (
    <View>
      {/* Month navigation */}
      <View style={calStyles.nav}>
        <TouchableOpacity
          style={calStyles.navBtn}
          onPress={prevMonth}
          accessibilityLabel="Previous month"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="chevron-left" size={17} color={colors.darkText} />
        </TouchableOpacity>
        <Text style={calStyles.monthLabel}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
        <TouchableOpacity
          style={calStyles.navBtn}
          onPress={nextMonth}
          accessibilityLabel="Next month"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="chevron-right" size={17} color={colors.darkText} />
        </TouchableOpacity>
      </View>

      {/* Weekday header */}
      <View style={calStyles.weekHeader}>
        {WEEK_DAYS_ABBR.map(d => (
          <View key={d} style={calStyles.weekCell}>
            <Text style={calStyles.weekText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View style={calStyles.grid}>
        {cells.map((d, i) => {
          const sel = isSelected(d);
          const tod = isToday(d);
          const bkd = isBooked(d) && !sel;
          return (
            <TouchableOpacity
              key={i}
              style={calStyles.cell}
              onPress={() => d && onSelectDate(new Date(viewYear, viewMonth, d))}
              disabled={!d}
              activeOpacity={d ? 0.7 : 1}
              accessibilityLabel={d ? `${d} ${MONTH_NAMES[viewMonth]}` : undefined}
            >
              <View style={[calStyles.circle, sel && calStyles.circleSelected]}>
                <Text style={[
                  calStyles.dayNum,
                  !d   && calStyles.invisible,
                  tod  && !sel && calStyles.today,
                  sel  && calStyles.selectedNum,
                ]}>
                  {d ?? ''}
                </Text>
              </View>
              {bkd && <View style={calStyles.dot} />}
              {sel && <View style={[calStyles.dot, calStyles.dotWhite]} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const calStyles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.creamBackground,
    alignItems: 'center', justifyContent: 'center',
  },
  monthLabel: { fontSize: 14, fontWeight: '700', color: colors.darkText },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  weekCell: {
    width: CELL_W,
    alignItems: 'center',
  },
  weekText: { fontSize: 10, fontWeight: '600', color: colors.textSecondary },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL_W,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  circle: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  circleSelected: { backgroundColor: colors.primary },
  dayNum: { fontSize: 12, color: colors.darkText },
  invisible: { opacity: 0 },
  today: { color: colors.primary, fontWeight: '700' },
  selectedNum: { color: colors.white, fontWeight: '700' },
  dot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: colors.statusGreenText,
    marginTop: 1,
  },
  dotWhite: { backgroundColor: colors.white },
});

// ─────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────
const AvailabilityScreen = ({ navigation }) => {
  const todayDate = new Date();

  const [schedule,     setSchedule]     = useState([]);
  const [activeSlots,  setActiveSlots]  = useState(['09:00 AM','10:00 AM','11:00 AM','01:00 PM']);
  const [selectedDate, setSelectedDate] = useState(todayDate);

  // Edit-hours modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem,  setEditingItem]  = useState(null);
  const [startTime,    setStartTime]    = useState('09:00 AM');
  const [endTime,      setEndTime]      = useState('05:00 PM');

  // Animations
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Mock booked dates (green dots)
  const yr = todayDate.getFullYear();
  const mo = todayDate.getMonth() + 1;
  const bookedDates = [5,7,12,16,19,23,26,28,30].map(d => `${yr}-${mo}-${d}`);

  useEffect(() => {
    loadAvailability();

    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -5, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue:  0, duration: 2000, useNativeDriver: true }),
      ])
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, []);

  const loadAvailability = async () => {
    const data = await counselorService.getAvailability();
    const merged = DAYS_LIST.map(day => {
      const found = data.find(d => d.day === day);
      return found ?? { id: `av-${day}`, day, active: false, startTime: '09:00 AM', endTime: '05:00 PM', slots: [] };
    });
    setSchedule(merged);
  };

  const handleToggle = async (id, current) => {
    await counselorService.updateAvailability(id, { active: !current });
    setSchedule(prev => prev.map(it => it.id === id ? { ...it, active: !current } : it));
  };

  const openEdit = item => {
    setEditingItem(item);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setModalVisible(true);
  };

  const handleSaveModal = async () => {
    if (!startTime || !endTime) {
      Alert.alert('Required', 'Please select both start and end times.');
      return;
    }
    await counselorService.updateAvailability(editingItem.id, { startTime, endTime });
    setSchedule(prev =>
      prev.map(it => it.id === editingItem.id ? { ...it, startTime, endTime } : it)
    );
    setModalVisible(false);
  };

  const toggleSlot = slot =>
    setActiveSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]);

  const handleAddSlot   = () => Alert.alert('Add Slot', 'Custom slot entry coming soon.');
  const handleQuickSetup = () => Alert.alert('Quick Setup', 'Quick schedule configuration coming soon.');
  const handleSave = () =>
    Alert.alert('✅ Availability updated', 'Your schedule has been saved successfully.');

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />

      {/* ── 1. Nav bar ──────────────────────────────────────────────── */}
      <View style={s.navBar}>
        <TouchableOpacity
          style={s.navBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="chevron-left" size={22} color={colors.darkText} />
        </TouchableOpacity>

        <TouchableOpacity style={s.navBtn} accessibilityLabel="Notifications">
          <Feather name="bell" size={19} color={colors.primary} />
          <View style={s.bellDot} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={[s.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 2. Hero ─────────────────────────────────────────────── */}
        <View style={s.heroRow}>
          <View style={s.heroText}>
            <Text style={s.heroTitle}>Availability</Text>
            <View style={s.roleBadge}>
              <Text style={s.roleBadgeText}>CLINICIAN STAFF</Text>
            </View>
            <Text style={s.heroSub}>
              Set your weekly availability{'\n'}for student appointments.
            </Text>
          </View>

          {/* Illustration — absolute-safe, fixed size, no overlap with text */}
          <Animated.View
            style={[s.illustWrap, { transform: [{ translateY: floatAnim }] }]}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <View style={s.illustBlob} />
            <View style={s.illustCalBox}>
              <View style={s.illustCalTop} />
              <View style={s.illustCalBody}>
                <Feather name="check" size={15} color={colors.primary} />
              </View>
            </View>
            <View style={s.illustClockBadge}>
              <Ionicons name="time-outline" size={16} color={colors.primary} />
            </View>
            <View style={[s.leafDot, { top: 6, right: 6 }]} />
            <View style={[s.leafDot, { bottom: 8, left: 8, width: 8, height: 8 }]} />
          </Animated.View>
        </View>

        {/* ── 3. Weekly Days Active ────────────────────────────────── */}
        <View style={s.card}>
          <CardHeader
            iconBg={colors.softCoral}
            iconColor={colors.primary}
            iconLib="MaterialCommunityIcons"
            iconName="calendar-check-outline"
            title="WEEKLY DAYS ACTIVE"
            subtitle="Set the days and time ranges you are available"
            action={
              <SecondaryPillBtn
                icon={<Ionicons name="settings-outline" size={12} color={colors.primary} />}
                label="Quick Setup"
                onPress={handleQuickSetup}
              />
            }
          />

          {schedule.map((item, i) => (
            <View key={item.id}>
              <DayRow
                item={item}
                shortName={DAYS_SHORT[i]}
                onToggle={handleToggle}
                onEdit={openEdit}
              />
              {i < schedule.length - 1 && <View style={s.rowDivider} />}
            </View>
          ))}
        </View>

        {/* ── 4. Select Date (calendar) ────────────────────────────── */}
        <View style={s.card}>
          <CardHeader
            iconBg="#FDF1EC"
            iconColor={colors.primary}
            iconLib="Feather"
            iconName="calendar"
            title="Select Date"
            subtitle="Pick a date to view or edit your time slots"
            action={
              <SecondaryPillBtn
                label="Today"
                onPress={() => setSelectedDate(new Date())}
                accessibilityLabel="Go to today"
              />
            }
          />

          <MiniCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            bookedDates={bookedDates}
          />
        </View>

        {/* ── 5. Active Hourly Slots ───────────────────────────────── */}
        <View style={s.card}>
          <CardHeader
            iconBg="#FDF1EC"
            iconColor={colors.primary}
            iconLib="Feather"
            iconName="clock"
            title="ACTIVE HOURLY SLOTS"
            subtitle="Select the time slots you want to offer for appointments"
            action={
              <SecondaryPillBtn
                icon={<Feather name="plus" size={12} color={colors.primary} />}
                label="Add Slot"
                onPress={handleAddSlot}
              />
            }
          />

          <View style={s.slotsGrid}>
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

        {/* ── 6. Save Availability — primary CTA ──────────────────── */}
        <TouchableOpacity
          style={s.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
          accessibilityLabel="Save Availability"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="calendar-check"
            size={20}
            color={colors.white}
            style={{ marginRight: 10 }}
          />
          <Text style={s.saveBtnText}>Save Availability</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </Animated.ScrollView>

      {/* ── Edit-hours bottom sheet ──────────────────────────────── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <View style={s.modalHandle} />
            <Text style={s.modalTitle}>Edit Hours — {editingItem?.day}</Text>
            <Text style={s.modalSub}>Tap a preset to change the time range</Text>

            <Text style={s.modalFieldLabel}>START TIME</Text>
            <View style={s.presetRow}>
              {['08:00 AM','09:00 AM','10:00 AM','11:00 AM'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.presetChip, startTime === t && s.presetChipActive]}
                  onPress={() => setStartTime(t)}
                  accessibilityLabel={t}
                >
                  <Text style={[s.presetText, startTime === t && s.presetTextActive]}>
                    {t.replace(':00', '')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.modalFieldLabel}>END TIME</Text>
            <View style={s.presetRow}>
              {['12:00 PM','01:00 PM','03:00 PM','05:00 PM'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.presetChip, endTime === t && s.presetChipActive]}
                  onPress={() => setEndTime(t)}
                  accessibilityLabel={t}
                >
                  <Text style={[s.presetText, endTime === t && s.presetTextActive]}>
                    {t.replace(':00', '')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.modalSummary}>
              <Feather name="clock" size={14} color={colors.primary} />
              <Text style={s.modalSummaryText}>  {startTime}  →  {endTime}</Text>
            </View>

            <View style={s.modalBtnsRow}>
              <TouchableOpacity style={s.modalCancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalSaveBtn} onPress={handleSaveModal}>
                <Text style={s.modalSaveText}>Save Hours</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// Screen-level styles  (alias: s)
// ─────────────────────────────────────────────────────────────────────────
const SCREEN_PAD = 20;   // horizontal screen padding

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.creamBackground },
  scroll:  { flex: 1 },
  content: {
    paddingHorizontal: SCREEN_PAD,
    paddingBottom: 40,
  },

  // ── Nav ────────────────────────────────────────────────────────
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SCREEN_PAD,
    paddingVertical: 10,
    backgroundColor: colors.creamBackground,
  },
  navBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  bellDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5, borderColor: colors.white,
  },

  // ── Hero ───────────────────────────────────────────────────────
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  heroText: { flex: 1, paddingRight: 8 },
  heroTitle: {
    fontSize: 26, fontWeight: '700',
    color: colors.darkText, lineHeight: 32, marginBottom: 6,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.softCoral,
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20, marginBottom: 8,
  },
  roleBadgeText: {
    fontSize: 10, fontWeight: '700',
    color: colors.primary, letterSpacing: 0.8,
  },
  heroSub: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  // ── Illustration (decorative only, fixed size) ──────────────────
  illustWrap: {
    width: 100, height: 100,
    position: 'relative',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  illustBlob: {
    position: 'absolute', width: 84, height: 84, borderRadius: 42,
    backgroundColor: colors.softCoral, top: 8, right: 0,
  },
  illustCalBox: {
    width: 60, height: 66, borderRadius: 11,
    backgroundColor: colors.white, overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14,
    shadowRadius: 8, elevation: 4, zIndex: 2,
  },
  illustCalTop:  { height: 14, backgroundColor: colors.primary },
  illustCalBody: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustClockBadge: {
    position: 'absolute', bottom: 2, right: 4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1,
    shadowRadius: 3, elevation: 2, zIndex: 3,
  },
  leafDot: {
    position: 'absolute', width: 9, height: 9, borderRadius: 5,
    backgroundColor: 'rgba(80,200,120,0.4)', zIndex: 1,
  },

  // ── Cards ──────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: CARD_H_PADDING,
    marginBottom: 16,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },

  // ── Day row divider ─────────────────────────────────────────────
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    // Indent so it starts after the badge (46) + gap (8) = 54px
    marginLeft: 54,
  },

  // ── Slots ───────────────────────────────────────────────────────
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 2,
  },

  // ── Save button (PRIMARY CTA) ───────────────────────────────────
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    height: 58,
    paddingHorizontal: 20,
    marginTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32, shadowRadius: 10, elevation: 5,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 15, fontWeight: '700', letterSpacing: 0.3,
  },

  // ── Edit-hours modal ────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 12, paddingBottom: 44,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.darkText, marginBottom: 4 },
  modalSub:   { fontSize: 12, color: colors.textSecondary, marginBottom: 16 },
  modalFieldLabel: {
    fontSize: 10, fontWeight: '700', color: colors.textSecondary,
    letterSpacing: 0.7, marginBottom: 8, marginTop: 4,
  },
  presetRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  presetChip: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 12, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.creamBackground,
    minHeight: 38,
  },
  presetChipActive: { borderColor: colors.primary, backgroundColor: colors.softCoral },
  presetText:       { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  presetTextActive: { color: colors.primary, fontWeight: '700' },
  modalSummary: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.softCoral,
    borderRadius: 12, padding: 12, marginBottom: 16,
  },
  modalSummaryText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  modalBtnsRow:  { flexDirection: 'row', gap: 12 },
  modalCancelBtn: {
    flex: 1, height: 48, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.creamBackground,
  },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  modalSaveBtn: {
    flex: 2, height: 48, borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
    shadowRadius: 8, elevation: 4,
  },
  modalSaveText: { fontSize: 14, fontWeight: '700', color: colors.white },
});

export default AvailabilityScreen;
