import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';
import { counselorService } from '../../services/counselorService';

const StudentListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
    const unsubscribe = navigation.addListener('focus', loadStudents);
    return unsubscribe;
  }, [navigation]);

  const loadStudents = async () => {
    const data = await counselorService.getStudents();
    setStudents(data);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.yearCourse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('StudentSession', { studentId: item.id })}
      accessibilityLabel={`View details for student ${item.name}`}
    >
      <Card style={styles.studentCard}>
        <View style={styles.cardMain}>
          <ImagePlaceholder
            initials={item.avatarInitials || item.name.substring(0, 2)}
            size={50}
          />
          <View style={styles.studentMeta}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.courseText}>{item.yearCourse}</Text>
            <Text style={styles.sessionCountText}>
              {item.sessionsCompleted} Session{item.sessionsCompleted === 1 ? '' : 's'} Completed
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.status === 'Active' && styles.statusActive,
              item.status === 'Completed' && styles.statusCompleted,
              item.status === 'New' && styles.statusNew
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === 'Active' && styles.textActive,
                item.status === 'Completed' && styles.textCompleted,
                item.status === 'New' && styles.textNew
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Students</Text>

        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No students matching search.</Text>
            </Card>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.creamBackground
  },
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.creamBackground
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText,
    marginBottom: spacing.sm
  },
  searchInput: {
    marginBottom: spacing.md,
    backgroundColor: colors.white
  },
  listContent: {
    paddingBottom: spacing.xxl
  },
  studentCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderColor: colors.border
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  studentMeta: {
    flex: 1,
    marginLeft: spacing.sm
  },
  studentName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  courseText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1
  },
  sessionCountText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusActive: {
    backgroundColor: colors.statusGreenBg
  },
  textActive: {
    color: colors.statusGreenText,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium
  },
  statusCompleted: {
    backgroundColor: colors.softCoral
  },
  textCompleted: {
    color: colors.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium
  },
  statusNew: {
    backgroundColor: colors.statusYellowBg
  },
  textNew: {
    color: colors.statusYellowText,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium
  },
  emptyCard: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.white
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md
  }
});

export default StudentListScreen;
