import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function UpdateUserScreen() {
  const [account, setAccount] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [fullName, setFullName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        setAccount(userInfo.account || '');
        setFullName(userInfo.fullName || '');
        setEmail(userInfo.email || '');
      }
    };
    fetchUserInfo();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userInfoStr = await AsyncStorage.getItem('userInfo');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
      const userId = userInfo && userInfo.userId ? userInfo.userId : null;

      if (!token || !userId) {
        Alert.alert('Không tìm thấy token hoặc userId');
        setLoading(false);
        return;
      }

      if (!email) {
        Alert.alert('Lỗi', 'Email là bắt buộc');
        setLoading(false);
        return;
      }

      const body = {
        account,
        email,
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
        let errMsg = 'Update failed.';
        if (data && typeof data === 'object') {
          errMsg = data.message || JSON.stringify(data);
        } else if (typeof data === 'string') {
          errMsg = data;
        }
        throw new Error(errMsg);
      }

      // THÀNH CÔNG
      console.log('Update successful:', data);
      Alert.alert('Success', data.message || 'Update successful!');
    } catch (err) {
      let msg = 'An error occurred.';
      if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === 'object') {
        msg = JSON.stringify(err);
      } else if (typeof err === 'string') {
        msg = err;
      }
      Alert.alert('Lỗi', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Nút back - đặt ngoài card */}
      <View style={styles.backContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="#047857" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.header}>Update user information</Text>

        {/* Account */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Account</Text>
          <TextInput
            value={account}
            onChangeText={setAccount}
            style={styles.input}
            placeholder="Enter account"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholder="Enter Password"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Role */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Role</Text>
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
          <Text style={styles.label}>Status</Text>
          <TextInput
            value={isActive ? 'Active' : 'Inactive'}
            editable={false}
            style={[styles.input, styles.disabledInput]}
            placeholder="Active or Inactive"
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
            {loading ? 'Updating...' : 'Update information'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  backContainer: {
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  disabledInput: {
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#047857',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#6b7280',
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
