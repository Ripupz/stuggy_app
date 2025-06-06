import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { 
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';


const forumPosts = [ // ini mock data aja
  {
    id: '1',
    author: 'Jeni',
    question: 'Is there anyone who knows how to solve this question? Pls help.',
    color: '#FFD6D6',
  },
  {
    id: '2',
    author: 'Syau',
    question: 'Any tips on how to stay consistent with your study plan...?',
    color: '#D6FFD6',
  },
  {
    id: '3',
    author: 'Rapi',
    question: 'Is there any source to learn coding?',
    color: '#D6F5FF',
  },
  {
    id: '4',
    author: 'Key',
    question:
      'which programming language that will suit the best for beginners?',
    color: '#EAD6FF',
  },
  {
    id: '5',
    author: 'Vale',
    question:
      'which programming language that will suit the best for beginners?',
    color: '#FFD6D6',
  },
];

const PostCard = ({ post }) => {
  return (
    <View style={[styles.postCard, { backgroundColor: post.color }]}>
      <Text style={styles.postAuthor}>{post.author}</Text>
      <Text style={styles.postQuestion}>{post.question}</Text>
    </View>
  );
};

export default function ForumPage(){
    return(
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <ScrollView>
              {/* ini header */}
              <View style={styles.header}>
                <TouchableOpacity>
                  <Ionicons name='arrow-back' size={24} color='black'/>
                </TouchableOpacity>
              </View>

              {/* ini tabsnya */}
              <View style={styles.tabs}>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                  <Text style={styles.activeTabText}>Discuss</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                  <Text style={styles.tabText}>Session</Text>
                </TouchableOpacity>
              </View>

              {/* ini discussion tab */}
              <View style={styles.discussContainer}>
                <View style={styles.discussHeader}>
                  <Text style={styles.discussTitle}>DISCUSS</Text>
                  <TouchableOpacity>
                    <AntDesign name="pluscircleo" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                {forumPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F1E5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    marginBottom: 20,
    position: 'sticky', // ini biar gak gerak gmn sik aku coba 1-1 g bisa
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  activeTab: {
    backgroundColor: 'black',
  },
  tabText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  discussContainer: {
    borderWidth: 1.5,
    borderColor: '#49250D',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  discussHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  discussTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
  postCard: {
    borderColor: '#49250D', // ini knp g bisa yak kgk muncul bordernya
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  postAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  postQuestion: {
    color: 'black',
  },
})