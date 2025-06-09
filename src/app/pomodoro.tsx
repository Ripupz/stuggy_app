import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../lib/utils/navbar';
import ModeSwitcher from '../lib/utils/pomo/ModeSwitcher';
import TaskManager from '../lib/utils/pomo/TaskManager';
import Timer from '../lib/utils/pomo/Timer';

export default function Pomodoro() {
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'Pomodoro' | 'Short break' | 'Long break'>('Pomodoro');
  const router = useRouter();
  const navigation = useNavigation();

  // Prevent leaving the page while timer is running
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (isRunning) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Optionally show a warning
        alert('You cannot leave the Pomodoro page while the timer is running!');
      }
    });
    return unsubscribe;
  }, [navigation, isRunning]);

  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push('/homepage')}
      >
        <AntDesign name="arrowleft" size={28} color="#7B5A36" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.timerContainer}>
          <Timer isRunning={isRunning} mode={mode} onModeChange={setMode} />
          <ModeSwitcher activeMode={mode} setMode={setMode} />
        </View>

        <TaskManager />

        <TouchableOpacity style={styles.startButton} onPress={() => setIsRunning(prev => !prev)}>
          <Text style={styles.startText}>{isRunning ? 'STOP' : 'START'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar active="timer" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefcf5',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingBottom: 100, // extra space so bottom button isn't hidden
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
    width: '100%',
  },
  startButton: {
    backgroundColor: 'black',
    paddingVertical: 20,
    borderRadius: 40,
    alignItems: 'center',
    marginTop: 20,
    width: '70%',
    alignSelf: 'center',
  },
  startText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 2,
  },
  backBtn: {
    marginLeft: 18,
    marginTop: 40,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
});
