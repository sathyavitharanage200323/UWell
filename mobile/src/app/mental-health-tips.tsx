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

export default function MentalHealthTipsScreen() {
  const tips = [
    {
      id: '3',
      icon: '🌿',
      title: 'Take a short break',
      description:
        'Give yourself a few minutes away from study or screen time to relax and reset.',
      category: 'Relaxation Technique',
    },
    {
      id: '3',
      icon: '🫁',
      title: 'Practice deep breathing',
      description:
        'Take slow, deep breaths when you feel stressed or overwhelmed.',
      category: 'Relaxation Technique',
    },
    {
      id: '2',
      icon: '💧',
      title: 'Stay hydrated',
      description:
        'Drink enough water throughout the day to support your body and mind.',
      category: 'Self Care',
    },
    {
      id: '2',
      icon: '😴',
      title: 'Get enough sleep',
      description:
        'A consistent sleep routine can help support your mood, focus and wellbeing.',
      category: 'Sleep & Recovery',
    },
    {
      id: '1',
      icon: '🚶',
      title: 'Move your body',
      description:
        'A short walk or gentle physical activity can help you feel refreshed.',
      category: 'Stress & Wellbeing',
    },
    {
      id: '6',
      icon: '💬',
      title: 'Talk to someone',
      description:
        'If something is bothering you, consider talking with someone you trust.',
      category: 'Support & Connection',
    },
  ];

  const openResource = (
    id: string,
    title: string,
    category: string
  ) => {
    router.push({
      pathname: '/resource-details',
      params: {
        id,
        title,
        category,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Header */}
        <Text style={styles.smallTitle}>
          WELLBEING
        </Text>

        <Text style={styles.title}>
          Mental Health Tips
        </Text>

        <Text style={styles.subtitle}>
          Simple ideas to support your mental wellbeing
          during your university journey.
        </Text>

        {/* Intro Card */}
        <View style={styles.introCard}>
          <Text style={styles.introIcon}>💚</Text>

          <View style={styles.introContent}>
            <Text style={styles.introTitle}>
              Take care of yourself
            </Text>

            <Text style={styles.introText}>
              Small, healthy habits can make a positive
              difference in how you feel each day.
            </Text>
          </View>
        </View>

        {/* Tips */}
        <Text style={styles.sectionTitle}>
          Helpful Tips
        </Text>

        {tips.map((tip, index) => (
          <Pressable
            key={index}
            style={({ pressed }) => [
              styles.tipCard,
              pressed && styles.tipCardPressed,
            ]}
            onPress={() =>
              openResource(
                tip.id,
                tip.title,
                tip.category
              )
            }
          >
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipIcon}>
                {tip.icon}
              </Text>
            </View>

            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>
                {tip.title}
              </Text>

              <Text style={styles.tipDescription}>
                {tip.description}
              </Text>

              <Text style={styles.readMore}>
                Read more →
              </Text>
            </View>
          </Pressable>
        ))}

        {/* Counselor Support */}
        <View style={styles.supportCard}>
          <Text style={styles.supportIcon}>🤝</Text>

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Need someone to talk to?
            </Text>

            <Text style={styles.supportText}>
              You can find a counselor and book a
              confidential counseling session through UWell.
            </Text>

            <Pressable
              style={styles.counselorButton}
              onPress={() => router.push('/counselor-search')}
            >
              <Text style={styles.counselorText}>
                Find a Counselor
              </Text>

              <Text style={styles.counselorArrow}>
                →
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Home Button */}
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
    marginBottom: 25,
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

  smallTitle: {
    color: '#EF806B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    color: '#3B2925',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },

  subtitle: {
    color: '#8A7770',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 22,
  },

  introCard: {
    backgroundColor: '#FCE0D9',
    borderRadius: 20,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  introIcon: {
    fontSize: 30,
    marginRight: 12,
  },

  introContent: {
    flex: 1,
  },

  introTitle: {
    color: '#3B2925',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  introText: {
    color: '#765F58',
    fontSize: 11,
    lineHeight: 17,
  },

  sectionTitle: {
    color: '#3B2925',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F0E2DC',
    marginBottom: 12,
  },

  tipCardPressed: {
    opacity: 0.75,
  },

  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FCEAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  tipIcon: {
    fontSize: 24,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    color: '#3B2925',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },

  tipDescription: {
    color: '#806F68',
    fontSize: 11,
    lineHeight: 17,
  },

  readMore: {
    color: '#EF806B',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 7,
  },

  supportCard: {
    backgroundColor: '#F5EFE9',
    borderRadius: 20,
    padding: 17,
    flexDirection: 'row',
    marginTop: 10,
  },

  supportIcon: {
    fontSize: 28,
    marginRight: 12,
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    color: '#3B2925',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },

  supportText: {
    color: '#806F68',
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 13,
  },

  counselorButton: {
    height: 40,
    backgroundColor: '#EF806B',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counselorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  counselorArrow: {
    color: '#FFFFFF',
    fontSize: 17,
    marginLeft: 7,
  },

  homeButton: {
    height: 46,
    backgroundColor: '#3B2925',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});