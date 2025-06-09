import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const modes: Array<'Pomodoro' | 'Short break' | 'Long break'> = [
  'Pomodoro',
  'Short break',
  'Long break',
];


type Props = {
  activeMode: 'Pomodoro' | 'Short break' | 'Long break';
  setMode: (mode: 'Pomodoro' | 'Short break' | 'Long break') => void;
};

const ModeSwitcher: React.FC<Props> = ({ activeMode, setMode }) => {
  return (
    <View style={styles.container}>
      {modes.map((mode) => (
        <TouchableOpacity key={mode} onPress={() => setMode(mode)}>
          <Text style={[styles.text, activeMode === mode && styles.active]}>
            {mode}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


export default ModeSwitcher;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  text: {
    fontSize: 16,
    color: '#000',
    marginHorizontal: 8,
    paddingVertical: 8
  },
  active: {
    backgroundColor: '#d1cdc2',
    borderRadius: 20,
    paddingHorizontal: 12
  }
});
