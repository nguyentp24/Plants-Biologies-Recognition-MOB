import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';

export default function SignUp() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const response = await fetch('https://bilogieseducationapp.onrender.com/api/Authentication/register', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account: email,
                    email: email,
                    password: password,
                    fullName: name,
                    role: role,
                    isActive: true,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
                return;
            }

            if (data.user_Id) {
                Alert.alert('Đăng ký thành công', 'Hãy đăng nhập để tiếp tục!', [
                    { text: 'OK', onPress: () => navigation.navigate('SignIn') }
                ]);
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
            {/* Logo */}
            <View style={styles.logoSection}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder logo
                    style={styles.logo}
                />
                <Text style={styles.logoText}>PLANT BIOLOGY EDUCATION</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>Sign up</Text>

            {/* Full Name Input */}
            <Text style={styles.label}>Full name</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            {/* Account (Username) Input */}
            <Text style={styles.label}>Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={email}
                onChangeText={setEmail}
            />

            {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Role Selection */}
            <Text style={styles.label}>Role</Text>
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

            {/* Error message */}
            {error !== '' && <Text style={styles.error}>{error}</Text>}

            {/* Sign Up Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            {/* "or" separator */}
            <Text style={styles.orText}>or</Text>

            {/* Sign up with Google */}
            <TouchableOpacity
                style={styles.googleButton}
                onPress={() => console.log('Google sign up pressed')}
            >
                <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>

            {/* Sign in link */}
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.link}>Already have an account? Sign in</Text>
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
    roleText: { fontSize: 14, color: '#333' },
    error: { color: 'red', marginBottom: 10, textAlign: 'center' },
    button: { backgroundColor: '#4CAF50', padding: 14, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    orText: { textAlign: 'center', color: '#777', fontSize: 14, marginVertical: 10 },
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
