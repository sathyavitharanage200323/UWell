import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const StudentsScreen = ({ navigation }) => {
  const students = [
    {
      id: 1,
      name: 'John Smith',
      studentId: 'STU001',
      counselor: 'Dr. Sarah Johnson',
      status: 'active',
      lastSession: 'Sep 28, 2024',
      mood: 'Good'
    },
    {
      id: 2,
      name: 'Emily Davis',
      studentId: 'STU002',
      counselor: 'Dr. Michael Chen',
      status: 'active',
      lastSession: 'Sep 25, 2024',
      mood: 'Fair'
    },
    {
      id: 3,
      name: 'Michael Brown',
      studentId: 'STU003',
      counselor: 'Dr. Emily Williams',
      status: 'attention',
      lastSession: 'Sep 20, 2024',
      mood: 'Poor'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      studentId: 'STU004',
      counselor: 'Dr. Sarah Johnson',
      status: 'active',
      lastSession: 'Sep 15, 2024',
      mood: 'Good'
    },
    {
      id: 5,
      name: 'David Lee',
      studentId: 'STU005',
      counselor: null,
      status: 'new',
      lastSession: 'Never',
      mood: 'N/A'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="All Students" />
      
      <View style={styles.content}>
        {students.map((student) => (
          <TouchableOpacity
            key={student.id}
            onPress={() => navigation.navigate('StudentDetails', { studentId: student.id })}
          >
            <Card style={[
              styles.studentCard,
              student.status === 'attention' && styles.attentionCard,
              student.status === 'new' && styles.newCard
            ]}>
              <View style={styles.studentHeader}>
                <Text style={styles.studentName}>{student.name}</Text>
                <View style={[
                  styles.statusBadge,
                  student.status === 'active' && styles.activeBadge,
                  student.status === 'attention' && styles.attentionBadge,
                  student.status === 'new' && styles.newBadge
                ]}>
                  <Text style={styles.statusText}>
                    {student.status === 'active' ? 'Active' : student.status === 'attention' ? 'Needs Attention' : 'New'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.studentDetails}>
                <Text style={styles.detail}>🆔 {student.studentId}</Text>
                <Text style={styles.detail}>👨‍⚕️ {student.counselor || 'Unassigned'}</Text>
                <Text style={styles.detail}>📅 Last: {student.lastSession}</Text>
                <Text style={styles.detail}>😊 Mood: {student.mood}</Text>
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
  studentCard: {
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  attentionCard: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5'
  },
  newCard: {
    borderColor: colors.info,
    backgroundColor: '#F0F8FF'
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  studentName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4
  },
  activeBadge: {
    backgroundColor: colors.success
  },
  attentionBadge: {
    backgroundColor: colors.error
  },
  newBadge: {
    backgroundColor: colors.info
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  studentDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  detail: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: '48%',
    marginBottom: spacing.xs
  }
});

export default StudentsScreen;
