import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function CounselorSearchScreen() {
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const counselors = [
    {
      id: '1',
      name: 'Dr. Sarah Perera',
      specialization: 'Student Counselling',
      experience: '8 years experience',
      availability: 'Available today',
      icon: '👩‍⚕️',
    },
    {
      id: '2',
      name: 'Ms. Amaya Fernando',
      specialization: 'Stress & Anxiety',
      experience: '6 years experience',
      availability: 'Available tomorrow',
      icon: '👩‍💼',
    },
    {
      id: '3',
      name: 'Dr. Kavindu Silva',
      specialization: 'Academic & Personal Support',
      experience: '5 years experience',
      availability: 'Available this week',
      icon: '👨‍⚕️',
    },
  ];

  const filters = [
    'All',
    'Student Counselling',
    'Stress & Anxiety',
    'Academic Support',
  ];

  const filteredCounselors = counselors.filter((counselor) => {
    const matchesSearch =
      counselor.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      counselor.specialization
        .toLowerCase()
        .includes(search.toLowerCase());

    let matchesFilter = true;

    if (selectedFilter === 'Student Counselling') {
      matchesFilter =
        counselor.specialization === 'Student Counselling';
    }

    if (selectedFilter === 'Stress & Anxiety') {
      matchesFilter =
        counselor.specialization === 'Stress & Anxiety';
    }

    if (selectedFilter === 'Academic Support') {
      matchesFilter =
        counselor.specialization ===
        'Academic & Personal Support';
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Back */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Header */}
        <Text style={styles.smallTitle}>
          COUNSELING SUPPORT
        </Text>

        <Text style={styles.title}>
          Find a Counselor
        </Text>

        <Text style={styles.subtitle}>
          Find a counselor who can support you
          with your wellbeing and personal needs.
        </Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search counselors or specialization"
            placeholderTextColor="#A99A94"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          )}
        </View>

        {/* Filter Title */}
        <View style={styles.filterHeader}>
          <Text style={styles.filterLabel}>
            Filter by specialization
          </Text>

          <Text style={styles.resultCount}>
            {filteredCounselors.length} found
          </Text>
        </View>

        {/* Filter Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter;

            return (
              <Pressable
                key={filter}
                style={[
                  styles.filterButton,
                  isSelected && styles.filterButtonSelected,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextSelected,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Counselor List */}
        <Text style={styles.sectionTitle}>
          Available Counselors
        </Text>

        {filteredCounselors.map((counselor) => (
          <Pressable
            key={counselor.id}
            style={({ pressed }) => [
              styles.counselorCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              router.push({
                pathname: '/counselor-details',
                params: {
                  id: counselor.id,
                },
              })
            }
          >
            {/* Profile */}
            <View style={styles.profileCircle}>
              <Text style={styles.profileIcon}>
                {counselor.icon}
              </Text>
            </View>

            {/* Information */}
            <View style={styles.counselorInfo}>
              <Text style={styles.counselorName}>
                {counselor.name}
              </Text>

              <Text style={styles.specialization}>
                {counselor.specialization}
              </Text>

              <Text style={styles.experience}>
                {counselor.experience}
              </Text>

              <View style={styles.availabilityRow}>
                <View style={styles.availableDot} />

                <Text style={styles.availability}>
                  {counselor.availability}
                </Text>
              </View>

              <Text style={styles.viewProfile}>
                View Profile →
              </Text>
            </View>

            {/* Arrow */}
            <Text style={styles.cardArrow}>
              ›
            </Text>
          </Pressable>
        ))}

        {/* Empty State */}
        {filteredCounselors.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🔍</Text>

            <Text style={styles.emptyTitle}>
              No counselors found
            </Text>

            <Text style={styles.emptyText}>
              Try another name or specialization,
              or select the All filter.
            </Text>

            <Pressable
              style={styles.resetButton}
              onPress={() => {
                setSearch('');
                setSelectedFilter('All');
              }}
            >
              <Text style={styles.resetButtonText}>
                Clear Filters
              </Text>
            </Pressable>
          </View>
        )}

        {/* Privacy Note */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyIcon}>🔒</Text>

          <Text style={styles.privacyText}>
            Your counseling information is treated as
            confidential within the UWell service.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  container: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  backArrow: {
    color: '#3B2925',
    fontSize: 30,
    lineHeight: 30,
    marginRight: 5,
  },

  backText: {
    color: '#6F5E58',
    fontSize: 13,
  },

  smallTitle: {
    color: '#EF806B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },

  title: {
    color: '#3B2925',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 9,
  },

  subtitle: {
    color: '#8A7770',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 22,
  },

  searchContainer: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD7',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchIcon: {
    color: '#8A7770',
    fontSize: 25,
    marginRight: 9,
  },

  searchInput: {
    flex: 1,
    color: '#3B2925',
    fontSize: 12,
  },

  clearText: {
    color: '#8A7770',
    fontSize: 22,
    paddingLeft: 8,
  },

  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 10,
  },

  filterLabel: {
    color: '#3B2925',
    fontSize: 13,
    fontWeight: '700',
  },

  resultCount: {
    color: '#8A7770',
    fontSize: 11,
  },

  filterScroll: {
    paddingBottom: 22,
  },

  filterButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD7',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },

  filterButtonSelected: {
    backgroundColor: '#FCE0D9',
    borderColor: '#FCE0D9',
  },

  filterText: {
    color: '#806F68',
    fontSize: 11,
    fontWeight: '600',
  },

  filterTextSelected: {
    color: '#C85F4E',
    fontWeight: '700',
  },

  sectionTitle: {
    color: '#3B2925',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  counselorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#F0E2DC',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  cardPressed: {
    opacity: 0.75,
  },

  profileCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FCE3DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  profileIcon: {
    fontSize: 30,
  },

  counselorInfo: {
    flex: 1,
  },

  counselorName: {
    color: '#3B2925',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },

  specialization: {
    color: '#EF806B',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },

  experience: {
    color: '#8A7770',
    fontSize: 10,
    marginBottom: 6,
  },

  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  availableDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#65B87A',
    marginRight: 6,
  },

  availability: {
    color: '#65A870',
    fontSize: 10,
    fontWeight: '600',
  },

  viewProfile: {
    color: '#EF806B',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 7,
  },

  cardArrow: {
    color: '#EF806B',
    fontSize: 28,
    marginLeft: 7,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0E2DC',
  },

  emptyIcon: {
    fontSize: 35,
    marginBottom: 10,
  },

  emptyTitle: {
    color: '#3B2925',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 5,
  },

  emptyText: {
    color: '#8A7770',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 15,
  },

  resetButton: {
    backgroundColor: '#EF806B',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },

  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  privacyCard: {
    backgroundColor: '#F5EFE9',
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  privacyIcon: {
    fontSize: 20,
    marginRight: 9,
  },

  privacyText: {
    flex: 1,
    color: '#806F68',
    fontSize: 10,
    lineHeight: 16,
  },
});