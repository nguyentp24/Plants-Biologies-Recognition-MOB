import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AuthStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export default function ForgotPassword() {
    const navigation = useNavigation<NavigationProp>();
    const [form, setForm] = useState({ account: '', newPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const scaleValues = {
        button: useSharedValue(1),
        back: useSharedValue(1),
    };
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, {
            duration: 800,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, []);

    const handlePressIn = (key: keyof typeof scaleValues) => {
        scaleValues[key].value = withSpring(0.92, { damping: 12, stiffness: 200 });
    };

    const handlePressOut = (key: keyof typeof scaleValues) => {
        scaleValues[key].value = withSpring(1, { damping: 12, stiffness: 200 });
    };

    const animatedStyles = {
        container: useAnimatedStyle(() => ({ opacity: opacity.value })),
        button: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.button.value }],
        })),
        back: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.back.value }],
        })),
    };

    const validateInputs = () => {
        if (!form.account || !form.newPassword) {
            setError('Vui lòng nhập đầy đủ email và mật khẩu mới');
            return false;
        }
        return true;
    };

    const handleResetPassword = async () => {
        setError('');
        setSuccess('');
        if (!validateInputs()) return;

        try {
            const response = await fetch('https://plants-biologies.onrender.com/api/Authentication/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: '*/*',
                },
                body: JSON.stringify({
                    Account: form.account,
                    NewPassword: form.newPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Đặt lại mật khẩu thất bại');
            }

            setSuccess('Mật khẩu đã được đặt lại thành công');
            setForm({ account: '', newPassword: '' });
        } catch (e: any) {
            setError(e.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={['#1B263B', '#2E3B55']} style={styles.gradientBackground}>
                <Animated.View style={[styles.contentWrapper, animatedStyles.container]}>
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/150' }}
                            style={styles.logo}
                        />
                        <Text style={styles.logoText}>PLANT BIOLOGY EDUCATION</Text>
                    </View>

                    <LinearGradient colors={['#FFD700', '#D4A017']} style={styles.headerGradient}>
                        <Text style={styles.header}>Đặt lại mật khẩu</Text>
                    </LinearGradient>

                    <View style={styles.inputCard}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập email của bạn"
                            value={form.account}
                            onChangeText={(text) => setForm({ ...form, account: text })}
                            placeholderTextColor="#666"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Text style={styles.label}>Mật khẩu mới</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mật khẩu mới"
                            value={form.newPassword}
                            onChangeText={(text) => setForm({ ...form, newPassword: text })}
                            secureTextEntry
                            placeholderTextColor="#666"
                        />
                        {error !== '' && <Text style={styles.error}>{error}</Text>}
                        {success !== '' && <Text style={styles.success}>{success}</Text>}
                    </View>

                    <Animated.View style={[styles.button, animatedStyles.button]}>
                        <TouchableOpacity
                            onPressIn={() => handlePressIn('button')}
                            onPressOut={() => handlePressOut('button')}
                            onPress={handleResetPassword}
                        >
                            <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View style={[styles.linkContainer, animatedStyles.back]}>
                        <TouchableOpacity
                            onPressIn={() => handlePressIn('back')}
                            onPressOut={() => handlePressOut('back')}
                            onPress={() => navigation.navigate('SignIn')}
                        >
                            <Text style={styles.linkText}>Nhớ mật khẩu? Quay lại đăng nhập</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradientBackground: {
        flex: 1,
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('2%'),
        justifyContent: 'center',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: hp('4%'),
    },
    logo: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: wp('4%'),
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    logoText: {
        fontSize: wp('5%'),
        fontWeight: '700',
        color: '#fff',
        marginTop: hp('1%'),
        textShadowColor: '#00000040',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    headerGradient: {
        borderRadius: wp('4%'),
        paddingVertical: hp('2%'),
        paddingHorizontal: wp('6%'),
        marginBottom: hp('3%'),
    },
    header: {
        fontSize: wp('7%'),
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: '#00000040',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    inputCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp('4%'),
        padding: wp('4%'),
        marginBottom: hp('3%'),
    },
    label: {
        fontSize: wp('4%'),
        fontWeight: '500',
        color: '#1B263B',
        marginBottom: hp('1%'),
        marginLeft: wp('2%'),
    },
    input: {
        borderWidth: 1,
        borderColor: '#FFD700',
        padding: wp('3%'),
        borderRadius: wp('2%'),
        marginBottom: hp('2%'),
        marginHorizontal: wp('2%'),
        fontSize: wp('4%'),
        color: '#1B263B',
        backgroundColor: '#F5F5F5',
    },
    error: {
        color: '#FF5252',
        fontSize: wp('3.5%'),
        textAlign: 'center',
        marginBottom: hp('1.5%'),
    },
    success: {
        color: '#4CAF50',
        fontSize: wp('3.5%'),
        textAlign: 'center',
        marginBottom: hp('1.5%'),
    },
    button: {
        backgroundColor: '#FFD700',
        padding: wp('3.5%'),
        borderRadius: wp('4%'),
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    buttonText: {
        color: '#1B263B',
        fontWeight: '600',
        fontSize: wp('4.5%'),
    },
    linkContainer: {
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    linkText: {
        fontSize: wp('4%'),
        color: '#FFD700',
        textDecorationLine: 'underline',
    },
});
