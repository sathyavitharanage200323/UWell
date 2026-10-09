import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { studentService } from '../../services/studentService';

// Fallback shown only when API returns no approved counselors from DB.
const FALLBACK_COUNSELORS: any[] = [];

export default function CounselorSearchScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [counselors, setCounselors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await studentService.getCounselors();
        const list = res?.data || [];
        setCounselors(list.length > 0 ? list : FALLBACK_COUNSELORS);
      } catch {
        setCounselors(FALLBACK_COUNSELORS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      matchesFilter = counselor.specialization
        .toLowerCase()
        .includes('student counselling');
    }

    if (selectedFilter === 'Stress & Anxiety') {
      matchesFilter = counselor.specialization
        .toLowerCase()
        .includes('stress') ||
        counselor.specialization
        .toLowerCase()
        .includes('anxiety');
    }

    if (selectedFilter === 'Academic Support') {
      matchesFilter = counselor.specialization
        .toLowerCase()
        .includes('academic');
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
          onPress={() => navigation.goBack()}
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

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#EF806B" />
            <Text style={styles.loadingText}>Finding counselors…</Text>
          </View>
        ) : filteredCounselors.map((counselor) => (
          <Pressable
            key={counselor._id || counselor.id}
            style={({ pressed }) => [
              styles.counselorCard,
              pressed && styles.cardPressed,
            ]}
            onPress={() =>
              navigation.navigate('CounselorProfile', {
                counselorId:           counselor._id || counselor.id,
                counselorName:         counselor.name,
                counselorSpecialization: counselor.specialization,
                counselorExperience:   counselor.experience,
              })
            }
          >
            {/* Profile */}
            <View style={styles.profileCircle}>
              <Text style={styles.profileInitials}>
                {counselor.avatarInitials ||
                  counselor.name.split(' ').map((p: string) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
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

        {/* Empty State — only when not loading */}
        {!loading && filteredCounselors.length === 0 && (
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

  profileInitials: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EF806B',
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

  loadingWrap: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },

  loadingText: {
    marginTop: 12,
    color: '#8A7770',
    fontSize: 13,
  },
});