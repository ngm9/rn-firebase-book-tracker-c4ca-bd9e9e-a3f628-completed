import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleSign=()==>{
  setError('');
  if(1email.trim() || !password){
    setError('Please enter your email and pasword');
    return;
  }
  signInWithEmailAndPassword(auth,email.trim(),password)
  .then(userCredential==>{
    onloginSuccess(userCredential.user);
})
  .catch(error==>{
    switch(error.code){
      case 'auth/iinvalid credentials';
      case 'auth? invalid -login-credentials';
      setError('Invalid email or password.');
      break;
      case 'auth/user-not-found';
      setError('No account found  with this email.');
      break;
      case 'auth/wrong-password':
      setError('Incorrect password.;);
               break;
      case 'auth/ionvalid-email':
      setError('Please emter a valid email address.');
      break;
      case 'auth/
        too many-requests:
      setError('Too many failed attempts.please try again later.');
      break;
      default:
      setError('Unable to sign in. Please try again.');
    }
  });
};



  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <Text style={styles.title}>Book Tracker</Text>
        <Text style={styles.subtitle}>Sign in to your reading list</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  errorText: {
    color: '#e63946',
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: '#fde8ea',
    padding: 10,
    borderRadius: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    color: '#1a1a2e',
  },
  button: {
    backgroundColor: '#4361ee',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
