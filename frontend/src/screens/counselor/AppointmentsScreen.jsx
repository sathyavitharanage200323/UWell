import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';
import { counselorService } from '../../services/counselorService';

const AppointmentsScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('Upcoming');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const data = await counselorService.getAppointments();
    setAppointments(data);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    await counselorService.updateAppointmentStatus(appointmentId, newStatus);
    loadAppointments();
  };

  const filteredAppointments = appointments.filter((app) => {
    if (activeFilter === 'Today') {
      return app.date === 'Today';
    }
    if (activeFilter === 'Upcoming') {
      return app.date !== 'Past' && app.status !== 'Completed';
    }
    if (activeFilter === 'Past') {
      return app.status === 'Completed' || app.date === 'Past';
    }
    return true;
  });

  const renderItem = ({ item }) => (
    <Card style={styles.appointmentCard}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('StudentSession', { studentId: item.studentId, appointment: item })}
        style={styles.cardHeader}
      >
        <View style={styles.studentInfo}>
          <ImagePlaceholder
            initials={item.avatarInitials || item.studentName.substring(0, 2)}
            size={46}
          />
          <View style={styles.nameBlock}>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.courseText}>{item.studentCourse}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'Confirmed' && styles.statusConfirmed,
            item.status === 'Pending' && styles.statusPending,
            item.status === 'Cancelled' && styles.statusCancelled
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'Confirmed' && styles.textConfirmed,
              item.status === 'Pending' && styles.textPending,
              item.status === 'Cancelled' && styles.textCancelled
            ]}
          >
            {item.status}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>📅 {item.date} · ⏰ {item.time}</Text>
        <Text style={styles.detailText}>📍 {item.location}</Text>
      </View>

      {item.status === 'Pending' && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => handleStatusChange(item.id || item._id, 'Confirmed')}
            accessibilityLabel="Accept Session"
          >
            <Text style={styles.acceptBtnText}>Accept Session</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.declineBtn]}
            onPress={() => handleStatusChange(item.id || item._id, 'Cancelled')}
            accessibilityLabel="Decline Session"
          >
            <Text style={styles.declineBtnText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Appointments</Text>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          {['Today', 'Upcoming', 'Past'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.tabBtn,
                activeFilter === filter && styles.tabBtnActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeFilter === filter && styles.tabTextActive
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id || item._id || String(Math.random())}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No {activeFilter.toLowerCase()} appointments found.</Text>
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
    marginBottom: spacing.md
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.softCoral,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.md
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 8
  },
  tabBtnActive: {
    backgroundColor: colors.primary
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeight.bold
  },
  listContent: {
    paddingBottom: spacing.xxl
  },
  appointmentCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderColor: colors.border
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameBlock: {
    marginLeft: spacing.sm
  },
  studentName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  courseText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusConfirmed: {
    backgroundColor: colors.statusGreenBg
  },
  textConfirmed: {
    color: colors.statusGreenText,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium
  },
  statusPending: {
    backgroundColor: colors.statusYellowBg
  },
  textPending: {
    color: colors.statusYellowText,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium
  },
  statusCancelled: {
    backgroundColor: colors.statusRedBg
  },
  textCancelled: {
    color: colors.statusRedText,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium
  },
  detailsRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  detailText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.sm
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    borderRadius: 8,
    alignItems: 'center'
  },
  acceptBtn: {
    backgroundColor: colors.primary
  },
  acceptBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold
  },
  declineBtn: {
    backgroundColor: colors.softCoral,
    borderWidth: 1,
    borderColor: colors.border
  },
  declineBtnText: {
    color: colors.darkText,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold
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

export default AppointmentsScreen;
