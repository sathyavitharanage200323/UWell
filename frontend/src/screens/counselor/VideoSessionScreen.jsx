import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';

const VideoSessionScreen = ({ route, navigation }) => {
  const studentName = route?.params?.studentName || 'Sarah Jenkins';
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleEndCall = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.liveIndicatorRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE SESSION · 14:32</Text>
        </View>
        <Text style={styles.encryptedTag}>🔒 End-to-End Encrypted</Text>
      </View>

      {/* Main Video Display Area */}
      <View style={styles.videoStage}>
        {/* Remote Participant (Student) */}
        <View style={styles.studentVideoContainer}>
          <ImagePlaceholder
            initials={studentName.substring(0, 2)}
            size={110}
            backgroundColor={colors.softCoral}
            textColor={colors.primary}
          />
          <Text style={styles.studentNameText}>{studentName}</Text>
          <Text style={styles.sessionTitleText}>CBT Session · University Wellness</Text>
        </View>

        {/* Local Self View Thumbnail */}
        <View style={styles.selfViewThumbnail}>
          <Text style={styles.selfViewText}>Dr. Martinez (You)</Text>
        </View>
      </View>

      {/* Video Control Bar */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
          onPress={() => setIsMuted(!isMuted)}
          accessibilityLabel="Toggle mute"
        >
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
          <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]}
          onPress={() => setIsVideoOff(!isVideoOff)}
          accessibilityLabel="Toggle camera"
        >
          <Text style={styles.controlIcon}>{isVideoOff ? '🚫' : '📹'}</Text>
          <Text style={styles.controlLabel}>{isVideoOff ? 'Start Video' : 'Camera'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          accessibilityLabel="Screen share"
        >
          <Text style={styles.controlIcon}>🖥️</Text>
          <Text style={styles.controlLabel}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, styles.endCallBtn]}
          onPress={handleEndCall}
          accessibilityLabel="End Session"
        >
          <Text style={styles.controlIcon}>📞</Text>
          <Text style={styles.endCallLabel}>End</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A'
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#262626'
  },
  liveIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    marginRight: 6
  },
  liveText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5
  },
  encryptedTag: {
    color: '#A0A0A0',
    fontSize: typography.fontSize.xs - 1
  },
  videoStage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#141414'
  },
  studentVideoContainer: {
    alignItems: 'center'
  },
  studentNameText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.md
  },
  sessionTitleText: {
    color: '#A0A0A0',
    fontSize: typography.fontSize.sm,
    marginTop: 4
  },
  selfViewThumbnail: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 100,
    height: 130,
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6
  },
  selfViewText: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center'
  },
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#262626',
    borderTopWidth: 1,
    borderTopColor: '#333333'
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#383838'
  },
  controlBtnActive: {
    backgroundColor: '#555555'
  },
  controlIcon: {
    fontSize: 20
  },
  controlLabel: {
    color: '#CCCCCC',
    fontSize: typography.fontSize.xs - 2,
    marginTop: 2
  },
  endCallBtn: {
    backgroundColor: '#C0392B'
  },
  endCallLabel: {
    color: '#FFFFFF',
    fontSize: typography.fontSize.xs - 1,
    fontWeight: typography.fontWeight.bold,
    marginTop: 2
  }
});

export default VideoSessionScreen;
