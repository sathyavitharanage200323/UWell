import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';
import { counselorService } from '../../services/counselorService';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [clinicalFocusText, setClinicalFocusText] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const data = await counselorService.getCounselorProfile();
    if (data) {
      setName(data.name || '');
      setQualification(data.qualification || '');
      setSpecialization(data.specialization || '');
      setClinicalFocusText(data.clinicalFocus ? data.clinicalFocus.join(', ') : '');
      setOfficeLocation(data.officeLocation || '');
      setEmail(data.email || '');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full name is required.');
      return;
    }
    if (!qualification.trim()) {
      Alert.alert('Validation Error', 'Qualification is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error', 'A valid contact email is required.');
      return;
    }

    setIsSaving(true);

    const focusArray = clinicalFocusText
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const updatedData = {
      name: name.trim(),
      qualification: qualification.trim(),
      specialization: specialization.trim(),
      clinicalFocus: focusArray.length > 0 ? focusArray : ['Academic Burnout', 'Anxiety Disorder'],
      officeLocation: officeLocation.trim(),
      email: email.trim()
    };

    await counselorService.updateCounselorProfile(updatedData);
    setIsSaving(false);

    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.avatarCard}>
          <ImagePlaceholder
            initials={name ? name.substring(0, 2) : 'EM'}
            size={74}
            backgroundColor={colors.softCoral}
            textColor={colors.primary}
          />
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change Avatar</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.formCard}>
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Dr. Evelyn Martinez, PhD"
          />

          <Input
            label="Qualification"
            value={qualification}
            onChangeText={setQualification}
            placeholder="PhD in Clinical Psychology, Stanford"
          />

          <Input
            label="Specialization"
            value={specialization}
            onChangeText={setSpecialization}
            placeholder="Cognitive Behavioral Therapy (CBT)"
          />

          <Input
            label="Clinical Focus Areas (comma-separated)"
            value={clinicalFocusText}
            onChangeText={setClinicalFocusText}
            placeholder="Academic Burnout, ADHD Management, Anxiety Disorder"
          />

          <Input
            label="Office Location"
            value={officeLocation}
            onChangeText={setOfficeLocation}
            placeholder="Clinic Hall B, Room 302"
          />

          <Input
            label="Contact Email"
            value={email}
            onChangeText={setEmail}
            placeholder="e.martinez@university.edu"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={isSaving}
            accessibilityLabel="Save Changes"
          >
            <Text style={styles.saveBtnText}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </Card>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.creamBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  backBtn: {
    padding: spacing.xs
  },
  backBtnText: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: 'bold'
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  avatarCard: {
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    marginBottom: spacing.md
  },
  changePhotoBtn: {
    marginTop: spacing.xs
  },
  changePhotoText: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold
  },
  formCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.lg
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: spacing.md
  },
  saveBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold
  }
});

export default EditProfileScreen;
