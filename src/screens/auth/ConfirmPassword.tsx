import React, { useRef, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackParamList } from '../../types/navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function ConfirmPassword() {

    const route = useRoute() as any;
    const email = route.params?.email || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const inputs = Array(6).fill(null).map(() => useRef(null));

    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

    const handleCodeChange = (value, idx) => {
        if (!/^[0-9]*$/.test(value)) return;
        const newCode = [...code];
        newCode[idx] = value;
        setCode(newCode);

        if (value && idx < 5) inputs[idx + 1].current?.focus();
        if (!value && idx > 0) inputs[idx - 1].current?.focus();
    };

    const handleConfirm = async () => {
        if (code.some(c => !c) || !newPassword) {
            setError('Please enter verification code and new password.');
            setMessage('');
            return;
        }
        setError('');
        setMessage('');
        try {
            const response = await fetch(
                'https://bilogieseducationapp.onrender.com/api/Authentication/forgot-password/confirm',
                {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        verificationCode: code.join(''),
                        newPassword: newPassword,
                    }),
                }
            );
            const resText = await response.text();
            if (response.ok) {
                setMessage('Password reset successful!');
                setError('');
            } else {
                setError(resText || 'Invalid code or password. Please try again.');
                setMessage('');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            setMessage('');
        }
    };

    const handleCancel = () => navigation.goBack();
    const handleGoSignIn = () => navigation.navigate('SignIn');

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.card}>
                <Text style={styles.title}>Forgot Password</Text>
                <View style={styles.codeRow}>
                    {code.map((val, idx) => (
                        <TextInput
                            key={idx}
                            ref={inputs[idx]}
                            style={[
                                styles.codeInput,
                                idx === code.findIndex(c => c === '') && styles.focused
                            ]}
                            value={val}
                            onChangeText={v => handleCodeChange(v.slice(-1), idx)}
                            maxLength={1}
                            keyboardType="numeric"
                            returnKeyType="next"
                            onFocus={() => setError('')}
                        />
                    ))}
                </View>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="New Password *"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                {error !== '' && <Text style={styles.error}>{error}</Text>}
                {message !== '' && <Text style={styles.success}>{message}</Text>}
                <View style={styles.row}>
                    <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
                        <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleGoSignIn} style={styles.goBackBtn}>
                    <Text style={styles.goBackText}>Go Back to Sign In</Text>
                </TouchableOpacity>
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
        marginBottom: 18,
        color: '#1a1a1a',
    },
    codeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    codeInput: {
        width: 44,
        height: 44,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: '#f6f6fa',
        fontSize: 22,
        textAlign: 'center',
    },
    focused: {
        borderColor: '#247bff',
    },
    passwordInput: {
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
        marginTop: 8,
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
    confirmBtn: {
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
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    goBackBtn: {
        marginTop: 18,
        alignSelf: 'center',
        backgroundColor: '#1a1a1a',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    goBackText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
