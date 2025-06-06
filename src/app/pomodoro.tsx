import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModeSwitcher from '../lib/utils/ModeSwitcher';
import BottomNavBar from '../lib/utils/navbar';
import Timer from '../lib/utils/Timer';
import TaskInput from './TaskInput';

export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.timerContainer}>
        <Timer isRunning={isRunning} />
        <ModeSwitcher />
      </View>
      <TaskInput />
      <TouchableOpacity style={styles.startButton} onPress={() => setIsRunning(true)}>
        <Text style={styles.startText}>START</Text>
      </TouchableOpacity>
      <BottomNavBar active="timer" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefcf5',
    paddingVertical:20,
    padding: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    marginBottom: 10,
  },
  timerContainer: {
    backgroundColor: '#fefcf5',
    padding: 100,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
    height: '50%',
    width: '100%',
  },
  startButton: {
    backgroundColor: 'black',
    paddingVertical: 20,
    borderRadius: 40,
    alignItems: 'center',
    padding: 30,
    marginTop: 120,
    width: '70%',
    marginLeft: '15%',
  },
  startText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 2,
  },
});