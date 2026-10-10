import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme';

/**
 * Confirmation dialog that behaves the same on phones and on the web build
 * (Alert.alert buttons do nothing on web). Optional text box for a reason.
 */
const ConfirmModal = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  inputLabel,
  inputPlaceholder,
  inputValue,
  onChangeInput,
  inputMaxLength = 300,
  onConfirm,
  onCancel,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={loading ? undefined : onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet} accessibilityViewIsModal>
              <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
                <Text style={styles.title}>{title}</Text>
                {message ? <Text style={styles.message}>{message}</Text> : null}

                {onChangeInput ? (
                  <View style={styles.inputBlock}>
                    {inputLabel ? <Text style={styles.inputLabel}>{inputLabel}</Text> : null}
                    <TextInput
                      style={styles.input}
                      value={inputValue}
                      onChangeText={onChangeInput}
                      placeholder={inputPlaceholder}
                      placeholderTextColor={colors.textMuted}
                      multiline
                      maxLength={inputMaxLength}
                    />
                    <Text style={styles.counter}>{(inputValue || '').length}/{inputMaxLength}</Text>
                  </View>
                ) : null}

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btn, styles.cancelBtn]}
                    onPress={onCancel}
                    disabled={loading}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                  >
                    <Text style={styles.cancelText}>{cancelLabel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, destructive ? styles.destructiveBtn : styles.confirmBtn, loading && { opacity: 0.7 }]}
                    onPress={onConfirm}
                    disabled={loading}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Text style={styles.confirmText}>{confirmLabel}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </Modal>
);

const styles = StyleSheet.create({
  fill: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(61,44,46,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.darkText, marginBottom: 6 },
  message: { fontSize: 14, color: colors.textSecondary, lineHeight: 21, marginBottom: 6 },
  inputBlock: { marginTop: 8 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 72,
    textAlignVertical: 'top',
    fontSize: 14,
    color: colors.darkText,
    backgroundColor: '#FBF8F4',
  },
  counter: { fontSize: 11, color: colors.textMuted, textAlign: 'right', marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  btn: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelBtn: { backgroundColor: '#F3EEE8', marginRight: 10 },
  cancelText: { fontSize: 14, fontWeight: '700', color: colors.darkText },
  confirmBtn: { backgroundColor: colors.primary },
  destructiveBtn: { backgroundColor: colors.statusRedText },
  confirmText: { fontSize: 14, fontWeight: '700', color: colors.white },
});

export default ConfirmModal;
