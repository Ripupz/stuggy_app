import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image, KeyboardAvoidingView,
  Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {

  const router = useRouter(); // <-- Get the router instance

  const Homepage = () => {
    console.log('homepage pressed');
    router.push('/homepage');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
    <Text style={styles.heading}>
        Login{'\n'}
    </Text>

      <SafeAreaView style={styles.innerContainer}>
        <Image
          source={require('../../assets/images/frog-login.png')} // 👈 replace with your frog image name
          style={styles.frogImage}
          resizeMode="contain"
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>email / username</Text>
          <TextInput
            style={styles.input}
            placeholder="enter your email / username"
            placeholderTextColor="#aaa"
          />
        </View>


        <View style={styles.inputContainer}>
          <Text style={styles.label}>password</Text>
          <TextInput
            style={styles.input}
            placeholder="enter your password"
            secureTextEntry
            placeholderTextColor="#aaa"
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={Homepage}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefcf4',
  },

  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: -90
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9DB394',
    marginBottom: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginTop: 40,
  },

  frogImage: {
    width: 280,
    height: 270,
    marginVertical: 10,
  },
  inputContainer: {
    width: '100%',
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 6,
    textTransform: 'lowercase',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#eeeef3',
    borderRadius: 15,
    padding: 25,
    fontSize: 14,
    color: '#333',
  },
  loginButton: {
    marginTop: 28,
    backgroundColor: '#9DAFCF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
