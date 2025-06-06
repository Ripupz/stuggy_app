import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import Timer from './Timer';
import ModeSwitcher from './ModeSwitcher';
import TaskInput from './TaskInput';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { router, useRouter } from 'expo-router';

export default function App() {
    const [isRunning, setIsRunning] = useState(false);
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.timerContainer}>
            <Timer isRunning = {isRunning}  />
            <ModeSwitcher />
        </View>
        <TaskInput />
        <TouchableOpacity style={styles.startButton} onPress={() => setIsRunning(true)}>
            <Text style={styles.startText}>START</Text>
        </TouchableOpacity>
        <View style={styles.navBar}>
            <TouchableOpacity>
                <Icon name="home" size={26} color="#49250D" />
            </TouchableOpacity>
            <TouchableOpacity>
                <Icon name="chatbubble-ellipses-outline" size={26} color="#49250D" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/Timer')}> {/* 👈 Navigate to Pomodoro */}
                <Icon name="timer-outline" size={26} color="#49250D" />
            </TouchableOpacity>
            <TouchableOpacity>
                <Icon name="stats-chart-outline" size={26} color="#49250D" />
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
    }

const styles = StyleSheet.create({
    container: 
    { 
        flex: 1, 
        backgroundColor: '#fefcf5', 
        padding: 20,
        height: "100%"
    },
    title: 
    { 
        fontSize: 18, 
        fontWeight: '600', 
        color: '#888', 
        marginBottom: 10 
    },
    timerContainer: 
    {
        backgroundColor: '#fefcf5',
        padding: 100,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginBottom: 20,
        height: "50%",
        width: "100%"
    },
    startButton: {
        backgroundColor: 'black',
        paddingVertical: 20,
        borderRadius: 40,
        alignItems: 'center',
        padding: 30,
        marginTop: 120,
        width: "70%",
        marginLeft: "15%"
    },
    startText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 2
    },
    navBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 95,
        backgroundColor: '#fdfaf5',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10,
        paddingBottom: 10,
    },
    navItem: { fontSize: 24 }
});
