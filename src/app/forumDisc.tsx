import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React, { useState } from 'react';
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

const dummyForumPosts = [
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
      'anyone got notes for Data Structure lecture?',
    color: '#FFD6D6',
  },
];

type Post = {
  id: string;
  author: string;
  question: string;
  color: string;
};

const PostCard = ({ post }: { post: Post }) => {
  return (
    <View style={[styles.postCard, { backgroundColor: post.color }]}>
      <Text style={styles.postAuthor}>{post.author}</Text>
      <Text style={styles.postQuestion}>{post.question}</Text>
    </View>
  );
};

export default function ForumPage() {
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [posts, setPosts] = useState(dummyForumPosts);
  const [caption, setCaption] = useState('');

  const addDiscuss = (event: GestureResponderEvent) => {
    console.log('add post pressed');
    setPopUpVisible(true)
  };

  const handlePost = () => {
    
    // Prevent posting empty captions // mau pake ini tapi gak bisa idk why
    // if (caption.trim() === '') {
    //   return;
    // }
    console.log('post pressed');

    // Create a new post object
    const newPost = {
      id: Date.now().toString(), // Use timestamp for a unique ID
      author: 'You', // Assuming the current user is posting
      question: caption,
      // Cycle through colors for new posts
      color: ['#FFD6D6', '#D6FFD6', '#D6F5FF', '#EAD6FF'][posts.length % 4],
    };

    // Add the new post to the beginning of the posts array
    setPosts([newPost, ...posts]);
    // Clear the caption input
    setCaption('');
    // Close the modal
    setPopUpVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal animationType='slide' transparent={true} visible={popUpVisible}
        onRequestClose={() => {
          setPopUpVisible(!popUpVisible);
        }}
      >
        <View style={styles.popUpCenteredView}>
          <View style={styles.popUpView}>
            {/* Back button */}
            <TouchableOpacity onPress={() => setPopUpVisible(!popUpVisible)}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
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
             onPress={handlePost} // Closes modal for now
            >
              <Text style={styles.postButtonText}>POST</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>
      <View style={styles.content}>
        <ScrollView>
          {/* ini header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/homepage')}>
              <Ionicons name='arrow-back' size={24} color='black' />
            </TouchableOpacity>
          </View>

          {/* ini tabsnya */}
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={styles.activeTabText}>Discussion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Session</Text>
            </TouchableOpacity>
          </View>

          {/* ini discussion tab */}
          <View style={styles.discussContainer}>
            <View style={styles.discussHeader}>
              <Text style={styles.discussTitle}>DISCUSSION</Text>
              <TouchableOpacity onPress={addDiscuss}>
                <AntDesign name="pluscircleo" size={24} color="black" />
              </TouchableOpacity>
            </View>
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </View>
        </ScrollView>
      </View>
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
});