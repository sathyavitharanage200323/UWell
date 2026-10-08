import React, { useState } from 'react';
import {
  SafeAreaView, StatusBar, ScrollView, View, Text,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme';
import { authService } from '../../services/authService';
import {
  FormField, DropdownField, PasswordStrengthBar,
  SectionCard, TermsCheckbox, SuccessView, ErrorBanner,
  sharedStyles, validators,
} from './registerShared';

const QUALIFICATIONS = ['PhD in Clinical Psychology','Master of Counseling','Master of Psychology','Bachelor of Psychology','PhD in Counseling Psychology','Other'];
const SPECIALIZATIONS = ['Cognitive Behavioral Therapy (CBT)','Anxiety & Stress Management','ADHD Management','Academic Burnout','Social Adjustment','Relationship Counseling','Depression','Other'];
const EXPERIENCE = ['Less than 1 year','1–2 years','3–5 years','6–10 years','10+ years'];

const INIT = { firstName:'', lastName:'', staffId:'', email:'', qualification:'', specialization:'', experience:'', phone:'', officeLocation:'', password:'', confirmPassword:'' };

export default function CounselorRegisterScreen({ navigation }) {
  const [f, setF]         = useState(INIT);
  const [errs, setErrs]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [terms, setTerms]     = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key, val) => { setF(p => ({ ...p, [key]: val })); if (errs[key]) setErrs(p => ({ ...p, [key]: null })); };
  const blur = (key) => { setTouched(p => ({ ...p, [key]: true })); validateField(key, f[key]); };

  const validateField = (key, val) => {
    let err = null;
    switch (key) {
      case 'firstName': err = validators.name(val, 'First name'); break;
      case 'lastName':  err = validators.name(val, 'Last name'); break;
      case 'staffId':   err = validators.id(val, 'Staff ID'); break;
      case 'email':     err = validators.email(val); break;
      case 'qualification':  err = validators.dropdown(val, 'Qualification'); break;
      case 'specialization': err = validators.dropdown(val, 'Specialization'); break;
      case 'experience':     err = validators.dropdown(val, 'Years of experience'); break;
      case 'phone':     err = validators.required(val, 'Phone number') || validators.phone(val); break;
      case 'password':        err = validators.password(val); break;
      case 'confirmPassword': err = validators.confirmPw(val, f.password); break;
    }
    if (err) setErrs(p => ({ ...p, [key]: err }));
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
      await authService.register({
        firstName: f.firstName.trim(), lastName: f.lastName.trim(),
        staffId: f.staffId.trim(), email: f.email.trim(),
        qualification: f.qualification, specialization: f.specialization,
        yearsOfExperience: f.experience, phone: f.phone.trim(),
        officeLocation: f.officeLocation.trim(), password: f.password, role: 'counselor',
      });
      setSuccess(true);
    } catch (e) {
      setErrs(p => ({ ...p, general: e.message || 'Registration failed.' }));
    } finally { setLoading(false); }
  };

  if (success) return <SafeAreaView style={sharedStyles.safe}><SuccessView role="counselor" onLogin={() => navigation.navigate('Login')} /></SafeAreaView>;
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
            <View style={sharedStyles.roleBadge}><Text style={sharedStyles.roleBadgeText}>CLINICAL STAFF</Text></View>
            <Text style={sharedStyles.pageTitle}>Create Counselor Account</Text>
            <Text style={sharedStyles.pageSub}>Set up your professional clinical profile.</Text>
          </View>

          <SectionCard iconName="person-outline" title="Personal Information" subtitle="Your full legal name">
            <FormField label="First Name" required value={f.firstName} onChangeText={v => set('firstName', v)} onBlur={() => blur('firstName')} placeholder="e.g. Evelyn" error={errs.firstName} success={isOk('firstName')} autoCapitalize="words" />
            <FormField label="Last Name" required value={f.lastName} onChangeText={v => set('lastName', v)} onBlur={() => blur('lastName')} placeholder="e.g. Martinez" error={errs.lastName} success={isOk('lastName')} autoCapitalize="words" />
          </SectionCard>

          <SectionCard iconName="briefcase-outline" iconBg="#EAF3FF" iconColor="#4A90E2" title="Professional Information" subtitle="Your clinical credentials and background">
            <FormField label="Staff ID" required value={f.staffId} onChangeText={v => set('staffId', v)} onBlur={() => blur('staffId')} placeholder="e.g. CSL2023001" autoCapitalize="characters" error={errs.staffId} success={isOk('staffId')} />
            <FormField label="Professional Email" required value={f.email} onChangeText={v => set('email', v)} onBlur={() => blur('email')} placeholder="you@university.edu" keyboardType="email-address" autoCapitalize="none" error={errs.email} success={isOk('email')} />
            <DropdownField label="Qualification" required value={f.qualification} onSelect={v => { set('qualification', v); blur('qualification'); }} options={QUALIFICATIONS} placeholder="Select highest qualification" error={errs.qualification} success={isOk('qualification')} />
            <DropdownField label="Specialization" required value={f.specialization} onSelect={v => { set('specialization', v); blur('specialization'); }} options={SPECIALIZATIONS} placeholder="Select specialization" error={errs.specialization} success={isOk('specialization')} />
            <DropdownField label="Years of Experience" required value={f.experience} onSelect={v => { set('experience', v); blur('experience'); }} options={EXPERIENCE} placeholder="Select experience range" error={errs.experience} success={isOk('experience')} />
          </SectionCard>

          <SectionCard iconName="call-outline" iconBg="#E8F8EF" iconColor="#397052" title="Contact" subtitle="Your office contact details">
            <FormField label="Phone Number" required value={f.phone} onChangeText={v => set('phone', v)} onBlur={() => blur('phone')} placeholder="+60 12 345 6789" keyboardType="phone-pad" autoCapitalize="none" error={errs.phone} success={f.phone && !errs.phone ? true : false} />
            <FormField label="Office Location" value={f.officeLocation} onChangeText={v => set('officeLocation', v)} placeholder="e.g. Clinic Hall B, Room 302" error={errs.officeLocation} success={isOk('officeLocation')} />
          </SectionCard>

          <SectionCard iconName="lock-closed-outline" iconBg="#F3EEFF" iconColor="#7C5CBF" title="Security" subtitle="Choose a strong password">
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
