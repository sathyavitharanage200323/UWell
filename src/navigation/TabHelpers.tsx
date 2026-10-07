import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../theme';

export const TabBarIcon = ({ icon, focused }: { icon: string; focused: boolean }) => (
  <Text style={[
    styles.icon,
    focused && styles.iconFocused
  ]}>
    {icon}
  </Text>
);

export const tabScreenOptions = (icon: string) => ({
  tabBarIcon: ({ focused }: { focused: boolean }) => <TabBarIcon icon={icon} focused={focused} />,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textLight,
  headerShown: false,
  tabBarStyle: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.sm,
    height: 70,
  },
  tabBarLabelStyle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium as TextStyle['fontWeight'],
  },
});

const styles = StyleSheet.create({
  icon: {
    fontSize: 24,
  },
  iconFocused: {
    // Add any focused icon styles if needed
  },
});