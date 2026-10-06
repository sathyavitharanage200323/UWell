import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function WellbeingRecommendation() {
  const {
    feeling,
    stress,
    sleep,
    energy,
    support,
  } = useLocalSearchParams<{
    feeling?: string;
    stress?: string;
    sleep?: string;
    energy?: string;
    support?: string;
  }>();

  const getRecommendation = () => {
    if (
      support === 'Stress & Anxiety' ||
      stress === 'High' ||
      stress === 'Very High'
    ) {
      return {
        icon: '🌿',
        title: 'Focus on Stress Management',
        description:
          'It looks like stress management may be helpful for you right now.',
        action: 'Explore Stress Management',
      };
    }

    if (support === 'Academic Pressure') {
      return {
        icon: '📚',
        title: 'Support for Academic Pressure',
        description:
          'Managing academic pressure can be challenging. A few simple strategies may help you feel more balanced.',
        action: 'Explore Academic Support',
      };
    }

    if (
      support === 'Sleep' ||
      sleep === 'Poor' ||
      sleep === 'Very Poor'
    ) {
      return {
        icon: '🌙',
        title: 'Improve Your Sleep',
        description:
          'Better sleep can support your mood, energy and overall wellbeing.',
        action: 'Explore Sleep Tips',
      };
    }

    if (
      support === 'Talking to Someone' ||
      feeling === 'Low' ||
      feeling === 'Very Low'
    ) {
      return {
        icon: '💬',
        title: "You Don't Have to Handle It Alone",
        description:
          'Talking with someone you trust or a counselor can be a helpful step when you are not feeling your best.',
        action: 'Find a Counselor',
      };
    }

    return {
      icon: '🌱',
      title: 'Keep Supporting Your Wellbeing',
      description:
        'You seem to be doing reasonably well. Keep building healthy habits and checking in with yourself regularly.',
      action: 'Explore Wellness Resources',
    };
  };

  const recommendation = getRecommendation();

  const handleAction = () => {
    if (recommendation.action === 'Find a Counselor') {
      router.push('/counselor-search');
      return;
    }

    router.push('/wellness-resources');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.smallTitle}>UWell</Text>

        <Text style={styles.title}>
          Your wellbeing matters
        </Text>

        <Text style={styles.subtitle}>
          Based on your answers, here is a support recommendation
          for you.
        </Text>
      </View>

      {/* Recommendation Card */}
      <View style={styles.recommendationCard}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>
            {recommendation.icon}
          </Text>
        </View>

        <Text style={styles.recommendationLabel}>
          PERSONALIZED RECOMMENDATION
        </Text>

        <Text style={styles.recommendationTitle}>
          {recommendation.title}
        </Text>

        <Text style={styles.recommendationDescription}>
          {recommendation.description}
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={handleAction}
        >
          <Text style={styles.primaryButtonText}>
            {recommendation.action}
          </Text>
        </Pressable>
      </View>

      {/* Support Information */}
      <View style={styles.supportCard}>
        <Text style={styles.supportTitle}>
          💛 Remember
        </Text>

        <Text style={styles.supportText}>
          This check-in is not a medical diagnosis. It is only a
          simple way to help you discover useful wellbeing support.
        </Text>
      </View>

      {/* Check-In Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          Your Check-In Summary
        </Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Feeling
          </Text>

          <Text style={styles.summaryValue}>
            {feeling || 'Not answered'}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Stress
          </Text>

          <Text style={styles.summaryValue}>
            {stress || 'Not answered'}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Sleep
          </Text>

          <Text style={styles.summaryValue}>
            {sleep || 'Not answered'}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Energy
          </Text>

          <Text style={styles.summaryValue}>
            {energy || 'Not answered'}
          </Text>
        </View>

        <View style={[styles.summaryRow, styles.lastRow]}>
          <Text style={styles.summaryLabel}>
            Support
          </Text>

          <Text style={styles.summaryValue}>
            {support || 'Not answered'}
          </Text>
        </View>
      </View>

      {/* Continue to Home */}
      <Pressable
        style={styles.secondaryButton}
        onPress={() => router.replace('/home')}
      >
        <Text style={styles.secondaryButtonText}>
          Continue to Home
        </Text>
      </Pressable>

      {/* Footer */}
      <Text style={styles.footerText}>
        You can return to UWell anytime to check in, explore
        resources or connect with a counselor.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginTop: 18,
    marginBottom: 20,
  },

  smallTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B85C38',
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D2B24',
    lineHeight: 35,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: '#75665F',
    marginTop: 10,
  },

  recommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E3DC',
    marginBottom: 16,
  },

  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F8E8DE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  icon: {
    fontSize: 34,
  },

  recommendationLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#C86B47',
    marginBottom: 8,
    textAlign: 'center',
  },

  recommendationTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3D2B24',
    textAlign: 'center',
    lineHeight: 29,
    marginBottom: 10,
  },

  recommendationDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6F5D55',
    textAlign: 'center',
    marginBottom: 20,
  },

  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    backgroundColor: '#C86B47',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },

  supportCard: {
    backgroundColor: '#F8E8DE',
    borderRadius: 18,
    padding: 17,
    marginBottom: 16,
  },

  supportTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4A342B',
    marginBottom: 6,
  },

  supportText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6F5D55',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F0E3DC',
    marginBottom: 16,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#3D2B24',
    marginBottom: 10,
  },

  summaryRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1E8E3',
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  summaryLabel: {
    fontSize: 13,
    color: '#806F67',
  },

  summaryValue: {
    maxWidth: '58%',
    fontSize: 13,
    fontWeight: '700',
    color: '#4A342B',
    textAlign: 'right',
  },

  secondaryButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#C86B47',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#A65335',
    fontSize: 15,
    fontWeight: '800',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: '#8A7971',
    marginTop: 14,
    paddingHorizontal: 12,
  },
});