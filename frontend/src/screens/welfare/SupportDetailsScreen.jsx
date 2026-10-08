import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../../theme';

const STORAGE_PREFIX = '@uwell/support_dir_';

const SupportDetailsScreen = ({ route, navigation }) => {
  const { directory } = route.params || {};

  const [dirData, setDirData] = useState(directory || {});
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(directory || {});
  const [saving, setSaving] = useState(false);

  // Load custom persisted data if previously updated
  useEffect(() => {
    if (directory?.id) {
      loadSavedData();
    }
  }, [directory?.id]);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem(`${STORAGE_PREFIX}${directory.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setDirData(parsed);
        setDraft(parsed);
      } else {
        setDirData(directory);
        setDraft(directory);
      }
    } catch (e) {
      console.error('Error loading support directory data:', e);
    }
  };

  const handleStartEdit = () => {
    setDraft(JSON.parse(JSON.stringify(dirData)));
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = {
        ...dirData,
        ...draft,
        contact: {
          ...dirData.contact,
          ...draft.contact,
        },
      };

      await AsyncStorage.setItem(`${STORAGE_PREFIX}${directory.id}`, JSON.stringify(updated));
      setDirData(updated);
      setIsEditing(false);
      Alert.alert('Updated Successfully', `Information for "${updated.title}" has been saved.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    Alert.alert(
      'Reset Information',
      'Are you sure you want to restore the default university information for this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to Default',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(`${STORAGE_PREFIX}${directory.id}`);
              setDirData(directory);
              setDraft(directory);
              setIsEditing(false);
              Alert.alert('Reset', 'Default information restored.');
            } catch (e) {
              console.error(e);
            }
          },
        },
      ]
    );
  };

  const handleCall = (phone) => {
    if (!phone) return;
    const clean = phone.replace(/[^0-9+]/g, '');
    Linking.openURL(`tel:${clean}`).catch(() => {
      Alert.alert('Call', `Please dial: ${phone}`);
    });
  };

  const handleEmail = (email) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Email', `Send email to: ${email}`);
    });
  };

  if (!dirData?.title) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support Details</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isUrgent = dirData.urgent;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ---------- Top Navigation Bar ---------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{dirData.title}</Text>
        <TouchableOpacity
          onPress={handleStartEdit}
          style={styles.editBtn}
          accessibilityLabel="Edit Information"
        >
          <Feather name="edit-2" size={16} color={colors.primary} />
          <Text style={styles.editBtnText}>Edit Info</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ---------- Tag Banner & Officer Badge ---------- */}
        <View style={styles.topMetaRow}>
          <View style={[styles.tagBanner, isUrgent && styles.tagBannerUrgent]}>
            <Text style={[styles.tagText, isUrgent && styles.tagTextUrgent]}>{dirData.tag}</Text>
          </View>
          <View style={styles.officerBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#2D6A4F" />
            <Text style={styles.officerBadgeText}>Welfare Managed</Text>
          </View>
        </View>

        {/* ---------- Quick Contact Bar (Click to Call / Email) ---------- */}
        <View style={styles.quickContactBar}>
          <TouchableOpacity
            style={[styles.quickContactBtn, { backgroundColor: isUrgent ? '#FBE1DE' : '#E8F8EF' }]}
            onPress={() => handleCall(dirData.contact?.phone)}
          >
            <Ionicons name="call" size={18} color={isUrgent ? '#C0392B' : '#2D6A4F'} />
            <Text style={[styles.quickContactBtnText, { color: isUrgent ? '#C0392B' : '#2D6A4F' }]}>
              {isUrgent ? 'Call Hotline' : 'Call Desk'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickContactBtn, { backgroundColor: '#FDF1EC' }]}
            onPress={() => handleEmail(dirData.contact?.email)}
          >
            <Ionicons name="mail" size={18} color={colors.primary} />
            <Text style={[styles.quickContactBtnText, { color: colors.primary }]}>Send Email</Text>
          </TouchableOpacity>
        </View>

        {/* ---------- About Section ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>About This Service</Text>
          </View>
          <Text style={styles.bodyText}>{dirData.about}</Text>
        </View>

        {/* ---------- Services Offered ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="list-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Services & Support Programs</Text>
          </View>
          {dirData.servicesOffered?.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bullet, isUrgent && { backgroundColor: '#C0392B' }]} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* ---------- Contact Information Card ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="call-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Contact Details</Text>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>{isUrgent ? 'CRISIS HOTLINE' : 'PHONE NUMBER'}</Text>
            <TouchableOpacity onPress={() => handleCall(dirData.contact?.phone)}>
              <Text style={[styles.contactValue, { color: colors.primary, fontWeight: '700' }]}>
                {dirData.contact?.phone}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>OFFICIAL EMAIL</Text>
            <TouchableOpacity onPress={() => handleEmail(dirData.contact?.email)}>
              <Text style={[styles.contactValue, { color: colors.primary }]}>
                {dirData.contact?.email}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>OPERATING HOURS</Text>
            <Text style={styles.contactValue}>{dirData.contact?.hours}</Text>
          </View>

          {dirData.contact?.leadOfficer ? (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>DUTY OFFICER / LEAD</Text>
              <Text style={styles.contactValue}>{dirData.contact?.leadOfficer}</Text>
            </View>
          ) : null}
        </View>

        {/* ---------- Physical Location Card ---------- */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="location-outline" size={20} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.cardTitle}>Campus Location</Text>
          </View>
          <Text style={styles.bodyText}>{dirData.location}</Text>
        </View>

        {/* ---------- Edit Information Button ---------- */}
        <TouchableOpacity style={styles.updateButton} onPress={handleStartEdit} activeOpacity={0.85}>
          <Feather name="edit" size={18} color="#FFFFFF" />
          <Text style={styles.updateButtonText}>Update Directory Information</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ---------- Edit Information Modal ---------- */}
      <Modal visible={isEditing} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Update Information</Text>
            <TouchableOpacity onPress={handleSave} style={styles.modalSaveBtn} disabled={saving}>
              <Text style={styles.modalSaveText}>{saving ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalSub}>
                Update the official directory details for <Text style={{ fontWeight: '700' }}>{dirData.title}</Text>. Changes will be saved reliably for all officers and students.
              </Text>

              {/* Phone Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Phone / Hotline Number *</Text>
                <TextInput
                  style={styles.input}
                  value={draft.contact?.phone}
                  onChangeText={(v) => setDraft({ ...draft, contact: { ...draft.contact, phone: v } })}
                  placeholder="e.g. +1 (555) 019-2834"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Official Email Address *</Text>
                <TextInput
                  style={styles.input}
                  value={draft.contact?.email}
                  onChangeText={(v) => setDraft({ ...draft, contact: { ...draft.contact, email: v } })}
                  placeholder="e.g. support@university.edu"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Hours Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Operating Hours *</Text>
                <TextInput
                  style={styles.input}
                  value={draft.contact?.hours}
                  onChangeText={(v) => setDraft({ ...draft, contact: { ...draft.contact, hours: v } })}
                  placeholder="e.g. Mon – Fri, 8:30 AM – 5:00 PM"
                />
              </View>

              {/* Lead Officer Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duty Officer / Coordinator</Text>
                <TextInput
                  style={styles.input}
                  value={draft.contact?.leadOfficer}
                  onChangeText={(v) => setDraft({ ...draft, contact: { ...draft.contact, leadOfficer: v } })}
                  placeholder="e.g. Dr. Evelyn Martinez / On-duty team"
                />
              </View>

              {/* Location Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Campus Location / Room *</Text>
                <TextInput
                  style={styles.input}
                  value={draft.location}
                  onChangeText={(v) => setDraft({ ...draft, location: v })}
                  placeholder="e.g. Room 105, Student Services Complex"
                />
              </View>

              {/* About Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>About Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={draft.about}
                  onChangeText={(v) => setDraft({ ...draft, about: v })}
                  placeholder="Detailed description of this support service"
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.resetBtn} onPress={handleResetToDefault}>
                  <Text style={styles.resetBtnText}>Restore Defaults</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={saving}>
                  <Text style={styles.submitBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  editBtnText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  tagBanner: {
    backgroundColor: '#FBE1DE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagBannerUrgent: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  tagTextUrgent: {
    color: '#DC2626',
  },
  officerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  officerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D6A4F',
  },
  quickContactBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
  },
  quickContactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  quickContactBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  bodyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: 10,
  },
  bulletText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: 20,
    flex: 1,
  },
  contactRow: {
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#397052',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 4,
    shadowColor: '#397052',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  updateButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundLight,
  },
  closeBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  modalSaveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalSaveText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalScroll: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalSub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundLight,
  },
  resetBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.statusRedText,
  },
  submitBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  submitBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default SupportDetailsScreen;
