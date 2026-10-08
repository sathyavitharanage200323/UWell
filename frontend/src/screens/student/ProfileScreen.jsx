import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout && logout() }
    ]);
  };

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>My Profile</Text>

        <Card style={styles.profileCard}>
          <ImagePlaceholder
            initials={getInitials(user?.name) || 'ST'}
            size={80}
            backgroundColor={colors.softCoral}
            textColor={colors.primary}
          />
          <Text style={styles.nameText}>{user?.name || 'Student'}</Text>
          <Text style={styles.roleText}>{user?.role || 'student'}</Text>
        </Card>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoVal}>{user?.email || 'student@university.edu'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student ID</Text>
            <Text style={styles.infoVal}>{user?.studentId || 'N/A'}</Text>
          </View>
        </Card>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          accessibilityLabel="Log Out"
        >
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.creamBackground
  },
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText,
    marginBottom: spacing.md
  },
  profileCard: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginBottom: spacing.md
  },
  nameText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText,
    marginTop: spacing.sm
  },
  roleText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2
  },
  infoCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  infoRow: {
    marginBottom: spacing.xs
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary
  },
  infoVal: {
    fontSize: typography.fontSize.sm,
    color: colors.darkText,
    fontWeight: typography.fontWeight.bold,
    marginTop: 1
  },
  logoutBtn: {
    backgroundColor: colors.softCoral,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  logoutBtnText: {
    color: colors.statusRedText,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold
  }
});

export default ProfileScreen;
