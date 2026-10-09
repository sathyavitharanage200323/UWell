import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';

const CORAL   = '#EF806B';
const MUTED   = '#A18E87';
const DARK    = '#4A3833';
const WHITE   = '#FFFFFF';
const BG      = '#FFF9F3';
const BORDER  = '#F0E4DE';
const ACTIVE_BG = '#FFF1EC';

/* =========================================================
   INLINE TAB ICONS  — pure View, no external libs
========================================================= */

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? CORAL : MUTED;
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center' }}>
      {/* roof */}
      <View style={{ position: 'absolute', top: 0, width: 0, height: 0,
        borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 9,
        borderLeftColor: 'transparent', borderRightColor: 'transparent',
        borderBottomColor: c }} />
      {/* walls */}
      <View style={{ position: 'absolute', bottom: 0, width: 16, height: 12,
        backgroundColor: c, borderRadius: 2 }} />
      {/* door */}
      <View style={{ position: 'absolute', bottom: 0, width: 5, height: 7,
        backgroundColor: active ? ACTIVE_BG : BG, borderTopLeftRadius: 2,
        borderTopRightRadius: 2 }} />
    </View>
  );
}

function MoodIcon({ active }: { active: boolean }) {
  const c = active ? CORAL : MUTED;
  return (
    <View style={{ width: 22, height: 22, borderRadius: 11,
      borderWidth: 2, borderColor: c, alignItems: 'center', justifyContent: 'center' }}>
      {/* left eye */}
      <View style={{ position: 'absolute', width: 3, height: 3, borderRadius: 2,
        backgroundColor: c, left: 5, top: 6 }} />
      {/* right eye */}
      <View style={{ position: 'absolute', width: 3, height: 3, borderRadius: 2,
        backgroundColor: c, right: 5, top: 6 }} />
      {/* smile */}
      <View style={{ position: 'absolute', width: 10, height: 5,
        borderBottomWidth: 2, borderRadius: 6, borderColor: c,
        bottom: 4 }} />
    </View>
  );
}

function CounselorIcon({ active }: { active: boolean }) {
  const c = active ? CORAL : MUTED;
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center' }}>
      {/* head */}
      <View style={{ width: 9, height: 9, borderRadius: 5,
        backgroundColor: c, position: 'absolute', top: 0 }} />
      {/* shoulders */}
      <View style={{ width: 18, height: 8, borderTopLeftRadius: 9,
        borderTopRightRadius: 9, backgroundColor: c,
        position: 'absolute', bottom: 0 }} />
      {/* chat bubble */}
      <View style={{ position: 'absolute', right: 0, top: 0,
        width: 10, height: 8, borderRadius: 4, borderWidth: 1.5,
        borderColor: c, backgroundColor: active ? ACTIVE_BG : BG }} />
      <View style={{ position: 'absolute', right: 3, top: 3,
        width: 4, height: 1.5, backgroundColor: c, borderRadius: 1 }} />
    </View>
  );
}

function SessionsIcon({ active }: { active: boolean }) {
  const c = active ? CORAL : MUTED;
  return (
    <View style={{ width: 22, height: 22 }}>
      {/* calendar body */}
      <View style={{ position: 'absolute', bottom: 0, width: 20, height: 16,
        borderWidth: 1.5, borderColor: c, borderRadius: 4, left: 1 }} />
      {/* top bar */}
      <View style={{ position: 'absolute', top: 4, left: 1, width: 20, height: 5,
        backgroundColor: c, borderTopLeftRadius: 4,
        borderTopRightRadius: 4 }} />
      {/* dots */}
      {[5, 10, 15].map(x => (
        <View key={x} style={{ position: 'absolute', bottom: 4,
          left: x, width: 3, height: 3, borderRadius: 2,
          backgroundColor: c }} />
      ))}
    </View>
  );
}

function ResourcesIcon({ active }: { active: boolean }) {
  const c = active ? CORAL : MUTED;
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      {/* leaf left */}
      <View style={{ position: 'absolute', width: 11, height: 17, borderRadius: 11,
        backgroundColor: c, left: 2, top: 2,
        transform: [{ rotate: '-35deg' }] }} />
      {/* leaf right */}
      <View style={{ position: 'absolute', width: 10, height: 16, borderRadius: 10,
        backgroundColor: active ? '#F5A890' : '#C5A49E', right: 2, top: 4,
        transform: [{ rotate: '40deg' }] }} />
      {/* stem */}
      <View style={{ position: 'absolute', width: 2, height: 16, borderRadius: 2,
        backgroundColor: c, bottom: 0, left: 10 }} />
    </View>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  const c = active ? CORAL : MUTED;
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center' }}>
      {/* head */}
      <View style={{ width: 10, height: 10, borderRadius: 5,
        borderWidth: 2, borderColor: c, position: 'absolute', top: 0 }} />
      {/* body */}
      <View style={{ width: 18, height: 9, borderTopLeftRadius: 9,
        borderTopRightRadius: 9, borderWidth: 2, borderBottomWidth: 0,
        borderColor: c, position: 'absolute', bottom: 0 }} />
    </View>
  );
}

/* =========================================================
   ICON ROUTER
========================================================= */

function TabIcon({ name, active }: { name: string; active: boolean }) {
  switch (name) {
    case 'Home':       return <HomeIcon active={active} />;
    case 'Mood':       return <MoodIcon active={active} />;
    case 'Counselors': return <CounselorIcon active={active} />;
    case 'Sessions':   return <SessionsIcon active={active} />;
    case 'Resources':  return <ResourcesIcon active={active} />;
    case 'Profile':    return <ProfileIcon active={active} />;
    default:           return <HomeIcon active={active} />;
  }
}

/* =========================================================
   TAB BAR ITEM WRAPPER  — icon + optional active dot
========================================================= */

export function TabBarItem({
  name,
  focused,
}: {
  name: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.itemWrap, focused && styles.itemWrapActive]}>
      <TabIcon name={name} active={focused} />
    </View>
  );
}

/* =========================================================
   TAB SCREEN OPTIONS FACTORY
========================================================= */

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
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#C6AEA1',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '600' as TextStyle['fontWeight'],
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  itemWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemWrapActive: {
    backgroundColor: ACTIVE_BG,
  },
});
