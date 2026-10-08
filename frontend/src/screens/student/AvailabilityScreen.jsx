import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import NavigationHeader from '../../components/navigation/Header';

const AvailabilityScreen = ({ route, navigation }) => {
  const { counselorId } = route.params || {};
  const [selectedSlot, setSelectedSlot] = useState(null);

  const timeSlots = [
    { id: 1, date: 'Today', time: '9:00 AM', available: true },
    { id: 2, date: 'Today', time: '10:00 AM', available: true },
    { id: 3, date: 'Today', time: '11:00 AM', available: false },
    { id: 4, date: 'Today', time: '2:00 PM', available: true },
    { id: 5, date: 'Today', time: '3:00 PM', available: true },
    { id: 6, date: 'Tomorrow', time: '9:00 AM', available: true },
    { id: 7, date: 'Tomorrow', time: '10:00 AM', available: true },
    { id: 8, date: 'Tomorrow', time: '11:00 AM', available: true }
  ];

  const handleContinue = () => {
    if (selectedSlot) {
      navigation.navigate('AppointmentDetails', { counselorId, slot: selectedSlot });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <NavigationHeader title="Select Time" onBack={() => navigation.goBack()} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Available Time Slots</Text>
        <Text style={styles.subtitle}>Select a convenient time for your session</Text>

        {timeSlots.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            onPress={() => slot.available && setSelectedSlot(slot.id)}
            disabled={!slot.available}
          >
            <Card
              style={[
                styles.slotCard,
                !slot.available && styles.disabledCard,
                selectedSlot === slot.id && styles.selectedCard
              ]}
            >
              <View style={styles.slotHeader}>
                <Text style={styles.slotDate}>{slot.date}</Text>
                {!slot.available && <Text style={styles.bookedText}>Booked</Text>}
              </View>
              <Text style={styles.slotTime}>{slot.time}</Text>
            </Card>
          </TouchableOpacity>
        ))}

        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedSlot}
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight
  },
  content: {
    padding: spacing.lg
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.xl,
    textAlign: 'center'
  },
  slotCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight
  },
  disabledCard: {
    opacity: 0.5
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  slotDate: {
    fontSize: typography.fontSize.md,
    color: colors.textLight
  },
  bookedText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    fontWeight: typography.fontWeight.bold
  },
  slotTime: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text
  },
  button: {
    marginTop: spacing.lg
  }
});

export default AvailabilityScreen;
