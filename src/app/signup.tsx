import { useRouter } from 'expo-router'; // <-- Add this
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUpWithEmail } from '../lib/services/auth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); // <-- Add this

  const handleSignUp = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !username || !password || !confirmPassword) {
      return setErrorMessage('All fields are required.');
    }

    if (password !== confirmPassword) {
      return setErrorMessage("Passwords don't match.");
    }

    try {
      const data = await signUpWithEmail(email, password, username);
      console.log('Sign-up success:', data);
      setSuccessMessage('Sign up successful! Please check your email to verify your account.');
      setTimeout(() => {
        router.replace('/login'); // <-- Navigate to login after 1.5s
      }, 1500);
    } catch (error: any) {
      console.error('Signup failed:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={60}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Sign up{'\n'}</Text>

          <View style={styles.innerContainer}>
            <Image
              source={require('../../assets/images/frog-signup.png')}
              style={styles.frogImage}
              resizeMode="contain"
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>enter email</Text>
              <TextInput
                style={styles.input}
                placeholder="enter your email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>make a username</Text>
              <TextInput
                style={styles.input}
                placeholder="make a username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>password</Text>
              <TextInput
                style={styles.input}
                placeholder="enter your password"
                secureTextEntry
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>confirm password</Text>
              <TextInput
                style={styles.input}
                placeholder="enter your password"
                secureTextEntry
                placeholderTextColor="#aaa"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {errorMessage ? (
              <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>
            ) : null}

            {successMessage ? (
              <Text style={{ color: 'green', marginTop: 10 }}>{successMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
              <Text style={styles.signupButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    marginBottom: -20,
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginTop: 40,
  },
  frogImage: {
    width: 250,
    height: 250,
    marginVertical: 10,
    marginBottom: -20
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
    padding: 20,
    fontSize: 14,
    color: '#333',
  },
  signupButton: {
    marginTop: 28,
    backgroundColor: '#9DAFCF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
});