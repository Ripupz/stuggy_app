import { useRouter } from 'expo-router';
import React from 'react';
import { useEventStore } from "../lib/utils/eventStore";
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomNavBar from '../lib/utils/navbar';
import { useScore } from '../lib/utils/userCourses';


function generateWeekDates() {
  const today = new Date();
  const dates = [];

  const currentDayIndex = today.getDay(); // Sunday = 0
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((currentDayIndex + 6) % 7)); // shift to Monday

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    dates.push({
      date: date.getDate().toString().padStart(2, '0'),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0), // 'M', 'T', etc
      isToday,
    });
  }

  return dates;
}

const dates = generateWeekDates();

export default function HomePage() {
  const { userCourses } = useScore();
  const router = useRouter();

  const { events, setEvents } = useEventStore();

  const allScores = userCourses.flatMap((c) => c.scoreData.map((sd) => sd.score));
  const averageScore = allScores.length
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2)
    : '--';

  const forum = (event: GestureResponderEvent) => {
    console.log('Forum pressed');
    router.push('/forumDisc');
  };

  return (
    <View style={{ flex: 1 }}>
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
            <TouchableOpacity
              key={index}
              onPress={() => router.push('/calendar')}
              activeOpacity={0.8}
            >
              <View style={[styles.dateBox, item.isToday && styles.todayBox]}>
                <Text style={[styles.dateText, item.isToday && styles.todayText]}>{item.date}</Text>
                <Text style={[styles.dayText, item.isToday && styles.todayText]}>{item.day}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Upcoming List & Score */}
        <View style={styles.roww}>
        <View style={styles.todoBox}>
          <Text style={styles.sectionTitle}>Upcoming list</Text>
          {(() => {
            const today = new Date();
            const sevenDaysLater = new Date();
            sevenDaysLater.setDate(today.getDate() + 7);

            const upcomingEvents: EventData[] = [];

            Object.entries(events).forEach(([dateStr, evts]) => {
              const date = new Date(dateStr);
              if (date >= today && date <= sevenDaysLater) {
                evts.forEach((e) => upcomingEvents.push({ ...e, date: dateStr }));
              }
            });

            const sorted = upcomingEvents.sort((a, b) => {
              const aDate = new Date(`${a.date}T${a.time}`);
              const bDate = new Date(`${b.date}T${b.time}`);
              return aDate.getTime() - bDate.getTime();
            });

            const limited = sorted.slice(0, 5);

            return limited.length > 0 ? (
              limited.map((event, idx) => (
                <Text key={idx} style={styles.listItem}>
                  • {event.time} – {event.title}
                </Text>
              ))
            ) : (
              <Text style={styles.emptyText}>No upcoming events</Text>
            );
          })()}
        </View>

          <TouchableOpacity
            style={styles.scoreBox}
            activeOpacity={0.7}
            onPress={() => router.push('/stats_goal')}
          >
            <View style={styles.titleScoreBox}>
              <Text style={styles.sectionTitle}>Score</Text>
            </View>
            <Text style={styles.scoreValue}>{averageScore}</Text>
          </TouchableOpacity>
        </View>

        {/* Forum */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push('/forumDisc')}>
          <View style={styles.forumBox}>
            <Text style={styles.sectionTitle}>FORUM</Text>
            <View style={styles.messageBox}>
              <Text className={styles.userName}>Jeni</Text>
              <Text>Is there anyone who wants to join a study session</Text>
            </View>
            <View style={styles.messageBox}>
              <Text className={styles.userName}>Syau</Text>
              <Text>Any tips on how to stay consistent with your study plan...?</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar active="home" />
    </View>
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
  todayBox: {
    backgroundColor: '#ddb8c1',
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
  todayText: {
    color: '#49250D',
    fontWeight: 'bold',
  },
  roww: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 16,
  marginTop: 24,
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
    marginBottom: 4.5,
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
});
