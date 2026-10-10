import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CORAL     = '#EF806B';
const MUTED     = '#A18E87';
const WHITE     = '#FFFFFF';
const BORDER    = '#F0E4DE';
const ACTIVE_BG = '#FFF1EC';

/* ─────────────────────────────────────────────────────────
   Icon name map  —  Ionicons
───────────────────────────────────────────────────────── */
const ICON_MAP: Record<string, { active: string; inactive: string }> = {
  Home:       { active: 'home',              inactive: 'home-outline' },
  Mood:       { active: 'happy',             inactive: 'happy-outline' },
  Counselors: { active: 'people',            inactive: 'people-outline' },
  Sessions:   { active: 'calendar',          inactive: 'calendar-outline' },
  Resources:  { active: 'leaf',              inactive: 'leaf-outline' },
  Profile:    { active: 'person-circle',     inactive: 'person-circle-outline' },
};

/* ─────────────────────────────────────────────────────────
   Tab Bar Item
───────────────────────────────────────────────────────── */
export function TabBarItem({
  name,
  focused,
}: {
  name: string;
  focused: boolean;
}) {
  const icons = ICON_MAP[name] || ICON_MAP['Home'];
  const iconName = (focused ? icons.active : icons.inactive) as any;

  return (
    <View style={[styles.wrap, focused && styles.wrapActive]}>
      <Ionicons
        name={iconName}
        size={22}
        color={focused ? CORAL : MUTED}
      />
    </View>
  );
}

/* ─────────────────────────────────────────────────────────
   tabScreenOptions factory
───────────────────────────────────────────────────────── */
export const tabScreenOptions = (_icon: string, routeName?: string) => ({
  tabBarIcon: ({ focused }: { focused: boolean }) => (
    <TabBarItem name={routeName || ''} focused={focused} />
  ),
  tabBarActiveTintColor:   CORAL,
  tabBarInactiveTintColor: MUTED,
  headerShown: false,
  tabBarStyle: {
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    height: 72,
    paddingBottom: 10,
    paddingTop: 4,
    shadowColor: '#C6AEA1',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 10,
  },
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '600' as TextStyle['fontWeight'],
    marginTop: 0,
  },
});

/* ─────────────────────────────────────────────────────────
   Styles
───────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  wrap: {
    width: 42,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapActive: {
    backgroundColor: ACTIVE_BG,
  },
});
