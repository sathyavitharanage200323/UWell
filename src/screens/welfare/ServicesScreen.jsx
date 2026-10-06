import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const ServicesScreen = ({ navigation }) => {
  const services = [
    {
      id: 1,
      name: 'Individual Counseling',
      description: 'One-on-one sessions with professional counselors',
      icon: '👤',
      active: true,
      counselors: 12
    },
    {
      id: 2,
      name: 'Group Therapy',
      description: 'Support groups for shared experiences',
      icon: '👥',
      active: true,
      counselors: 5
    },
    {
      id: 3,
      name: 'Stress Management Workshop',
      description: 'Weekly workshops on stress reduction techniques',
      icon: '🧘',
      active: true,
      counselors: 3
    },
    {
      id: 4,
      name: 'Crisis Intervention',
      description: '24/7 emergency support for urgent situations',
      icon: '🆘',
      active: true,
      counselors: 8
    },
    {
      id: 5,
      name: 'Career Counseling',
      description: 'Guidance for academic and career decisions',
      icon: '💼',
      active: false,
      counselors: 0
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Services" />
      
      <View style={styles.content}>
        <Button
          title="+ Add New Service"
          onPress={() => {}}
          style={styles.addButton}
        />

        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            onPress={() => navigation.navigate('ServiceDetails', { serviceId: service.id })}
          >
            <Card style={[
              styles.serviceCard,
              !service.active && styles.inactiveCard
            ]}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                </View>
                <View style={[
                  styles.statusIndicator,
                  service.active ? styles.activeIndicator : styles.inactiveIndicator
                ]} />
              </View>
              
              <View style={styles.serviceDetails}>
                <Text style={styles.detail}>
                  {service.active ? `👨‍⚕️ ${service.counselors} Counselors` : 'Inactive'}
                </Text>
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
  addButton: {
    marginBottom: spacing.lg
  },
  serviceCard: {
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  inactiveCard: {
    opacity: 0.6,
    borderColor: colors.border
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  serviceIcon: {
    fontSize: 40,
    marginRight: spacing.md
  },
  serviceInfo: {
    flex: 1
  },
  serviceName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs
  },
  serviceDescription: {
    fontSize: typography.fontSize.md,
    color: colors.textLight
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6
  },
  activeIndicator: {
    backgroundColor: colors.success
  },
  inactiveIndicator: {
    backgroundColor: colors.textLight
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  detail: {
    fontSize: typography.fontSize.md,
    color: colors.textLight
  }
});

export default ServicesScreen;
