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
  StatusBar,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography } from '../../theme';
import { useWelfare } from '../../context/WelfareContext';
import { useAuth } from '../../context/AuthContext';
import { welfareService, resolveProfileImageUrl } from '../../services/welfareService';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, iconLib = 'Ionicons', label, value, highlight, last }) => {
  const IconComp = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  return (
    <View style={[rowStyles.row, last && rowStyles.rowLast]}>
      <View style={rowStyles.iconWrap}>
        <IconComp name={icon} size={14} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={[rowStyles.value, highlight && rowStyles.valueHighlight]}>
          {value || 'Not provided'}
        </Text>
      </View>
    </View>
  );
};

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowLast: { borderBottomWidth: 0 },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 1,
    flexShrink: 0,
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
    lineHeight: 18,
  },
  valueHighlight: {
    color: '#1B4332',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

const Field = ({ label, icon, value, onChangeText, keyboardType, placeholder, multiline, last }) => (
  <View style={[fieldStyles.wrap, last && fieldStyles.wrapLast]}>
    <View style={fieldStyles.labelRow}>
      {icon ? <Ionicons name={icon} size={13} color={colors.primary} style={{ marginRight: 5 }} /> : null}
      <Text style={fieldStyles.label}>{label}</Text>
    </View>
    <TextInput
      style={[fieldStyles.input, multiline && fieldStyles.inputMulti]}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
      placeholder={placeholder || label}
      placeholderTextColor={colors.textMuted}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      autoCapitalize="none"
      autoCorrect={false}
    />
  </View>
);

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  wrapLast: { marginBottom: 0 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  label: { fontSize: 11, fontWeight: '700', color: colors.text, letterSpacing: 0.2 },
  input: {
    backgroundColor: colors.creamBackground,
    borderWidth: 1.2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
    fontSize: 13,
    color: colors.text,
  },
  inputMulti: { height: 80, textAlignVertical: 'top' },
});

const SectionCard = ({ title, icon, iconLib = 'Ionicons', children }) => {
  const IconComp = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.header}>
        <View style={cardStyles.iconAccent}>
          <IconComp name={icon} size={15} color={colors.primary} />
        </View>
        <Text style={cardStyles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconAccent: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: { fontSize: 13, fontWeight: '700', color: colors.text, letterSpacing: 0.1 },
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────

const ProfileScreen = ({ navigation }) => {
  const { profile, updateProfile, uploadProfilePhoto, removeProfilePhoto } = useWelfare();
  const { logout, user, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile || {});
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const handleChooseFromGallery = async () => {
    setPhotoModalVisible(false);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera roll access is needed to select a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await processAndUploadImage(result.assets[0]);
      }
    } catch (err) {
      console.error('Gallery picker error:', err);
      Alert.alert('Error', 'Failed to pick image from gallery.');
    }
  };

  const handleTakePhoto = async () => {
    setPhotoModalVisible(false);
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera permission is needed to take a profile photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await processAndUploadImage(result.assets[0]);
      }
    } catch (err) {
      console.error('Camera capture error:', err);
      Alert.alert('Error', 'Failed to take photo with camera.');
    }
  };

  const processAndUploadImage = async (asset) => {
    setUploadingPhoto(true);
    setImageError(false);
    try {
      const filename = asset.fileName || `welfare_photo_${Date.now()}.jpg`;
      const mimeType = asset.mimeType || 'image/jpeg';

      const formData = new FormData();
      formData.append('photo', {
        uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
        name: filename,
        type: mimeType,
      });
      if (asset.base64) {
        formData.append('base64', `data:${mimeType};base64,${asset.base64}`);
      }

      let res;
      try {
        res = await uploadProfilePhoto(formData);
      } catch (uploadErr) {
        if (asset.base64) {
          res = await uploadProfilePhoto({
            profilePicture: `data:${mimeType};base64,${asset.base64}`,
          });
        } else {
          throw uploadErr;
        }
      }

      const newPic = res?.profilePicture || res?.user?.profilePicture || asset.uri;
      if (updateUser) {
        await updateUser({ profilePicture: newPic });
      }
      setDraft((prev) => ({ ...prev, profilePicture: newPic }));
      Alert.alert('Photo Updated', 'Your profile picture has been saved successfully.');
    } catch (err) {
      console.error('Photo upload failed:', err);
      Alert.alert('Upload Failed', err?.response?.data?.message || err?.message || 'Could not upload photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoModalVisible(false);
    Alert.alert('Remove Photo', 'Are you sure you want to remove your profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setUploadingPhoto(true);
          try {
            await removeProfilePhoto();
            if (updateUser) {
              await updateUser({ profilePicture: null });
            }
            setDraft((prev) => ({ ...prev, profilePicture: null }));
            setImageError(false);
            Alert.alert('Photo Removed', 'Your profile picture has been removed.');
          } catch (err) {
            Alert.alert('Error', 'Failed to remove photo.');
          } finally {
            setUploadingPhoto(false);
          }
        },
      },
    ]);
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




  if (!profile && !user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const p = profile || user || {};
  const displayName = p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Welfare Officer';
  const initials = p.avatarInitials || getInitials(displayName);
  const currentPhoto = draft?.profilePicture || p.profilePicture || p.avatar;
  const resolvedPhotoUri = resolveProfileImageUrl(currentPhoto);

  const menuGroups = [
    {
      id: 'prefs',
      title: 'Settings & Preferences',
      icon: 'settings-outline',
      items: [
        { id: 'privacy', label: 'Privacy & Security', icon: 'shield-checkmark-outline', sub: 'Session timeout, 2FA & compliance', screen: 'PrivacySecurity' },
        { id: 'notifications', label: 'Notification Preferences', icon: 'notifications-outline', sub: 'Appointment & crisis alerts' },
        { id: 'schedule', label: 'Work Schedule & Availability', icon: 'calendar-outline', sub: p.workingSchedule || 'Full-time On Campus', screen: 'WorkSchedule' },
      ],
    },
    {
      id: 'docs',
      title: 'Resources & Support',
      icon: 'folder-open-outline',
      items: [
        { id: 'guidelines', label: 'Student Welfare Guidelines', icon: 'document-text-outline', sub: 'Campus policy & official handbook', screen: 'PrivacyInformation' },
        { id: 'help', label: 'System Help & Technical Support', icon: 'help-circle-outline', sub: 'Contact administrator' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />

      {/* ── Top Header Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.topTitle}>My Profile</Text>
          <Text style={styles.topSub}>Welfare Officer Account</Text>
        </View>
        {!isEditing ? (
          <TouchableOpacity style={styles.editBtn} onPress={handleStartEdit} activeOpacity={0.8}>
            <Feather name="edit-2" size={13} color={colors.primary} />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn} disabled={saving}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn} disabled={saving}>
              {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Save</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Hero Banner */}
          <View style={styles.heroBanner}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                {resolvedPhotoUri && !imageError ? (
                  <Image
                    source={{ uri: resolvedPhotoUri }}
                    style={styles.avatarImg}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Text style={styles.avatarText}>{initials}</Text>
                )}
                {uploadingPhoto && (
                  <View style={styles.avatarLoadingOverlay}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  </View>
                )}
              </View>

              {/* Camera Upload Badge */}
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={() => setPhotoModalVisible(true)}
                activeOpacity={0.8}
                disabled={uploadingPhoto}
                accessibilityLabel="Change profile picture"
              >
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroName}>{displayName}</Text>
            <Text style={styles.heroRole}>{p.position || 'Welfare Officer'}</Text>
            <Text style={styles.heroDept}>{p.department || 'Student Welfare Services'}</Text>
            <View style={styles.badgeRow}>
              {p.staffId ? (
                <View style={styles.staffBadge}>
                  <MaterialCommunityIcons name="badge-account-horizontal-outline" size={12} color="#1B4332" />
                  <Text style={styles.staffBadgeText}>{p.staffId}</Text>
                </View>
              ) : null}
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#15803D" />
                <Text style={styles.verifiedBadgeText}>Approved Official</Text>
              </View>
            </View>
          </View>

          {/* ── EDIT MODE */}
          {isEditing ? (
            <>
              <SectionCard title="Personal & Contact" icon="person-outline">
                <Field label="Full Name *" icon="person-outline" value={draft.name || ''} onChangeText={(v) => setDraft({ ...draft, name: v })} placeholder="e.g. Jon Wick" />
                <Field label="Work Email *" icon="mail-outline" value={draft.email || ''} onChangeText={(v) => setDraft({ ...draft, email: v })} keyboardType="email-address" placeholder="e.g. welfare@university.edu" />
                <Field label="Office Phone" icon="call-outline" value={draft.phone || ''} onChangeText={(v) => setDraft({ ...draft, phone: v })} keyboardType="phone-pad" placeholder="e.g. 0752206048" />
                <Field label="Emergency Contact" icon="alert-circle-outline" value={draft.emergencyContactPhone || ''} onChangeText={(v) => setDraft({ ...draft, emergencyContactPhone: v })} keyboardType="phone-pad" placeholder="e.g. +94 77 123 4567" last />
              </SectionCard>

              <SectionCard title="Department & Location" icon="business-outline">
                <Field label="Department" icon="layers-outline" value={draft.department || ''} onChangeText={(v) => setDraft({ ...draft, department: v })} placeholder="e.g. Student Welfare Services" />
                <Field label="Position / Designation" icon="ribbon-outline" value={draft.position || ''} onChangeText={(v) => setDraft({ ...draft, position: v })} placeholder="e.g. Senior Welfare Officer" />
                <Field label="Campus Office Location" icon="location-outline" value={draft.officeLocation || ''} onChangeText={(v) => setDraft({ ...draft, officeLocation: v })} placeholder="e.g. Block C, Room 04" />
                <Field label="Office Hours" icon="time-outline" value={draft.officeHours || ''} onChangeText={(v) => setDraft({ ...draft, officeHours: v })} placeholder="e.g. Mon – Fri, 8:30 AM – 4:30 PM" />
                <Field label="Working Schedule" icon="calendar-outline" value={draft.workingSchedule || ''} onChangeText={(v) => setDraft({ ...draft, workingSchedule: v })} placeholder="e.g. Full-time On Campus" last />
              </SectionCard>

              <SectionCard title="Professional Summary" icon="document-text-outline">
                <Field label="Specializations (comma separated)" icon="ribbon-outline" value={Array.isArray(draft.specializations) ? draft.specializations.join(', ') : (draft.specializations || '')} onChangeText={(v) => setDraft({ ...draft, specializations: v })} placeholder="e.g. Financial Aid, Housing, Crisis Relief" />
                <Field label="Bio / Summary" icon="chatbubble-ellipses-outline" value={draft.bio || ''} onChangeText={(v) => setDraft({ ...draft, bio: v })} placeholder="Short description of your background and focus" multiline last />
              </SectionCard>
            </>
          ) : (
            <>
              {/* ── Bio */}
              <SectionCard title="Professional Summary" icon="person-circle-outline">
                <Text style={styles.bioText}>
                  {p.bio || 'Dedicated to supporting university student wellbeing, mental health initiatives, and student advocacy.'}
                </Text>
              </SectionCard>

              {/* ── Specializations */}
              {p.specializations?.length ? (
                <SectionCard title="Areas of Expertise" icon="ribbon-outline">
                  <View style={styles.chipGrid}>
                    {p.specializations.map((item, idx) => (
                      <View key={idx} style={styles.chip}>
                        <Ionicons name="checkmark-circle-outline" size={11} color="#2D6A4F" style={{ marginRight: 4 }} />
                        <Text style={styles.chipText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </SectionCard>
              ) : null}

              {/* ── Officer Information */}
              <SectionCard title="Officer Information" icon="id-card-outline">
                <InfoRow icon="badge-account-horizontal-outline" iconLib="MaterialCommunityIcons" label="Staff ID (Unique Key)" value={p.staffId} highlight />
                <InfoRow icon="person-outline" label="Full Name" value={displayName} />
                <InfoRow icon="mail-outline" label="Work Email" value={p.email} />
                <InfoRow icon="call-outline" label="Office Phone" value={p.phone} />
                {p.emergencyContactPhone ? <InfoRow icon="alert-circle-outline" label="Emergency Phone" value={p.emergencyContactPhone} /> : null}
                <InfoRow icon="layers-outline" label="Department" value={p.department} />
                <InfoRow icon="ribbon-outline" label="Designation" value={p.position} />
                <InfoRow icon="location-outline" label="Office Location" value={p.officeLocation || 'Main Welfare Office'} />
                <InfoRow icon="time-outline" label="Office Hours" value={p.officeHours || 'Monday – Friday, 8:30 AM – 4:30 PM'} />
                <InfoRow icon="calendar-outline" label="Work Schedule" value={p.workingSchedule || 'Full-time On Campus'} last />
              </SectionCard>

              {/* ── Settings Groups */}
              {menuGroups.map((group) => (
                <SectionCard key={group.id} title={group.title} icon={group.icon}>
                  {group.items.map((item, idx) => {
                    const isLast = idx === group.items.length - 1;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.menuRow, isLast && styles.menuRowLast]}
                        onPress={() => item.screen ? navigation.navigate(item.screen) : Alert.alert(item.label, `${item.label} preferences are active.`)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.menuIconWrap}>
                          <Ionicons name={item.icon} size={15} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.menuLabel}>{item.label}</Text>
                          {item.sub ? <Text style={styles.menuSub}>{item.sub}</Text> : null}
                        </View>
                        <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
                      </TouchableOpacity>
                    );
                  })}
                </SectionCard>
              ))}

              {/* ── Logout */}
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => Alert.alert('Log Out', 'Are you sure you want to log out?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Log Out', style: 'destructive', onPress: () => logout && logout() },
                ])}
                activeOpacity={0.8}
              >
                <View style={styles.logoutIconWrap}>
                  <Ionicons name="log-out-outline" size={16} color={colors.statusRedText} />
                </View>
                <Text style={styles.logoutText}>Log Out from Welfare Account</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.statusRedText} />
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Photo Action Sheet Modal */}
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setPhotoModalVisible(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Profile Photo</Text>
            <Text style={styles.sheetSub}>Upload an official photo visible to students & staff</Text>

            <TouchableOpacity style={styles.sheetOption} onPress={handleChooseFromGallery} activeOpacity={0.7}>
              <View style={[styles.sheetOptionIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="images-outline" size={20} color="#0284C7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetOptionLabel}>Choose from Gallery</Text>
                <Text style={styles.sheetOptionSub}>Select an existing image from your device</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOption} onPress={handleTakePhoto} activeOpacity={0.7}>
              <View style={[styles.sheetOptionIcon, { backgroundColor: '#FDF2F8' }]}>
                <Ionicons name="camera-outline" size={20} color="#DB2777" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetOptionLabel}>Take a Photo</Text>
                <Text style={styles.sheetOptionSub}>Use your camera to capture a new photo</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {currentPhoto ? (
              <TouchableOpacity style={styles.sheetOption} onPress={handleRemovePhoto} activeOpacity={0.7}>
                <View style={[styles.sheetOptionIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.sheetOptionLabel, { color: '#DC2626' }]}>Remove Photo</Text>
                  <Text style={styles.sheetOptionSub}>Revert back to your initials avatar</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={styles.sheetCancelBtn} onPress={() => setPhotoModalVisible(false)} activeOpacity={0.8}>
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 13, color: colors.textMuted, marginTop: 10 },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.creamBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topTitle: { fontSize: 20, fontWeight: '800', color: colors.text, letterSpacing: 0.1 },
  topSub: { fontSize: 11, color: colors.textMuted, marginTop: 1, fontWeight: '500' },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 5,
  },
  editBtnText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  editActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cancelBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  cancelBtnText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  scroll: { paddingHorizontal: 16, paddingBottom: 32, paddingTop: 4 },

  // Hero Banner
  heroBanner: {
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    borderRadius: 20,
    marginVertical: 12,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2.5,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    position: 'relative',
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#C8634D',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 41,
    resizeMode: 'cover',
  },
  avatarLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarText: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  heroName: { fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'center', letterSpacing: 0.2 },
  heroRole: { fontSize: 13, fontWeight: '700', color: colors.primary, marginTop: 3, textAlign: 'center' },
  heroDept: { fontSize: 11, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },

  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' },
  staffBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F8EF',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
    borderWidth: 1, borderColor: '#B7E4C7', gap: 4,
  },
  staffBadgeText: { fontSize: 11, fontWeight: '800', color: '#1B4332', letterSpacing: 0.5 },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
    borderWidth: 1, borderColor: '#BBF7D0', gap: 4,
  },
  verifiedBadgeText: { fontSize: 11, fontWeight: '700', color: '#15803D' },

  // Bio
  bioText: { fontSize: 13, color: colors.textSecondary, lineHeight: 22 },

  // Chips
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  chip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F8EF',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
    borderWidth: 1, borderColor: '#C2E7D0',
  },
  chipText: { fontSize: 11, fontWeight: '600', color: '#2D6A4F' },

  // Menu
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  menuRowLast: { borderBottomWidth: 0 },
  menuIconWrap: {
    width: 32, height: 32, borderRadius: 9, backgroundColor: colors.softCoral,
    alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0,
  },
  menuLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
  menuSub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDE8E8',
    borderWidth: 1, borderColor: '#F9BFBF', borderRadius: 14,
    paddingVertical: 13, paddingHorizontal: 14, marginTop: 4, marginBottom: 16,
  },
  logoutIconWrap: {
    width: 30, height: 30, borderRadius: 8, backgroundColor: '#FECACA',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  logoutText: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.statusRedText },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.backgroundLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  sheetHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  sheetSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 18,
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.creamBackground,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetOptionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  sheetOptionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  sheetOptionSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  sheetCancelBtn: {
    marginTop: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  sheetCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});

export default ProfileScreen;
