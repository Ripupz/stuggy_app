import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
  created_at?: string;
};

const PostCard = ({ 
  post, 
  currentUsername, 
  onEdit 
}: { 
  post: Post; 
  currentUsername: string | null;
  onEdit: (post: Post) => void;
}) => {
  const isOwner = currentUsername === post.author;

  return (
    <View style={[styles.postCard, { backgroundColor: post.color }]}>
      <View style={styles.postHeader}>
        <Text style={styles.postAuthor}>{post.author}</Text>
        {isOwner && (
          <TouchableOpacity
            onPress={() => onEdit(post)}
            style={styles.editButton}
          >
            <MaterialIcons name="edit" size={20} color="#49250D" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.postQuestion}>{post.question}</Text>
    </View>
  );
};

export default function ForumPage() {
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Get current user's username
  const getCurrentUsername = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData } = await supabase
      .from('users_data')
      .select('username')
      .eq('email', user.email)
      .single();

    return userData?.username || null;
  };

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setPosts(data as Post[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
    getCurrentUsername().then(setCurrentUsername);
  }, []);

  const addDiscuss = (event: GestureResponderEvent) => {
    setPopUpVisible(true);
    setIsEditing(false);
    setEditingPost(null);
    setCaption('');
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setCaption(post.question);
    setIsEditing(true);
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

    if (isEditing && editingPost) {
      // Update existing post
      const { error } = await supabase
        .from('forum_posts')
        .update({ question: caption })
        .eq('id', editingPost.id);

      if (error) {
        console.log('Supabase update error:', error.message);
        alert('Failed to update post: ' + error.message);
        return;
      }
    } else {
      // Create new post
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
    }

    setCaption('');
    setPopUpVisible(false);
    setIsEditing(false);
    setEditingPost(null);
    await fetchPosts();
  };

  const handleDeletePost = async () => {
    if (!editingPost) return;

    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', editingPost.id);

    if (error) {
      console.log('Supabase delete error:', error.message);
      alert('Failed to delete post: ' + error.message);
      return;
    }

    setCaption('');
    setPopUpVisible(false);
    setIsEditing(false);
    setEditingPost(null);
    await fetchPosts();
  };

  const closeModal = () => {
    setPopUpVisible(false);
    setIsEditing(false);
    setEditingPost(null);
    setCaption('');
  };

  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => { router.push('/homepage'); }}
      >
        <AntDesign name="arrowleft" size={28} color="#7B5A36" />
      </TouchableOpacity>
      
      <Modal 
        animationType='slide' 
        transparent={true} 
        visible={popUpVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.popUpCenteredView}>
          <View style={styles.popUpView}>
            <View style={styles.popUpHeader}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.captionTitle}>
                  {isEditing ? 'Edit Post' : 'New Post'}
                </Text>
                {isEditing && (
                  <TouchableOpacity
                    onPress={handleDeletePost}
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="delete" size={24} color="#B4656F" />
                  </TouchableOpacity>
                )}
              </View>
              {/* Caption Input */}
              <TextInput
                style={styles.captionInput}
                placeholder="write your caption!"
                multiline
                value={caption}
                onChangeText={setCaption}
              />
            </View>
            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.postButton}
                onPress={handlePost}
              >
                <Text style={styles.postButtonText}>
                  {isEditing ? 'UPDATE' : 'POST'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <View style={styles.content}>
        <ScrollView>
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
                <PostCard 
                  key={post.id} 
                  post={post} 
                  currentUsername={currentUsername}
                  onEdit={handleEditPost}
                />
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  postAuthor: {
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
  },
  postQuestion: {
    color: 'black',
  },
  editButton: {
    padding: 4,
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
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  captionTitle: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  deleteButton: {
    padding: 4,
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
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  postButton: {
    backgroundColor: 'black',
    borderRadius: 20,
    paddingVertical: 15,
    flex: 1,
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 15,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'black',
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