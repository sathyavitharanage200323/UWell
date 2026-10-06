import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { privacySecurityData } from '../../data/welfareMockData';

const PrivacySecurityScreen = ({ navigation }) => {
  const [twoFactor, setTwoFactor] = useState(privacySecurityData.twoFactorEnabled);
  const data = privacySecurityData;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Manage your privacy settings and understand how student data is protected.
        </Text>

        {/* Data Access Level */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>Data Access Level</Text>
            <View style={styles.badgeCoral}>
              <Text style={styles.badgeCoralText}>{data.dataAccessLevel.label}</Text>
            </View>
          </View>
          <Text style={styles.bodyText}>{data.dataAccessLevel.description}</Text>
        </View>

        {/* Confidentiality Agreement */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.cardTitle}>Confidentiality Agreement</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Signed Date</Text>
                <Text style={styles.metaValue}>{data.confidentiality.signedDate}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Renewal Date</Text>
                <Text style={styles.metaValue}>{data.confidentiality.renewalDate}</Text>
              </View>
            </View>
            {data.confidentiality.active && (
              <View style={styles.badgeGreen}>
                <Text style={styles.badgeGreenText}>Active</Text>
              </View>
            )}
          </View>
        </View>

        {/* Two-Factor Authentication */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Two-Factor Authentication</Text>
              <Text style={styles.bodyTextMuted}>Secure your account access</Text>
            </View>
            <Switch
              value={twoFactor}
              onValueChange={setTwoFactor}
              trackColor={{ false: colors.border, true: '#B7DCC5' }}
              thumbColor={twoFactor ? '#397052' : '#F4F3F4'}
            />
          </View>
        </View>

        {/* Session Timeout */}
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>Session Timeout</Text>
              <Text style={styles.bodyTextMuted}>
                Inactivity logout duration
              </Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.valueText}>{data.sessionTimeout}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Data Handling Guidelines */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PrivacyInformation')}
        >
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Data Handling Guidelines</Text>
              <Text style={styles.bodyTextMuted}>Standard compliance handbook</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.creamBackground },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  backBtn: { padding: spacing.xs, marginRight: spacing.sm },
  headerTitle: {
    fontSize: typography.fontSize.xxl,
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
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  bodyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 4
  },
  bodyTextMuted: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2
  },
  valueText: {
    fontSize: typography.fontSize.md,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
    marginRight: spacing.xs
  },

  badgeCoral: {
    backgroundColor: '#FDF1EC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeCoralText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary
  },
  badgeGreen: {
    backgroundColor: '#DDF3E4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeGreenText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#397052'
  },

  metaRow: { flexDirection: 'row', marginTop: spacing.sm },
  metaLabel: {
    width: 90,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted
  },
  metaValue: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    fontWeight: typography.fontWeight.medium
  }
});

export default PrivacySecurityScreen;