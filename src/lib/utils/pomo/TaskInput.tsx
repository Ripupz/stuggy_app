import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface TaskInputProps {
  onAdd: (name: string, est: number) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [est, setEst] = useState(1);

  const handleAdd = () => {
    if (taskName.trim()) {
      onAdd(taskName, est);
      setTaskName('');
      setEst(1);
      setIsAdding(false);
    }
  };

  if (!isAdding) {
    return (
      <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
        <Text style={styles.addText}>+ Add Tasks</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="What would you like to work on?"
        value={taskName}
        onChangeText={setTaskName}
      />
      <View style={styles.estRow}>
        <Text style={styles.label}>Est Pomodoros</Text>
        <View style={styles.estControls}>
          <TouchableOpacity onPress={() => setEst(Math.max(1, est - 1))}>
            <Text style={styles.button}>▼</Text>
          </TouchableOpacity>
          <Text style={styles.estText}>{est}</Text>
          <TouchableOpacity onPress={() => setEst(est + 1)}>
            <Text style={styles.button}>▲</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => setIsAdding(false)}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAdd}>
          <Text style={styles.save}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskInput;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#dcdcdc',
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  addText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 18,
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#dcdcdc',
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  estRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  estText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    fontSize: 20,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancel: {
    color: '#333',
    fontSize: 16,
  },
  save: {
    color: '#3c6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
