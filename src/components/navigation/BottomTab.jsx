import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';

const BottomTab = ({ tabs, activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
            {tab.icon}
          </Text>
          <Text style={[styles.label, activeTab === tab.id && styles.activeLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.sm
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: colors.primary
  },
  tabText: {
    fontSize: typography.fontSize.xl,
    marginBottom: spacing.xs
  },
  activeTabText: {
    color: colors.primary
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.textLight
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium
  }
});

export default BottomTab;
