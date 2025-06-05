import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#fefbf8',
        width: '100%',
        height: '100%',
        marginLeft: -20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3e2d24',
        textAlign: 'center',
        alignContent:'center',
        marginBottom: 16,
        marginLeft: '10%',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: "120%",
        marginLeft: "-5%"
    },
    quadrant: {
        width: '50%',
        height: '100%',
        borderRadius: 12,
        padding: 10,
        marginBottom: 16,
        marginLeft: -30,
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    taskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,

    },
    taskLabel: {
        fontSize: 14,
        marginLeft: 8,
        color: '#333',
        flex: 1, // Add this to make text take available space
        flexWrap: 'wrap', // Add this to enable wrapping
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#444',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    doNow: {
        backgroundColor: '#f4cdd3',
    },
    schedule: {
        backgroundColor: '#cde9eb',
    },
    delegate: {
        backgroundColor: '#f7efbd',
    },
    ignore: {
        backgroundColor: '#a9cfa6',
        borderColor: '#3791e0',
        borderWidth: 2,
    },
    urgent: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333',
    },
    priorityWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    verticalLabelWrapper: {
        transform: [{ rotate: '-90deg' }],
        paddingVertical: 90,
        marginTop: "5%",
        width: "30%",
        fontSize: 14,
        color: '#333',
        paddingHorizontal: "-100%"
    },
});

const SquareCheckbox = ({ checked, onToggle }: { checked: boolean; onToggle: () => void }) => (
    <TouchableOpacity style={styles.checkbox} onPress={onToggle}>
        {checked && <Ionicons name="checkmark-sharp" size={16} color="black" />}
    </TouchableOpacity>
);

const TaskPrioritization = () => {
    const [tasks, setTasks] = useState({
        agenda: false,
        calculus: false,
        french: false,
        toefl: false,
        chinese: false,
        ppt: false,
        pptDesign: false,
        notes: false,
    });

    const toggleTask = (key: keyof typeof tasks) => {
        setTasks(prev => ({ ...prev, [key]: !prev[key] }));
    };

return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Task Prioritization</Text>

        <View style={styles.priorityWrapper}>
            {/* Vertical label */}
            
            <Text style={styles.verticalLabelWrapper}>IMPORTANT</Text>
            

            <View style={{ flex: 1 }}>
                {/* Top label */}
                <View style={{ paddingLeft: 8, paddingRight: 8 }}>
                    <Text style={styles.urgent}>URGENT                        LESS URGENT</Text>
            </View>


            {/* Grid */}
            <View style={styles.grid}>
                {/* Do Now Quadrant */}
                <View style={[styles.quadrant, styles.doNow]}>
                    <Text style={styles.heading}>Do Now</Text>
                    <View style={styles.taskRow}>
                        <SquareCheckbox checked={tasks.agenda} onToggle={() => toggleTask('agenda')} />
                        <Text style={styles.taskLabel}>Make an agenda</Text>
                    </View>
                    <View style={styles.taskRow}>
                        <SquareCheckbox checked={tasks.calculus} onToggle={() => toggleTask('calculus')} />
                        <Text style={styles.taskLabel}>Learn Calculus</Text>
                    </View>
                </View>

                {/* You can replicate and adjust below quadrants as needed */}
                {/* Schedule Quadrant */}
                <View style={[styles.quadrant, styles.schedule]}>
                    <Text style={styles.heading}>Schedule</Text>
                    <View style={styles.taskRow}>
                        <SquareCheckbox checked={tasks.french} onToggle={() => toggleTask('french')} />
                        <Text style={styles.taskLabel}>Practice French</Text>
                    </View>
                    <View style={styles.taskRow}>
                        <SquareCheckbox checked={tasks.toefl} onToggle={() => toggleTask('toefl')} />
                        <Text style={styles.taskLabel}>TOEFL prep</Text>
                    </View>
                </View>

                {/* Delegate Quadrant */}
                <View style={[styles.quadrant, styles.delegate]}>
                    <Text style={styles.heading}>Delegate</Text>
                    <View style={styles.taskRow}>
                        <SquareCheckbox checked={tasks.pptDesign} onToggle={() => toggleTask('pptDesign')} />
                        <Text style={styles.taskLabel}>Delegate PPT Design</Text>
                    </View>
                </View>

                {/* Ignore Quadrant */}
                <View style={[styles.quadrant, styles.ignore]}>
                    <Text style={styles.heading}>Ignore</Text>
                    <View style={styles.taskRow}>
                        <SquareCheckbox checked={tasks.notes} onToggle={() => toggleTask('notes')} />
                        <Text style={styles.taskLabel}>Reformat old 
                            notes</Text>
                    </View>
                </View>
            </View>
        </View>
    </View>
    </ScrollView>
  );
};

export default TaskPrioritization;
