import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';
import { useAuth } from '../../context/AuthContext';
import { counselorService } from '../../services/counselorService';

const ProfileScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProfile();
    });
    loadProfile();
    return unsubscribe;
  }, [navigation]);

  const loadProfile = async () => {
    const data = await counselorService.getCounselorProfile();
    setProfile(data);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout && logout() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>My Profile</Text>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <ImagePlaceholder
            initials={profile?.avatarInitials || 'EM'}
            size={80}
            backgroundColor={colors.softCoral}
            textColor={colors.primary}
          />
          <Text style={styles.nameText}>{profile?.name || 'Dr. Evelyn Martinez, PhD'}</Text>
          <Text style={styles.titleText}>
            {profile?.title || 'Senior Student Cognitive Psychologist'}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.starText}>⭐ {profile?.rating || '4.9'}</Text>
            <Text style={styles.ratingSubText}>
              ({profile?.sessionsReviewed || 148} sessions reviewed)
            </Text>
          </View>

          <TouchableOpacity
            style={styles.quickAvailBtn}
            onPress={() => navigation.navigate('Availability')}
            accessibilityLabel="Manage Availability"
          >
            <Text style={styles.quickAvailText}>📅 Manage Availability</Text>
          </TouchableOpacity>
        </Card>

        {/* Clinical Focus Areas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CLINICAL FOCUS AREAS</Text>
        </View>
        <Card style={styles.infoCard}>
          <View style={styles.chipsWrap}>
            {profile?.clinicalFocus?.map((focus, index) => (
              <View key={index} style={styles.focusChip}>
                <Text style={styles.focusChipText}>{focus}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Contact & Office Info */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>OFFICE & CONTACT</Text>
        </View>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Office Location:</Text>
            <Text style={styles.infoVal}>{profile?.officeLocation || 'Clinic Hall B, Room 302'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact Email:</Text>
            <Text style={styles.infoVal}>{profile?.email || 'e.martinez@university.edu'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Qualification:</Text>
            <Text style={styles.infoVal}>{profile?.qualification || 'PhD in Clinical Psychology'}</Text>
          </View>
        </Card>

        {/* Actions */}
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => navigation.navigate('EditProfile')}
          accessibilityLabel="Edit Profile"
        >
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.signOutBtn]}
          onPress={handleSignOut}
          accessibilityLabel="Staff Sign Out"
        >
          <Text style={styles.signOutBtnText}>Staff Sign Out</Text>
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
  titleText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center'
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4
  },
  starText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  ratingSubText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary
  },
  quickAvailBtn: {
    backgroundColor: colors.softCoral,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    marginTop: spacing.md,
    borderColor: colors.border,
    borderWidth: 1
  },
  quickAvailText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold
  },
  sectionHeader: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs
  },
  sectionTitle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 1
  },
  infoCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs
  },
  focusChip: {
    backgroundColor: colors.softCoral,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12
  },
  focusChipText: {
    fontSize: typography.fontSize.xs,
    color: colors.darkText,
    fontWeight: typography.fontWeight.medium
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
  actionBtn: {
    paddingVertical: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  editBtn: {
    backgroundColor: colors.primary
  },
  editBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold
  },
  signOutBtn: {
    backgroundColor: colors.softCoral,
    borderWidth: 1,
    borderColor: colors.border
  },
  signOutBtnText: {
    color: colors.statusRedText,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold
  }
});

export default ProfileScreen;
