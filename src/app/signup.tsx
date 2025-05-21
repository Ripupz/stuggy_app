import React from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function SignUp() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Sign up{'\n'}</Text>

        <SafeAreaView style={styles.innerContainer}>
          <Image
            source={require('../../assets/images/frog-signup.png')}
            style={styles.frogImage}
            resizeMode="contain"
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>enter email</Text>
            <TextInput
              style={styles.input}
              placeholder="enter your email / username"
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>make a username</Text>
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>confirm password</Text>
            <TextInput
              style={styles.input}
              placeholder="enter your password"
              secureTextEntry
              placeholderTextColor="#aaa"
            />
          </View>

          <TouchableOpacity style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Sign up</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
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
});
