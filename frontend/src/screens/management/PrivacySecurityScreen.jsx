import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const PrivacySecurityScreen = ({ navigation }) => {
  const settings = [
    {
      id: 1,
      title: 'Data Encryption',
      description: 'All user data is encrypted at rest and in transit',
      status: 'Enabled'
    },
    {
      id: 2,
      title: 'Two-Factor Authentication',
      description: 'Require 2FA for all admin accounts',
      status: 'Enabled'
    },
    {
      id: 3,
      title: 'Session Timeout',
      description: 'Auto-logout after inactivity period',
      status: '30 minutes'
    },
    {
      id: 4,
      title: 'Audit Logging',
      description: 'Log all system activities for security review',
      status: 'Enabled'
    },
    {
      id: 5,
      title: 'Data Retention Policy',
      description: 'Automatic deletion of old records',
      status: '5 years'
    },
    {
      id: 6,
      title: 'Privacy Mode',
      description: 'Hide sensitive information in reports',
      status: 'Disabled'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Privacy & Security" />
      
      <View style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔒 Security Overview</Text>
          <Text style={styles.infoText}>
            Your data is protected with industry-standard security measures. 
            Review and adjust security settings below.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Security Settings</Text>
        
        {settings.map((setting) => (
          <TouchableOpacity key={setting.id}>
            <Card style={styles.settingCard}>
              <View style={styles.settingHeader}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{setting.status}</Text>
                </View>
              </View>
              <Text style={styles.settingDescription}>{setting.description}</Text>
            </Card>
          </TouchableOpacity>
        ))}

        <Card style={styles.complianceCard}>
          <Text style={styles.complianceTitle}>Compliance</Text>
          <View style={styles.complianceItem}>
            <Text style={styles.complianceCheck}>✓</Text>
            <Text style={styles.complianceText}>FERPA Compliant</Text>
          </View>
          <View style={styles.complianceItem}>
            <Text style={styles.complianceCheck}>✓</Text>
            <Text style={styles.complianceText}>HIPAA Ready</Text>
          </View>
          <View style={styles.complianceItem}>
            <Text style={styles.complianceCheck}>✓</Text>
            <Text style={styles.complianceText}>GDPR Compliant</Text>
          </View>
        </Card>

        <Card style={styles.alertCard}>
          <Text style={styles.alertTitle}>⚠️ Security Alerts</Text>
          <View style={styles.alertItem}>
            <Text style={styles.alertText}>• No security alerts at this time</Text>
          </View>
          <View style={styles.alertItem}>
            <Text style={styles.alertText}>• Last security scan: Yesterday</Text>
          </View>
          <View style={styles.alertItem}>
            <Text style={styles.alertText}>• All systems operational</Text>
          </View>
        </Card>
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
  infoCard: {
    backgroundColor: colors.primaryLight,
    marginBottom: spacing.xl
  },
  infoTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.sm
  },
  infoText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: typography.lineHeight.relaxed
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg
  },
  settingCard: {
    marginBottom: spacing.md
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  settingTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 4,
    backgroundColor: colors.success
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite
  },
  settingDescription: {
    fontSize: typography.fontSize.md,
    color: colors.textLight
  },
  complianceCard: {
    marginBottom: spacing.lg
  },
  complianceTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  complianceCheck: {
    fontSize: typography.fontSize.lg,
    color: colors.success,
    marginRight: spacing.md
  },
  complianceText: {
    fontSize: typography.fontSize.md,
    color: colors.text
  },
  alertCard: {
    backgroundColor: colors.success
  },
  alertTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite,
    marginBottom: spacing.md
  },
  alertItem: {
    marginBottom: spacing.sm
  },
  alertText: {
    fontSize: typography.fontSize.md,
    color: colors.textWhite
  }
});

export default PrivacySecurityScreen;
