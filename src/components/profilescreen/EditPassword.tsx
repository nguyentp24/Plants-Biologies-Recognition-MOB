import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdateUserScreen() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [fullName, setFullName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Không tìm thấy token hoặc userId');
        return;
      }

      const body = {
        account,
        password,
        role,
        fullName,
        isActive,
      };

      const response = await fetch(
        `https://plants-biologies.onrender.com/api/User/${userId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data || 'Cập nhật thất bại.');
      }

      Alert.alert('Cập nhật thành công!');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Đã xảy ra lỗi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Cập nhật thông tin người dùng</Text>

        {/* Account */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tài khoản</Text>
          <TextInput
            value={account}
            onChangeText={setAccount}
            style={styles.input}
            placeholder="Nhập tài khoản"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Họ tên</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Tên đầy đủ"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Role */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Vai trò</Text>
          <TextInput
            value={role}
            editable={false}
            style={[styles.input, styles.disabledInput]}
            placeholder="Student, Teacher, Admin"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Status */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Trạng thái</Text>
          <TextInput
            value={isActive ? 'Hoạt động' : 'Không hoạt động'}
            editable={false}
            style={[styles.input, styles.disabledInput]}
            placeholder="Hoạt động hoặc Không hoạt động"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6', // Light gray background
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, // For Android shadow
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937', // Dark gray for header
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151', // Dark gray for labels
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db', // Light gray border
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937', // Dark text for input
  },
  disabledInput: {
    backgroundColor: '#e5e7eb', // Gray background for disabled inputs
    color: '#6b7280', // Lighter text for disabled inputs
  },
  button: {
    backgroundColor: '#047857', // Green button
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#6b7280', // Gray when disabled
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});