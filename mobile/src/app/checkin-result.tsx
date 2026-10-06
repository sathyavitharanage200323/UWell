import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

export default function CheckInResultScreen() {
  const { mood } = useLocalSearchParams();

  const getMessage = () => {
    switch (mood) {
      case 'Very Good':
        return 'That is wonderful! Keep taking care of yourself.';
      case 'Good':
        return 'It is great to hear that you are feeling good today.';
      case 'Okay':
        return 'It is okay to have an average day. Be kind to yourself.';
      case 'Low':
        return 'Thank you for checking in. Remember, you do not have to face difficult moments alone.';
      case 'Very Low':
        return 'We are glad you checked in. Consider reaching out to someone you trust for support.';
      default:
        return 'Thank you for taking a moment to check in with yourself.';
    }
  };

  const getEmoji = () => {
    switch (mood) {
      case 'Very Good':
        return '😄';
      case 'Good':
        return '🙂';
      case 'Okay':
        return '😐';
      case 'Low':
        return '😔';
      case 'Very Low':
        return '😢';
      default:
        return '💚';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Back */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Header */}
        <Text style={styles.smallTitle}>
          CHECK-IN RESULT
        </Text>

        <Text style={styles.title}>
          Thank you for checking in
        </Text>

        <Text style={styles.subtitle}>
          Here is a reflection of how you are
          feeling today.
        </Text>

        {/* Result Card */}
        <View style={styles.resultCard}>

          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>
              {getEmoji()}
            </Text>
          </View>

          <Text style={styles.feelingText}>
            You are feeling
          </Text>

          <Text style={styles.moodText}>
            {mood || 'Not selected'}
          </Text>

          <Text style={styles.message}>
            {getMessage()}
          </Text>

        </View>

        {/* Support Card */}
        <View style={styles.supportCard}>
          <Text style={styles.supportIcon}>
            💚
          </Text>

          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>
              Your wellbeing matters
            </Text>

            <Text style={styles.supportText}>
              Small steps can make a difference.
              Take some time for yourself today.
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <Pressable
          style={styles.tipsButton}
          onPress={() => router.push('/mental-health-tips')}
        >
          <Text style={styles.tipsText}>
            View Mental Health Tips
          </Text>

          <Text style={styles.arrow}>
            →
          </Text>
        </Pressable>

        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace('/home')}
        >
          <Text style={styles.homeText}>
            Back to Home
          </Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  container: {
    flex: 1,
    paddingHorizontal: 22,
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
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700',
    marginBottom: 10,
  },

  subtitle: {
    color: '#8A7770',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  emojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FCE0D9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  emoji: {
    fontSize: 52,
  },

  feelingText: {
    color: '#8A7770',
    fontSize: 13,
    marginBottom: 5,
  },

  moodText: {
    color: '#EF806B',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
  },

  message: {
    color: '#5F4D47',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },

  supportCard: {
    flexDirection: 'row',
    backgroundColor: '#F5EFE9',
    borderRadius: 17,
    padding: 15,
    marginTop: 18,
  },

  supportIcon: {
    fontSize: 24,
    marginRight: 11,
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    color: '#3B2925',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },

  supportText: {
    color: '#806F68',
    fontSize: 11,
    lineHeight: 17,
  },

  tipsButton: {
    height: 53,
    backgroundColor: '#EF806B',
    borderRadius: 27,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tipsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 21,
    marginLeft: 9,
  },

  homeButton: {
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#EF806B',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  homeText: {
    color: '#EF806B',
    fontSize: 14,
    fontWeight: '700',
  },
});