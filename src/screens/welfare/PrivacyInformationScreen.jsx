import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

export default function PrivacyInformationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Privacy Information — Building soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.creamBackground },
  text: { fontSize: typography.fontSize.lg, color: colors.text }
});