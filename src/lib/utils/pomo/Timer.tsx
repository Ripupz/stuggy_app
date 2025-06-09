import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TimerProps = {
  isRunning: boolean;
  mode: 'Pomodoro' | 'Short break' | 'Long break';
  onModeChange: (newMode: 'Pomodoro' | 'Short break' | 'Long break') => void;
};

const getInitialSeconds = (mode: TimerProps['mode']) => {
  switch (mode) {
    case 'Pomodoro':
      return 25 * 60;
    case 'Short break':
      return 5 * 60;
    case 'Long break':
      return 15 * 60;
    default:
      return 25 * 60;
  }
};

const Timer: React.FC<TimerProps> = ({ isRunning, mode, onModeChange }) => {
  const [seconds, setSeconds] = useState(getInitialSeconds(mode));
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Reset timer when mode changes
  useEffect(() => {
    setSeconds(getInitialSeconds(mode));
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleModeSwitch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleModeSwitch = () => {
    if (mode === 'Pomodoro') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      if (newCount % 4 === 0) {
        onModeChange('Long break');
      } else {
        onModeChange('Short break');
      }
    } else if (mode === 'Short break' || mode === 'Long break') {
      onModeChange('Pomodoro');
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.timer}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 65,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 65,
  },
  timer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default Timer;
