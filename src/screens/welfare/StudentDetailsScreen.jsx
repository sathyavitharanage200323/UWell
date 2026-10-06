import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const StudentDetailsScreen = ({ route, navigation }) => {
  const { studentId } = route.params || {};

  const student = {
    name: 'John Smith',
    studentId: 'STU001',
    email: 'john.smith@university.edu',
    phone: '+1 555-0123',
    counselor: 'Dr. Sarah Johnson',
    joinDate: 'Aug 15, 2024',
    totalSessions: 8,
    lastSession: 'Sep 28, 2024',
    currentMood: 'Good',
    status: 'active'
  };

  const recentSessions = [
    { date: 'Sep 28', counselor: 'Dr. Sarah Johnson', type: 'Individual' },
    { date: 'Sep 20', counselor: 'Dr. Sarah Johnson', type: 'Individual' },
    { date: 'Sep 15', counselor: 'Dr. Sarah Johnson', type: 'Individual' }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Student Details" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
          </View>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentId}>{student.studentId}</Text>
          <View style={[
            styles.statusBadge,
            student.status === 'active' && styles.activeBadge
          ]}>
            <Text style={styles.statusText}>Active</Text>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{student.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{student.phone}</Text>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Counseling Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Counselor:</Text>
            <Text style={styles.infoValue}>{student.counselor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joined:</Text>
            <Text style={styles.infoValue}>{student.joinDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Sessions:</Text>
            <Text style={styles.infoValue}>{student.totalSessions}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Session:</Text>
            <Text style={styles.infoValue}>{student.lastSession}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Mood:</Text>
            <Text style={styles.infoValue}>{student.currentMood}</Text>
          </View>
        </Card>

        <Card style={styles.sessionsCard}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          {recentSessions.map((session, index) => (
            <View key={index} style={styles.sessionRow}>
              <Text style={styles.sessionDate}>{session.date}</Text>
              <Text style={styles.sessionCounselor}>{session.counselor}</Text>
              <Text style={styles.sessionType}>{session.type}</Text>
            </View>
          ))}
        </Card>

        <Button
          title="Assign Counselor"
          onPress={() => {}}
          style={styles.button}
        />

        <Button
          title="View Full History"
          variant="outline"
          onPress={() => {}}
          style={styles.button}
        />
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
  profileCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  avatarText: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  studentName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs
  },
  studentId: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.md
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    backgroundColor: colors.backgroundLight
  },
  activeBadge: {
    backgroundColor: colors.success
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  infoCard: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm
  },
  infoLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: 120
  },
  infoValue: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text
  },
  sessionsCard: {
    marginBottom: spacing.xl
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border
  },
  sessionDate: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    width: 80
  },
  sessionCounselor: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.textLight
  },
  sessionType: {
    fontSize: typography.fontSize.md,
    color: colors.primary
  },
  button: {
    marginTop: spacing.md
  }
});

export default StudentDetailsScreen;
