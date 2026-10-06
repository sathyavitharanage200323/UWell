import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import ImagePlaceholder from '../../components/common/ImagePlaceholder';
import { counselorService } from '../../services/counselorService';

const MessagesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMessages();
    });
    loadMessages();
    return unsubscribe;
  }, [navigation]);

  const loadMessages = async () => {
    const data = await counselorService.getMessages();
    setConversations(data);
  };

  const filteredConversations = conversations.filter((item) =>
    item.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('StudentChat', {
          studentId: item.studentId,
          studentName: item.studentName
        })
      }
      accessibilityLabel={`Open chat with ${item.studentName}`}
    >
      <Card style={styles.chatRowCard}>
        <View style={styles.rowMain}>
          <ImagePlaceholder
            initials={item.avatarInitials || item.studentName.substring(0, 2)}
            size={48}
          />
          <View style={styles.textMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.studentName}>{item.studentName}</Text>
              <Text style={styles.timestampText}>{item.timestamp}</Text>
            </View>
            <View style={styles.msgSnippetRow}>
              <Text
                style={[
                  styles.lastMsgText,
                  item.unread && styles.unreadMsgText
                ]}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
              {item.unread && <View style={styles.unreadDot} />}
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.creamBackground} />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Student Chats</Text>

        <Input
          placeholder="Search student messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No messages found.</Text>
            </Card>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.creamBackground
  },
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.creamBackground
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText,
    marginBottom: spacing.sm
  },
  searchInput: {
    marginBottom: spacing.md,
    backgroundColor: colors.white
  },
  listContent: {
    paddingBottom: spacing.xxl
  },
  chatRowCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderColor: colors.border
  },
  rowMain: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textMeta: {
    flex: 1,
    marginLeft: spacing.sm
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2
  },
  studentName: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  timestampText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary
  },
  msgSnippetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  lastMsgText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.xs
  },
  unreadMsgText: {
    fontWeight: typography.fontWeight.bold,
    color: colors.darkText
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.primary
  },
  emptyCard: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.white
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.md
  }
});

export default MessagesScreen;
