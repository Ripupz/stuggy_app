import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';



const dates = [
  { date: '24', day: 'M' },
  { date: '25', day: 'T' },
  { date: '26', day: 'W', selected: true },
  { date: '27', day: 'T' },
  { date: '28', day: 'F' },
  { date: '01', day: 'S' },
  { date: '02', day: 'S' },
];

const router = useRouter();


export default function HomePage() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome */}
      <Image
        source={require('../../assets/images/FrogHome.png')}
        style={styles.frogImage}
        resizeMode="contain"
      />
      <Text style={styles.welcomeText}>Welcome Back,</Text>
      <Text style={styles.nameText}>
        Valen <Text style={styles.emoji}>👋</Text>
      </Text>

      {/* Calendar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarContainer}>
        {dates.map((item, index) => (
          <View
            key={index}
            style={[
              styles.dateBox,
              item.selected && styles.selectedDateBox,
            ]}
          >
            <Text style={[styles.dateText, item.selected && styles.selectedText]}>
              {item.date}
            </Text>
            <Text style={[styles.dayText, item.selected && styles.selectedText]}>
              {item.day}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Today's List & Score */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.todoBox}
          onPress={() => router.push('/task')}>
          <Text style={styles.sectionTitle}>Today's list</Text>
          <Text style={styles.listItem}>• Make Agenda</Text>
          <Text style={styles.listItem}>• Study Calculus</Text>
          <Text style={styles.listItem}>• Meeting</Text>
        </TouchableOpacity>

        <View style={styles.scoreBox}>
          <View style={styles.titleScoreBox}>
            <Text style={styles.sectionTitle}>Score</Text>
          </View>
          <Text style={styles.scoreValue}>3.80</Text>
        </View>
      </View>


      {/* Forum */}
      <View style={styles.forumBox}>
        <Text style={styles.sectionTitle}>FORUM</Text>

        <View style={styles.messageBox}>
          <Text style={styles.userName}>Jeni</Text>
          <Text>Is there anyone who wants to join a study session</Text>
        </View>

        <View style={styles.messageBox}>
          <Text style={styles.userName}>Syau</Text>
          <Text>Any tips on how to stay consistent with your study plan...?</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fdfaf5',
    padding: 20,
    paddingBottom: 250,
  },
  frogImage: {
    width: screenWidth,
    height: 200,
    alignSelf: 'center',
    marginTop: -50,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 4,
    color: '#444',
  },
  nameText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#3a1f0f',
  },
  emoji: {
    fontSize: 26,
  },
  calendarContainer: {
    marginTop: 25,
    flexDirection: 'row',
  },
  dateBox: {
    width: 48,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#8F8D82',
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDateBox: {
    backgroundColor: '#E0B2BE',
  },
  dateText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#49250D',
  },
  dayText: {
    fontSize: 14,
    color: '#49250D',
  },
  selectedText: {
    color: '#49250D',
  },
  row: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  todoBox: {
    flex: 1,
    backgroundColor: '#D2D0E0',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#49250D',
    width: 150,
    height: 150,
  },
  listItem: {
    color: '#3a1f0f',
    marginTop: 4,
  },
  scoreBox: {
    backgroundColor: '#DED193',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#49250D',
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
    height: 150, 
  },
  titleScoreBox: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: -40,
  },
  scoreValue: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#3a1f0f',
    marginTop: 10,
    alignItems: 'center',
  },
  forumBox: {
    marginTop: 24,
    backgroundColor: '#ABD2D1',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#49250D',
    height: 250,
    width: '100%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#3a1f0f',
    marginBottom: 10,
    fontSize: 16,
  },
  messageBox: {
    backgroundColor: '#BEE9E8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#49250D',
    borderWidth: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
