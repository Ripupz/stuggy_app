import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TaskInput = () => {
  return (
    <View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addText}>+ Add Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskInput;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  addButton: {
    backgroundColor: '#dcdcdc',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: "90%",
    marginLeft: "5%"
  },
  addText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 18,
    fontWeight: '500'
  }
});
