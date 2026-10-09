import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import NavigationHeader from '../../components/navigation/Header';
import { managementService } from '../../services/managementService';

const MIN_PASSWORD_LENGTH = 8;

const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : 'Never');

const PrivacySecurityScreen = ({ navigation }) => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState(null); // { type: 'error' | 'success', text }

  const load = useCallback(async () => {
    try {
      setError('');
      setInfo(await managementService.getSecurityInfo());
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load security information. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChangePassword = async () => {
    setFormMessage(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormMessage({ type: 'error', text: 'Fill in all three password fields.' });
      return;
    }
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setFormMessage({ type: 'error', text: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setSaving(true);
    try {
      await managementService.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFormMessage({ type: 'success', text: 'Password changed. Use the new password next time you sign in.' });
      await load();
    } catch (err) {
      setFormMessage({
        type: 'error',
        text: err.response?.data?.message || 'Could not change the password. Check your connection.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <NavigationHeader title="Privacy & Security" />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
      }
    >
      <NavigationHeader title="Privacy & Security" />

      <View style={styles.content}>
        {error ? (
          <Card style={styles.card}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        ) : (
          <>
            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Your Account</Text>
              <InfoRow label="Name" value={info.account.fullName} />
              <InfoRow label="Email" value={info.account.email} />
              <InfoRow label="Employee ID" value={info.account.employeeId} />
              <InfoRow label="Last sign-in" value={formatDateTime(info.account.lastLogin)} />
              <InfoRow
                label="Password changed"
                value={info.account.passwordChangedAt ? formatDateTime(info.account.passwordChangedAt) : 'Not since account creation'}
              />
            </Card>

            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Recent Sign-ins</Text>
              {info.recentLogins.length === 0 ? (
                <Text style={styles.emptyText}>Sign-ins are recorded from your next login onward.</Text>
              ) : (
                info.recentLogins.map((at) => (
                  <Text key={at} style={styles.loginRow}>{formatDateTime(at)}</Text>
                ))
              )}
            </Card>
          </>
        )}

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Change Password</Text>

          <Text style={styles.fieldLabel}>Current password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.fieldLabel}>New password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            placeholderTextColor={colors.textMuted}
          />

          <Text style={styles.fieldLabel}>Confirm new password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat new password"
            placeholderTextColor={colors.textMuted}
          />

          {formMessage && (
            <Text style={formMessage.type === 'error' ? styles.errorText : styles.successText}>
              {formMessage.text}
            </Text>
          )}

          <Button title="Update Password" onPress={handleChangePassword} loading={saving} style={styles.button} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>How your data is protected</Text>
          <Text style={styles.noteText}>
            Passwords are stored hashed, never as plain text. Management features require a signed-in
            management account, and sessions expire automatically. Student mood and appointment
            details are only shown in summary form on this account.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    padding: spacing.lg,
  },
  loader: {
    marginTop: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  infoRow: {
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
  },
  infoValue: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  loginRow: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: typography.fontSize.md,
  },
  fieldLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.md,
    color: colors.text,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.md,
    marginTop: spacing.md,
  },
  successText: {
    color: colors.success,
    fontSize: typography.fontSize.md,
    marginTop: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
  noteText: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    lineHeight: 22,
  },
});

export default PrivacySecurityScreen;
