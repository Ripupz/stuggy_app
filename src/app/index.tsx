import { 
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  GestureResponderEvent,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from "react-native";
import { useFonts } from 'expo-font';
import React from 'react';

export default function Index() {

  const [fontsLoaded] = useFonts({
    'TaskFont': require('../../assets/fonts/PermanentMarker-Regular.ttf'),
  });

  const login = (event: GestureResponderEvent) => {
    console.log('Login pressed');
  };
  const signUp = (event: GestureResponderEvent) => {
    console.log('Sign Up pressed');
  };
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <SafeAreaView style={styles.container}>
    <Image
      source={require('../../assets/images/Long_froggy.png')}
      style={styles.frog}
      resizeMode="contain"
    />

    <Text style={styles.spacing}>
      Manage your{'\n'}
    </Text>
    <Text style={styles.title}>
      <Text style={styles.task}>TASK</Text>
      <Text style={styles.title}> daily!</Text>
    </Text>

      <TouchableOpacity
        style={styles.buttonLogin}
        onPress={login}
        accessible={true}
        accessibilityLabel="Login button"
        accessibilityHint="Press to log into your account"
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSignUp}
        onPress={signUp}
        accessible={true}
        accessibilityLabel="Sign Up button"
        accessibilityHint="Press to create a new account"
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  </KeyboardAvoidingView>
);
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fbf6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  frog: {
    width: screenWidth,       // Slightly exceed screen width for overflow effect
    height: 900,         // Match height from your note
    marginTop: -100,
    marginBottom: 20,
    resizeMode: 'cover', // Ensures it fills and crops as needed
    alignSelf: 'center', // Keeps image centered
    position: 'absolute', // Optional: to overlay content
  },
  title: {
    fontSize: 40,
    color: '#9FCDA3',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: -50,
    marginBottom: 40,
  },
  spacing: { //supaya misahin Manage your sama Task daily karna kalo ga gabisa atur spacing
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    color: '#9FCDA3',
    marginTop: 200,
  },
  task: {
    color: '#dd4a48',
    fontWeight: '600',
    fontFamily: 'TaskFont',
    textDecorationLine: 'underline'
  },
  buttonLogin: {
    backgroundColor: '#9cadce',
    paddingVertical: 12,
    paddingHorizontal: 110,
    borderRadius: 25,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    width: screenWidth * 0.8,
    alignItems: 'center',
  },
  buttonSignUp:{
    backgroundColor: '#9cadce',
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    width: screenWidth * 0.8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
});
