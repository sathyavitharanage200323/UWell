import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const feelings = ['Very Good', 'Good', 'Okay', 'Low', 'Very Low'];

const stressLevels = [
  'Very Low',
  'Low',
  'Moderate',
  'High',
  'Very High',
];

const sleepLevels = [
  'Very Good',
  'Good',
  'Okay',
  'Poor',
  'Very Poor',
];

const energyLevels = [
  'High',
  'Good',
  'Moderate',
  'Low',
  'Very Low',
];

const supportOptions = [
  'Stress & Anxiety',
  'Academic Pressure',
  'Sleep',
  'Personal Wellbeing',
  'Talking to Someone',
];

export default function WellbeingCheck() {
  // Get the student email passed from Login
  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  const [feeling, setFeeling] = useState('');
  const [stress, setStress] = useState('');
  const [sleep, setSleep] = useState('');
  const [energy, setEnergy] = useState('');
  const [support, setSupport] = useState('');

  const handleContinue = () => {
    if (!feeling || !stress || !sleep || !energy || !support) {
      Alert.alert(
        'Complete Check',
        'Please answer all questions before continuing.'
      );
      return;
    }

    // Pass the student's email together with the wellbeing answers
    router.push({
      pathname: '/wellbeing-recommendation',
      params: {
        email: email || '',
        feeling,
        stress,
        sleep,
        energy,
        support,
      },
    });
  };

  const OptionButton = ({
    option,
    selected,
    onPress,
  }: {
    option: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        selected && styles.optionSelected,
      ]}
    >
      <View
        style={[
          styles.radio,
          selected && styles.radioSelected,
        ]}
      >
        {selected && <View style={styles.radioInner} />}
      </View>

      <Text
        style={[
          styles.optionText,
          selected && styles.optionTextSelected,
        ]}
      >
        {option}
      </Text>
    </Pressable>
  );

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
          Let's understand how you're doing
        </Text>

        <Text style={styles.subtitle}>
          This short check helps us suggest useful wellbeing support for you.
        </Text>
      </View>

      {/* Privacy Notice */}
      <View style={styles.privacyCard}>
        <Text style={styles.privacyTitle}>
          🔒 Your privacy matters
        </Text>

        <Text style={styles.privacyText}>
          Your responses are private and are used to provide personalized
          wellbeing recommendations.
        </Text>
      </View>

      {/* Question 1 */}
      <View style={styles.questionCard}>
        <Text style={styles.questionNumber}>01</Text>

        <Text style={styles.question}>
          How have you been feeling recently?
        </Text>

        {feelings.map((option) => (
          <OptionButton
            key={option}
            option={option}
            selected={feeling === option}
            onPress={() => setFeeling(option)}
          />
        ))}
      </View>

      {/* Question 2 */}
      <View style={styles.questionCard}>
        <Text style={styles.questionNumber}>02</Text>

        <Text style={styles.question}>
          How stressed have you been feeling?
        </Text>

        {stressLevels.map((option) => (
          <OptionButton
            key={option}
            option={option}
            selected={stress === option}
            onPress={() => setStress(option)}
          />
        ))}
      </View>

      {/* Question 3 */}
      <View style={styles.questionCard}>
        <Text style={styles.questionNumber}>03</Text>

        <Text style={styles.question}>
          How has your sleep been?
        </Text>

        {sleepLevels.map((option) => (
          <OptionButton
            key={option}
            option={option}
            selected={sleep === option}
            onPress={() => setSleep(option)}
          />
        ))}
      </View>

      {/* Question 4 */}
      <View style={styles.questionCard}>
        <Text style={styles.questionNumber}>04</Text>

        <Text style={styles.question}>
          How is your energy level?
        </Text>

        {energyLevels.map((option) => (
          <OptionButton
            key={option}
            option={option}
            selected={energy === option}
            onPress={() => setEnergy(option)}
          />
        ))}
      </View>

      {/* Question 5 */}
      <View style={styles.questionCard}>
        <Text style={styles.questionNumber}>05</Text>

        <Text style={styles.question}>
          What would you like support with?
        </Text>

        {supportOptions.map((option) => (
          <OptionButton
            key={option}
            option={option}
            selected={support === option}
            onPress={() => setSupport(option)}
          />
        ))}
      </View>

      {/* Continue */}
      <Pressable
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.continueText}>
          Continue
        </Text>
      </Pressable>

      <Text style={styles.footerText}>
        You can explore wellbeing resources and counselor support anytime.
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

  privacyCard: {
    backgroundColor: '#F8E8DE',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },

  privacyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A342B',
    marginBottom: 6,
  },

  privacyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6F5D55',
  },

  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 17,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0E3DC',
  },

  questionNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#C86B47',
    marginBottom: 6,
  },

  question: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3D2B24',
    lineHeight: 23,
    marginBottom: 13,
  },

  option: {
    minHeight: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E6D9D1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    marginBottom: 9,
    backgroundColor: '#FFFDFC',
  },

  optionSelected: {
    borderColor: '#C86B47',
    backgroundColor: '#FDF0E9',
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#B9AAA2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  radioSelected: {
    borderColor: '#C86B47',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C86B47',
  },

  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#5F514B',
  },

  optionTextSelected: {
    fontWeight: '700',
    color: '#8F4C32',
  },

  continueButton: {
    height: 54,
    borderRadius: 17,
    backgroundColor: '#C86B47',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    color: '#8A7971',
    marginTop: 14,
    paddingHorizontal: 15,
  },
});