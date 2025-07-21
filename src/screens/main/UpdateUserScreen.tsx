import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header row */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={26} color="#222" />
          </TouchableOpacity>
          <Text style={styles.header}>Edit Profile</Text>
          <View style={{ width: 32 }} />
        </View>
        {/* Avatar with camera icon */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraIcon}>
            <MaterialIcons name="photo-camera" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor="#aaa"
          />
        </View>
        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {/* Account (hidden) */}
        <View style={{ display: 'none' }}>
          <TextInput value={account} onChangeText={setAccount} />
        </View>
        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#aaa"
          />
        </View>
        {/* Role */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Role</Text>
          <TextInput
            value={role}
            editable={false}
            style={[styles.input, styles.disabledInput]}
            placeholder="Student, Teacher, Admin"
            placeholderTextColor="#aaa"
          />
        </View>
        {/* Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <TextInput
            value={isActive ? 'Active' : 'Inactive'}
            editable={false}
            style={[styles.input, styles.disabledInput]}
            placeholder="Active or Inactive"
            placeholderTextColor="#aaa"
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#eee',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: (88 - 32) / 2 * -1 + 8,
    backgroundColor: '#8e24aa',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    color: '#888',
    marginBottom: 2,
    marginLeft: 2,
  },
  input: {
    borderBottomWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 0,
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#222',
  },
  inputTag: {
    borderBottomWidth: 2,
    borderColor: '#8e24aa',
    borderRadius: 0,
    paddingVertical: 8,
    paddingHorizontal: 0,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: '#222',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  button: {
    backgroundColor: '#047857',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#6b7280',
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
