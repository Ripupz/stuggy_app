import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type TimerProps = {
  isRunning: boolean;
};

const Timer: React.FC<TimerProps> = ({ isRunning }) => {
  const [seconds, setSeconds] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  timerText: {
    fontSize: 68,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 65,
  }
});

export default Timer;
