import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthStackParamList } from '../../types/navigation';

export default function SignUp() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
                    role: 'Student', // mặc định
                }),
            });

            const data = await response.json();
            if (response.ok && data.userId) {
                navigation.navigate('SignIn');
            } else {
                setError(data || 'Đăng ký thất bại. Vui lòng thử lại.');
            }
        } catch (e) {
            console.error('Đăng ký lỗi:', e);
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#1B263B', '#2E3B55']}
                style={styles.gradientBackground}
            >
                <View style={styles.contentWrapper}>
                    <View style={styles.logoSection}>
                        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.logo} />
                        <Text style={styles.logoText}>PLANT BIOLOGY EDUCATION</Text>
                    </View>

                    <LinearGradient
                        colors={['#FFD700', '#D4A017']}
                        style={styles.headerGradient}
                    >
                        <Text style={styles.header}>Đăng ký</Text>
                    </LinearGradient>

                    <View style={styles.inputCard}>
                        <Text style={styles.label}>Họ tên</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#666"
                        />

                        <Text style={styles.label}>Tài khoản</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            placeholderTextColor="#666"
                        />

                        <Text style={styles.label}>Mật khẩu</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor="#666"
                        />

                        <Text style={styles.label}>Xác nhận mật khẩu</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholderTextColor="#666"
                        />

                        {error !== '' && <Text style={styles.error}>{error}</Text>}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>Đăng ký</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradientBackground: { flex: 1 },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
        justifyContent: 'center',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        textShadowColor: '#00000040',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    headerGradient: {
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: '#00000040',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    inputCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1B263B',
        marginBottom: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: '#FFD700',
        padding: 12,
        borderRadius: 8,
        marginBottom: 14,
        fontSize: 14,
        color: '#1B263B',
        backgroundColor: '#F5F5F5',
    },
    error: {
        color: '#FF5252',
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 8,
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#1B263B',
        fontWeight: '600',
        fontSize: 16,
    },
    link: {
        fontSize: 14,
        color: '#FFD700',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
