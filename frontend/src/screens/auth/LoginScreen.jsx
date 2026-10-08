import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { validateEmail, validatePassword } from '../../utils/validation';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { USER_ROLES } from '../../utils/constants';

const { width } = Dimensions.get('window');

// ─── Role card data ────────────────────────────────────────────────────────
const ROLES = [
  {
    key: USER_ROLES.STUDENT,
    label: 'Student',
    desc: 'Get support and book sessions',
    iconLib: 'Ionicons',
    iconName: 'school-outline',
    bg: '#FDF1EC',
    activeBg: colors.primary,
    color: colors.primary,
  },
  {
    key: USER_ROLES.COUNSELOR,
    label: 'Counselor',
    desc: 'Manage your sessions',
    iconLib: 'Ionicons',
    iconName: 'person-circle-outline',
    bg: '#FDF1EC',
    activeBg: '#FDF1EC',
    color: colors.primary,
  },
  {
    key: USER_ROLES.WELFARE,
    label: 'Welfare',
    desc: 'Oversee student wellbeing',
    iconLib: 'MaterialCommunityIcons',
    iconName: 'heart-outline',
    bg: '#E8F8EF',
    activeBg: '#E8F8EF',
    color: '#397052',
  },
  {
    key: USER_ROLES.MANAGEMENT,
    label: 'Management',
    desc: 'Admin and system access',
    iconLib: 'Ionicons',
    iconName: 'settings-outline',
    bg: '#F3EEFF',
    activeBg: '#F3EEFF',
    color: '#7C5CBF',
  },
];

// ─── Role card icon renderer ───────────────────────────────────────────────
const RoleIcon = ({ lib, name, size, color }) => {
  if (lib === 'MaterialCommunityIcons')
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  return <Ionicons name={name} size={size} color={color} />;
};

// ─── Decorative illustration (no external assets) ─────────────────────────
const HeroIllustration = ({ floatAnim }) => (
  <Animated.View
    style={[styles.illustWrap, { transform: [{ translateY: floatAnim }] }]}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  >
    {/* Soft blob */}
    <View style={styles.illustBlob} />
    {/* Doctor figure placeholder */}
    <View style={styles.illustFigure}>
      {/* Head */}
      <View style={styles.illustHead}>
        <Ionicons name="person" size={38} color={colors.primary} style={{ opacity: 0.7 }} />
      </View>
      {/* Clipboard */}
      <View style={styles.illustClipboard}>
        <View style={styles.illustClipTop} />
        <View style={styles.illustClipBody}>
          {[65, 50, 65].map((w, i) => (
            <View
              key={i}
              style={[styles.illustLine, { width: `${w}%`, backgroundColor: i === 0 ? colors.primary : colors.border }]}
            />
          ))}
        </View>
      </View>
    </View>
    {/* Heart badge */}
    <View style={styles.illustHeartBadge}>
      <Ionicons name="heart" size={13} color={colors.primary} />
    </View>
    {/* Info badge */}
    <View style={styles.illustInfoBadge}>
      <Text style={styles.illustInfoText}>Supporting{'\n'}brighter{'\n'}tomorrows</Text>
    </View>
    {/* Leaf dots */}
    <View style={[styles.leafDot, { bottom: 10, left: 6, backgroundColor: 'rgba(80,200,120,0.35)' }]} />
    <View style={[styles.leafDot, { top: 10, right: 10, width: 7, height: 7, backgroundColor: 'rgba(232,131,107,0.4)' }]} />
  </Animated.View>
);

// ─── Main screen ──────────────────────────────────────────────────────────
const LoginScreen = ({ navigation }) => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [role, setRole]             = useState(USER_ROLES.STUDENT);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -6, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue:  0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();

    return () => floatAnim.stopAnimation();
  }, []);

  const handleLogin = async () => {
    const newErrors = {};
    if (!validateEmail(email))    newErrors.email    = 'Please enter a valid email';
    if (!validatePassword(password)) newErrors.password = 'Password must be at least 6 characters';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    try {
      setLoading(true);
      setErrors({});
      const response = await authService.login(email, password, role);
      await login({ ...response.user, token: response.token });
    } catch (error) {
      const isPending = error.response?.data?.isPendingApproval;
      setErrors({
        general: error.response?.data?.message || error.message || 'Login failed. Please try again.',
        isPendingApproval: !!isPending,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Hero row ──────────────────────────────────────── */}
          <Animated.View style={[styles.heroRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Left text */}
            <View style={styles.heroText}>
              <Text style={styles.welcomeLine1}>Welcome</Text>
              <Text style={styles.welcomeLine2}>Back!</Text>
              <Text style={styles.heroSub}>
                Sign in to continue and{'\n'}make a positive difference{'\n'}today.
              </Text>
            </View>
            {/* Right illustration */}
            <HeroIllustration floatAnim={floatAnim} />
          </Animated.View>

          {/* ── Role selector ─────────────────────────────────── */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.roleLabelRow}>
              <Text style={styles.roleTitle}>Select your role</Text>
              <Text style={styles.roleHint}>Choose how you want to continue</Text>
            </View>

            <View style={styles.roleGrid}>
              {ROLES.map(r => {
                const isActive = role === r.key;
                const studentActive = isActive && r.key === USER_ROLES.STUDENT;
                return (
                  <TouchableOpacity
                    key={r.key}
                    style={[
                      styles.roleCard,
                      { backgroundColor: studentActive ? colors.primary : colors.white },
                      isActive && !studentActive && styles.roleCardActiveBorder,
                    ]}
                    onPress={() => setRole(r.key)}
                    activeOpacity={0.8}
                    accessibilityRole="radio"
                    accessibilityLabel={`${r.label}: ${r.desc}`}
                    accessibilityState={{ selected: isActive }}
                  >
                    <View style={[
                      styles.roleIconCircle,
                      { backgroundColor: studentActive ? 'rgba(255,255,255,0.25)' : r.bg },
                    ]}>
                      <RoleIcon
                        lib={r.iconLib}
                        name={r.iconName}
                        size={22}
                        color={studentActive ? colors.white : r.color}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.roleLabel, studentActive && { color: colors.white }]}>
                        {r.label}
                      </Text>
                      <Text style={[styles.roleDesc, studentActive && { color: 'rgba(255,255,255,0.85)' }]}>
                        {r.desc}
                      </Text>
                    </View>
                    {isActive && (
                      <View style={[styles.roleCheck, studentActive && styles.roleCheckWhite]}>
                        <Feather name="check" size={11} color={studentActive ? colors.primary : colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* ── Email field ───────────────────────────────────── */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.inputBox, errors.email && styles.inputBoxError]}>
              <Feather name="mail" size={18} color={errors.email ? colors.error : colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.inputText}
                value={email}
                onChangeText={t => { setEmail(t); setErrors(e => ({ ...e, email: undefined })); }}
                placeholder="Enter your email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Email address"
              />
            </View>
            {errors.email && <Text style={styles.errorMsg}>{errors.email}</Text>}

            {/* ── Password field ──────────────────────────────── */}
            <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Password</Text>
            <View style={[styles.inputBox, errors.password && styles.inputBoxError]}>
              <Feather name="lock" size={18} color={errors.password ? colors.error : colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.inputText, { flex: 1 }]}
                value={password}
                onChangeText={t => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(v => !v)}
                style={styles.eyeBtn}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorMsg}>{errors.password}</Text>}

            {/* Remember me + Forgot */}
            <View style={styles.rememberRow}>
              <TouchableOpacity
                style={styles.rememberLeft}
                onPress={() => setRememberMe(v => !v)}
                activeOpacity={0.8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                accessibilityLabel="Remember me"
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                  {rememberMe && <Feather name="check" size={11} color={colors.white} />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity accessibilityLabel="Forgot password">
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* General error or Pending Approval Banner */}
            {errors.general && (
              errors.isPendingApproval ? (
                <View style={styles.pendingBox}>
                  <View style={styles.pendingHeaderRow}>
                    <Feather name="clock" size={16} color="#B45309" />
                    <Text style={styles.pendingTitle}>Account Pending Approval</Text>
                  </View>
                  <Text style={styles.pendingMessage}>{errors.general}</Text>
                  <Text style={styles.pendingSubtext}>
                    A university manager must approve your registration from the Management Dashboard before you can sign in.
                  </Text>
                </View>
              ) : (
                <View style={styles.generalErrorBox}>
                  <Feather name="alert-circle" size={14} color={colors.statusRedText} />
                  <Text style={styles.generalErrorText}>{errors.general}</Text>
                </View>
              )
            )}

            {/* ── Login button ──────────────────────────────── */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.75 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Login"
            >
              {loading ? (
                <Text style={styles.loginBtnText}>Signing in…</Text>
              ) : (
                <>
                  <Text style={styles.loginBtnText}>Login</Text>
                  <View style={styles.loginArrowCircle}>
                    <Feather name="arrow-right" size={18} color={colors.primary} />
                  </View>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* ── Register strip ────────────────────────────────── */}
          <Animated.View style={[styles.registerStrip, { opacity: fadeAnim }]}>
            {/* Leaf decorations */}
            <View style={styles.stripLeafLeft}>
              <Ionicons name="leaf-outline" size={22} color="rgba(80,200,120,0.5)" />
            </View>
            <View style={styles.stripTextWrap}>
              <Text style={styles.stripTitle}>Don't have an account?</Text>
              <Text style={styles.stripSub}>Join us and be part of a healthier, happier campus.</Text>
            </View>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Register for an account"
            >
              <Text style={styles.registerBtnText}>Register</Text>
              <Feather name="arrow-right" size={14} color={colors.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            <View style={styles.stripLeafRight}>
              <Ionicons name="leaf-outline" size={22} color="rgba(80,200,120,0.5)" style={{ transform: [{ scaleX: -1 }] }} />
            </View>
          </Animated.View>

          <View style={{ height: spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────
const ROLE_CARD_W = (width - spacing.md * 2 - spacing.sm) / 2;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  // ── Hero ─────────────────────────────────────────────────────
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  heroText: {
    flex: 1,
  },
  welcomeLine1: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.darkText,
    lineHeight: 40,
  },
  welcomeLine2: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 40,
    marginBottom: spacing.sm,
  },
  heroSub: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  // ── Illustration ─────────────────────────────────────────────
  illustWrap: {
    width: 130,
    height: 140,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  illustBlob: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.softCoral,
    top: 10,
    right: 0,
  },
  illustFigure: {
    alignItems: 'center',
    zIndex: 2,
  },
  illustHead: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  illustClipboard: {
    width: 52,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  illustClipTop: {
    height: 12,
    backgroundColor: colors.primary,
  },
  illustClipBody: {
    flex: 1,
    padding: 7,
    gap: 4,
    justifyContent: 'center',
  },
  illustLine: {
    height: 4,
    borderRadius: 2,
  },
  illustHeartBadge: {
    position: 'absolute',
    top: 4,
    left: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 3,
  },
  illustInfoBadge: {
    position: 'absolute',
    top: 4,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 3,
    maxWidth: 72,
  },
  illustInfoText: {
    fontSize: 9,
    color: colors.textSecondary,
    lineHeight: 13,
    textAlign: 'center',
  },
  leafDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 1,
  },

  // ── Role selector ─────────────────────────────────────────────
  roleLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.darkText,
  },
  roleHint: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  roleCard: {
    width: ROLE_CARD_W,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  roleCardActiveBorder: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  roleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 2,
  },
  roleDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  roleCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  roleCheckWhite: {
    backgroundColor: colors.white,
  },

  // ── Inputs ───────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: spacing.sm,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputBoxError: {
    borderColor: colors.error,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: colors.darkText,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 8,
  },
  errorMsg: {
    fontSize: 11,
    color: colors.error,
    marginTop: 5,
    marginLeft: 4,
  },

  // ── Remember me + Forgot ─────────────────────────────────────
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  forgotText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },

  // ── General error ─────────────────────────────────────────────
  generalErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.statusRedBg,
    borderRadius: 10,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  generalErrorText: {
    fontSize: 12,
    color: colors.statusRedText,
    flex: 1,
  },
  pendingBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 12,
    marginBottom: spacing.md,
  },
  pendingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  pendingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },
  pendingMessage: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 17,
  },
  pendingSubtext: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 6,
    fontStyle: 'italic',
  },

  // ── Login button ─────────────────────────────────────────────
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 10,
    elevation: 5,
  },
  loginBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  loginArrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Register strip ────────────────────────────────────────────
  registerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  stripLeafLeft: {
    flexShrink: 0,
  },
  stripLeafRight: {
    flexShrink: 0,
  },
  stripTextWrap: {
    flex: 1,
  },
  stripTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 2,
  },
  stripSub: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexShrink: 0,
  },
  registerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default LoginScreen;
