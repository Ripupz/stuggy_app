// components/Navbar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure this package is installed

interface NavbarProps {
  title: string;
  onBackPress?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ title, onBackPress }) => {
  return (
    <View style={styles.navbar}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} /> // Placeholder to keep spacing
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={{ width: 24 }} /> // Placeholder for right-side alignment
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#fefcf4',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
