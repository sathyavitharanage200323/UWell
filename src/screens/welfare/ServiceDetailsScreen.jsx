import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { counselingServiceDetails } from '../../data/welfareMockData';

const ServiceDetailsScreen = ({ navigation }) => {
  const svc = counselingServiceDetails;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{svc.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tag Banner */}
        <View style={styles.tagBanner}>
          <Text style={styles.tagText}>{svc.tag}</Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Service</Text>
          <Text style={styles.bodyText}>{svc.about}</Text>
        </View>

        {/* Services Offered */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Services Offered</Text>
          {svc.servicesOffered.map((item, i) => (
            <View key={i} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>

          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>WELFARE PHONE</Text>
            <Text style={styles.contactValue}>{svc.contact.phone}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>WELFARE EMAIL</Text>
            <Text style={styles.contactValue}>{svc.contact.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>OFFICE HOURS</Text>
            <Text style={styles.contactValue}>{svc.contact.hours}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location</Text>
          <Text style={styles.bodyText}>{svc.location}</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Ionicons name="calendar-outline" size={18} color={colors.textWhite} />
          <Text style={styles.primaryButtonText}>Book an Appointment</Text>
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

  tagBanner: {
    backgroundColor: '#FBE1DE',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: spacing.lg
  },
  tagText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#C0392B',
    letterSpacing: 0.5
  },

  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  bodyText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22
  },

  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.sm },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: spacing.sm
  },
  bulletText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
    lineHeight: 20
  },

  contactRow: { marginTop: spacing.sm },
  contactLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2
  },
  contactValue: { fontSize: typography.fontSize.md, color: colors.text },

  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 14,
    marginTop: spacing.sm
  },
  primaryButtonText: {
    color: colors.textWhite,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    marginLeft: spacing.sm
  }
});

export default ServiceDetailsScreen;