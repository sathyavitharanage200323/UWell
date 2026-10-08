import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { supportDirectories } from '../../data/welfareMockData';

const SupportInformationScreen = ({ navigation }) => {
  const handlePress = (dir) => {
    if (dir.title === 'Counseling Service') {
      navigation.navigate('ServiceDetails');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Information</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Find the right support for every student need. Use the specialized directories below to
          guide students to appropriate university help desks.
        </Text>

        {supportDirectories.map((dir) => (
          <TouchableOpacity
            key={dir.id}
            style={[styles.card, dir.urgent && styles.cardUrgent]}
            onPress={() => handlePress(dir)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrap, dir.urgent && styles.iconWrapUrgent]}>
              <Ionicons
                name={dir.icon}
                size={22}
                color={dir.urgent ? '#C0392B' : colors.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{dir.title}</Text>
              <Text style={styles.desc}>{dir.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  scrollContent: { padding: spacing.lg, paddingTop: 0, paddingBottom: spacing.xxl },

  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardUrgent: {
    borderColor: '#F0B8B1'
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  iconWrapUrgent: { backgroundColor: '#FBE1DE' },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  desc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18
  }
});

export default SupportInformationScreen;