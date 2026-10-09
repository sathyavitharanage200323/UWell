import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useWelfare } from '../../context/WelfareContext';
import { useAuth } from '../../context/AuthContext';
import { welfareService } from '../../services/welfareService';

const ProfileScreen = ({ navigation }) => {
  const { profile, updateProfile } = useWelfare();
  const { logout, user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile || {});
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Sync draft whenever profile updates
  useEffect(() => {
    if (profile) {
      setDraft(profile);
    }
  }, [profile]);

  // Fetch fresh profile from backend on mount
  useEffect(() => {
    fetchBackendProfile();
  }, []);

  const fetchBackendProfile = async () => {
    try {
      setRefreshing(true);
      const res = await welfareService.getProfile();
      if (res?.user) {
        updateProfile(res.user);
      }
    } catch (e) {
      // Offline fallback: profile from context is already loaded
    } finally {
      setRefreshing(false);
    }
  };

  const handleStartEdit = () => {
    setDraft(JSON.parse(JSON.stringify(profile || {})));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(profile || {});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!draft.name?.trim() && !draft.firstName?.trim()) {
      Alert.alert('Validation Error', 'Name is required.');
      return;
    }
    if (!draft.email?.trim()) {
      Alert.alert('Validation Error', 'Work email is required.');
      return;
    }

    try {
      setSaving(true);
      const fullName = (draft.name || `${draft.firstName || ''} ${draft.lastName || ''}`).trim();
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || draft.firstName || 'Officer';
      const lastName = nameParts.slice(1).join(' ') || draft.lastName || '';

      const payload = {
        name: fullName,
        firstName,
        lastName,
        email: draft.email.trim(),
        phone: draft.phone?.trim() || '',
        emergencyContactPhone: draft.emergencyContactPhone?.trim() || '',
        department: draft.department?.trim() || 'Student Welfare Services',
        position: draft.position?.trim() || 'Welfare Officer',
        officeLocation: draft.officeLocation?.trim() || '',
        officeHours: draft.officeHours?.trim() || 'Monday – Friday, 8:30 AM – 4:30 PM',
        workingSchedule: draft.workingSchedule?.trim() || 'Full-time On Campus',
        bio: draft.bio?.trim() || '',
        specializations: Array.isArray(draft.specializations)
          ? draft.specializations
          : (draft.specializations || '').split(',').map((s) => s.trim()).filter(Boolean),
        avatarInitials: getInitials(fullName),
      };

      // Update both Context and backend database
      await updateProfile(payload);
      setIsEditing(false);
      Alert.alert('Profile Saved', 'Your officer profile details have been saved to the database.');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Update Failed', error.response?.data?.message || 'Failed to save changes to the backend.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'WO';

  const menuGroups = [
    {
      id: 'prefs',
      items: [
        {
          id: 'privacy',
          label: 'Privacy & Security',
          icon: 'shield-checkmark-outline',
          screen: 'PrivacySecurity',
          subLabel: 'Session timeout, 2FA, & compliance'
        },
        {
          id: 'schedule',
          label: 'Work Schedule & Availability',
          icon: 'calendar-outline',
          screen: 'WorkSchedule',
          subLabel: profile?.workingSchedule || 'Full-time On Campus'
        },
        {
          id: 'notifications',
          label: 'Notification Preferences',
          icon: 'notifications-outline',
          subLabel: 'Appointment requests & crisis alerts'
        },
      ],
    },
    {
      id: 'support_docs',
      items: [
        {
          id: 'guidelines',
          label: 'Student Welfare Guidelines',
          icon: 'document-text-outline',
          screen: 'PrivacyInformation',
          subLabel: 'Official campus policy & handbook'
        },
        {
          id: 'help',
          label: 'System Help & Technical Support',
          icon: 'help-circle-outline',
          subLabel: 'Contact administrator'
        },
      ],
    },
  ];

  const handleMenuPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else {
      Alert.alert(item.label, `${item.label} preferences are active and configured.`);
    }
  };

  if (!profile && !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.emptyBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.emptyText}>Loading profile data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const p = profile || user || {};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Welfare Officer Profile</Text>
          <Text style={styles.headerSub}>Official University Credentials</Text>
        </View>
        {!isEditing ? (
          <TouchableOpacity style={styles.editBtn} onPress={handleStartEdit} activeOpacity={0.8}>
            <Feather name="edit-2" size={15} color={colors.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn} disabled={saving}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ---------- Top Avatar & Official Identity Banner ---------- */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{p.avatarInitials || getInitials(p.name)}</Text>
            </View>
            <Text style={styles.name}>{p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim()}</Text>
            <Text style={styles.role}>{p.position || 'Welfare Officer'}</Text>
            <Text style={styles.dept}>{p.department || 'Student Welfare Services'}</Text>

            {/* Staff ID & Verification Badges */}
            <View style={styles.badgeRow}>
              {p.staffId ? (
                <View style={styles.staffIdBadge}>
                  <MaterialCommunityIcons name="badge-account-horizontal-outline" size={15} color="#1B4332" />
                  <Text style={styles.staffIdBadgeText}>Staff ID: {p.staffId}</Text>
                </View>
              ) : null}

              <View style={styles.approvedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#15803D" />
                <Text style={styles.approvedBadgeText}>Approved Official</Text>
              </View>
            </View>
          </View>

          {/* ---------- Bio Section (About the Officer) ---------- */}
          {!isEditing ? (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="person-circle-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Professional Summary</Text>
              </View>
              <Text style={styles.bioText}>
                {p.bio || 'Dedicated to supporting university student wellbeing, mental health initiatives, and student advocacy.'}
              </Text>
            </View>
          ) : null}

          {/* ---------- Areas of Expertise / Specializations ---------- */}
          {!isEditing && p.specializations?.length ? (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="ribbon-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.cardTitle}>Areas of Focus & Expertise</Text>
              </View>
              <View style={styles.chipGrid}>
                {p.specializations.map((item, idx) => (
                  <View key={idx} style={styles.chip}>
                    <Text style={styles.chipText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* ---------- Edit Mode Form vs Read-Only Details Card ---------- */}
          {isEditing ? (
            <View style={styles.group}>
              <Text style={styles.formSectionHeader}>Personal & Contact Details</Text>
              <Field
                label="Full Name *"
                value={draft.name || ''}
                onChangeText={(v) => setDraft({ ...draft, name: v })}
                placeholder="e.g. Jon Wick"
              />
              <Field
                label="Work Email *"
                value={draft.email || ''}
                onChangeText={(v) => setDraft({ ...draft, email: v })}
                keyboardType="email-address"
                placeholder="e.g. welfare@university.edu"
              />
              <Field
                label="Office Phone *"
                value={draft.phone || ''}
                onChangeText={(v) => setDraft({ ...draft, phone: v })}
                keyboardType="phone-pad"
                placeholder="e.g. 0752206048"
              />
              <Field
                label="Emergency Contact Phone"
                value={draft.emergencyContactPhone || ''}
                onChangeText={(v) => setDraft({ ...draft, emergencyContactPhone: v })}
                keyboardType="phone-pad"
                placeholder="e.g. +1 (555) 019-9999"
              />

              <Text style={styles.formSectionHeader}>Department & Location</Text>
              <Field
                label="Department"
                value={draft.department || ''}
                onChangeText={(v) => setDraft({ ...draft, department: v })}
                placeholder="e.g. Student Welfare Services"
              />
              <Field
                label="Position / Designation"
                value={draft.position || ''}
                onChangeText={(v) => setDraft({ ...draft, position: v })}
                placeholder="e.g. Senior Welfare Officer"
              />
              <Field
                label="Campus Office Location"
                value={draft.officeLocation || ''}
                onChangeText={(v) => setDraft({ ...draft, officeLocation: v })}
                placeholder="e.g. Block C, Room 04"
              />
              <Field
                label="Office Hours"
                value={draft.officeHours || ''}
                onChangeText={(v) => setDraft({ ...draft, officeHours: v })}
                placeholder="e.g. Mon – Fri, 8:30 AM – 4:30 PM"
              />
              <Field
                label="Working Schedule"
                value={draft.workingSchedule || ''}
                onChangeText={(v) => setDraft({ ...draft, workingSchedule: v })}
                placeholder="e.g. Full-time On Campus"
              />

              <Text style={styles.formSectionHeader}>Professional Summary & Focus</Text>
              <Field
                label="Specializations (comma separated)"
                value={Array.isArray(draft.specializations) ? draft.specializations.join(', ') : (draft.specializations || '')}
                onChangeText={(v) => setDraft({ ...draft, specializations: v })}
                placeholder="e.g. Financial Aid, Housing Support, Crisis Relief"
              />
              <Field
                label="Professional Summary / Bio"
                value={draft.bio || ''}
                onChangeText={(v) => setDraft({ ...draft, bio: v })}
                placeholder="Short description of your background and student support focus"
                multiline
                last
              />
            </View>
          ) : (
            <>
              {/* ---------- Contact & Official Details Card ---------- */}
              <View style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <Ionicons name="id-card-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.cardTitle}>Officer Information</Text>
                </View>
                <InfoDisplay label="Staff ID (Unique Key)" value={p.staffId} highlight />
                <InfoDisplay label="Full Name" value={p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim()} />
                <InfoDisplay label="Work Email" value={p.email} />
                <InfoDisplay label="Official Phone" value={p.phone} />
                {p.emergencyContactPhone ? (
                  <InfoDisplay label="Emergency / Secondary Phone" value={p.emergencyContactPhone} />
                ) : null}
                <InfoDisplay label="Department" value={p.department} />
                <InfoDisplay label="Designation" value={p.position} />
                <InfoDisplay label="Office Location" value={p.officeLocation || 'Main Welfare Office'} />
                <InfoDisplay label="Office Hours" value={p.officeHours || 'Monday – Friday, 8:30 AM – 4:30 PM'} />
                <InfoDisplay label="Work Schedule" value={p.workingSchedule || 'Full-time On Campus'} last />
              </View>

              {/* ---------- Menu Groups ---------- */}
              {menuGroups.map((group) => (
                <View key={group.id} style={styles.group}>
                  {group.items.map((item, index) => {
                    const isLast = index === group.items.length - 1;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.menuItem, isLast && styles.menuItemLast]}
                        onPress={() => handleMenuPress(item)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.menuIconWrap}>
                          <Ionicons name={item.icon} size={18} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.menuLabel}>{item.label}</Text>
                          {item.subLabel ? (
                            <Text style={styles.menuSubLabel}>{item.subLabel}</Text>
                          ) : null}
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}

              {/* ---------- Log Out Button ---------- */}
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => {
                  Alert.alert('Log Out', 'Are you sure you want to log out of your Welfare Officer account?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log Out', style: 'destructive', onPress: () => logout && logout() },
                  ]);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={18} color={colors.statusRedText} style={{ marginRight: 6 }} />
                <Text style={styles.logoutText}>Log Out from Welfare Account</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Field = ({ label, value, onChangeText, keyboardType, placeholder, multiline, last }) => (
  <View style={[styles.fieldRow, last && styles.fieldRowLast]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
      placeholder={placeholder || label}
      placeholderTextColor={colors.textMuted}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
    />
  </View>
);

const InfoDisplay = ({ label, value, highlight, last }) => (
  <View style={[styles.infoRow, last && styles.infoRowLast]}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>
      {value || 'Not provided'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  headerSub: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  editBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  editActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cancelBtn: { paddingHorizontal: spacing.md, paddingVertical: 6 },
  cancelBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 7,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite,
  },

  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  emptyBox: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { fontSize: typography.fontSize.md, color: colors.textMuted, marginTop: 8 },

  avatarSection: { alignItems: 'center', paddingVertical: spacing.md },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#397052',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: '#397052',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  name: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  role: {
    fontSize: typography.fontSize.sm + 1,
    color: '#397052',
    fontWeight: '700',
    marginTop: 2,
  },
  dept: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  staffIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8EF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B7E4C7',
    gap: 4,
  },
  staffIdBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B4332',
    letterSpacing: 0.6,
  },
  approvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 4,
  },
  approvedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },

  // Card
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
  bioText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 21,
  },

  // Chip Grid
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#E8F8EF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C2E7D0',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D6A4F',
  },

  // Info Display Rows
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  infoRowLast: { borderBottomWidth: 0 },
  infoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: '500',
  },
  infoValueHighlight: {
    color: '#1B4332',
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Edit Mode Form
  formSectionHeader: {
    fontSize: typography.fontSize.xs,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginVertical: 10,
  },
  fieldRow: {
    marginBottom: spacing.sm,
  },
  fieldRowLast: { marginBottom: 0 },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  fieldInputMultiline: {
    height: 70,
    textAlignVertical: 'top',
  },

  // Groups and Menu Items
  group: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    padding: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: '600',
  },
  menuSubLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDE8E8',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F9A8A8',
    marginTop: spacing.sm,
  },
  logoutText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '700',
    color: colors.statusRedText,
  },
});

export default ProfileScreen;