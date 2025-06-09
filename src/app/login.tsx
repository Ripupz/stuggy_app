import { useRouter } from 'expo-router';
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
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import supabase from '../lib/utils/supabase'; // <-- adjust path if needed

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setErrorMessage(error.message);
      } else {
        router.replace('/homepage');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
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
          <Text style={styles.heading}>Login{'\n'}</Text>

          <View style={styles.innerContainer}>
            <Image
              source={require('../../assets/images/frog-login.png')}
              style={styles.frogImage}
              resizeMode="contain"
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>email</Text>
              <TextInput
                style={styles.input}
                placeholder="enter your email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
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

            {errorMessage ? (
              <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>
            ) : null}

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
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
  scrollContainer: {
  paddingBottom: 40,
},

});

