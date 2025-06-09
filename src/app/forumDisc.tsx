import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  GestureResponderEvent,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavBar from '../lib/utils/navbar'; // Adjust the import based on your file structure
import supabase from '../lib/utils/supabase';


type Post = {
  id: string;
  author: string;
  question: string;
  color: string;
};

const PostCard = ({ post }: { post: Post }) => (
  <View style={[styles.postCard, { backgroundColor: post.color }]}>
    <Text style={styles.postAuthor}>{post.author}</Text>
    <Text style={styles.postQuestion}>{post.question}</Text>
  </View>
);

export default function ForumPage() {
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setPosts(data as Post[]);
      // console.log('Fetched posts:', data); // <-- Add this line
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addDiscuss = (event: GestureResponderEvent) => {
    setPopUpVisible(true);
  };

  const handlePost = async () => {
    if (caption.trim() === '') return;

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to post.');
      return;
    }

    // Always fetch username from users_data table using email
    const { data: userData } = await supabase
      .from('users_data')
      .select('username')
      .eq('email', user.email)
      .single();

    const username = userData?.username;

    if (!username) {
      alert('Username not found.');
      return;
    }

    console.log('Posting as username:', username);

    const colorArr = ['#FFD6D6', '#D6FFD6', '#D6F5FF', '#EAD6FF'];
    const color = colorArr[posts.length % 4];

    const { error } = await supabase.from('forum_posts').insert([
      {
        author: username, 
        question: caption,
        color,
      }
    ]);
    if (error) {
      console.log('Supabase insert error:', error.message);
      alert('Failed to post: ' + error.message);
      return;
    }
    setCaption('');
    setPopUpVisible(false);
    await fetchPosts();
  };

  const router = useRouter()
  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => { router.push('/homepage'); }}
      >
        <AntDesign name="arrowleft" size={28} color="#7B5A36" />
      </TouchableOpacity>
      <Modal animationType='slide' transparent={true} visible={popUpVisible}
        onRequestClose={() => setPopUpVisible(!popUpVisible)}
      >
        <View style={styles.popUpCenteredView}>
          <View style={styles.popUpView}>
            <View style={styles.popUpHeader}>
              <Text style={styles.captionTitle}>caption</Text>
              {/* Caption Input */}
              <TextInput
                style={styles.captionInput}
                placeholder="write your caption!"
                multiline
                value={caption}
                onChangeText={setCaption}
              />
            </View>
            {/* Post Button */}
            <TouchableOpacity
              style={styles.postButton}
              onPress={handlePost}
            >
              <Text style={styles.postButtonText}>POST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.content}>
        <ScrollView>
          {/* Tabs */}
          {/* <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={styles.activeTabText}>Discussion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab} onPress={() => router.push('./forumSes')}>
              <Text style={styles.tabText}>Session</Text>
            </TouchableOpacity>
          </View> */}
          {/* Discussion tab */}
            <View style={styles.discussHeader}>
              <Text style={styles.discussTitle}>DISCUSSION</Text>
              <TouchableOpacity onPress={addDiscuss}>
                <AntDesign name="pluscircleo" size={24} color="black" />
              </TouchableOpacity>
            </View>
          <View style={styles.discussContainer}>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </View>
        </ScrollView>
      </View>
      <BottomNavBar active="chat" />
    </SafeAreaView>
  );
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
    borderWidth: 1.5,
    borderColor: '#49250D',
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

  // pop up post discuss
  popUpCenteredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  popUpView: {
    width: '90%',
    height: 'auto',
    backgroundColor: '#F7F1E5',
    borderRadius: 20,
    padding: 25,
  },
  popUpHeader: {
    top: 20,
    marginBottom: 40,
    // display: 'flex',
    // flexDirection: 'column'
  },
  captionTitle: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginBottom: 5,
    color: 'black',
    fontSize: 16,
  },
  captionInput: {
    width: '100%',
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 30,
  },
  postButton: {
    backgroundColor: 'black',
    borderRadius: 20,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backBtn: {
    marginLeft: 18,
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
});