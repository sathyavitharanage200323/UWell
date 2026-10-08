import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const ResourcesScreen = ({ navigation }) => {
  const resources = [
    {
      id: 1,
      title: 'Managing Stress',
      category: 'Self-Care',
      icon: '🧘',
      description: 'Learn effective techniques to manage daily stress'
    },
    {
      id: 2,
      title: 'Sleep Hygiene',
      category: 'Health',
      icon: '😴',
      description: 'Tips for better sleep and improved well-being'
    },
    {
      id: 3,
      title: 'Building Resilience',
      category: 'Personal Growth',
      icon: '💪',
      description: 'Develop mental strength to overcome challenges'
    },
    {
      id: 4,
      title: 'Mindfulness Basics',
      category: 'Meditation',
      icon: '🧠',
      description: 'Introduction to mindfulness practices'
    },
    {
      id: 5,
      title: 'Social Connections',
      category: 'Relationships',
      icon: '🤝',
      description: 'Building and maintaining healthy relationships'
    },
    {
      id: 6,
      title: 'Time Management',
      category: 'Productivity',
      icon: '⏰',
      description: 'Balance your academic and personal life'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Resources" />
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Helpful resources for your mental wellness journey</Text>

        {resources.map((resource) => (
          <TouchableOpacity key={resource.id} style={styles.resourceCard}>
            <Card>
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceIcon}>{resource.icon}</Text>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceCategory}>{resource.category}</Text>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                </View>
              </View>
              <Text style={styles.resourceDescription}>{resource.description}</Text>
            </Card>
          </TouchableOpacity>
        ))}
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
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.lg,
    textAlign: 'center'
  },
  resourceCard: {
    marginBottom: spacing.md
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  resourceIcon: {
    fontSize: 40,
    marginRight: spacing.md
  },
  resourceInfo: {
    flex: 1
  },
  resourceCategory: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs
  },
  resourceTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  resourceDescription: {
    fontSize: typography.fontSize.md,
    color: colors.textLight
  }
});

export default ResourcesScreen;
