import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme';
import NavigationHeader from '../../components/navigation/Header';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import ConfirmModal from '../../components/management/ConfirmModal';
import useSessionGuard from '../../components/management/useSessionGuard';
import {
  ResponsiveScroll,
  SectionCard,
  Banner,
  LoadingState,
  ActionButton,
  useLayout,
  PAGE_BACKGROUND,
} from '../../components/management/ManagementUI';

const PHONE_PATTERN = /^\+?[\d\s\-()]{7,20}$/;

/** Labelled text box; `locked` shows the value read-only with a padlock. */
const Field = ({ label, value, onChangeText, placeholder, locked, keyboardType, error }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputWrap, locked && styles.inputLocked, !!error && styles.inputError]}>
      <TextInput
        style={[styles.input, locked && styles.inputLockedText]}
        value={value}
        onChangeText={onChangeText}
        editable={!locked}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        accessibilityLabel={label}
      />
      {locked ? <Feather name="lock" size={14} color={colors.textMuted} /> : null}
    </View>
    {error ? <Text style={styles.fieldError}>{error}</Text> : null}
  </View>
);

const ProfileScreen = () => {
  const { user, logout, updateUser } = useAuth();
  const handleError = useSessionGuard();
  const { isWide } = useLayout();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    employeeId: user?.employeeId || '',
    phone: user?.phone || '',
    department: user?.department || '',
    position: user?.position || '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [errors, setErrors] = useState({});
  const [confirmLogout, setConfirmLogout] = useState(false);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const fetchProfile = useCallback(async () => {
    try {
      const res = await authService.getManagementProfile();
      if (res.success && res.profile) {
        const p = res.profile;
        setProfile({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          email: p.email || '',
          employeeId: p.employeeId || '',
          phone: p.phone || '',
          department: p.department || '',
          position: p.position || '',
        });
      } else if (res.error) {
        showFeedback('error', 'Could not load your profile. Showing saved details.');
      }
    } catch (err) {
      showFeedback('error', handleError(err, 'Could not load your profile.'));
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Load once; saving updates the screen directly, so no refetch loop
  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const setField = (key) => (value) => {
    setProfile((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!profile.firstName.trim()) next.firstName = 'First name is required.';
    if (!profile.lastName.trim()) next.lastName = 'Last name is required.';
    if (profile.phone.trim() && !PHONE_PATTERN.test(profile.phone.trim())) {
      next.phone = 'Enter a valid phone number (7 to 20 digits, spaces, dashes or +).';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await authService.updateManagementProfile({
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        phone: profile.phone.trim(),
        department: profile.department.trim(),
        position: profile.position.trim(),
      });
      if (res.success) {
        if (updateUser && res.profile) updateUser(res.profile);
        showFeedback('success', 'Profile updated successfully.');
      } else {
        showFeedback('error', res.message || 'Could not save profile changes.');
      }
    } catch (err) {
      showFeedback('error', handleError(err, 'Could not save profile changes.'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await authService.logout(); } catch (e) { /* local sign-out is enough */ }
    setConfirmLogout(false);
    if (logout) await logout();
  };

  const initials = `${(profile.firstName || 'A')[0]}${(profile.lastName || 'M')[0]}`.toUpperCase();

  return (
    <View style={styles.container}>
      <NavigationHeader title="Management Profile" />

      <ResponsiveScroll>
        {loading ? (
          <LoadingState text="Loading your profile..." />
        ) : (
          <>
            <View style={styles.avatarCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <Text style={styles.profileName}>{profile.firstName} {profile.lastName}</Text>
              <View style={styles.roleBadge}>
                <MaterialCommunityIcons name="shield-crown" size={14} color="#B45309" style={{ marginRight: 4 }} />
                <Text style={styles.roleBadgeText}>Administrator / Manager</Text>
              </View>
              <Text style={styles.profileEmail}>{profile.email}</Text>
            </View>

            {feedback ? <Banner type={feedback.type} message={feedback.message} /> : null}

            <View style={isWide ? styles.twoColumn : null}>
              <View style={isWide ? styles.column : null}>
                <SectionCard title="Personal details" icon="user" iconTone="info">
                  <Field label="First name" value={profile.firstName} onChangeText={setField('firstName')} placeholder="First name" error={errors.firstName} />
                  <Field label="Last name" value={profile.lastName} onChangeText={setField('lastName')} placeholder="Last name" error={errors.lastName} />
                  <Field label="Phone number" value={profile.phone} onChangeText={setField('phone')} placeholder="e.g. +94 77 123 4567" keyboardType="phone-pad" error={errors.phone} />
                </SectionCard>
              </View>
              <View style={isWide ? styles.column : null}>
                <SectionCard title="Role and organization" icon="briefcase" iconTone="warning">
                  <Field label="Employee ID" value={profile.employeeId} locked />
                  <Field label="Official email" value={profile.email} locked />
                  <Field label="Department" value={profile.department} onChangeText={setField('department')} placeholder="Department" />
                  <Field label="Position / title" value={profile.position} onChangeText={setField('position')} placeholder="Position" />
                </SectionCard>
              </View>
            </View>

            <ActionButton title="Save profile changes" icon="check" loading={saving} onPress={handleSave} />
            <ActionButton
              title="Log out"
              icon="log-out"
              variant="danger"
              onPress={() => setConfirmLogout(true)}
              style={styles.logoutBtn}
            />
          </>
        )}
      </ResponsiveScroll>

      <ConfirmModal
        visible={confirmLogout}
        title="Log out?"
        message="You will need to sign in again to use the management portal."
        confirmLabel="Log out"
        destructive
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PAGE_BACKGROUND },
  avatarCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: colors.white, letterSpacing: 1 },
  profileName: { fontSize: 20, fontWeight: '700', color: colors.darkText, marginBottom: 6, textAlign: 'center' },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 8,
  },
  roleBadgeText: { fontSize: 12, fontWeight: '700', color: '#B45309' },
  profileEmail: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
  twoColumn: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: '49%' },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF8F4',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputLocked: { backgroundColor: '#F3EEE8' },
  inputError: { borderColor: colors.statusRedText },
  input: { flex: 1, fontSize: 14, color: colors.darkText, paddingVertical: 10 },
  inputLockedText: { color: colors.textMuted },
  fieldError: { fontSize: 12, color: colors.statusRedText, marginTop: 4 },
  logoutBtn: { marginTop: 10 },
});

export default ProfileScreen;
