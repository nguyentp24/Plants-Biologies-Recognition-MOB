import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
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
    setError(''); // Reset error before the API call

    try {
      const response = await fetch('https://bilogieseducationapp.onrender.com/api/Authentication/login', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email,  // Thay thế "account" thành "identifier"
          password: password,
        }),
      });

      // Kiểm tra mã trạng thái HTTP
      if (!response.ok) {
        throw new Error('Đăng nhập thất bại. Vui lòng thử lại.');
      }

      const data = await response.json();

      // Kiểm tra nếu có token trong dữ liệu trả về
      if (data.token) {
        // Lưu token vào AsyncStorage
        await AsyncStorage.setItem('userToken', data.token);
        // Lưu thông tin user vào AsyncStorage (CHUẨN KEY TỪ API)
        await AsyncStorage.setItem('userId', data.user_Id);
        await AsyncStorage.setItem(
          'userInfo',
          JSON.stringify({
            account: data.account,
            fullName: data.fullName,
            userId: data['user_Id'],
          })
        );
        const testUser = await AsyncStorage.getItem('userInfo');
        console.log('TEST userInfo đã lưu:', testUser);
        setLoggedIn(true);
        setLoading(false);
      } else {
        setError('Login failed. Please try again.');
        setLoading(false);
      }
    } catch (e) {
      console.error('Đăng nhập lỗi:', e);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder logo
          style={styles.logo}
        />
        <Text style={styles.logoText}>PLANT BIOLOGY EDUCATION</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>Sign in</Text>

      {/* Email Input with label */}
      <Text style={styles.label}>Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input with label */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Remember me Checkbox */}
      <View style={styles.rememberMeSection}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <Text style={styles.rememberMeText}>
            {rememberMe ? '☑ Remember me' : '⬜ Remember me'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error message */}
      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {/* Sign in Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity onPress={() => navigation.navigate('ForgetPass')}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>

      {/* Google Sign in */}
      <TouchableOpacity style={styles.googleButton} onPress={() => console.log('Google sign in pressed')}>
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Sign up */}
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
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