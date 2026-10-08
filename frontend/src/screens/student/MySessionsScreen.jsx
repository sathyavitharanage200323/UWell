import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const MySessionsScreen = ({ navigation }) => {
  const sessions = [
    {
      id: 1,
      counselor: 'Dr. Sarah Johnson',
      date: 'Today',
      time: '2:00 PM',
      status: 'upcoming',
      type: 'Individual'
    },
    {
      id: 2,
      counselor: 'Dr. Michael Chen',
      date: 'Oct 5, 2024',
      time: '10:00 AM',
      status: 'upcoming',
      type: 'Individual'
    },
    {
      id: 3,
      counselor: 'Dr. Emily Williams',
      date: 'Sep 28, 2024',
      time: '3:00 PM',
      status: 'completed',
      type: 'Individual'
    },
    {
      id: 4,
      counselor: 'Dr. Sarah Johnson',
      date: 'Sep 15, 2024',
      time: '11:00 AM',
      status: 'completed',
      type: 'Individual'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="My Sessions" />
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Upcoming Sessions</Text>
        
        {sessions.filter(s => s.status === 'upcoming').map((session) => (
          <TouchableOpacity key={session.id}>
            <Card style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Upcoming</Text>
                </View>
                <Text style={styles.sessionType}>{session.type}</Text>
              </View>
              <Text style={styles.counselorName}>{session.counselor}</Text>
              <View style={styles.sessionDetails}>
                <Text style={styles.detail}>📅 {session.date}</Text>
                <Text style={styles.detail}>⏰ {session.time}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, styles.completedTitle]}>Past Sessions</Text>
        
        {sessions.filter(s => s.status === 'completed').map((session) => (
          <TouchableOpacity key={session.id}>
            <Card style={[styles.sessionCard, styles.completedCard]}>
              <View style={styles.sessionHeader}>
                <View style={[styles.statusBadge, styles.completedBadge]}>
                  <Text style={styles.completedStatusText}>Completed</Text>
                </View>
                <Text style={styles.sessionType}>{session.type}</Text>
              </View>
              <Text style={styles.counselorName}>{session.counselor}</Text>
              <View style={styles.sessionDetails}>
                <Text style={styles.detail}>📅 {session.date}</Text>
                <Text style={styles.detail}>⏰ {session.time}</Text>
              </View>
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
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
    marginTop: spacing.lg
  },
  completedTitle: {
    marginTop: spacing.xxl
  },
  sessionCard: {
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary
  },
  completedCard: {
    borderColor: colors.border,
    opacity: 0.8
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  statusBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4
  },
  completedBadge: {
    backgroundColor: colors.success
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  completedStatusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  sessionType: {
    fontSize: typography.fontSize.sm,
    color: colors.textLight
  },
  counselorName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detail: {
    fontSize: typography.fontSize.md,
    color: colors.textLight
  }
});

export default MySessionsScreen;
