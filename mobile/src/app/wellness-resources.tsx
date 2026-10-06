import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const resources = [
  {
    id: '1',
    icon: '🧘',
    title: 'Stress Management',
    description:
      'Simple techniques to manage academic and everyday stress.',
    category: 'Stress & Relaxation',
  },
  {
    id: '2',
    icon: '🌙',
    title: 'Better Sleep',
    description:
      'Helpful habits and tips for improving your sleep routine.',
    category: 'Sleep & Rest',
  },
  {
    id: '3',
    icon: '🌬️',
    title: 'Deep Breathing',
    description:
      'Practice simple breathing exercises to feel calmer.',
    category: 'Relaxation',
  },
  {
    id: '4',
    icon: '🧠',
    title: 'Mental Health Tips',
    description:
      'Learn simple ways to support your mental wellbeing.',
    category: 'Mental Wellbeing',
  },
  {
    id: '5',
    icon: '📚',
    title: 'Managing Academic Pressure',
    description:
      'Practical ideas for handling study pressure and workload.',
    category: 'Student Life',
  },
  {
    id: '6',
    icon: '💬',
    title: 'Talk to Someone',
    description:
      'Understand when and how to reach out for emotional support.',
    category: 'Support',
  },
];

export default function WellnessResourcesScreen() {
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
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Wellness Resources
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Intro */}
        <View style={styles.introCard}>
          <View style={styles.introIconCircle}>
            <Text style={styles.introIcon}>🌿</Text>
          </View>

          <Text style={styles.introTitle}>
            Support Your Wellbeing
          </Text>

          <Text style={styles.introText}>
            Explore helpful resources designed to support
            your mental health and everyday wellbeing.
          </Text>
        </View>

        {/* Recommended */}
        <Text style={styles.sectionTitle}>
          Recommended for You
        </Text>

        <View style={styles.featuredCard}>
          <View style={styles.featuredIcon}>
            <Text style={styles.featuredEmoji}>🧘</Text>
          </View>

          <View style={styles.featuredContent}>
            <Text style={styles.featuredLabel}>
              RECOMMENDED
            </Text>

            <Text style={styles.featuredTitle}>
              Take a Mental Break
            </Text>

            <Text style={styles.featuredText}>
              Take a few minutes to pause, breathe and
              reset your mind during a busy day.
            </Text>

            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/resource-details',
                  params: {
                    id: '1',
                    title: 'Take a Mental Break',
                    category: 'Stress & Relaxation',
                  },
                })
              }
            >
              <Text style={styles.readMore}>
                Read More →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* All Resources */}
        <Text style={styles.sectionTitle}>
          All Resources
        </Text>

        {resources.map((resource) => (
          <Pressable
            key={resource.id}
            style={({ pressed }) => [
              styles.resourceCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              router.push({
                pathname: '/resource-details',
                params: {
                  id: resource.id,
                  title: resource.title,
                  category: resource.category,
                },
              })
            }
          >
            <View style={styles.resourceIconBox}>
              <Text style={styles.resourceIcon}>
                {resource.icon}
              </Text>
            </View>

            <View style={styles.resourceContent}>
              <Text style={styles.resourceCategory}>
                {resource.category}
              </Text>

              <Text style={styles.resourceTitle}>
                {resource.title}
              </Text>

              <Text style={styles.resourceDescription}>
                {resource.description}
              </Text>
            </View>

            <Text style={styles.resourceArrow}>›</Text>
          </Pressable>
        ))}

        {/* Counselor Support */}
        <View style={styles.supportCard}>
          <View style={styles.supportIcon}>
            <Text>👩‍⚕️</Text>
          </View>

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Need More Support?
            </Text>

            <Text style={styles.supportText}>
              If you feel that you need additional support,
              you can find a counselor through UWell.
            </Text>

            <Pressable
              onPress={() => router.push('/counselor-search')}
            >
              <Text style={styles.supportLink}>
                Find a Counselor →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Back Home */}
        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace('/home')}
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
    backgroundColor: '#FFF9F3',
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 32,
    color: '#3B2925',
    marginTop: -4,
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3B2925',
  },

  headerSpacer: {
    width: 42,
  },

  introCard: {
    backgroundColor: '#F47F69',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 22,
  },

  introIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  introIcon: {
    fontSize: 30,
  },

  introTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 7,
  },

  introText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#FFF5F1',
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 12,
    marginTop: 2,
  },

  featuredCard: {
    backgroundColor: '#FFF0EA',
    borderRadius: 20,
    padding: 17,
    flexDirection: 'row',
    marginBottom: 24,
  },

  featuredIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  featuredEmoji: {
    fontSize: 27,
  },

  featuredContent: {
    flex: 1,
  },

  featuredLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#C85F4D',
    marginBottom: 3,
  },

  featuredTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  featuredText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#806F69',
  },

  readMore: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C85F4D',
    marginTop: 8,
  },

  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
    marginBottom: 11,
  },

  cardPressed: {
    opacity: 0.75,
  },

  resourceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  resourceIcon: {
    fontSize: 24,
  },

  resourceContent: {
    flex: 1,
  },

  resourceCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: '#C85F4D',
    marginBottom: 3,
  },

  resourceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 3,
  },

  resourceDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: '#8A7770',
  },

  resourceArrow: {
    fontSize: 27,
    color: '#B39D96',
    marginLeft: 7,
  },

  supportCard: {
    backgroundColor: '#F7F3EF',
    borderRadius: 20,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },

  supportIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2925',
    marginBottom: 4,
  },

  supportText: {
    fontSize: 11,
    lineHeight: 17,
    color: '#806F69',
  },

  supportLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C85F4D',
    marginTop: 8,
  },

  homeButton: {
    height: 52,
    backgroundColor: '#F47F69',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});