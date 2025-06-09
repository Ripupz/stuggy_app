import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, GestureResponderEvent, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomNavBar from '../lib/utils/navbar';
import supabase from '../lib/utils/supabase';
import { useScore } from '../lib/utils/userCourses';

const dates = [
  { date: '24', day: 'M' },
  { date: '25', day: 'T' },
  { date: '26', day: 'W', selected: true },
  { date: '27', day: 'T' },
  { date: '28', day: 'F' },
  { date: '01', day: 'S' },
  { date: '02', day: 'S' },
];

export default function HomePage() {
  const { userCourses } = useScore();
  const router = useRouter();

  const [username, setUsername] = useState<string | null>(null);
  const [forumPosts, setForumPosts] = useState<{ id: string; author: string; question: string; color: string }[]>([]);
  const [forumLoading, setForumLoading] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('users_data')
        .select('username')
        .eq('email', user.email)
        .single();
      if (!error && data) setUsername(data.username);
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchForumPosts = async () => {
      setForumLoading(true);
      const { data, error } = await supabase
        .from('forum_posts')
        .select('id, author, question, color')
        .order('created_at', { ascending: false })
        .limit(2); // Show the latest 2 posts
      if (!error && data) setForumPosts(data);
      setForumLoading(false);
    };
    fetchForumPosts();
  }, []);

  const allScores = userCourses.flatMap(c => c.scoreData.map(sd => sd.score));
  const averageScore = allScores.length
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2)
    : '--';

  const forum = (event: GestureResponderEvent) => {
    console.log('forum pressed');
    router.push('/forumDisc')
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
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back,</Text>
            <Text style={styles.nameText}>
              {username ? username : '...'} <Text style={styles.emoji}>👋</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <MaterialIcons name="account-circle" size={44} color="#49250D" />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarContainer}>
          {dates.map((item, index) => (
            <View
              key={index}
              style={[styles.dateBox, item.selected && styles.selectedDateBox]}
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
          <View style={styles.todoBox}>
            <Text style={styles.sectionTitle}>Today's list</Text>
            <Text style={styles.listItem}>• Make Agenda</Text>
            <Text style={styles.listItem}>• Study Calculus</Text>
            <Text style={styles.listItem}>• Meeting</Text>
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
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={forum}
        >
          <View style={styles.forumBox}>
            <Text style={styles.sectionTitle}>FORUM</Text>
            {forumLoading ? (
              <Text>Loading...</Text>
            ) : forumPosts.length === 0 ? (
              <Text style={{ color: '#888' }}>No posts yet.</Text>
            ) : (
              forumPosts.map(post => (
                <View key={post.id} style={[styles.messageBox, { backgroundColor: post.color || '#BEE9E8' }]}>
                  <Text style={styles.userName}>{post.author}</Text>
                  <Text>{post.question}</Text>
                </View>
              ))
            )}
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
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: -40,
  },
});
