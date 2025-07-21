import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    Easing,
} from 'react-native-reanimated';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Định nghĩa kiểu TypeScript cho AuthContext
interface AuthContextType {
    setLoggedIn: (value: boolean) => void;
}

export default function ForgetPassword() {
    const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
    const { setLoggedIn } = useAuth() as AuthContextType;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Animation state
    const scaleValues = {
        signIn: useSharedValue(1),
        google: useSharedValue(1),
        signUp: useSharedValue(1),
        forgotPassword: useSharedValue(1),
    };
    const opacity = useSharedValue(0);

    // Hiệu ứng fade-in khi tải
    useEffect(() => {
        opacity.value = withTiming(1, {
            duration: 800,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, []);

    // Xử lý hiệu ứng nhấn
    const handlePressIn = (key: keyof typeof scaleValues) => {
        scaleValues[key].value = withSpring(0.92, { damping: 12, stiffness: 200 });
    };

    const handlePressOut = (key: keyof typeof scaleValues) => {
        scaleValues[key].value = withSpring(1, { damping: 12, stiffness: 200 });
    };

    // Animated style
    const animatedStyles = {
        container: useAnimatedStyle(() => ({
            opacity: opacity.value,
        })),
        signIn: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.signIn.value }],
        })),
        google: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.google.value }],
        })),
        signUp: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.signUp.value }],
        })),
        forgotPassword: useAnimatedStyle(() => ({
            transform: [{ scale: scaleValues.forgotPassword.value }],
        })),
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            setError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        try {
            const response = await fetch('https://plants-biologies.onrender.com/api/Authentication/login', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.token) {
                await AsyncStorage.setItem('userToken', data.token);
                setLoggedIn(true);
            } else {
                setError('Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } catch (e) {
            console.error('Đăng nhập lỗi:', e);
            setError('Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#1B263B', '#2E3B55']}
                style={styles.gradientBackground}
            >
                <Animated.View style={[styles.contentWrapper, animatedStyles.container]}>
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/150' }}
                            style={styles.logo}
                        />
                        <Text style={styles.logoText}>PLANT BIOLOGY EDUCATION</Text>
                    </View>

                    {/* Header */}
                    <LinearGradient
                        colors={['#ff4000ff', '#D4A017']}
                        style={styles.headerGradient}
                    >
                        <Text style={styles.header}>Đăng nhập</Text>
                    </LinearGradient>

                    {/* Input Card */}

                    <View style={styles.inputCard}>
                        <Text style={styles.label}>Tài khoản</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Username"
                            value={email}
                            onChangeText={setEmail}
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
                        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
                            <Text style={styles.rememberMeText}>
                                {rememberMe ? '☑ Ghi nhớ tôi' : '⬜ Ghi nhớ tôi'}
                            </Text>
                        </TouchableOpacity>
                        {error !== '' && <Text style={styles.error}>{error}</Text>}
                    </View>

                    {/* Sign In Button */}
                    <Animated.View style={[styles.button, animatedStyles.signIn]}>
                        <TouchableOpacity
                            onPressIn={() => handlePressIn('signIn')}
                            onPressOut={() => handlePressOut('signIn')}
                            onPress={handleSignIn}
                        >
                            <Text style={styles.buttonText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Forgot Password */}
                    <Animated.View style={[styles.linkContainer, animatedStyles.forgotPassword]}>
                        <TouchableOpacity
                            onPressIn={() => handlePressIn('forgotPassword')}
                            onPressOut={() => handlePressOut('forgotPassword')}
                            onPress={() => console.log('Forgot password pressed')}
                        >
                            <Text style={styles.linkText}>Quên mật khẩu?</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Google Sign In
                
                        <Animated.View style={[styles.googleButton, animatedStyles.google]}>
                            <TouchableOpacity
                                onPressIn={() => handlePressIn('google')}
                                onPressOut={() => handlePressOut('google')}
                                onPress={() => console.log('Google sign in pressed')}
                            >
                                <MaterialIcons name="email" size={wp('6%')} color="#FFD700" style={styles.icon} />
                                <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
                            </TouchableOpacity>
                        </Animated.View> */}

                    {/* Sign Up Link */}
                    <Animated.View style={[styles.linkContainer, animatedStyles.signUp]}>
                        <TouchableOpacity
                            onPressIn={() => handlePressIn('signUp')}
                            onPressOut={() => handlePressOut('signUp')}
                            onPress={() => navigation.navigate('SignUp')}
                        >
                            <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký</Text>
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
        padding: wp('0.5%'),
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
        width: "100%",
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
    rememberMeText: {
        fontSize: wp('3.5%'),
        color: '#1B263B',
        marginLeft: wp('2%'),
        marginBottom: hp('1.5%'),
    },
    error: {
        color: '#FF5252',
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
    // googleButton: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     backgroundColor: '#FFFFFF',
    //     padding: wp('3.5%'),
    //     borderRadius: wp('4%'),
    //     marginBottom: hp('2%'),
    // },
    // googleButtonText: {
    //     color: '#1B263B',
    //     fontWeight: '600',
    //     fontSize: wp('4.5%'),
    //     flex: 1,
    //     textAlign: 'center',
    // },
    icon: {
        marginLeft: wp('2%'),
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