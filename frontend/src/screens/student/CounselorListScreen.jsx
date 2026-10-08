import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const CounselorListScreen = ({ navigation }) => {
  const counselors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Anxiety & Depression',
      rating: 4.9,
      experience: '10 years',
      availability: 'Available Today'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Stress Management',
      rating: 4.8,
      experience: '8 years',
      availability: 'Available Tomorrow'
    },
    {
      id: 3,
      name: 'Dr. Emily Williams',
      specialization: 'Relationship Counseling',
      rating: 4.7,
      experience: '12 years',
      availability: 'Available Today'
    },
    {
      id: 4,
      name: 'Dr. James Brown',
      specialization: 'Academic Stress',
      rating: 4.6,
      experience: '6 years',
      availability: 'Next Week'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Find a Counselor" />
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Connect with professional counselors</Text>

        {counselors.map((counselor) => (
          <TouchableOpacity
            key={counselor.id}
            onPress={() => navigation.navigate('CounselorProfile', { counselorId: counselor.id })}
          >
            <Card style={styles.counselorCard}>
              <View style={styles.counselorHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{counselor.name.charAt(0)}</Text>
                </View>
                <View style={styles.counselorInfo}>
                  <Text style={styles.counselorName}>{counselor.name}</Text>
                  <Text style={styles.specialization}>{counselor.specialization}</Text>
                </View>
              </View>
              
              <View style={styles.counselorDetails}>
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Rating</Text>
                  <Text style={styles.detailValue}>⭐ {counselor.rating}</Text>
                </View>
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Experience</Text>
                  <Text style={styles.detailValue}>{counselor.experience}</Text>
                </View>
                <View style={styles.detail}>
                  <Text style={styles.detailLabel}>Availability</Text>
                  <Text style={[styles.detailValue, styles.availability]}>{counselor.availability}</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.lg,
    textAlign: 'center'
  },
  counselorCard: {
    marginBottom: spacing.md
  },
  counselorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md
  },
  avatarText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  counselorInfo: {
    flex: 1
  },
  counselorName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs
  },
  specialization: {
    fontSize: typography.fontSize.md,
    color: colors.textLight
  },
  counselorDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detail: {
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight,
    marginBottom: spacing.xs
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  availability: {
    color: colors.success
  }
});

export default CounselorListScreen;
