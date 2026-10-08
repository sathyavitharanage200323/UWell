import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';
import { MOOD_LEVELS } from '../../utils/constants';

const MoodCheckInScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');

  const moods = [
    { level: MOOD_LEVELS.EXCELLENT, emoji: '😄', label: 'Excellent', color: colors.mood.excellent },
    { level: MOOD_LEVELS.GOOD, emoji: '😊', label: 'Good', color: colors.mood.good },
    { level: MOOD_LEVELS.FAIR, emoji: '😐', label: 'Fair', color: colors.mood.fair },
    { level: MOOD_LEVELS.POOR, emoji: '😔', label: 'Poor', color: colors.mood.poor },
    { level: MOOD_LEVELS.TERRIBLE, emoji: '😢', label: 'Terrible', color: colors.mood.terrible }
  ];

  const handleSubmit = () => {
    navigation.navigate('MoodResult', { mood: selectedMood, notes });
  };

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Mood Check-In" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>Select the option that best describes your mood</Text>

        <View style={styles.moodGrid}>
          {moods.map((mood) => (
            <TouchableOpacity
              key={mood.level}
              style={[
                styles.moodCard,
                selectedMood === mood.level && { borderColor: mood.color, borderWidth: 3 }
              ]}
              onPress={() => setSelectedMood(mood.level)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.notesCard}>
          <Text style={styles.notesLabel}>Notes (optional)</Text>
          <Text style={styles.notesPlaceholder}>
            Add any details about how you're feeling...
          </Text>
        </Card>

        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={!selectedMood}
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
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.xl,
    textAlign: 'center'
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.xl
  },
  moodCard: {
    width: '45%',
    alignItems: 'center',
    padding: spacing.lg,
    margin: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm
  },
  moodLabel: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  notesCard: {
    marginBottom: spacing.xl
  },
  notesLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm
  },
  notesPlaceholder: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    fontStyle: 'italic'
  },
  button: {
    marginTop: spacing.lg
  }
});

export default MoodCheckInScreen;
