import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';

const NavigationHeader = ({ title, onMenuPress, rightComponent }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      {rightComponent && <View style={styles.right}>{rightComponent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary
  },
  menuButton: {
    padding: spacing.sm
  },
  menuIcon: {
    fontSize: typography.fontSize.xxl,
    color: colors.textWhite,
    fontWeight: typography.fontWeight.bold
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite,
    textAlign: 'center'
  },
  right: {
    position: 'absolute',
    right: spacing.lg
  }
});

export default NavigationHeader;
