import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Top Logo */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoIcon}>♡</Text>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>UWell</Text>

        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Text style={styles.illustrationEmoji}>🎓</Text>
          </View>

          <View style={styles.smallCircleOne} />
          <View style={styles.smallCircleTwo} />
          <View style={styles.smallCircleThree} />
        </View>

        {/* Main Heading */}
        <Text style={styles.title}>
          Your Mental Wellness{'\n'}Companion
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          A safe and supportive space for your
          {'\n'}mental health and wellbeing.
        </Text>

        {/* Get Started Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>

        {/* Privacy Message */}
        <Text style={styles.privacyText}>
          🔒 Your privacy and confidentiality matter to us.
        </Text>

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
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  /* Logo */
  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F47F69',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },

  logoIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '600',
  },

  /* App Name */
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B2925',
    marginTop: 8,
  },

  /* Illustration */
  illustrationContainer: {
    width: width * 0.78,
    height: 245,
    backgroundColor: '#F47F69',
    borderRadius: 30,
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  illustrationCircle: {
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: '#FFF9F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  illustrationEmoji: {
    fontSize: 70,
  },

  smallCircleOne: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FFD2C7',
    top: 22,
    left: 25,
  },

  smallCircleTwo: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#FFE8E0',
    bottom: 28,
    right: 35,
  },

  smallCircleThree: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    top: 45,
    right: 30,
  },

  /* Heading */
  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700',
    color: '#3B2925',
    textAlign: 'center',
    marginTop: 24,
  },

  /* Description */
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#75645F',
    textAlign: 'center',
    marginTop: 10,
  },

  /* Button */
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#F47F69',
    borderRadius: 16,
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 22,
    marginLeft: 10,
    fontWeight: '600',
  },

  /* Privacy */
  privacyText: {
    fontSize: 12,
    color: '#8A7973',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
});