import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import * as AuthSession from 'expo-auth-session';

// Google Sign-In
import * as Google from 'expo-auth-session/providers/google';
import { googleAuthConfig } from '../../config/googleAuthConfig';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { setLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Auth
WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri({ useProxy: true } as any);


// ✅ Gắn redirectUri vào request
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '57952782502-q8suimrjpi79lprua52197e934929m04.apps.googleusercontent.com',
  redirectUri, // 👈 RẤT QUAN TRỌNG
});



  // ✅ Google login handler (define BEFORE useEffect!)
  const handleGoogleLogin = useCallback(
    async (idToken: string) => {
      try {
        const res = await fetch('https://bilogieseducationapp.onrender.com/api/Authentication/google', {
          method: 'POST',
          headers: {
            Accept: '*/*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (!res.ok) throw new Error('Google login failed');

        const data = await res.json();
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
          setLoggedIn(true);
        } else {
          Alert.alert('Google login thất bại', 'Không nhận được token');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Lỗi', 'Đăng nhập Google thất bại.');
      }
    },
    [setLoggedIn]
  );

  // ✅ useEffect to trigger Google login
  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = (response.authentication as any).idToken;
      handleGoogleLogin(idToken);
    }
  }, [response, handleGoogleLogin]);

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
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      if (!response.ok) throw new Error('Đăng nhập thất bại.');

      const data = await response.json();

      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        setLoggedIn(true);
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (e) {
      console.error('Đăng nhập lỗi:', e);
      setError('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }}
          style={styles.logo}
        />
        <Text style={styles.logoText}>PLANT BIOLOGY EDUCATION</Text>
      </View>

      <Text style={styles.title}>Sign in</Text>

      <Text style={styles.label}>Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.rememberMeSection}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <Text style={styles.rememberMeText}>
            {rememberMe ? '☑ Remember me' : '⬜ Remember me'}
          </Text>
        </TouchableOpacity>
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => console.log('Forgot password pressed')}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don&apos;t have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 80, height: 80, borderRadius: 10, marginBottom: 10 },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  label: { fontSize: 14, fontWeight: '500', color: '#333', marginBottom: 8, marginLeft: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 10,
  },
  rememberMeSection: { marginBottom: 10, alignItems: 'flex-start' },
  rememberMeText: { fontSize: 14, color: '#444' },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  button: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  forgotPassword: { textAlign: 'center', color: '#1e90ff', fontSize: 14, marginTop: 10 },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  googleButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, textAlign: 'center', color: '#1e90ff', fontSize: 14 },
});
