import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';

const CORAL  = '#EF806B';
const CREAM  = '#FFF9F3';
const DARK   = '#4A3833';
const MUTED  = '#806F68';
const WHITE  = '#FFFFFF';
const BORDER = '#E9DDD7';

/* ─────────────────────────────────────────────────────────
   REUSABLE FORM FIELD
───────────────────────────────────────────────────────── */
const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'words',
  editable = true,
  helperText = '',
  required = false,
}: {
  label: string;
  value: string;
  onChangeText?: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  editable?: boolean;
  helperText?: string;
  required?: boolean;
}) => (
  <View style={fieldStyles.wrap}>
    <Text style={fieldStyles.label}>
      {label}
      {required && <Text style={fieldStyles.required}> *</Text>}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#B5A49E"
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      editable={editable}
      style={[
        fieldStyles.input,
        !editable && fieldStyles.inputReadOnly,
      ]}
    />
    {!!helperText && (
      <Text style={fieldStyles.helper}>{helperText}</Text>
    )}
  </View>
);

const fieldStyles = StyleSheet.create({
  wrap:          { marginBottom: 18 },
  label:         { fontSize: 12.5, fontWeight: '700', color: DARK, marginBottom: 7 },
  required:      { color: CORAL },
  input: {
    height: 48, borderWidth: 1, borderColor: BORDER,
    borderRadius: 13, paddingHorizontal: 14,
    backgroundColor: WHITE, fontSize: 13, color: DARK,
  },
  inputReadOnly: { backgroundColor: '#F7F3EF', color: MUTED },
  helper:        { fontSize: 10, color: '#95847E', marginTop: 5 },
});

/* ─────────────────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────────────────── */
const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <View style={sectionStyles.wrap}>
    <View style={sectionStyles.header}>
      <Text style={sectionStyles.title}>{title}</Text>
      {!!subtitle && (
        <Text style={sectionStyles.subtitle}>{subtitle}</Text>
      )}
    </View>
    <View style={sectionStyles.card}>{children}</View>
  </View>
);

const sectionStyles = StyleSheet.create({
  wrap:     { marginBottom: 22 },
  header:   { marginBottom: 10 },
  title:    { fontSize: 16, fontWeight: '700', color: DARK },
  subtitle: { fontSize: 11.5, color: MUTED, marginTop: 2 },
  card: {
    backgroundColor: WHITE, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: '#F0E4DE',
    shadowColor: '#C6AEA1', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 1,
  },
});

/* ─────────────────────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────────────────────── */
export default function EditProfileScreen() {
  const navigation  = useNavigation<any>();
  const { user, updateUser } = useAuth();

  // Editable fields
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName,  setLastName]  = useState(user?.lastName  || '');
  const [phone,     setPhone]     = useState(user?.phone     || '');

  const [loading, setLoading] = useState(false);

  /* ── Save ── */
  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert('Required', 'First name cannot be empty.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Required', 'Last name cannot be empty.');
      return;
    }

    try {
      setLoading(true);

      const res = await studentService.updateProfile({
        firstName: firstName.trim(),
        lastName:  lastName.trim(),
        phone:     phone.trim(),
      });

      if (res?.data) {
        await updateUser({
          ...res.data,
          name: `${res.data.firstName} ${res.data.lastName}`,
        });
      }

      Alert.alert(
        'Profile Updated',
        'Your information has been saved successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update profile. Please try again.';
      Alert.alert('Update Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── UI ── */
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Header ── */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* ── Page intro ── */}
        <View style={styles.introBlock}>
          <Text style={styles.introSmall}>ACCOUNT SETTINGS</Text>
          <Text style={styles.introTitle}>Update Your Profile</Text>
          <Text style={styles.introSub}>
            Edit your personal details below. Fields marked with{' '}
            <Text style={{ color: CORAL }}>*</Text> are required.
          </Text>
        </View>

        {/* ── Personal Information ── */}
        <Section
          title="Personal Information"
          subtitle="Your full legal name as registered"
        >
          <Field
            label="First Name"
            required
            value={firstName}
            onChangeText={setFirstName}
            placeholder="e.g. Sarah"
            autoCapitalize="words"
          />
          <Field
            label="Last Name"
            required
            value={lastName}
            onChangeText={setLastName}
            placeholder="e.g. Fernando"
            autoCapitalize="words"
          />
        </Section>

        {/* ── Academic Information ── */}
        <Section
          title="Academic Information"
          subtitle="Your university enrollment details (read-only)"
        >
          <Field
            label="Student ID"
            value={user?.studentId || '—'}
            editable={false}
            helperText="Student ID cannot be changed."
          />
          <Field
            label="Faculty"
            value={user?.faculty || '—'}
            editable={false}
          />
          <Field
            label="Degree Program"
            value={user?.degreeProgram || '—'}
            editable={false}
          />
          <Field
            label="Year of Study"
            value={user?.yearOfStudy || '—'}
            editable={false}
          />
        </Section>

        {/* ── Contact Information ── */}
        <Section
          title="Contact Information"
          subtitle="How we can reach you"
        >
          <Field
            label="University Email"
            value={user?.email || '—'}
            editable={false}
            helperText="Email address cannot be changed."
          />
          <Field
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="e.g. +94 77 123 4567"
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </Section>

        {/* ── Privacy notice ── */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>Privacy & Data</Text>
          <Text style={styles.privacyText}>
            Your personal information is stored securely and handled in
            accordance with the UWell privacy policy.
          </Text>
        </View>

        {/* ── Buttons ── */}
        <Pressable
          style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={WHITE} />
            : <Text style={styles.saveBtnText}>Save Changes</Text>
          }
        </Pressable>

        <Pressable
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ─────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  safeArea:  { flex: 1, backgroundColor: CREAM },
  container: { paddingHorizontal: 22, paddingBottom: 40 },

  // Header
  header: {
    height: 58, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: WHITE, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#F0E4DE',
  },
  backArrow:    { fontSize: 28, color: MUTED, fontWeight: '400', marginTop: -2 },
  headerTitle:  { fontSize: 17, fontWeight: '700', color: DARK },
  headerSpacer: { width: 40 },

  // Intro
  introBlock: { marginTop: 4, marginBottom: 24 },
  introSmall: {
    fontSize: 10, fontWeight: '700', color: CORAL,
    letterSpacing: 1.2, marginBottom: 5,
  },
  introTitle: { fontSize: 26, fontWeight: '800', color: DARK, lineHeight: 32 },
  introSub:   { fontSize: 12.5, color: MUTED, lineHeight: 18, marginTop: 6 },

  // Privacy
  privacyCard: {
    backgroundColor: '#F7F3EF', borderRadius: 16,
    padding: 15, marginBottom: 22,
    borderWidth: 1, borderColor: '#EFE5DE',
  },
  privacyTitle: { fontSize: 13, fontWeight: '700', color: DARK, marginBottom: 5 },
  privacyText:  { fontSize: 11.5, color: MUTED, lineHeight: 17 },

  // Save button
  saveBtn: {
    height: 52, backgroundColor: CORAL, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: CORAL, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 8, elevation: 3,
  },
  saveBtnDisabled: { backgroundColor: '#D4B3AB', shadowOpacity: 0, elevation: 0 },
  saveBtnText:     { fontSize: 15, fontWeight: '700', color: WHITE },

  // Cancel button
  cancelBtn: {
    height: 48, backgroundColor: WHITE,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 17, alignItems: 'center',
    justifyContent: 'center', marginTop: 10,
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: MUTED },
});
