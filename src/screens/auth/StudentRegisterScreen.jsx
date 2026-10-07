import React, { useState, useRef } from 'react';
import {
  SafeAreaView, StatusBar, ScrollView, View, Text,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import {
  FormField, DropdownField, PasswordStrengthBar,
  SectionCard, TermsCheckbox, SuccessView, ErrorBanner,
  sharedStyles, validators,
} from './registerShared';

const FACULTIES   = ['Science & Technology','Business','Arts & Humanities','Law','Medicine','Education','Engineering','Social Sciences'];
const PROGRAMS    = ['Computer Science','Psychology','Business Administration','Law','Medicine','Education','Engineering','Social Work','Other'];
const YEARS       = ['Year 1','Year 2','Year 3','Year 4','Year 5','Postgraduate','PhD'];

const INIT = { firstName:'', lastName:'', studentId:'', faculty:'', program:'', year:'', email:'', phone:'', password:'', confirmPassword:'' };

export default function StudentRegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [f, setF]         = useState(INIT);
  const [errs, setErrs]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [terms, setTerms]     = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key, val) => {
    setF(p => ({ ...p, [key]: val }));
    if (errs[key]) setErrs(p => ({ ...p, [key]: null }));
  };

  const blur = (key) => {
    setTouched(p => ({ ...p, [key]: true }));
    validateField(key, f[key]);
  };

  const validateField = (key, val) => {
    let err = null;
    switch (key) {
      case 'firstName':     err = validators.name(val, 'First name'); break;
      case 'lastName':      err = validators.name(val, 'Last name'); break;
      case 'studentId':     err = validators.id(val, 'Student ID'); break;
      case 'faculty':       err = validators.dropdown(val, 'Faculty'); break;
      case 'program':       err = validators.dropdown(val, 'Degree program'); break;
      case 'year':          err = validators.dropdown(val, 'Year of study'); break;
      case 'email':         err = validators.email(val); break;
      case 'phone':         err = validators.phone(val); break;
      case 'password':      err = validators.password(val); break;
      case 'confirmPassword': err = validators.confirmPw(val, f.password); break;
    }
    if (err) setErrs(p => ({ ...p, [key]: err }));
    return err;
  };

  const validate = () => {
    const keys = Object.keys(INIT);
    const newErrs = {};
    keys.forEach(k => { const e = validateField(k, f[k]); if (e) newErrs[k] = e; });
    if (!terms) newErrs.terms = true;
    setErrs(newErrs);
    setTouched(Object.fromEntries(keys.map(k => [k, true])));
    return Object.keys(newErrs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = {
        firstName: f.firstName.trim(), lastName: f.lastName.trim(),
        studentId: f.studentId.trim(), faculty: f.faculty,
        degreeProgram: f.program, yearOfStudy: f.year,
        email: f.email.trim(), phone: f.phone.trim(),
        password: f.password, role: 'student',
      };
      const res = await authService.register(payload);
      setSuccess(true);
    } catch (e) {
      setErrs(p => ({ ...p, general: e.message || 'Registration failed. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };

  if (success) return <SafeAreaView style={sharedStyles.safe}><SuccessView role="student" onLogin={() => navigation.navigate('Login')} /></SafeAreaView>;

  const isOk = (k) => touched[k] && !errs[k] && f[k]?.trim?.();

  return (
    <SafeAreaView style={sharedStyles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Nav */}
        <View style={sharedStyles.navBar}>
          <TouchableOpacity style={sharedStyles.backBtn} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Feather name="chevron-left" size={22} color={colors.darkText} />
          </TouchableOpacity>
        </View>

        <ScrollView style={sharedStyles.scroll} contentContainerStyle={sharedStyles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={sharedStyles.pageHeader}>
            <View style={sharedStyles.roleBadge}><Text style={sharedStyles.roleBadgeText}>STUDENT</Text></View>
            <Text style={sharedStyles.pageTitle}>Create Student Account</Text>
            <Text style={sharedStyles.pageSub}>Join your university wellbeing community.</Text>
          </View>

          {/* Personal */}
          <SectionCard iconName="person-outline" title="Personal Information" subtitle="Your full legal name">
            <FormField label="First Name" required value={f.firstName} onChangeText={v => set('firstName', v)} onBlur={() => blur('firstName')} placeholder="e.g. Sarah" error={errs.firstName} success={isOk('firstName')} autoCapitalize="words" />
            <FormField label="Last Name" required value={f.lastName} onChangeText={v => set('lastName', v)} onBlur={() => blur('lastName')} placeholder="e.g. Jenkins" error={errs.lastName} success={isOk('lastName')} autoCapitalize="words" />
          </SectionCard>

          {/* Academic */}
          <SectionCard iconName="school-outline" iconBg="#EAF3FF" iconColor="#4A90E2" title="Academic Information" subtitle="Your university enrollment details">
            <FormField label="Student ID" required value={f.studentId} onChangeText={v => set('studentId', v)} onBlur={() => blur('studentId')} placeholder="e.g. STU20231001" autoCapitalize="characters" error={errs.studentId} success={isOk('studentId')} />
            <DropdownField label="Faculty" required value={f.faculty} onSelect={v => { set('faculty', v); blur('faculty'); }} options={FACULTIES} placeholder="Select faculty" error={errs.faculty} success={isOk('faculty')} />
            <DropdownField label="Degree Program" required value={f.program} onSelect={v => { set('program', v); blur('program'); }} options={PROGRAMS} placeholder="Select program" error={errs.program} success={isOk('program')} />
            <DropdownField label="Year of Study" required value={f.year} onSelect={v => { set('year', v); blur('year'); }} options={YEARS} placeholder="Select year" error={errs.year} success={isOk('year')} />
          </SectionCard>

          {/* Contact */}
          <SectionCard iconName="mail-outline" iconBg="#E8F8EF" iconColor="#397052" title="Contact Information" subtitle="How we reach you">
            <FormField label="University Email" required value={f.email} onChangeText={v => set('email', v)} onBlur={() => blur('email')} placeholder="you@university.edu" keyboardType="email-address" autoCapitalize="none" error={errs.email} success={isOk('email')} />
            <FormField label="Phone Number" value={f.phone} onChangeText={v => set('phone', v)} onBlur={() => blur('phone')} placeholder="+60 12 345 6789" keyboardType="phone-pad" autoCapitalize="none" error={errs.phone} success={f.phone && !errs.phone ? true : false} />
          </SectionCard>

          {/* Security */}
          <SectionCard iconName="lock-closed-outline" iconBg="#F3EEFF" iconColor="#7C5CBF" title="Security" subtitle="Choose a strong password">
            <FormField label="Password" required value={f.password} onChangeText={v => set('password', v)} onBlur={() => blur('password')} placeholder="Create a strong password" secureTextEntry showToggle showHide={showPw} onToggleShow={() => setShowPw(p => !p)} error={errs.password} autoCapitalize="none" />
            <PasswordStrengthBar password={f.password} />
            <FormField label="Confirm Password" required value={f.confirmPassword} onChangeText={v => set('confirmPassword', v)} onBlur={() => blur('confirmPassword')} placeholder="Repeat your password" secureTextEntry showToggle showHide={showCPw} onToggleShow={() => setShowCPw(p => !p)} error={errs.confirmPassword} success={f.confirmPassword && !errs.confirmPassword && f.confirmPassword === f.password} autoCapitalize="none" />

            <View style={{ marginTop: 8 }}>
              <TermsCheckbox checked={terms} onToggle={() => setTerms(p => !p)} error={errs.terms} />
            </View>
          </SectionCard>

          <ErrorBanner message={errs.general} />

          {/* Submit */}
          <TouchableOpacity style={sharedStyles.submitBtn} onPress={handleSubmit} disabled={loading} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel="Create Account">
            {loading
              ? <><ActivityIndicator color={colors.white} style={{ marginRight: 8 }} /><Text style={sharedStyles.submitBtnText}>Creating Account…</Text></>
              : <Text style={sharedStyles.submitBtnText}>Create Account</Text>
            }
          </TouchableOpacity>

          {/* Login link */}
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
