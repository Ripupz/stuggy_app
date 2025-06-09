import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';

const TaskManager = () => {
  interface Task {
    id: string;
    name: string;
    estPomodoros: number;
    completed: boolean;
  }

  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (taskName: string, est: number) => {
    const newTask = {
      id: Date.now().toString(),
      name: taskName,
      estPomodoros: est,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks</Text>
      <TaskInput onAdd={addTask} />
      <FlatList
        contentContainerStyle={styles.taskListContainer}
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)} // Pass delete function
          />
        )}
      />
    </View>
  );
};

export default TaskManager;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fdfbf6',
    flex: 1,
    marginTop: 12,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#999',
  },
  taskListContainer: {
    marginTop: 12,
    paddingBottom:50,
  },
});
