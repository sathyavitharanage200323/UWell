import React, { useState, useEffect } from 'react';
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
  Alert
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import { counselorService } from '../../services/counselorService';

const DAYS_LIST = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AvailabilityScreen = ({ navigation }) => {
  const [schedule, setSchedule] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State for Add / Edit
  const [editingId, setEditingId] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    const data = await counselorService.getAvailability();
    setSchedule(data);
  };

  const handleToggleDay = async (id, currentStatus) => {
    const updated = await counselorService.updateAvailability(id, { active: !currentStatus });
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !currentStatus } : item))
    );
  };

  const openAddModal = () => {
    setEditingId(null);
    setSelectedDay('Monday');
    setStartTime('09:00 AM');
    setEndTime('05:00 PM');
    setModalVisible(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setSelectedDay(item.day);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    setModalVisible(true);
  };

  const handleDeleteSlot = async (id) => {
    Alert.alert(
      'Delete Slot',
      'Are you sure you want to delete this availability slot?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await counselorService.deleteAvailability(id);
            loadAvailability();
          }
        }
      ]
    );
  };

  const handleSaveModal = async () => {
    if (!selectedDay || !startTime || !endTime) {
      Alert.alert('Validation Error', 'Day, Start Time, and End Time are required.');
      return;
    }

    if (editingId) {
      // Update existing
      await counselorService.updateAvailability(editingId, {
        day: selectedDay,
        startTime,
        endTime,
        slots: [startTime, endTime]
      });
    } else {
      // Create new
      await counselorService.createAvailability({
        day: selectedDay,
        startTime,
        endTime,
        slots: [startTime, endTime]
      });
    }

    setModalVisible(false);
    loadAvailability();
  };

  const handleSaveActiveSchedule = () => {
    Alert.alert('Success', 'Weekly active schedule updated and saved.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      
      {/* Header bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Availability</Text>
        <TouchableOpacity
          onPress={openAddModal}
          style={styles.addHeaderBtn}
          accessibilityLabel="Add new slot"
        >
          <Text style={styles.addHeaderBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subTitle}>WEEKLY DAY ACTIVE</Text>

        {schedule.map((item) => (
          <Card key={item.id} style={styles.dayCard}>
            <View style={styles.dayHeaderRow}>
              <View>
                <Text style={styles.dayNameText}>{item.day}</Text>
                <Text style={styles.hoursText}>
                  {item.active ? `${item.startTime} – ${item.endTime}` : 'Unavailable'}
                </Text>
              </View>
              <View style={styles.rightActionsRow}>
                <Switch
                  value={item.active}
                  onValueChange={() => handleToggleDay(item.id, item.active)}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={item.active ? colors.primary : colors.white}
                />
              </View>
            </View>

            {item.active && item.slots && item.slots.length > 0 && (
              <View style={styles.slotsWrapper}>
                <Text style={styles.slotsLabel}>AVAILABLE HOURLY SLOTS</Text>
                <View style={styles.chipsRow}>
                  {item.slots.map((slot, index) => (
                    <View key={index} style={styles.chip}>
                      <Text style={styles.chipText}>{slot}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.cardFooterActions}>
              <TouchableOpacity
                onPress={() => openEditModal(item)}
                style={styles.editBtn}
                accessibilityLabel={`Edit ${item.day} schedule`}
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteSlot(item.id)}
                style={styles.deleteBtn}
                accessibilityLabel={`Delete ${item.day} schedule`}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}

        <TouchableOpacity
          style={styles.saveScheduleBtn}
          onPress={handleSaveActiveSchedule}
          accessibilityLabel="Save Active Schedule"
        >
          <Text style={styles.saveScheduleBtnText}>Save Active Schedule</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add / Edit Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editingId ? 'Edit Availability Slot' : 'Add Availability Slot'}
            </Text>

            <Text style={styles.fieldLabel}>Day of Week</Text>
            <View style={styles.daySelectorRow}>
              {DAYS_LIST.slice(0, 5).map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.dayChip,
                    selectedDay === d && styles.dayChipActive
                  ]}
                  onPress={() => setSelectedDay(d)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      selectedDay === d && styles.dayChipTextActive
                    ]}
                  >
                    {d.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Start Time"
              placeholder="e.g. 09:00 AM"
              value={startTime}
              onChangeText={setStartTime}
            />

            <Input
              label="End Time"
              placeholder="e.g. 05:00 PM"
              value={endTime}
              onChangeText={setEndTime}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSaveBtn]}
                onPress={handleSaveModal}
              >
                <Text style={styles.saveText}>Save Slot</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.creamBackground
  },
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.creamBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backBtn: {
    padding: spacing.xs
  },
  backBtnText: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: 'bold'
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  addHeaderBtn: {
    backgroundColor: colors.softCoral,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8
  },
  addHeaderBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary
  },
  subTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.sm
  },
  dayCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderColor: colors.border
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dayNameText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  hoursText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2
  },
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  slotsWrapper: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  slotsLabel: {
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  chip: {
    backgroundColor: colors.softCoral,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    color: colors.darkText,
    fontWeight: typography.fontWeight.medium
  },
  cardFooterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    gap: spacing.md
  },
  editBtnText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold
  },
  deleteBtnText: {
    fontSize: typography.fontSize.xs,
    color: colors.statusRedText,
    fontWeight: typography.fontWeight.bold
  },
  saveScheduleBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: spacing.md
  },
  saveScheduleBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: spacing.lg
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    borderColor: colors.border,
    borderWidth: 1
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText,
    marginBottom: spacing.md,
    textAlign: 'center'
  },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },
  daySelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md
  },
  dayChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.creamBackground,
    borderWidth: 1,
    borderColor: colors.border
  },
  dayChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  dayChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.darkText
  },
  dayChipTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md
  },
  modalBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8
  },
  modalCancelBtn: {
    backgroundColor: colors.creamBackground
  },
  cancelText: {
    color: colors.darkText,
    fontWeight: typography.fontWeight.medium
  },
  modalSaveBtn: {
    backgroundColor: colors.primary
  },
  saveText: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold
  }
});

export default AvailabilityScreen;
