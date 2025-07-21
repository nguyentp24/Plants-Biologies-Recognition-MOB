import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function SignIn() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { setLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://bilogieseducationapp.onrender.com/api/Authentication/login', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error('Đăng nhập thất bại. Vui lòng thử lại.');
      }
      const data = await response.json();
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userId', data.user_Id);
        await AsyncStorage.setItem(
          'userInfo',
          JSON.stringify({
            account: data.account,
            fullName: data.fullName,
            userId: data['user_Id'],
          })
        );
        setLoggedIn(true);
        setLoading(false);
      } else {
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (e) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Logo text */}
        <Text style={styles.logoText}>BiologiesRecognition</Text>
        {/* Title */}
        <Text style={styles.title}>Welcome!</Text>
        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {/* Remember me */}
        <TouchableOpacity style={styles.rememberMeSection} onPress={() => setRememberMe(!rememberMe)}>
          <Text style={styles.rememberMeText}>{rememberMe ? '☑' : '⬜'} Remember me</Text>
        </TouchableOpacity>
        {/* Error message */}
        {error !== '' && <Text style={styles.error}>{error}</Text>}
        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgetPass')}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
        {/* Social Login */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={[styles.socialButton, { flex: 1, maxWidth: '100%' }]} onPress={() => {}}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png' }} style={styles.socialIcon} />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
        </View>
        {/* Sign up link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'cursive',
    color: '#2e8b57',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#f2f3f7',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 0,
    color: '#222',
  },
  rememberMeSection: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 4,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#888',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: '#2e8b57',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#2e8b57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#2e8b57',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 16,
    alignSelf: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f3f7',
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
    resizeMode: 'contain',
  },
  socialText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    color: '#888',
    fontSize: 14,
  },
  signupLink: {
    color: '#2e8b57',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 2,
  },
});