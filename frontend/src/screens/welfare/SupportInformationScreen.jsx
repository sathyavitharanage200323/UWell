import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, typography } from '../../theme';
import { supportDirectories } from '../../data/welfareMockData';

const STORAGE_PREFIX = '@uwell/support_dir_';

const TABS = [
  { key: 'all', label: 'All (4)' },
  { key: 'counseling', label: 'Counseling' },
  { key: 'academic', label: 'Academic' },
  { key: 'welfare', label: 'Welfare' },
  { key: 'emergency', label: 'Emergency' },
];

const SupportInformationScreen = ({ navigation }) => {
  const [directories, setDirectories] = useState(supportDirectories);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Reload saved custom data whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCustomizedDirectories();
    }, [])
  );

  const loadCustomizedDirectories = async () => {
    try {
      const updatedList = await Promise.all(
        supportDirectories.map(async (item) => {
          const saved = await AsyncStorage.getItem(`${STORAGE_PREFIX}${item.id}`);
          if (saved) {
            try {
              return JSON.parse(saved);
            } catch (e) {
              return item;
            }
          }
          return item;
        })
      );
      setDirectories(updatedList);
    } catch (e) {
      console.error('Error loading directories from storage:', e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCustomizedDirectories();
    setRefreshing(false);
  };

  const handlePress = (dir) => {
    navigation.navigate('ServiceDetails', {
      service: dir,
      directory: dir,
      id: dir.id,
      title: dir.title,
      category: dir.category,
    });
  };

  const filteredDirectories = directories.filter((dir) => {
    const matchesTab = activeTab === 'all' || dir.category === activeTab;
    const matchesSearch =
      !searchQuery.trim() ||
      dir.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dir.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dir.contact?.phone?.includes(searchQuery) ||
      dir.contact?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Information</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <Text style={styles.subtitle}>
          Find the right support for every student need. Use the specialized directories below to guide students to appropriate university help desks.
        </Text>

        {/* ---------- Quick Search Bar ---------- */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search directories, contacts, or phone numbers..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* ---------- Filter Tabs ---------- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabPill, isActive && styles.tabPillActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabPillText, isActive && styles.tabPillTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ---------- Directory Cards List ---------- */}
        {filteredDirectories.map((dir) => {
          const isUrgent = dir.urgent;
          return (
            <TouchableOpacity
              key={dir.id}
              style={[styles.card, isUrgent && styles.cardUrgent]}
              onPress={() => handlePress(dir)}
              activeOpacity={0.85}
            >
              <View style={[styles.iconWrap, isUrgent && styles.iconWrapUrgent]}>
                <Ionicons
                  name={dir.icon}
                  size={24}
                  color={isUrgent ? '#C0392B' : colors.primary}
                />
              </View>

              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.title}>{dir.title}</Text>
                  {isUrgent ? (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentBadgeText}>24/7</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.desc}>{dir.description}</Text>

                {/* Sub-meta contact preview */}
                {dir.contact?.phone ? (
                  <View style={styles.cardMetaRow}>
                    <Ionicons name="call-outline" size={12} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={styles.cardMetaText}>{dir.contact.phone}</Text>
                  </View>
                ) : null}
              </View>

              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        {filteredDirectories.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="search-outline" size={36} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Matching Directories</Text>
            <Text style={styles.emptySub}>Try searching for a different keyword or reset the filter tab.</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.creamBackground,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: spacing.xxl,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },

  // Search
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },

  // Tabs
  tabScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.lg,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Directory Cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 18,
    padding: spacing.md + 2,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardUrgent: {
    borderColor: '#F0B8B1',
    backgroundColor: '#FFFBFB',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconWrapUrgent: {
    backgroundColor: '#FBE1DE',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.md + 1,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    fontFamily: typography.fontFamily.accent,
  },
  urgentBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  urgentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  desc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cardMetaText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  // Empty Box
  emptyBox: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  emptySub: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default SupportInformationScreen;