import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';

export default function SignUp() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        try {
            const response = await fetch('https://plants-biologies.onrender.com/api/Authentication/register', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account: email,
                    password,
                    fullName: name,
                    role,
                }),
            });

            const data = await response.json();

            if (response.ok && data.userId) {
                navigation.navigate('SignIn');
            } else {
                setError('Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (e) {
            console.error('Đăng ký lỗi:', e);
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoSection}>
                <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.logo} />
                <Text style={styles.logoText}>PLANT BIOLOGY EDUCATION</Text>
            </View>

            <Text style={styles.title}>Đăng ký</Text>

            <Text style={styles.label}>Họ tên</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Tài khoản</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <Text style={styles.label}>Vai trò</Text>
            <View style={styles.roleSection}>
                <TouchableOpacity
                    style={[styles.roleButton, role === 'Student' && styles.selectedRole]}
                    onPress={() => setRole('Student')}
                >
                    <Text style={styles.roleText}>Student</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.roleButton, role === 'Teacher' && styles.selectedRole]}
                    onPress={() => setRole('Teacher')}
                >
                    <Text style={styles.roleText}>Teacher</Text>
                </TouchableOpacity>
            </View>

            {error !== '' && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Đăng ký</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
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
    roleSection: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
    roleButton: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '40%',
        alignItems: 'center',
    },
    selectedRole: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
    roleText: { fontSize: 14, color: '#fff' },
    error: { color: 'red', marginBottom: 10, textAlign: 'center' },
    button: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    link: { marginTop: 20, textAlign: 'center', color: '#1e90ff', fontSize: 14 },
});
