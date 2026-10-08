/**
 * RegisterSelectScreen
 * Choose account type → navigate to the correct registration screen.
 */
import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StatusBar, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../theme';

const ROLES = [
  {
    key: 'StudentRegister',
    label: 'Student',
    sub: 'Get support and book sessions',
    icon: 'school-outline',
    lib: 'Ionicons',
    bg: '#FDF1EC', color: colors.primary,
    badge: 'STUDENT',
  },
  {
    key: 'CounselorRegister',
    label: 'Counselor',
    sub: 'Manage your students and sessions',
    icon: 'person-circle-outline',
    lib: 'Ionicons',
    bg: '#EAF3FF', color: '#4A90E2',
    badge: 'CLINICAL STAFF',
  },
  {
    key: 'WelfareRegister',
    label: 'Welfare',
    sub: 'Oversee student wellbeing',
    icon: 'heart-outline',
    lib: 'MaterialCommunityIcons',
    bg: '#E8F8EF', color: '#397052',
    badge: 'WELFARE STAFF',
  },
  {
    key: 'ManagementRegister',
    label: 'Management',
    sub: 'Admin and system access',
    icon: 'settings-outline',
    lib: 'Ionicons',
    bg: '#F3EEFF', color: '#7C5CBF',
    badge: 'MANAGEMENT',
  },
];

const RoleIcon = ({ lib, name, size, color }) => {
  if (lib === 'MaterialCommunityIcons')
    return <MaterialCommunityIcons name={name} size={size} color={color} />;
  return <Ionicons name={name} size={size} color={color} />;
};

export default function RegisterSelectScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef(ROLES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    ROLES.forEach((_, i) => {
      Animated.timing(cardAnims[i], {
        toValue: 1, duration: 360, delay: 80 + i * 70, useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />

      {/* Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
          <Feather name="chevron-left" size={22} color={colors.darkText} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.sub}>Choose your account type to get started.</Text>
        </Animated.View>

        <View style={styles.grid}>
          {ROLES.map((r, i) => {
            const anim = cardAnims[i];
            return (
              <Animated.View
                key={r.key}
                style={[
                  styles.cardWrap,
                  {
                    opacity: anim,
                    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate(r.key)}
                  activeOpacity={0.82}
                  accessibilityRole="button"
                  accessibilityLabel={`Register as ${r.label}`}
                >
                  <View style={[styles.iconCircle, { backgroundColor: r.bg }]}>
                    <RoleIcon lib={r.lib} name={r.icon} size={28} color={r.color} />
                  </View>

                  <Text style={styles.roleLabel}>{r.label}</Text>
                  <Text style={styles.roleSub}>{r.sub}</Text>

                  <View style={[styles.badge, { backgroundColor: r.bg }]}>
                    <Text style={[styles.badgeText, { color: r.color }]}>{r.badge}</Text>
                  </View>

                  <View style={[styles.arrowCircle, { backgroundColor: r.color }]}>
                    <Feather name="arrow-right" size={14} color={colors.white} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} accessibilityRole="button">
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_W = '48%';

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.creamBackground },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  navBar:  { paddingHorizontal: 20, paddingVertical: 10 },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  title: { fontSize: 26, fontWeight: '700', color: colors.darkText, marginBottom: 6, marginTop: 6 },
  sub:   { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 24 },
  grid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  cardWrap: { width: CARD_W },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20, padding: 16,
    alignItems: 'flex-start',
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
    minHeight: 180,
  },
  iconCircle: {
    width: 54, height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  roleLabel: { fontSize: 15, fontWeight: '700', color: colors.darkText, marginBottom: 4 },
  roleSub:   { fontSize: 11, color: colors.textSecondary, lineHeight: 15, flex: 1, marginBottom: 10 },
  badge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10, marginBottom: 10,
  },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.6 },
  arrowCircle: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  loginText: { fontSize: 13, color: colors.textSecondary },
  loginLink: { fontSize: 13, color: colors.primary, fontWeight: '700' },
});
