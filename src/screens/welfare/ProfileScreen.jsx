import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useWelfare } from '../../context/WelfareContext';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { profile, updateProfile } = useWelfare();
  const { logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile || {});

  // ---------- UPDATE: start editing ----------
  const handleStartEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  // ---------- UPDATE: cancel editing ----------
  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  // ---------- UPDATE: save changes ----------
  const handleSave = () => {
    if (!draft.name?.trim() || !draft.email?.trim()) {
      Alert.alert('Validation', 'Name and email are required.');
      return;
    }
    updateProfile({
      name: draft.name,
      firstName: draft.name?.split(' ')[0] || draft.firstName,
      email: draft.email,
      phone: draft.phone,
      department: draft.department,
      officeLocation: draft.officeLocation,
      avatarInitials: getInitials(draft.name)
    });
    setIsEditing(false);
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const menuGroups = [
    {
      id: 'info',
      items: [
        { id: 'personal', label: 'Personal Information', icon: 'person-outline' },
        { id: 'schedule', label: 'Work Schedule', icon: 'calendar-outline' }
      ]
    },
    {
      id: 'prefs',
      items: [
        { id: 'notifications', label: 'Notification Preferences', icon: 'notifications-outline' },
        {
          id: 'privacy',
          label: 'Privacy & Security',
          icon: 'shield-checkmark-outline',
          screen: 'PrivacySecurity'
        }
      ]
    },
    {
      id: 'about',
      items: [
        { id: 'help', label: 'Help & Support', icon: 'help-circle-outline' },
        { id: 'about', label: 'About', icon: 'information-circle-outline' }
      ]
    }
  ];

  const handleMenuPress = (item) => {
    if (item.screen) navigation.navigate(item.screen);
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        {!isEditing ? (
          <TouchableOpacity style={styles.editBtn} onPress={handleStartEdit}>
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.avatarInitials || 'WO'}</Text>
            </View>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.role}>{profile.role}</Text>
            <Text style={styles.dept}>{profile.department}</Text>
          </View>

          {/* Edit mode — form inputs */}
          {isEditing ? (
            <View style={styles.group}>
              <Field
                label="Full Name"
                value={draft.name || ''}
                onChangeText={(v) => setDraft({ ...draft, name: v })}
              />
              <Field
                label="Email"
                value={draft.email || ''}
                onChangeText={(v) => setDraft({ ...draft, email: v })}
                keyboardType="email-address"
              />
              <Field
                label="Phone"
                value={draft.phone || ''}
                onChangeText={(v) => setDraft({ ...draft, phone: v })}
                keyboardType="phone-pad"
              />
              <Field
                label="Department"
                value={draft.department || ''}
                onChangeText={(v) => setDraft({ ...draft, department: v })}
              />
              <Field
                label="Office Location"
                value={draft.officeLocation || ''}
                onChangeText={(v) => setDraft({ ...draft, officeLocation: v })}
                last
              />
            </View>
          ) : (
            <>
              {/* Read-only info card */}
              <View style={styles.group}>
                <InfoDisplay label="Full Name" value={profile.name} />
                <InfoDisplay label="Email" value={profile.email} />
                <InfoDisplay label="Phone" value={profile.phone} />
                <InfoDisplay label="Department" value={profile.department} />
                <InfoDisplay label="Office Location" value={profile.officeLocation} last />
              </View>

              {/* Menu groups */}
              {menuGroups.map((group) => (
                <View key={group.id} style={styles.group}>
                  {group.items.map((item, index) => {
                    const isLast = index === group.items.length - 1;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.menuItem, isLast && styles.menuItemLast]}
                        onPress={() => handleMenuPress(item)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.menuIconWrap}>
                          <Ionicons name={item.icon} size={18} color={colors.text} />
                        </View>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color={colors.textMuted}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}

              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => {
                  Alert.alert('Log Out', 'Are you sure you want to log out?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log Out', style: 'destructive', onPress: () => logout && logout() }
                  ]);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const Field = ({ label, value, onChangeText, keyboardType, last }) => (
  <View style={[styles.fieldRow, last && styles.fieldRowLast]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={styles.fieldInput}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
      placeholder={label}
      placeholderTextColor={colors.textMuted}
    />
  </View>
);

const InfoDisplay = ({ label, value, last }) => (
  <View style={[styles.fieldRow, last && styles.fieldRowLast]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.softCoral,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20
  },
  editBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginLeft: 4
  },
  editActions: { flexDirection: 'row', alignItems: 'center' },
  cancelBtn: { paddingHorizontal: spacing.md, paddingVertical: 6 },
  cancelBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20
  },
  saveBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },

  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  emptyBox: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { fontSize: typography.fontSize.md, color: colors.textMuted },

  avatarSection: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.md
  },
  avatarText: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary
  },
  name: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  role: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginTop: 4
  },
  dept: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center'
  },

  group: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden'
  },

  // Info / Field rows
  fieldRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  fieldRowLast: { borderBottomWidth: 0 },
  fieldLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4
  },
  fieldValue: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium
  },
  fieldInput: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    fontWeight: typography.fontWeight.medium
  },

  // Menu item
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider
  },
  menuItemLast: { borderBottomWidth: 0 },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  menuLabel: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium
  },

  logoutBtn: {
    borderWidth: 1.5,
    borderColor: '#E8836B',
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.backgroundLight
  },
  logoutText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#E8836B'
  }
});

export default ProfileScreen;