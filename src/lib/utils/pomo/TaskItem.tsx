import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Task {
  id: string;
  name: string;
  estPomodoros: number;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onToggle} style={styles.checkboxContainer}>
        <View style={[styles.checkbox, task.completed && styles.checked]}>
          {task.completed && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
      </TouchableOpacity>
      <Text
        style={[
          styles.taskText,
          task.completed && styles.completedText,
        ]}
      >
        {task.name}
      </Text>

      {/* 3-dot menu */}
      <TouchableOpacity
        style={styles.menu}
        onPress={() => setMenuVisible(prev => !prev)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#444" />
      </TouchableOpacity>

      {/* Delete button appears if menu is visible */}
      {menuVisible && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dcdcdc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#444',
    borderColor: '#444',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#111',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  menu: {
    paddingHorizontal: 6,
  },
  deleteButton: {
    position: 'absolute',
    right: 10,
    top: 45,
    backgroundColor: '#ff4444',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    zIndex: 2,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
