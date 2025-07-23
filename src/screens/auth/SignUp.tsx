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
    const [role, setRole] = useState<'Student' | 'Teacher'>('Student');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        if (!name || !email || !password) {
            setError('Please fill in all fields.');
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
                setError(data?.message || 'Something went wrong. Please try again.');
                return;
            }
            if (data.user_Id) {
                Alert.alert('Sign up successful', 'Please sign in to continue.', [
                    { text: 'OK', onPress: () => navigation.navigate('SignIn') }
                ]);
            } else {
                setError('Sign up failed. Please try again.');
            }
        } catch (e) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                {/* Logo */}
                <Text style={styles.logoText}>BiologiesRecognition</Text>
                {/* Title */}
                <Text style={styles.title}>Sign Up</Text>

                {/* Input Fields */}
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#bbb"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#bbb"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#bbb"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {/* Role Selection */}
                <View style={styles.roleRow}>
                    <TouchableOpacity
                        style={[
                            styles.roleBtn,
                            role === 'Student' && styles.selectedRoleBtn
                        ]}
                        onPress={() => setRole('Student')}
                    >
                        <Text style={[
                            styles.roleBtnText,
                            role === 'Student' && styles.selectedRoleBtnText
                        ]}>Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.roleBtn,
                            role === 'Teacher' && styles.selectedRoleBtn
                        ]}
                        onPress={() => setRole('Teacher')}
                    >
                        <Text style={[
                            styles.roleBtnText,
                            role === 'Teacher' && styles.selectedRoleBtnText
                        ]}>Teacher</Text>
                    </TouchableOpacity>
                </View>

                {error !== '' && <Text style={styles.error}>{error}</Text>}

                {/* Sign Up Button */}
                <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
                    <Text style={styles.signupBtnText}>Sign Up</Text>
                </TouchableOpacity>

                {/* or */}
                <Text style={styles.or}>or</Text>

                {/* Google Sign up */}
                <TouchableOpacity style={styles.googleBtn} onPress={() => Alert.alert('Google sign up')}>
                    <Image
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png' }}
                        style={styles.googleIcon}
                    />
                    <Text style={styles.googleBtnText}>Sign up with Google</Text>
                </TouchableOpacity>

                {/* Sign In link */}
                <View style={styles.footerRow}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.footerLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#f8f8fb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '92%',
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 22,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
    },
    logoText: {
        fontSize: 30,
        color: '#179049',
        marginBottom: 2,
        marginTop: 10,
        fontFamily: 'DancingScript-Bold', // Cần import font viết tay, nếu không có dùng fontFamily: 'cursive'
        textAlign: 'center',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#f7f7fa',
        borderRadius: 10,
        paddingHorizontal: 18,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 14,
        borderWidth: 0,
        color: '#222',
    },
    roleRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 18,
        gap: 10,
    },
    roleBtn: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#179049',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
    },
    selectedRoleBtn: {
        backgroundColor: '#179049',
    },
    roleBtnText: {
        color: '#179049',
        fontSize: 16,
        fontWeight: 'bold',
    },
    selectedRoleBtnText: {
        color: '#fff',
    },
    error: {
        color: '#e53935',
        marginBottom: 8,
        textAlign: 'center',
    },
    signupBtn: {
        width: '100%',
        backgroundColor: '#179049',
        borderRadius: 10,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 4,
        shadowColor: '#179049',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 1,
    },
    signupBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    or: {
        marginVertical: 8,
        color: '#888',
        fontSize: 15,
        textAlign: 'center',
    },
    googleBtn: {
        flexDirection: 'row',
        backgroundColor: '#f7f7fa',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 13,
        marginBottom: 18,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 8,
    },
    googleBtnText: {
        color: '#222',
        fontWeight: '600',
        fontSize: 15,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
    },
    footerText: {
        color: '#888',
        fontSize: 15,
    },
    footerLink: {
        color: '#179049',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
