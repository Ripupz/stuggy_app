import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import supabase from '../lib/utils/supabase';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      // Fetch from users_data table using email
      const { data, error } = await supabase
        .from('users_data')
        .select('username, email')
        .eq('email', user.email)
        .single();
      if (!error && data) {
        setProfile({ username: data.username, email: data.email });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  
  

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={28} color="#7B5A36" />
      </TouchableOpacity>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image source={require('../../assets/images/FrogHome.png')} style={styles.avatar} />
        <View>
          {loading ? (
            <ActivityIndicator color="#7B5A36" />
          ) : (
            <>
              <Text style={styles.name}>{profile?.username || '-'}</Text>
              <Text style={styles.email}>{profile?.email || '-'}</Text>
            </>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.actionRow}>
          <MaterialIcons name="person-outline" size={22} color="#7B5A36" />
          <Text style={styles.actionText}>edit profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.actionRow}>
          <Feather name="key" size={20} color="#7B5A36" />
          <Text style={styles.actionText}>Change password</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.actionRow} 
        onPress={async () => {
            await supabase.auth.signOut();
            router.replace('/login'); 
          }}
        >
          <AntDesign name="logout" size={20} color="#C0392B" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF9F2',
    paddingTop: 40,
    paddingHorizontal: 0,
  },
  backBtn: {
    marginLeft: 18,
    marginTop: 10,
    marginBottom: 0,
    alignSelf: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 28,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 18,
    borderWidth: 2,
    borderColor: '#E5D5C3',
    backgroundColor: '#FFF',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#7B5A36',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#7B5A36',
    opacity: 0.7,
    marginBottom: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  actionText: {
    fontSize: 16,
    color: '#7B5A36',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutText: {
    fontSize: 16,
    color: '#C0392B',
    marginLeft: 12,
    fontWeight: 'bold',
  },
});