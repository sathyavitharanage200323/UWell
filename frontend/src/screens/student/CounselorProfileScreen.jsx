import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const CounselorProfileScreen = ({ route, navigation }) => {
  const { counselorId } = route.params || {};

  const counselor = {
    name: 'Dr. Sarah Johnson',
    specialization: 'Anxiety & Depression',
    rating: 4.9,
    experience: '10 years',
    education: 'Ph.D. in Clinical Psychology',
    bio: 'Dr. Johnson specializes in helping students manage anxiety and depression. She uses evidence-based approaches including CBT and mindfulness techniques.',
    languages: ['English', 'Spanish'],
    nextAvailable: 'Today at 2:00 PM'
  };

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Counselor Profile" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{counselor.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{counselor.name}</Text>
          <Text style={styles.specialization}>{counselor.specialization}</Text>
          <Text style={styles.rating}>⭐ {counselor.rating} Rating</Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{counselor.bio}</Text>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Qualifications</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Experience:</Text>
            <Text style={styles.infoValue}>{counselor.experience}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Education:</Text>
            <Text style={styles.infoValue}>{counselor.education}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Languages:</Text>
            <Text style={styles.infoValue}>{counselor.languages.join(', ')}</Text>
          </View>
        </Card>

        <Card style={styles.availabilityCard}>
          <Text style={styles.sectionTitle}>Next Available</Text>
          <Text style={styles.nextAvailable}>{counselor.nextAvailable}</Text>
        </Card>

        <Button
          title="View Availability"
          onPress={() => navigation.navigate('Availability', { counselorId })}
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
  profileCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  avatarText: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  name: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  specialization: {
    fontSize: typography.fontSize.lg,
    color: colors.textLight,
    marginBottom: spacing.sm
  },
  rating: {
    fontSize: typography.fontSize.md,
    color: colors.warning,
    fontWeight: typography.fontWeight.medium
  },
  infoCard: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  bio: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    lineHeight: typography.lineHeight.relaxed
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm
  },
  infoLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: 100
  },
  infoValue: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text
  },
  availabilityCard: {
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.lg
  },
  nextAvailable: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary
  },
  button: {
    marginTop: spacing.lg
  }
});

export default CounselorProfileScreen;
