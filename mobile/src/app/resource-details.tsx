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

const resourceContent: Record<
  string,
  {
    title: string;
    category: string;
    icon: string;
    description: string;
    tips: string[];
  }
> = {
  '1': {
    title: 'Stress Management',
    category: 'Stress & Wellbeing',
    icon: '🧘',
    description:
      'Stress is a common part of university life. Learning simple ways to manage stress can help you feel more balanced and focused.',
    tips: [
      'Take short breaks between study sessions.',
      'Practice slow and deep breathing.',
      'Organize your tasks and avoid leaving everything until the last minute.',
      'Get enough sleep and stay hydrated.',
      'Talk to someone you trust when you feel overwhelmed.',
    ],
  },

  '2': {
    title: 'Better Sleep',
    category: 'Sleep & Recovery',
    icon: '😴',
    description:
      'Good sleep supports your mental wellbeing, concentration, memory, and overall academic performance.',
    tips: [
      'Try to keep a regular sleep schedule.',
      'Avoid using your phone immediately before sleeping.',
      'Create a calm and comfortable sleeping environment.',
      'Avoid excessive caffeine late in the day.',
      'Give yourself enough time to rest before an important day.',
    ],
  },

  '3': {
    title: 'Deep Breathing',
    category: 'Relaxation Technique',
    icon: '🌿',
    description:
      'Deep breathing is a simple relaxation technique that can help you slow down and manage feelings of stress or anxiety.',
    tips: [
      'Sit comfortably and relax your shoulders.',
      'Slowly breathe in through your nose.',
      'Hold your breath for a few seconds.',
      'Slowly breathe out through your mouth.',
      'Repeat the process several times.',
    ],
  },

  '4': {
    title: 'Mental Health Tips',
    category: 'Mental Wellbeing',
    icon: '🧠',
    description:
      'Small daily habits can support your mental wellbeing and help you manage the challenges of university life.',
    tips: [
      'Make time for activities you enjoy.',
      'Stay connected with friends and supportive people.',
      'Take regular breaks from academic work.',
      'Be kind and patient with yourself.',
      'Ask for professional support when you need it.',
    ],
  },

  '5': {
    title: 'Managing Academic Pressure',
    category: 'Academic Wellbeing',
    icon: '📚',
    description:
      'Assignments, exams, deadlines, and academic expectations can sometimes feel overwhelming. Managing your workload can reduce unnecessary pressure.',
    tips: [
      'Break large assignments into smaller tasks.',
      'Create a realistic study schedule.',
      'Prioritize important deadlines.',
      'Take short breaks while studying.',
      'Talk to a lecturer, friend, or counselor if pressure becomes difficult to manage.',
    ],
  },

  '6': {
    title: 'Talk to Someone',
    category: 'Support & Connection',
    icon: '💬',
    description:
      'You do not have to deal with everything alone. Talking with someone you trust can provide emotional support and a different perspective.',
    tips: [
      'Choose someone you feel comfortable talking to.',
      'Explain how you have been feeling honestly.',
      'Let the person know if you simply need someone to listen.',
      'Stay connected with supportive friends or family members.',
      'Consider speaking with a counselor if you need professional support.',
    ],
  },
};

export default function ResourceDetailsScreen() {
  const { id, title, category } = useLocalSearchParams<{
    id?: string;
    title?: string;
    category?: string;
  }>();

  const resource = resourceContent[id || '1'];

  const displayTitle = resource?.title || title || 'Wellness Resource';
  const displayCategory = resource?.category || category || 'Mental Wellbeing';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Resource Details</Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Resource Header Card */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>
              {resource?.icon || '🌿'}
            </Text>
          </View>

          <Text style={styles.title}>{displayTitle}</Text>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {displayCategory}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Resource</Text>

          <Text style={styles.description}>
            {resource?.description ||
              'Explore this resource to support your mental wellbeing.'}
          </Text>
        </View>

        {/* Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Helpful Tips</Text>

          {resource?.tips?.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>

              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Counselor Support */}
        <View style={styles.supportCard}>
          <Text style={styles.supportIcon}>💛</Text>

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Need More Support?
            </Text>

            <Text style={styles.supportText}>
              If you feel that you need additional support,
              you can find a counselor through UWell.
            </Text>

            <Pressable
              style={styles.counselorButton}
              onPress={() => router.push('/counselor-search')}
            >
              <Text style={styles.counselorButtonText}>
                Find a Counselor
              </Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          </View>
        </View>

        {/* Back Home */}
        <Pressable
          style={styles.homeButton}
          onPress={() => router.push('/home')}
        >
          <Text style={styles.homeButtonText}>
            Back to Home
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3E5D8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    fontSize: 32,
    color: '#4A3028',
    marginTop: -3,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A3028',
  },

  headerSpace: {
    width: 42,
  },

  heroCard: {
    backgroundColor: '#F5C7B8',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
  },

  iconCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#FFF8F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  icon: {
    fontSize: 38,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#4A3028',
    textAlign: 'center',
    marginBottom: 12,
  },

  categoryBadge: {
    backgroundColor: '#FFF8F2',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A5548',
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#4A3028',
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#6D5A53',
  },

  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },

  numberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F5C7B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  numberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A3028',
  },

  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: '#5F514C',
  },

  supportCard: {
    flexDirection: 'row',
    backgroundColor: '#F3E5D8',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },

  supportIcon: {
    fontSize: 27,
    marginRight: 12,
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#4A3028',
    marginBottom: 6,
  },

  supportText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6D5A53',
    marginBottom: 14,
  },

  counselorButton: {
    backgroundColor: '#C96F55',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counselorButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  homeButton: {
    backgroundColor: '#4A3028',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },

  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});