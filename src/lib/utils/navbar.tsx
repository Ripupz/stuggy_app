import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  active: 'home' | 'chat' | 'timer' | 'stats';
}

const BottomNavBar: React.FC<Props> = ({ active }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/homepage')}>
        <Ionicons name="home" size={26} color={active === 'home' ? '#49250D' : '#888'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/forumDisc')}>
        <Ionicons name="chatbubble-ellipses-outline" size={26} color={active === 'chat' ? '#49250D' : '#888'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/pomodoro')}>
        <Ionicons name="timer-outline" size={26} color={active === 'timer' ? '#49250D' : '#888'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/stats_goal')}>
        <Ionicons name="stats-chart-outline" size={26} color={active === 'stats' ? '#49250D' : '#888'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    backgroundColor: '#fdfaf5',
    borderTopWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
});

export default BottomNavBar;
