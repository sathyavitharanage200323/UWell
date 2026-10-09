import React, { useState } from 'react';
import {
  StatusBar, ScrollView, View, Text,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme';
import { authService } from '../../services/authService';
import {
  FormField, DropdownField, PasswordStrengthBar,
  SectionCard, TermsCheckbox, SuccessView, ErrorBanner,
  sharedStyles, validators,
} from './registerShared';

const DEPARTMENTS = ['IT Services','Finance & Accounting','Human Resources','Academic Administration','Registry','Student Services','Research & Development','Facilities Management','Other'];
const POSITIONS   = ['System Administrator','IT Manager','Operations Manager','Director','Deputy Director','Senior Manager','Coordinator','Analyst','Other'];

const INIT = { firstName:'', lastName:'', employeeId:'', department:'', position:'', workEmail:'', phone:'', password:'', confirmPassword:'' };

export default function ManagementRegisterScreen({ navigation }) {
  const [f, setF]         = useState(INIT);
  const [errs, setErrs]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [terms, setTerms]     = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [success, setSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState(null);

  const set  = (k, v) => { setF(p => ({ ...p, [k]: v })); if (errs[k]) setErrs(p => ({ ...p, [k]: null })); };
  const blur = (k)    => { setTouched(p => ({ ...p, [k]: true })); validateField(k, f[k]); };

  const validateField = (k, v) => {
    let err = null;
    switch (k) {
      case 'firstName':  err = validators.name(v, 'First name'); break;
      case 'lastName':   err = validators.name(v, 'Last name'); break;
      case 'employeeId': err = validators.id(v, 'Employee ID'); break;
      case 'department': err = validators.dropdown(v, 'Department'); break;
      case 'position':   err = validators.dropdown(v, 'Position'); break;
      case 'workEmail':  err = validators.email(v); break;
      case 'phone':      err = validators.phone(v); break;
      case 'password':        err = validators.password(v); break;
      case 'confirmPassword': err = validators.confirmPw(v, f.password); break;
    }
    if (err) setErrs(p => ({ ...p, [k]: err }));
    return err;
  };

  const validate = () => {
    const newErrs = {};
    Object.keys(INIT).forEach(k => { const e = validateField(k, f[k]); if (e) newErrs[k] = e; });
    if (!terms) newErrs.terms = true;
    setErrs(newErrs);
    setTouched(Object.fromEntries(Object.keys(INIT).map(k => [k, true])));
    return Object.keys(newErrs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = {
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
        employeeId: f.employeeId.trim().toUpperCase(),
        department: f.department,
        position: f.position,
        email: f.workEmail.trim().toLowerCase(),
        phone: f.phone ? f.phone.trim() : '',
        password: f.password,
        role: 'management',
      };
      const res = await authService.register(payload);
      setRegisteredData(res.user || payload);
      setSuccess(true);
    } catch (e) {
      setErrs(p => ({ ...p, general: e.response?.data?.message || e.message || 'Registration failed.' }));
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <SafeAreaView style={sharedStyles.safe}>
        <SuccessView
          role="management"
          userData={registeredData}
          onLogin={() => navigation.navigate('Login')}
        />
      </SafeAreaView>
    );
  }
  const isOk = k => touched[k] && !errs[k] && f[k]?.trim?.();

  return (
    <SafeAreaView style={sharedStyles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={sharedStyles.navBar}>
          <TouchableOpacity style={sharedStyles.backBtn} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Feather name="chevron-left" size={22} color={colors.darkText} />
          </TouchableOpacity>
        </View>

        <ScrollView style={sharedStyles.scroll} contentContainerStyle={sharedStyles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={sharedStyles.pageHeader}>
            <View style={[sharedStyles.roleBadge, { backgroundColor: '#F3EEFF' }]}>
              <Text style={[sharedStyles.roleBadgeText, { color: '#7C5CBF' }]}>MANAGEMENT</Text>
            </View>
            <Text style={sharedStyles.pageTitle}>Create Management Account</Text>
            <Text style={sharedStyles.pageSub}>Set up your management account.</Text>
          </View>

          <SectionCard iconName="person-outline" title="Personal Information" subtitle="Your full legal name">
            <FormField label="First Name" required value={f.firstName} onChangeText={v => set('firstName', v)} onBlur={() => blur('firstName')} placeholder="e.g. David" error={errs.firstName} success={isOk('firstName')} autoCapitalize="words" />
            <FormField label="Last Name" required value={f.lastName} onChangeText={v => set('lastName', v)} onBlur={() => blur('lastName')} placeholder="e.g. Tan" error={errs.lastName} success={isOk('lastName')} autoCapitalize="words" />
          </SectionCard>

          <SectionCard iconName="business-outline" iconBg="#F3EEFF" iconColor="#7C5CBF" title="Employment Information" subtitle="Your university employment details">
            <FormField label="Employee ID" required value={f.employeeId} onChangeText={v => set('employeeId', v)} onBlur={() => blur('employeeId')} placeholder="e.g. MGT2023001" autoCapitalize="characters" error={errs.employeeId} success={isOk('employeeId')} />
            <DropdownField label="Department" required value={f.department} onSelect={v => { set('department', v); blur('department'); }} options={DEPARTMENTS} placeholder="Select department" error={errs.department} success={isOk('department')} />
            <DropdownField label="Position" required value={f.position} onSelect={v => { set('position', v); blur('position'); }} options={POSITIONS} placeholder="Select position" error={errs.position} success={isOk('position')} />
          </SectionCard>

          <SectionCard iconName="call-outline" iconBg="#EAF3FF" iconColor="#4A90E2" title="Contact" subtitle="Your work contact details">
            <FormField label="Work Email" required value={f.workEmail} onChangeText={v => set('workEmail', v)} onBlur={() => blur('workEmail')} placeholder="you@university.edu" keyboardType="email-address" autoCapitalize="none" error={errs.workEmail} success={isOk('workEmail')} />
            <FormField label="Phone Number" value={f.phone} onChangeText={v => set('phone', v)} onBlur={() => blur('phone')} placeholder="+60 12 345 6789" keyboardType="phone-pad" autoCapitalize="none" error={errs.phone} success={f.phone && !errs.phone ? true : false} />
          </SectionCard>

          <SectionCard iconName="lock-closed-outline" iconBg="#FDF1EC" iconColor={colors.primary} title="Security" subtitle="Choose a strong password">
            <FormField label="Password" required value={f.password} onChangeText={v => set('password', v)} onBlur={() => blur('password')} placeholder="Create a strong password" secureTextEntry showToggle showHide={showPw} onToggleShow={() => setShowPw(p => !p)} error={errs.password} autoCapitalize="none" />
            <PasswordStrengthBar password={f.password} />
            <FormField label="Confirm Password" required value={f.confirmPassword} onChangeText={v => set('confirmPassword', v)} onBlur={() => blur('confirmPassword')} placeholder="Repeat your password" secureTextEntry showToggle showHide={showCPw} onToggleShow={() => setShowCPw(p => !p)} error={errs.confirmPassword} success={f.confirmPassword && !errs.confirmPassword && f.confirmPassword === f.password} autoCapitalize="none" />
            <View style={{ marginTop: 8 }}><TermsCheckbox checked={terms} onToggle={() => setTerms(p => !p)} error={errs.terms} /></View>
          </SectionCard>

          <ErrorBanner message={errs.general} />

          <TouchableOpacity style={sharedStyles.submitBtn} onPress={handleSubmit} disabled={loading} activeOpacity={0.85} accessibilityRole="button">
            {loading
              ? <><ActivityIndicator color={colors.white} style={{ marginRight: 8 }} /><Text style={sharedStyles.submitBtnText}>Creating Account…</Text></>
              : <Text style={sharedStyles.submitBtnText}>Create Account</Text>}
          </TouchableOpacity>
          <View style={sharedStyles.loginLink}>
            <Text style={sharedStyles.loginLinkText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} accessibilityRole="button">
              <Text style={sharedStyles.loginLinkAction}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
