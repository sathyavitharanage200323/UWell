import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@university.edu',
    phone: '+1 555-0100',
    role: 'Management',
    department: 'IT Services'
  });

  const handleSave = () => {
    // Save profile logic
  };

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Admin Profile" />
      
      <View style={styles.content}>
        <Card style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AU</Text>
          </View>
          <Button
            title="Change Photo"
            variant="outline"
            onPress={() => {}}
            style={styles.photoButton}
          />
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Input
            label="First Name"
            value={profile.firstName}
            onChangeText={(value) => setProfile({ ...profile, firstName: value })}
          />

          <Input
            label="Last Name"
            value={profile.lastName}
            onChangeText={(value) => setProfile({ ...profile, lastName: value })}
          />

          <Input
            label="Email"
            value={profile.email}
            onChangeText={(value) => setProfile({ ...profile, email: value })}
            keyboardType="email-address"
          />

          <Input
            label="Phone"
            value={profile.phone}
            onChangeText={(value) => setProfile({ ...profile, phone: value })}
            keyboardType="phone-pad"
          />
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Role Information</Text>
          
          <Input
            label="Role"
            value={profile.role}
            onChangeText={(value) => setProfile({ ...profile, role: value })}
            editable={false}
          />

          <Input
            label="Department"
            value={profile.department}
            onChangeText={(value) => setProfile({ ...profile, department: value })}
          />
        </Card>

        <Button
          title="Save Changes"
          onPress={handleSave}
          style={styles.button}
        />

        <Button
          title="Change Password"
          variant="outline"
          onPress={() => {}}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight
  },
  content: {
    padding: spacing.lg
  },
  avatarCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.textDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  avatarText: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  photoButton: {
    width: '50%'
  },
  formCard: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg
  },
  button: {
    marginTop: spacing.md
  }
});

export default ProfileScreen;
