import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function MoodCheckInScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { emoji: '😄', label: 'Very Good' },
    { emoji: '🙂', label: 'Good' },
    { emoji: '😐', label: 'Okay' },
    { emoji: '😔', label: 'Low' },
    { emoji: '😢', label: 'Very Low' },
  ];

  const handleContinue = () => {
    if (selectedMood) {
      router.push({
        pathname: '/checkin-result',
        params: { mood: selectedMood },
      });
    }
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
        <Text style={styles.smallTitle}>DAILY CHECK-IN</Text>

        <Text style={styles.title}>
          How are you feeling today?
        </Text>

        <Text style={styles.subtitle}>
          Take a moment to check in with yourself.
          {'\n'}There are no right or wrong answers.
        </Text>

        {/* Mood Card */}
        <View style={styles.card}>
          <Text style={styles.question}>
            Choose the option that best describes
            {'\n'}how you feel right now.
          </Text>

          <View style={styles.moodContainer}>
            {moods.map((mood) => {
              const isSelected = selectedMood === mood.label;

              return (
                <Pressable
                  key={mood.label}
                  style={[
                    styles.moodButton,
                    isSelected && styles.selectedMood,
                  ]}
                  onPress={() => setSelectedMood(mood.label)}
                >
                  <Text style={styles.emoji}>
                    {mood.emoji}
                  </Text>

                  <Text
                    style={[
                      styles.moodLabel,
                      isSelected && styles.selectedMoodLabel,
                    ]}
                  >
                    {mood.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Encouragement */}
        <View style={styles.encouragement}>
          <Text style={styles.encouragementIcon}>💚</Text>

          <View style={styles.encouragementContent}>
            <Text style={styles.encouragementTitle}>
              Remember
            </Text>

            <Text style={styles.encouragementText}>
              Checking in with yourself regularly
              can help you understand your wellbeing.
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <Pressable
          style={[
            styles.continueButton,
            !selectedMood && styles.disabledButton,
          ]}
          disabled={!selectedMood}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>
            Continue
          </Text>

          <Text style={styles.arrow}>
            →
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
    marginBottom: 28,
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
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700',
    marginBottom: 10,
  },

  subtitle: {
    color: '#8A7770',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  question: {
    color: '#4A3833',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    marginBottom: 20,
  },

  moodContainer: {
    gap: 10,
  },

  moodButton: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: '#E8DDD7',
    borderRadius: 15,
    backgroundColor: '#FFFDFC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  selectedMood: {
    backgroundColor: '#FCE0D9',
    borderColor: '#EF806B',
    borderWidth: 2,
  },

  emoji: {
    fontSize: 27,
    marginRight: 14,
  },

  moodLabel: {
    color: '#5F4D47',
    fontSize: 14,
    fontWeight: '500',
  },

  selectedMoodLabel: {
    color: '#C85F4E',
    fontWeight: '700',
  },

  encouragement: {
    flexDirection: 'row',
    backgroundColor: '#F5EFE9',
    borderRadius: 16,
    padding: 15,
    marginTop: 18,
  },

  encouragementIcon: {
    fontSize: 23,
    marginRight: 11,
  },

  encouragementContent: {
    flex: 1,
  },

  encouragementTitle: {
    color: '#3B2925',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },

  encouragementText: {
    color: '#806F68',
    fontSize: 11,
    lineHeight: 17,
  },

  continueButton: {
    height: 54,
    backgroundColor: '#EF806B',
    borderRadius: 27,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    backgroundColor: '#DCCBC5',
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 21,
    marginLeft: 9,
  },
});