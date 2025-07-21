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
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                {/* Logo text */}
                <Text style={styles.logoText}>BiologiesRecognition</Text>
                {/* Title */}
                <Text style={styles.title}>Sign Up</Text>
                {/* Full Name Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#bbb"
                    value={name}
                    onChangeText={setName}
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
                {/* "or" separator */}
                <Text style={styles.orText}>or</Text>
                {/* Sign up with Google */}
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={() => console.log('Google sign up pressed')}
                >
                    <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png' }} style={styles.socialIcon} />
                    <Text style={styles.googleButtonText}>Sign up with Google</Text>
                </TouchableOpacity>
                {/* Sign in link */}
                <View style={styles.signupRow}>
                    <Text style={styles.signupText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.signupLink}>Sign In</Text>
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
    roleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 16,
    },
    roleButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        marginHorizontal: 4,
        backgroundColor: '#f2f3f7',
    },
    selectedRole: {
        backgroundColor: '#2e8b57',
        borderColor: '#2e8b57',
    },
    roleText: {
        fontSize: 14,
        color: '#333',
    },
    selectedRoleText: {
        color: '#fff',
        fontWeight: 'bold',
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
    orText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 14,
        marginVertical: 10,
    },
    googleButton: {
        flexDirection: 'row',
        backgroundColor: '#f2f3f7',
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 8,
        marginBottom: 16,
    },
    socialIcon: {
        width: 22,
        height: 22,
        marginRight: 8,
        resizeMode: 'contain',
    },
    googleButtonText: {
        color: '#222',
        fontWeight: '500',
        fontSize: 15,
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
