import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme';
import NavigationHeader from '../../components/navigation/Header';
import { managementService } from '../../services/managementService';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/management/ConfirmModal';
import useSessionGuard from '../../components/management/useSessionGuard';
import {
  ResponsiveScroll,
  SectionCard,
  Banner,
  LoadingState,
  ErrorState,
  InfoRow,
  ActionButton,
  PAGE_BACKGROUND,
} from '../../components/management/ManagementUI';

const MIN_PASSWORD_LENGTH = 8;

const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : 'Never');

/** Password box with a show/hide toggle. */
const PasswordField = ({ label, value, onChangeText, placeholder }) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel={label}
        />
        <TouchableOpacity
          onPress={() => setVisible((v) => !v)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel={visible ? `Hide ${label}` : `Show ${label}`}
        >
          <Feather name={visible ? 'eye-off' : 'eye'} size={18} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Rule = ({ ok, text }) => (
  <View style={styles.ruleRow}>
    <Feather name={ok ? 'check-circle' : 'circle'} size={14} color={ok ? colors.statusGreenText : colors.textMuted} />
    <Text style={[styles.ruleText, ok && { color: colors.statusGreenText }]}>{text}</Text>
  </View>
);

const PrivacySecurityScreen = () => {
  const { logout } = useAuth();
  const handleError = useSessionGuard();

  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 6000);
  };

  const load = useCallback(async () => {
    try {
      setError('');
      setInfo(await managementService.getSecurityInfo());
    } catch (err) {
      setError(handleError(err, 'Could not load security information.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [handleError]);

  useEffect(() => { load(); }, [load]);

  const longEnough = newPassword.length >= MIN_PASSWORD_LENGTH;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const strong = longEnough && hasUpper && hasLower && hasNumber && hasSpecial;
  const differs = !!newPassword && newPassword !== currentPassword;
  const matches = !!confirmPassword && newPassword === confirmPassword;
  const canSubmit = !!currentPassword && strong && differs && matches;

  const handleChangePassword = async () => {
    if (!canSubmit) {
      showBanner('error', 'Fill in all fields and meet the password rules first.');
      return;
    }
    setSaving(true);
    try {
      await managementService.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showBanner('success', 'Password changed. Use the new password next time you sign in.');
      await load();
    } catch (err) {
      showBanner('error', handleError(err, 'Could not change the password.'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await authService.logout(); } catch (e) { /* local sign-out is enough */ }
    setConfirmLogout(false);
    if (logout) await logout();
  };

  return (
    <View style={styles.container}>
      <NavigationHeader title="Privacy & Security" />

      <ResponsiveScroll refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }}>
        {banner ? <Banner type={banner.type} message={banner.message} /> : null}

        {loading ? (
          <LoadingState text="Loading account details..." />
        ) : error || !info ? (
          <ErrorState message={error || 'No data available.'} onRetry={() => { setLoading(true); load(); }} />
        ) : (
          <>
            <SectionCard title="Your account" icon="user" iconTone="info">
              <InfoRow label="Name" value={info.account.fullName} bold />
              <InfoRow label="Email" value={info.account.email} />
              <InfoRow label="Employee ID" value={info.account.employeeId} />
              <InfoRow label="Last sign-in" value={formatDateTime(info.account.lastLogin)} />
              <InfoRow
                label="Password changed"
                value={info.account.passwordChangedAt ? formatDateTime(info.account.passwordChangedAt) : 'Not since account creation'}
              />
            </SectionCard>

            <SectionCard title="Recent sign-ins" icon="clock" iconTone="warning">
              {info.recentLogins.length === 0 ? (
                <Text style={styles.mutedText}>Sign-ins are recorded from your next login onward.</Text>
              ) : (
                info.recentLogins.map((at) => (
                  <View key={at} style={styles.loginRow}>
                    <Feather name="log-in" size={14} color={colors.textMuted} />
                    <Text style={styles.loginText}>{formatDateTime(at)}</Text>
                  </View>
                ))
              )}
            </SectionCard>
          </>
        )}

        <SectionCard title="Change password" icon="lock" iconTone="success">
          <PasswordField label="Current password" value={currentPassword} onChangeText={setCurrentPassword} placeholder="Enter current password" />
          <PasswordField label="New password" value={newPassword} onChangeText={setNewPassword} placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`} />
          <PasswordField label="Confirm new password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Repeat new password" />

          <View style={styles.rules}>
            <Rule ok={longEnough} text={`At least ${MIN_PASSWORD_LENGTH} characters`} />
            <Rule ok={hasUpper && hasLower} text="Upper and lower case letters" />
            <Rule ok={hasNumber} text="A number" />
            <Rule ok={hasSpecial} text="A special character, e.g. ! or @" />
            <Rule ok={differs} text="Different from the current password" />
            <Rule ok={matches} text="Confirmation matches" />
          </View>

          <ActionButton
            title="Update password"
            icon="check"
            loading={saving}
            disabled={!canSubmit}
            onPress={handleChangePassword}
            style={{ marginTop: 6 }}
          />
        </SectionCard>

        <SectionCard title="How your data is protected" icon="shield" iconTone="info">
          <Text style={styles.mutedText}>
            Passwords are stored hashed, never as plain text. Management features require a signed-in
            management account, and sessions expire automatically after 7 days.
          </Text>
        </SectionCard>

        <ActionButton
          title="Log out"
          icon="log-out"
          variant="danger"
          onPress={() => setConfirmLogout(true)}
          style={styles.logoutBtn}
        />
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
  mutedText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  loginRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  loginText: { fontSize: 13, color: colors.darkText, marginLeft: 8 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBF8F4',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  input: { flex: 1, fontSize: 14, color: colors.darkText, paddingVertical: 10 },
  rules: { marginBottom: 10 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 3 },
  ruleText: { fontSize: 12, color: colors.textMuted, marginLeft: 8 },
  logoutBtn: { marginTop: 2 },
});

export default PrivacySecurityScreen;
