import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ForgetPassword() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSendVerification = async () => {
        if (!email) {
            setError('Please enter your email.');
            setMessage('');
            return;
        }
        setError('');
        setMessage('');

        try {
            const response = await fetch('https://bilogieseducationapp.onrender.com/api/Authentication/forgot-password/request', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                }),
            });

            const resText = await response.text();
            if (response.ok) {
                setMessage(resText || 'Verification code sent to your email.');
                // CHUYỂN MÀN HÌNH ConfirmPassword và truyền email
                setTimeout(() => {
                    (navigation as any).navigate('ConfirmPassword', { email: email.trim() });
                }, 1000); // Chờ 1 giây cho user thấy thông báo
            } else {
                setError(resText || 'An error occurred. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.card}>
                <Text style={styles.title}>Forgot Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email *"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {error !== '' && <Text style={styles.error}>{error}</Text>}
                {message !== '' && <Text style={styles.success}>{message}</Text>}

                <View style={styles.row}>
                    <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSendVerification}
                        style={styles.sendBtn}
                    >
                        <Text style={styles.sendText}>Send Verification</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#1a1a1a',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#f6f6fa',
        marginBottom: 16,
    },
    error: {
        color: '#d32f2f',
        fontSize: 14,
        marginBottom: 8,
    },
    success: {
        color: '#388e3c',
        fontSize: 14,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10,
    },
    cancelBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 10,
    },
    cancelText: {
        color: '#384454',
        fontSize: 16,
    },
    sendBtn: {
        backgroundColor: '#21242b',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
        shadowColor: '#111',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
