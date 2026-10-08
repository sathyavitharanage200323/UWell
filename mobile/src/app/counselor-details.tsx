import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

type Counselor = {
  name: string;
  specialization: string;
  experience: string;
  qualification: string;
  icon: string;
  bio: string;
  availability: string;
};

export default function CounselorDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const counselors: Record<string, Counselor> = {
    '1': {
      name: 'Dr. Sarah Perera',
      specialization: 'Student Counselling',
      experience: '8 years experience',
      qualification: 'PhD in Counselling Psychology',
      icon: '👩‍⚕️',
      bio:
        'Experienced in supporting university students with personal, academic and emotional wellbeing concerns.',
      availability: 'Available today',
    },

    '2': {
      name: 'Ms. Amaya Fernando',
      specialization: 'Stress & Anxiety',
      experience: '6 years experience',
      qualification: 'MSc in Psychology',
      icon: '👩‍💼',
      bio:
        'Specializes in helping students manage stress, anxiety and challenges related to university life.',
      availability: 'Available tomorrow',
    },

    '3': {
      name: 'Dr. Kavindu Silva',
      specialization: 'Academic & Personal Support',
      experience: '5 years experience',
      qualification: 'MA in Counselling Psychology',
      icon: '👨‍⚕️',
      bio:
        'Provides supportive counselling for academic pressure, personal challenges and student wellbeing.',
      availability: 'Available this week',
    },
  };

  const counselor = counselors[String(id)] || counselors['1'];

  const handleViewAvailability = () => {
    router.push({
      pathname: '/availability',
      params: {
        id: String(id || '1'),
        counselorName: counselor.name,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Back */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileIcon}>
              {counselor.icon}
            </Text>
          </View>

          <Text style={styles.name}>
            {counselor.name}
          </Text>

          <Text style={styles.specialization}>
            {counselor.specialization}
          </Text>

          <View style={styles.availableRow}>
            <View style={styles.availableDot} />

            <Text style={styles.availableText}>
              {counselor.availability}
            </Text>
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>
          About the Counselor
        </Text>

        <View style={styles.card}>
          <Text style={styles.bio}>
            {counselor.bio}
          </Text>
        </View>

        {/* Professional Details */}
        <Text style={styles.sectionTitle}>
          Professional Details
        </Text>

        <View style={styles.card}>

          {/* Qualification */}
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🎓</Text>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Qualification
              </Text>

              <Text style={styles.detailValue}>
                {counselor.qualification}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Experience */}
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>💼</Text>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Experience
              </Text>

              <Text style={styles.detailValue}>
                {counselor.experience}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Specialization */}
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🧠</Text>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>
                Specialization
              </Text>

              <Text style={styles.detailValue}>
                {counselor.specialization}
              </Text>
            </View>
          </View>

        </View>

        {/* What They Can Help With */}
        <Text style={styles.sectionTitle}>
          Support Areas
        </Text>

        <View style={styles.supportAreasCard}>
          <View style={styles.supportItem}>
            <Text style={styles.supportBullet}>✓</Text>
            <Text style={styles.supportText}>
              Academic and university-related concerns
            </Text>
          </View>

          <View style={styles.supportItem}>
            <Text style={styles.supportBullet}>✓</Text>
            <Text style={styles.supportText}>
              Stress and emotional wellbeing
            </Text>
          </View>

          <View style={styles.supportItem}>
            <Text style={styles.supportBullet}>✓</Text>
            <Text style={styles.supportText}>
              Personal challenges and wellbeing support
            </Text>
          </View>
        </View>

        {/* Confidentiality */}
        <View style={styles.confidentialCard}>
          <Text style={styles.confidentialIcon}>
            🔒
          </Text>

          <View style={styles.confidentialContent}>
            <Text style={styles.confidentialTitle}>
              Confidential Support
            </Text>

            <Text style={styles.confidentialText}>
              Your counseling information is treated
              with privacy and confidentiality within UWell.
            </Text>
          </View>
        </View>

        {/* Availability Button */}
        <Pressable
          style={styles.availabilityButton}
          onPress={handleViewAvailability}
        >
          <Text style={styles.availabilityButtonText}>
            View Availability
          </Text>

          <Text style={styles.arrow}>
            →
          </Text>
        </Pressable>

        {/* Back to Search */}
        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push('/counselor-search')}
        >
          <Text style={styles.secondaryButtonText}>
            Back to Counselors
          </Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  container: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },

  backArrow: {
    color: '#3B2925',
    fontSize: 30,
    lineHeight: 30,
    marginRight: 5,
  },

  backText: {
    color: '#6F5E58',
    fontSize: 13,
  },

  profileSection: {
    alignItems: 'center',
    marginBottom: 25,
  },

  profileCircle: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#FCE3DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  profileIcon: {
    fontSize: 55,
  },

  name: {
    color: '#3B2925',
    fontSize: 23,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },

  specialization: {
    color: '#EF806B',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 9,
    textAlign: 'center',
  },

  availableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#65B87A',
    marginRight: 6,
  },

  availableText: {
    color: '#65A870',
    fontSize: 11,
    fontWeight: '600',
  },

  sectionTitle: {
    color: '#3B2925',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 11,
    marginTop: 5,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: '#F0E2DC',
    marginBottom: 20,
  },

  bio: {
    color: '#6F5E58',
    fontSize: 12,
    lineHeight: 19,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIcon: {
    fontSize: 23,
    marginRight: 12,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    color: '#9A8982',
    fontSize: 10,
    marginBottom: 3,
  },

  detailValue: {
    color: '#4A3833',
    fontSize: 12,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1E7E2',
    marginVertical: 13,
  },

  supportAreasCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: '#F0E2DC',
    marginBottom: 20,
  },

  supportItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 11,
  },

  supportItemLast: {
    marginBottom: 0,
  },

  supportBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FCE0D9',
    color: '#C85F4E',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    fontWeight: '700',
    marginRight: 10,
  },

  supportText: {
    flex: 1,
    color: '#6F5E58',
    fontSize: 11,
    lineHeight: 18,
  },

  confidentialCard: {
    backgroundColor: '#F5EFE9',
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 20,
  },

  confidentialIcon: {
    fontSize: 23,
    marginRight: 11,
  },

  confidentialContent: {
    flex: 1,
  },

  confidentialTitle: {
    color: '#3B2925',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  confidentialText: {
    color: '#806F68',
    fontSize: 11,
    lineHeight: 17,
  },

  availabilityButton: {
    height: 54,
    backgroundColor: '#EF806B',
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  availabilityButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 21,
    marginLeft: 9,
  },

  secondaryButton: {
    height: 48,
    backgroundColor: '#FCE0D9',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  secondaryButtonText: {
    color: '#C85F4E',
    fontSize: 13,
    fontWeight: '700',
  },
});