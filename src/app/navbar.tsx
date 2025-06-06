import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

<Ionicons name="home" size={26} color="#49250D" />


interface Props {
  active: 'home' | 'chat' | 'timer' | 'stats';
  onNavigate?: (page: string) => void;
}

const BottomNavBar: React.FC<Props> = ({ active, onNavigate }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onNavigate?.('homepage')}>
        <Icon name="home" size={26} color={active === 'home' ? '#49250D' : '#888'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate?.('chat')}>
        <Icon name="chatbubble-ellipses-outline" size={26} color={active === 'chat' ? '#49250D' : '#888'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate?.('pomodoro')}>
        <Icon name="timer-outline" size={26} color={active === 'timer' ? '#49250D' : '#888'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate?.('stats')}>
        <Icon name="stats-chart-outline" size={26} color={active === 'stats' ? '#49250D' : '#888'} />
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
