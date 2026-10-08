import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const MoodResultScreen = ({ route, navigation }) => {
  const { mood, notes } = route.params || {};

  const getMoodInfo = (level) => {
    switch (level) {
      case 5:
        return { emoji: '😄', label: 'Excellent', message: 'That\'s wonderful! Keep up the great work!' };
      case 4:
        return { emoji: '😊', label: 'Good', message: 'Great to hear you\'re doing well!' };
      case 3:
        return { emoji: '😐', label: 'Fair', message: 'It\'s okay to have mixed feelings. Take care of yourself.' };
      case 2:
        return { emoji: '😔', label: 'Poor', message: 'I\'m sorry you\'re feeling this way. Consider reaching out for support.' };
      case 1:
        return { emoji: '😢', label: 'Terrible', message: 'Please consider talking to a counselor. You\'re not alone.' };
      default:
        return { emoji: '😐', label: 'Fair', message: 'Take care of yourself.' };
    }
  };

  const moodInfo = getMoodInfo(mood);

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Mood Result" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Card style={styles.resultCard}>
          <Text style={styles.emoji}>{moodInfo.emoji}</Text>
          <Text style={styles.moodLabel}>{moodInfo.label}</Text>
          <Text style={styles.message}>{moodInfo.message}</Text>
        </Card>

        {notes && (
          <Card style={styles.notesCard}>
            <Text style={styles.notesTitle}>Your Notes:</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </Card>
        )}

        <Card style={styles.suggestionCard}>
          <Text style={styles.suggestionTitle}>Suggestions:</Text>
          <Text style={styles.suggestionText}>
            • Take a short walk outside{'\n'}
            • Practice deep breathing exercises{'\n'}
            • Connect with a friend{'\n'}
            • Consider booking a session if needed
          </Text>
        </Card>

        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Home')}
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
  resultCard: {
    alignItems: 'center',
    padding: spacing.xxl,
    marginBottom: spacing.lg
  },
  emoji: {
    fontSize: 80,
    marginBottom: spacing.md
  },
  moodLabel: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.md
  },
  message: {
    fontSize: typography.fontSize.lg,
    color: colors.text,
    textAlign: 'center'
  },
  notesCard: {
    marginBottom: spacing.lg
  },
  notesTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  notesText: {
    fontSize: typography.fontSize.md,
    color: colors.textLight
  },
  suggestionCard: {
    marginBottom: spacing.xl
  },
  suggestionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  suggestionText: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    lineHeight: typography.lineHeight.relaxed
  },
  button: {
    marginTop: spacing.lg
  }
});

export default MoodResultScreen;
