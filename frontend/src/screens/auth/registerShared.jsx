/**
 * registerShared.jsx
 * Shared components, validation helpers, and styles used by all four
 * role-specific registration screens. Import from here — do NOT duplicate.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

// ─── Password strength ────────────────────────────────────────────────────
export const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', checks: { len: false, upper: false, lower: false, num: false, special: false } };
  const checks = {
    len:     pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    num:     /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const labels = ['', 'Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] || '', checks };
};

// ─── Field-level validators (return error string or null) ─────────────────
export const validators = {
  required:  (v, label = 'This field') => (v?.trim() ? null : `${label} is required`),
  email:     (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v?.trim()) ? null : 'Enter a valid email address'),
  name:      (v, label = 'Name') => {
    const t = v?.trim() ?? '';
    if (!t) return `${label} is required`;
    if (t.length < 2) return `${label} must be at least 2 characters`;
    if (t.length > 50) return `${label} must be 50 characters or fewer`;
    return null;
  },
  id:        (v, label = 'ID') => {
    const t = v?.trim() ?? '';
    if (!t) return `${label} is required`;
    if (!/^[A-Za-z0-9]{5,20}$/.test(t)) return `${label} must be 5–20 alphanumeric characters`;
    return null;
  },
  phone:     (v) => {
    if (!v?.trim()) return null; // phone is often optional
    return /^[+]?[0-9\s\-()]{7,15}$/.test(v.trim()) ? null : 'Enter a valid phone number';
  },
  password:  (v) => {
    const { checks } = getPasswordStrength(v);
    if (!v) return 'Password is required';
    if (!checks.len)     return 'Password must be at least 8 characters';
    if (!checks.upper)   return 'Include at least one uppercase letter';
    if (!checks.lower)   return 'Include at least one lowercase letter';
    if (!checks.num)     return 'Include at least one number';
    if (!checks.special) return 'Include at least one special character';
    return null;
  },
  confirmPw: (v, pw) => {
    if (!v) return 'Please confirm your password';
    return v === pw ? null : 'Passwords do not match';
  },
  dropdown: (v, label = 'Selection') => (v?.trim() ? null : `${label} is required`),
};

// ─── FormField — label + input + error + success hint ────────────────────
export const FormField = ({
  label,
  required = false,
  value,
  onChangeText,
  onBlur,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  showToggle = false,          // for password fields
  showHide,                    // boolean state from parent
  onToggleShow,                // handler from parent
  error,
  success,                     // show green ✓ when true
  style,
}) => (
  <View style={[ffStyles.wrap, style]}>
    <Text style={ffStyles.label}>
      {label}
      {required && <Text style={ffStyles.req}> *</Text>}
    </Text>

    <View style={[
      ffStyles.inputWrap,
      error   && ffStyles.inputWrapError,
      success && ffStyles.inputWrapSuccess,
    ]}>
      <TextInput
        style={[ffStyles.input, showToggle && { paddingRight: 44 }]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        secureTextEntry={secureTextEntry && !showHide}
      />
      {showToggle && (
        <TouchableOpacity
          style={ffStyles.eyeBtn}
          onPress={onToggleShow}
          accessibilityLabel={showHide ? 'Hide password' : 'Show password'}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name={showHide ? 'eye' : 'eye-off'} size={17} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>

    {error ? (
      <View style={ffStyles.hintRow}>
        <Feather name="alert-circle" size={12} color={colors.error} style={{ marginRight: 4 }} />
        <Text style={ffStyles.errorText}>{error}</Text>
      </View>
    ) : success ? (
      <View style={ffStyles.hintRow}>
        <Feather name="check-circle" size={12} color={colors.statusGreenText} style={{ marginRight: 4 }} />
        <Text style={ffStyles.successText}>Looks good</Text>
      </View>
    ) : null}
  </View>
);

const ffStyles = StyleSheet.create({
  wrap:  { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: colors.darkText, marginBottom: 6 },
  req:   { color: colors.primary },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    minHeight: 52,
    paddingHorizontal: 14,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  inputWrapError:   { borderColor: colors.error },
  inputWrapSuccess: { borderColor: colors.statusGreenText },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.darkText,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 2 },
  errorText:   { fontSize: 11, color: colors.error,            flex: 1 },
  successText: { fontSize: 11, color: colors.statusGreenText,  flex: 1 },
});

// ─── DropdownField — simple modal-less picker ─────────────────────────────
export const DropdownField = ({
  label,
  required = false,
  value,
  onSelect,
  options,         // array of strings
  placeholder = 'Select an option',
  error,
  success,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={ddStyles.wrap}>
      <Text style={ddStyles.label}>
        {label}
        {required && <Text style={{ color: colors.primary }}> *</Text>}
      </Text>

      <TouchableOpacity
        style={[
          ddStyles.trigger,
          error   && ddStyles.triggerError,
          success && ddStyles.triggerSuccess,
        ]}
        onPress={() => setOpen(o => !o)}
        accessibilityLabel={`${label} dropdown`}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: open }}
      >
        <Text style={[ddStyles.triggerText, !value && { color: colors.textMuted }]}>
          {value || placeholder}
        </Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      {open && (
        <View style={ddStyles.menu}>
          {options.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[ddStyles.option, opt === value && ddStyles.optionActive]}
              onPress={() => { onSelect(opt); setOpen(false); }}
              accessibilityLabel={opt}
              accessibilityRole="option"
              accessibilityState={{ selected: opt === value }}
            >
              <Text style={[ddStyles.optionText, opt === value && ddStyles.optionTextActive]}>
                {opt}
              </Text>
              {opt === value && <Feather name="check" size={14} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Feather name="alert-circle" size={12} color={colors.error} style={{ marginRight: 4 }} />
          <Text style={{ fontSize: 11, color: colors.error }}>{error}</Text>
        </View>
      ) : success ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <Feather name="check-circle" size={12} color={colors.statusGreenText} style={{ marginRight: 4 }} />
          <Text style={{ fontSize: 11, color: colors.statusGreenText }}>Looks good</Text>
        </View>
      ) : null}
    </View>
  );
};

const ddStyles = StyleSheet.create({
  wrap: { marginBottom: 14, zIndex: 10 },
  label: { fontSize: 13, fontWeight: '600', color: colors.darkText, marginBottom: 6 },
  trigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.white, borderRadius: 14, borderWidth: 1.5,
    borderColor: colors.border, minHeight: 52, paddingHorizontal: 14,
  },
  triggerError:   { borderColor: colors.error },
  triggerSuccess: { borderColor: colors.statusGreenText },
  triggerText: { fontSize: 14, color: colors.darkText, flex: 1 },
  menu: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 4,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 13, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  optionActive:     { backgroundColor: colors.softCoral },
  optionText:       { fontSize: 14, color: colors.darkText },
  optionTextActive: { color: colors.primary, fontWeight: '600' },
});

// ─── PasswordStrengthBar ──────────────────────────────────────────────────
export const PasswordStrengthBar = ({ password }) => {
  const { score, label, checks } = getPasswordStrength(password);
  if (!password) return null;

  const barColor = ['', colors.error, colors.error, colors.statusYellowText, colors.statusGreenText, colors.statusGreenText][score];
  const barWidth = `${(score / 5) * 100}%`;

  return (
    <View style={psStyles.wrap}>
      {/* Bar */}
      <View style={psStyles.track}>
        <View style={[psStyles.bar, { width: barWidth, backgroundColor: barColor }]} />
      </View>
      <Text style={[psStyles.label, { color: barColor }]}>{label}</Text>

      {/* Criteria */}
      <View style={psStyles.checks}>
        {[
          { key: 'len',     text: '8+ characters' },
          { key: 'upper',   text: 'Uppercase letter' },
          { key: 'lower',   text: 'Lowercase letter' },
          { key: 'num',     text: 'Number' },
          { key: 'special', text: 'Special character' },
        ].map(c => (
          <View key={c.key} style={psStyles.checkRow}>
            <Feather
              name={checks[c.key] ? 'check-circle' : 'circle'}
              size={11}
              color={checks[c.key] ? colors.statusGreenText : colors.textMuted}
              style={{ marginRight: 5 }}
            />
            <Text style={[psStyles.checkText, checks[c.key] && psStyles.checkTextDone]}>
              {c.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const psStyles = StyleSheet.create({
  wrap:  { marginTop: 8, marginBottom: 4 },
  track: { height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: 4, overflow: 'hidden' },
  bar:   { height: '100%', borderRadius: 2 },
  label: { fontSize: 11, fontWeight: '600', textAlign: 'right', marginBottom: 8 },
  checks: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  checkRow:      { flexDirection: 'row', alignItems: 'center', minWidth: '45%' },
  checkText:     { fontSize: 10, color: colors.textMuted },
  checkTextDone: { color: colors.statusGreenText },
});

// ─── SectionCard ─────────────────────────────────────────────────────────
export const SectionCard = ({ iconName, iconColor = colors.primary, iconBg = colors.softCoral, title, subtitle, children }) => (
  <View style={scStyles.card}>
    <View style={scStyles.header}>
      <View style={[scStyles.iconCircle, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={19} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={scStyles.title}>{title}</Text>
        {subtitle ? <Text style={scStyles.sub}>{subtitle}</Text> : null}
      </View>
    </View>
    {children}
  </View>
);

const scStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  title: { fontSize: 13, fontWeight: '700', color: colors.darkText, letterSpacing: 0.4, marginBottom: 2 },
  sub:   { fontSize: 11, color: colors.textSecondary, lineHeight: 15 },
});

// ─── TermsCheckbox ────────────────────────────────────────────────────────
export const TermsCheckbox = ({ checked, onToggle, error }) => (
  <View>
    <TouchableOpacity
      style={tcStyles.row}
      onPress={onToggle}
      activeOpacity={0.8}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel="I agree to the Terms of Service and Privacy Policy"
    >
      <View style={[tcStyles.box, checked && tcStyles.boxChecked, error && tcStyles.boxError]}>
        {checked && <Feather name="check" size={12} color={colors.white} />}
      </View>
      <Text style={tcStyles.text}>
        I agree to the{' '}
        <Text style={tcStyles.link}>Terms of Service</Text>
        {' '}and{' '}
        <Text style={tcStyles.link}>Privacy Policy</Text>
      </Text>
    </TouchableOpacity>
    {error && (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 2 }}>
        <Feather name="alert-circle" size={12} color={colors.error} style={{ marginRight: 4 }} />
        <Text style={{ fontSize: 11, color: colors.error }}>You must accept the terms to continue</Text>
      </View>
    )}
  </View>
);

const tcStyles = StyleSheet.create({
  row:        { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  box: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  boxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  boxError:   { borderColor: colors.error },
  text:       { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  link:       { color: colors.primary, fontWeight: '600' },
});

// ─── SuccessView ─────────────────────────────────────────────────────────
export const SuccessView = ({ role, onLogin }) => (
  <View style={svStyles.wrap}>
    <View style={svStyles.circle}>
      <Feather name="check" size={40} color={colors.white} />
    </View>
    <Text style={svStyles.title}>Account Created!</Text>
    <Text style={svStyles.sub}>
      Your {role} account has been created successfully.{'\n'}You can now sign in.
    </Text>
    <TouchableOpacity style={svStyles.btn} onPress={onLogin} accessibilityRole="button">
      <Text style={svStyles.btnText}>Go to Login</Text>
    </TouchableOpacity>
  </View>
);

const svStyles = StyleSheet.create({
  wrap:   { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  circle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.statusGreenText,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.statusGreenText,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.darkText, marginBottom: 12, textAlign: 'center' },
  sub:   { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  btn: {
    backgroundColor: colors.primary, borderRadius: 16,
    paddingVertical: 14, paddingHorizontal: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3,
    shadowRadius: 8, elevation: 4,
  },
  btnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
});

// ─── General error banner ─────────────────────────────────────────────────
export const ErrorBanner = ({ message }) =>
  message ? (
    <View style={ebStyles.wrap}>
      <Feather name="alert-circle" size={14} color={colors.statusRedText} style={{ marginRight: 8 }} />
      <Text style={ebStyles.text}>{message}</Text>
    </View>
  ) : null;

const ebStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.statusRedBg, borderRadius: 12,
    padding: 12, marginBottom: 12,
  },
  text: { flex: 1, fontSize: 12, color: colors.statusRedText },
});

// ─── Shared screen-level styles ───────────────────────────────────────────
export const sharedStyles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.creamBackground },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 48 },

  // Nav bar
  navBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 10,
    backgroundColor: colors.creamBackground,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08,
    shadowRadius: 4, elevation: 2,
  },

  // Page header
  pageHeader: { marginBottom: 20, marginTop: 8 },
  pageTitle:  { fontSize: 24, fontWeight: '700', color: colors.darkText, lineHeight: 30, marginBottom: 4 },
  pageSub:    { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  // Role badge
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.softCoral,
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20, marginBottom: 6,
  },
  roleBadgeText: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 0.8 },

  // Primary CTA
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, borderRadius: 18, height: 56,
    marginTop: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3,
    shadowRadius: 10, elevation: 5,
  },
  submitBtnText: { color: colors.white, fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  // Login link
  loginLink: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 18, marginBottom: 8,
  },
  loginLinkText:   { fontSize: 13, color: colors.textSecondary },
  loginLinkAction: { fontSize: 13, color: colors.primary, fontWeight: '700', marginLeft: 4 },
});
