import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import NavigationHeader from '../../components/navigation/Header';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    firstName: user?.firstName || 'Admin',
    lastName: user?.lastName || 'Manager',
    email: user?.email || 'admin@university.edu',
    employeeId: user?.employeeId || 'ADM001',
    phone: user?.phone || '',
    role: 'management',
    department: user?.department || 'Administration',
    position: user?.position || 'System Administrator',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await authService.getManagementProfile({
        id: user?.id || user?._id,
        email: user?.email,
      });
      if (res.success && res.profile) {
        setProfile((prev) => ({
          ...prev,
          ...res.profile,
          firstName: res.profile.firstName || prev.firstName,
          lastName: res.profile.lastName || prev.lastName,
          email: res.profile.email || prev.email,
          employeeId: res.profile.employeeId || prev.employeeId,
          phone: res.profile.phone || prev.phone,
          department: res.profile.department || prev.department,
          position: res.profile.position || prev.position,
        }));
      }
    } catch (err) {
      console.log('Error fetching manager profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile.firstName?.trim() || !profile.lastName?.trim()) {
      Alert.alert('Validation Error', 'First name and Last name are required.');
      return;
    }

    try {
      setSaving(true);
      setFeedback(null);
      const res = await authService.updateManagementProfile({
        id: user?.id || user?._id,
        email: profile.email,
        firstName: profile.firstName.trim(),
        lastName: profile.lastName.trim(),
        phone: profile.phone.trim(),
        department: profile.department.trim(),
        position: profile.position.trim(),
      });

      if (res.success) {
        if (updateUser && res.profile) {
          updateUser(res.profile);
        }
        setFeedback({ type: 'success', message: 'Profile updated successfully!' });
        setTimeout(() => setFeedback(null), 4000);
      } else {
        Alert.alert('Update Failed', res.message || 'Could not save profile changes.');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || error.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your Management account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
            } catch (e) {
              // Ignore network logout error
            }
            if (logout) {
              await logout();
            }
          },
        },
      ]
    );
  };

  const initials = `${(profile.firstName || 'A')[0]}${(profile.lastName || 'M')[0]}`.toUpperCase();

  return (
    <View style={styles.container}>
      <NavigationHeader title="Management Profile" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Avatar Header Card ────────────────────────────────────── */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>
            {profile.firstName} {profile.lastName}
          </Text>
          <View style={styles.roleBadge}>
            <MaterialCommunityIcons name="shield-crown" size={14} color="#B45309" style={{ marginRight: 4 }} />
            <Text style={styles.roleBadgeText}>ADMINISTRATOR / MANAGER</Text>
          </View>
          <Text style={styles.profileEmail}>{profile.email}</Text>
        </View>

        {/* ── Feedback Message ──────────────────────────────────────── */}
        {feedback && (
          <View style={[styles.feedbackBox, feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError]}>
            <Feather
              name={feedback.type === 'success' ? 'check-circle' : 'alert-circle'}
              size={16}
              color={feedback.type === 'success' ? '#065F46' : '#991B1B'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.feedbackText, feedback.type === 'success' ? styles.feedbackSuccessText : styles.feedbackErrorText]}>
              {feedback.message}
            </Text>
          </View>
        )}

        {/* ── Personal Info Section ─────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
              <Feather name="user" size={16} color="#4F46E5" />
            </View>
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>First Name</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={profile.firstName}
                onChangeText={(v) => setProfile({ ...profile, firstName: v })}
                placeholder="First Name"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Last Name</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={profile.lastName}
                onChangeText={(v) => setProfile({ ...profile, lastName: v })}
                placeholder="Last Name"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={profile.phone}
                onChangeText={(v) => setProfile({ ...profile, phone: v })}
                placeholder="e.g. +1 555-0100"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* ── Role & Department Section ─────────────────────────────── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Feather name="briefcase" size={16} color="#B45309" />
            </View>
            <Text style={styles.sectionTitle}>Role & Organization</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Employee / Admin ID</Text>
            <View style={[styles.inputWrap, styles.inputDisabled]}>
              <TextInput
                style={[styles.input, styles.inputDisabledText]}
                value={profile.employeeId}
                editable={false}
              />
              <Feather name="lock" size={14} color={colors.textMuted} />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Official Email</Text>
            <View style={[styles.inputWrap, styles.inputDisabled]}>
              <TextInput
                style={[styles.input, styles.inputDisabledText]}
                value={profile.email}
                editable={false}
              />
              <Feather name="lock" size={14} color={colors.textMuted} />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Department</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={profile.department}
                onChangeText={(v) => setProfile({ ...profile, department: v })}
                placeholder="Department"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Position / Title</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={profile.position}
                onChangeText={(v) => setProfile({ ...profile, position: v })}
                placeholder="Position"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* ── Save Changes Button ───────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Feather name="check" size={18} color={colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>Save Profile Changes</Text>
            </>
          )}
        </TouchableOpacity>

        {/* ── LOG OUT BUTTON ────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Feather name="log-out" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Log Out from Management</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  avatarCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 4,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  feedbackSuccess: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  feedbackError: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  feedbackSuccessText: {
    color: '#065F46',
  },
  feedbackErrorText: {
    color: '#991B1B',
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.darkText,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.darkText,
  },
  inputDisabledText: {
    color: colors.textMuted,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    paddingVertical: 14,
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
});

export default ProfileScreen;
