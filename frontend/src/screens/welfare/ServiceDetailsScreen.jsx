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
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography } from '../../theme';

const STORAGE_KEY_PREFIX = '@uwell/service_details_';

// Full reliable default details for all 4 support categories
const DIRECTORY_DETAILS = {
  'sd-1': {
    id: 'sd-1',
    category: 'counseling',
    title: 'Counseling Service',
    tag: 'LICENSED CLINICAL SUPPORT',
    about: 'Our fully-certified counseling service focuses on providing students with direct, confidential access to licensed psychologists, welfare workers, and crisis negotiators during stressful semesters.',
    servicesOffered: [
      'Individual Counseling Programs',
      'Group Therapy Sessions & Stress Management',
      'Crisis Intervention Protocols',
      'Peer Support Programs & Outreach',
      'Confidential Psychiatric Referrals'
    ],
    contact: {
      phone: '+1 (555) 019-2834',
      email: 'counseling.center@university.edu',
      hours: 'Monday – Friday, 8:30 AM – 5:00 PM',
      leadOfficer: 'Dr. Evelyn Martinez (Lead Clinical Psychologist)'
    },
    location: 'Room 105, Student Services Building (Adjacent to Main Library)',
    urgent: false,
  },
  'sd-2': {
    id: 'sd-2',
    category: 'academic',
    title: 'Academic Support',
    tag: 'ACADEMIC EXCELLENCE & ADVISORY',
    about: 'The Academic Support Desk assists students experiencing learning hurdles, coursework difficulties, exam anxiety, and time management challenges. Specialized peer tutors and academic advisors are available daily.',
    servicesOffered: [
      'One-on-One Peer Tutoring (STEM & Humanities)',
      'Study Skills & Time Management Workshops',
      'Academic Probation Coaching & GPA Recovery',
      'Exam Preparation & Review Sessions',
      'Specialized Learning & Disability Accommodations'
    ],
    contact: {
      phone: '+1 (555) 019-4455',
      email: 'academic.support@university.edu',
      hours: 'Monday – Saturday, 8:00 AM – 6:00 PM',
      leadOfficer: 'Prof. David Miller (Academic Support Coordinator)'
    },
    location: 'Building B, 2nd Floor, Academic Commons Desk',
    urgent: false,
  },
  'sd-3': {
    id: 'sd-3',
    category: 'welfare',
    title: 'Student Welfare Support',
    tag: 'STUDENT WELLBEING & WELFARE',
    about: 'The Student Welfare Office is the primary hub for holistic student wellbeing, managing emergency hardship grants, campus food security vouchers, off-campus accommodation mediation, and emergency student allowances.',
    servicesOffered: [
      'Emergency Student Hardship Grants & Subsidies',
      'Hostel & Off-Campus Accommodation Mediation',
      'Campus Food Security & Meal Assistance Vouchers',
      'Student Medical Insurance Guidance',
      'Disability Access & Adaptive Equipment Support'
    ],
    contact: {
      phone: '+1 (555) 019-3322',
      email: 'student.welfare@university.edu',
      hours: 'Monday – Friday, 9:00 AM – 4:30 PM',
      leadOfficer: 'Jon Wick (Senior Welfare Officer)'
    },
    location: 'Block C, Ground Floor, Welfare Office 04',
    urgent: false,
  },
  'sd-4': {
    id: 'sd-4',
    category: 'emergency',
    title: 'Emergency Support',
    tag: '24/7 CRISIS RESPONSE & SAFETY',
    about: 'Immediate, 24/7 emergency response for students facing severe mental health crises, acute distress, suicidal ideation, campus security emergencies, or physical safety threats on or off campus.',
    servicesOffered: [
      '24/7 Crisis Hotline & Suicide Prevention Support',
      'Rapid On-Campus Medical & Ambulance Dispatch',
      'Immediate Psychological First Aid Intervention',
      'Campus Security Safety Escort',
      'Urgent Temporary Safe Haven Housing'
    ],
    contact: {
      phone: '+1 (555) 911-HELP / 1990',
      email: 'crisis.response@university.edu',
      hours: '24 Hours / 7 Days a week (Always Open)',
      leadOfficer: 'Emergency Response Unit & Campus Safety'
    },
    location: 'Campus Security & Health Centre, Gate 1 Emergency Entrance',
    urgent: true,
  },
};

// Resolver helper to guarantee full details are never undefined
const resolveService = (param) => {
  if (!param) return DIRECTORY_DETAILS['sd-1'];

  // Check by id
  if (param.id && DIRECTORY_DETAILS[param.id]) {
    return { ...DIRECTORY_DETAILS[param.id], ...param };
  }

  // Check by title or category
  const titleLower = (param.title || '').toLowerCase();
  const catLower = (param.category || '').toLowerCase();

  if (titleLower.includes('academic') || catLower.includes('academic')) {
    return { ...DIRECTORY_DETAILS['sd-2'], ...param };
  }
  if (titleLower.includes('welfare') || catLower.includes('welfare')) {
    return { ...DIRECTORY_DETAILS['sd-3'], ...param };
  }
  if (titleLower.includes('emergency') || catLower.includes('emergency')) {
    return { ...DIRECTORY_DETAILS['sd-4'], ...param };
  }
  return { ...DIRECTORY_DETAILS['sd-1'], ...param };
};

const ServiceDetailsScreen = ({ route, navigation }) => {
  const incomingParam = route?.params?.service || route?.params?.directory || route?.params;
  const initial = resolveService(incomingParam);

  const [svc, setSvc] = useState(initial);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);

  // Sync state whenever route.params changes
  useEffect(() => {
    const target = resolveService(route?.params?.service || route?.params?.directory || route?.params);
    loadCustomizedData(target);
  }, [route?.params]);

  const loadCustomizedData = async (targetService) => {
    try {
      const key = `${STORAGE_KEY_PREFIX}${targetService.id}`;
      const saved = await AsyncStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...targetService, ...parsed };
        setSvc(merged);
        setDraft(merged);
      } else {
        setSvc(targetService);
        setDraft(targetService);
      }
    } catch (e) {
      console.error('Error loading service data:', e);
      setSvc(targetService);
      setDraft(targetService);
    }
  };

  const handleStartEdit = () => {
    setDraft(JSON.parse(JSON.stringify(svc)));
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = {
        ...svc,
        ...draft,
        contact: {
          ...svc.contact,
          ...draft.contact,
        },
      };

      const key = `${STORAGE_KEY_PREFIX}${svc.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      setSvc(updated);
      setIsEditing(false);
      Alert.alert('Saved Successfully', `Information for "${updated.title}" has been updated.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    Alert.alert(
      'Reset Information',
      'Restore default university details for this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore Defaults',
          style: 'destructive',
          onPress: async () => {
            try {
              const key = `${STORAGE_KEY_PREFIX}${svc.id}`;
              await AsyncStorage.removeItem(key);
              const def = DIRECTORY_DETAILS[svc.id] || DIRECTORY_DETAILS['sd-1'];
              setSvc(def);
              setDraft(def);
              setIsEditing(false);
              Alert.alert('Restored', 'Default information has been restored.');
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
      Alert.alert('Dial Contact', `Phone: ${phone}`);
    });
  };

  const handleEmail = (email) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Send Email', `Email: ${email}`);
    });
  };

  const handlePrimaryAction = () => {
    if (svc.urgent) {
      handleCall(svc.contact?.phone);
    } else {
      Alert.alert(
        `Contact ${svc.title}`,
        `You can reach out directly via Phone (${svc.contact?.phone}) or Email (${svc.contact?.email}).`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Call Desk', onPress: () => handleCall(svc.contact?.phone) },
          { text: 'Send Email', onPress: () => handleEmail(svc.contact?.email) },
        ]
      );
    }
  };

  const isUrgent = svc.urgent;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{svc.title}</Text>
        <TouchableOpacity
          onPress={handleStartEdit}
          style={styles.editBtn}
          accessibilityLabel="Edit Information"
        >
          <Feather name="edit-2" size={15} color={colors.primary} />
          <Text style={styles.editBtnText}>Edit Info</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ---------- Tag Banner ---------- */}
        <View style={[styles.tagBanner, isUrgent && styles.tagBannerUrgent]}>
          <Text style={[styles.tagText, isUrgent && styles.tagTextUrgent]}>{svc.tag}</Text>
        </View>

        {/* ---------- About Section ---------- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Service</Text>
          <Text style={styles.bodyText}>{svc.about}</Text>
        </View>

        {/* ---------- Services Offered ---------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Services Offered</Text>
          {svc.servicesOffered?.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={[styles.bullet, isUrgent && { backgroundColor: '#C0392B' }]} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* ---------- Contact Information ---------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>{isUrgent ? 'CRISIS HOTLINE' : 'WELFARE PHONE'}</Text>
            <TouchableOpacity onPress={() => handleCall(svc.contact?.phone)}>
              <Text style={[styles.contactValue, { color: isUrgent ? '#C0392B' : colors.primary, fontWeight: '700' }]}>
                {svc.contact?.phone}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>OFFICIAL EMAIL</Text>
            <TouchableOpacity onPress={() => handleEmail(svc.contact?.email)}>
              <Text style={[styles.contactValue, { color: colors.primary }]}>
                {svc.contact?.email}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>OFFICE HOURS</Text>
            <Text style={styles.contactValue}>{svc.contact?.hours}</Text>
          </View>

          {svc.contact?.leadOfficer ? (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>LEAD OFFICER / COORDINATOR</Text>
              <Text style={styles.contactValue}>{svc.contact?.leadOfficer}</Text>
            </View>
          ) : null}
        </View>

        {/* ---------- Location ---------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location</Text>
          <Text style={styles.bodyText}>{svc.location}</Text>
        </View>

        {/* ---------- Primary Action Button ---------- */}
        <TouchableOpacity
          style={[styles.primaryButton, isUrgent && styles.primaryButtonUrgent]}
          activeOpacity={0.85}
          onPress={handlePrimaryAction}
        >
          <Ionicons
            name={isUrgent ? 'alert-circle-outline' : 'call-outline'}
            size={18}
            color={colors.textWhite}
          />
          <Text style={styles.primaryButtonText}>
            {isUrgent ? 'Call Emergency Hotline Now' : 'Contact Help Desk'}
          </Text>
        </TouchableOpacity>

        {/* ---------- Update Directory Info Secondary Button ---------- */}
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={handleStartEdit}
        >
          <Feather name="edit-3" size={16} color="#397052" />
          <Text style={styles.secondaryButtonText}>Update Service Details</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ---------- Edit Service Details Modal ---------- */}
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
                Update the official contact and operational details for <Text style={{ fontWeight: '700' }}>{svc.title}</Text>. Changes will be saved and displayed reliably.
              </Text>

              {/* Phone Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Phone / Hotline *</Text>
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
                <Text style={styles.inputLabel}>Official Email *</Text>
                <TextInput
                  style={styles.input}
                  value={draft.contact?.email}
                  onChangeText={(v) => setDraft({ ...draft, contact: { ...draft.contact, email: v } })}
                  placeholder="e.g. support@university.edu"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Office Hours */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Operating Hours *</Text>
                <TextInput
                  style={styles.input}
                  value={draft.contact?.hours}
                  onChangeText={(v) => setDraft({ ...draft, contact: { ...draft.contact, hours: v } })}
                  placeholder="e.g. Monday – Friday, 8:30 AM – 5:00 PM"
                />
              </View>

              {/* Lead Officer */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Lead Officer / Coordinator</Text>
                <TextInput
                  style={styles.input}
                  value={draft.contact?.leadOfficer}
                  onChangeText={(v) => setDraft({ ...draft, contact: { ...draft.contact, leadOfficer: v } })}
                  placeholder="e.g. Dr. Evelyn Martinez / On-duty Officer"
                />
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Campus Location / Room *</Text>
                <TextInput
                  style={styles.input}
                  value={draft.location}
                  onChangeText={(v) => setDraft({ ...draft, location: v })}
                  placeholder="e.g. Room 105, Student Services Complex"
                />
              </View>

              {/* About Description */}
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
  container: { flex: 1, backgroundColor: colors.creamBackground },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
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
  scrollContent: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },

  tagBanner: {
    backgroundColor: '#FBE1DE',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: spacing.lg,
  },
  tagBannerUrgent: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
  },
  tagText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#C0392B',
    letterSpacing: 0.5,
  },
  tagTextUrgent: {
    color: '#DC2626',
  },

  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bodyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.sm },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: 20,
  },

  contactRow: { marginTop: spacing.sm },
  contactLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: { fontSize: typography.fontSize.md, color: colors.text },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 14,
    marginTop: spacing.sm,
  },
  primaryButtonUrgent: {
    backgroundColor: '#C0392B',
  },
  primaryButtonText: {
    color: colors.textWhite,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.sm,
  },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F8EF',
    paddingVertical: spacing.md - 2,
    borderRadius: 14,
    marginTop: spacing.sm + 4,
    borderWidth: 1,
    borderColor: '#B7E4C7',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#2D6A4F',
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
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
  closeBtn: { padding: 4 },
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

export default ServiceDetailsScreen;