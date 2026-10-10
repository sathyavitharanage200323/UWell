import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme';

// Content never grows wider than this, so tablets and the web build stay readable
export const MAX_CONTENT_WIDTH = 760;
export const PAGE_BACKGROUND = '#F9F6F0';

/** Current window size, with the breakpoints every management screen shares. */
export const useLayout = () => {
  const { width } = useWindowDimensions();
  return {
    width,
    isWide: width >= 700,
    isNarrow: width < 360,
    pad: width >= 600 ? 24 : 16,
  };
};

/** Scrolling page body: centred, width-limited, pull-to-refresh optional. */
export const ResponsiveScroll = ({ children, refreshing, onRefresh }) => {
  const { pad } = useLayout();
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        ) : undefined
      }
    >
      <View style={[styles.column, { padding: pad }]}>{children}</View>
    </ScrollView>
  );
};

/** White rounded card with an optional icon + title row. */
export const SectionCard = ({ title, icon, iconTone = 'info', right, children, style }) => {
  const tone = TONES[iconTone] || TONES.info;
  return (
    <View style={[styles.card, style]}>
      {(title || right) && (
        <View style={styles.cardHeader}>
          {icon ? (
            <View style={[styles.iconCircle, { backgroundColor: tone.bg }]}>
              <Feather name={icon} size={16} color={tone.fg} />
            </View>
          ) : null}
          <Text style={styles.cardTitle}>{title}</Text>
          {right}
        </View>
      )}
      {children}
    </View>
  );
};

export const TONES = {
  success: { bg: colors.statusGreenBg, fg: colors.statusGreenText },
  warning: { bg: colors.statusYellowBg, fg: colors.statusYellowText },
  danger: { bg: colors.statusRedBg, fg: colors.statusRedText },
  info: { bg: colors.primaryLight, fg: colors.primaryDark },
  neutral: { bg: '#EFE9E2', fg: colors.textSecondary },
};

/** Small coloured status label. */
export const StatusPill = ({ label, tone = 'neutral' }) => {
  const t = TONES[tone] || TONES.neutral;
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <Text style={[styles.pillText, { color: t.fg }]}>{label}</Text>
    </View>
  );
};

/** Selectable filter chip. */
export const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityState={{ selected: !!active }}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

/** Message strip for success / error / info feedback. */
export const Banner = ({ type = 'info', message }) => {
  if (!message) return null;
  const tone = type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info';
  const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
  const t = TONES[tone];
  return (
    <View style={[styles.banner, { backgroundColor: t.bg }]} accessibilityLiveRegion="polite">
      <Feather name={icon} size={16} color={t.fg} style={styles.bannerIcon} />
      <Text style={[styles.bannerText, { color: t.fg }]}>{message}</Text>
    </View>
  );
};

export const LoadingState = ({ text = 'Loading...' }) => (
  <View style={styles.centerBox}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.centerText}>{text}</Text>
  </View>
);

export const EmptyState = ({ icon = 'inbox', title, text }) => (
  <View style={styles.centerBox}>
    <View style={[styles.emptyCircle]}>
      <Feather name={icon} size={30} color={colors.mutedRose} />
    </View>
    {title ? <Text style={styles.emptyTitle}>{title}</Text> : null}
    {text ? <Text style={styles.centerText}>{text}</Text> : null}
  </View>
);

export const ErrorState = ({ message, onRetry }) => (
  <View style={styles.centerBox}>
    <Feather name="wifi-off" size={30} color={colors.statusRedText} />
    <Text style={[styles.centerText, { color: colors.statusRedText, marginTop: 10 }]}>{message}</Text>
    {onRetry ? (
      <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
        <Feather name="refresh-cw" size={14} color={colors.white} style={{ marginRight: 6 }} />
        <Text style={styles.retryText}>Try again</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

/** Label on the left, value on the right; both wrap on narrow screens. */
export const InfoRow = ({ label, value, bold }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, bold && { fontWeight: '700' }]}>{value}</Text>
  </View>
);

/** Primary / secondary / danger button used across management screens. */
export const ActionButton = ({ title, onPress, variant = 'primary', icon, loading, disabled, style }) => {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const fg = isPrimary ? colors.white : isDanger ? colors.statusRedText : colors.primaryDark;
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isPrimary && styles.btnPrimary,
        variant === 'secondary' && styles.btnSecondary,
        isDanger && styles.btnDanger,
        (disabled || loading) && { opacity: 0.55 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <>
          {icon ? <Feather name={icon} size={16} color={fg} style={{ marginRight: 8 }} /> : null}
          <Text style={[styles.btnText, { color: fg }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: PAGE_BACKGROUND },
  scrollContent: { alignItems: 'center', paddingBottom: 40 },
  column: { width: '100%', maxWidth: MAX_CONTENT_WIDTH },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#3D2C2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.darkText },
  pill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  pillText: { fontSize: 11, fontWeight: '700' },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.darkText, fontWeight: '500' },
  chipTextActive: { color: colors.white, fontWeight: '700' },
  banner: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 14 },
  bannerIcon: { marginRight: 8 },
  bannerText: { flex: 1, fontSize: 13, fontWeight: '600' },
  centerBox: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 12 },
  centerText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 19 },
  emptyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.darkText, marginTop: 12 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 14,
  },
  retryText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: { fontSize: 13, color: colors.textSecondary, marginRight: 12 },
  infoValue: { fontSize: 13, color: colors.darkText, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
    minHeight: 46,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: colors.primaryLight, borderWidth: 1, borderColor: colors.border },
  btnDanger: { backgroundColor: colors.statusRedBg, borderWidth: 1, borderColor: '#F5B7B1' },
  btnText: { fontSize: 14, fontWeight: '700' },
});
