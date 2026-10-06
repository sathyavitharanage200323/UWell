import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const ServiceDetailsScreen = ({ route, navigation }) => {
  const { serviceId } = route.params || {};
  const [service, setService] = useState({
    name: 'Individual Counseling',
    description: 'One-on-one sessions with professional counselors for personalized mental health support.',
    icon: '👤',
    active: true,
    counselors: 12,
    duration: '50 minutes',
    price: 'Free for students'
  });

  const handleSave = () => {
    // Save service logic
  };

  const handleToggleStatus = () => {
    setService({ ...service, active: !service.active });
  };

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Service Details" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Card style={styles.headerCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.serviceIcon}>{service.icon}</Text>
          </View>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={[
            styles.statusBadge,
            service.active ? styles.activeBadge : styles.inactiveBadge
          ]}>
            <Text style={styles.statusText}>
              {service.active ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </Card>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Service Information</Text>
          
          <Input
            label="Service Name"
            value={service.name}
            onChangeText={(value) => setService({ ...service, name: value })}
          />

          <Input
            label="Description"
            value={service.description}
            onChangeText={(value) => setService({ ...service, description: value })}
            multiline
          />

          <Input
            label="Duration"
            value={service.duration}
            onChangeText={(value) => setService({ ...service, duration: value })}
          />

          <Input
            label="Price"
            value={service.price}
            onChangeText={(value) => setService({ ...service, price: value })}
          />
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Active Counselors:</Text>
            <Text style={styles.statValue}>{service.counselors}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Sessions This Month:</Text>
            <Text style={styles.statValue}>156</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Student Satisfaction:</Text>
            <Text style={styles.statValue}>4.8/5.0</Text>
          </View>
        </Card>

        <Button
          title={service.active ? 'Deactivate Service' : 'Activate Service'}
          onPress={handleToggleStatus}
          variant={service.active ? 'outline' : 'primary'}
          style={styles.button}
        />

        <Button
          title="Save Changes"
          onPress={handleSave}
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
  headerCard: {
    alignItems: 'center',
    padding: spacing.xl,
    marginBottom: spacing.lg
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  serviceIcon: {
    fontSize: 40
  },
  serviceName: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4
  },
  activeBadge: {
    backgroundColor: colors.success
  },
  inactiveBadge: {
    backgroundColor: colors.textLight
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  formCard: {
    marginBottom: spacing.lg
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg
  },
  statsCard: {
    marginBottom: spacing.xl
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: spacing.md
  },
  statLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    width: 200
  },
  statValue: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text
  },
  button: {
    marginTop: spacing.md
  }
});

export default ServiceDetailsScreen;
