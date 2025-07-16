import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shadow } from 'react-native-shadow-2';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/ProfileStack';
import api from '../../../config/axios';

interface AuthContextType {
  setLoggedIn: (value: boolean) => void;
}

export default function Profile() {
  const { setLoggedIn } = useAuth() as AuthContextType;
  const [infor, setInfor] = React.useState<any>(null);
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const fetchProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('User ID:', userId);
      const response = await api.get(`/Authentication/${userId}`);
      setInfor(response.data);
      console.log(response.data.fullName);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin hồ sơ:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const scaleValues = {
    profile: useSharedValue(1),
    account: useSharedValue(1),
    notification: useSharedValue(1),
    logout: useSharedValue(1),
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

  const confirmLogout = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            setLoggedIn(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const animatedStyles = {
    container: useAnimatedStyle(() => ({
      opacity: opacity.value,
    })),
    profile: useAnimatedStyle(() => ({
      transform: [{ scale: scaleValues.profile.value }],
    })),
    account: useAnimatedStyle(() => ({
      transform: [{ scale: scaleValues.account.value }],
    })),
    notification: useAnimatedStyle(() => ({
      transform: [{ scale: scaleValues.notification.value }],
    })),
    logout: useAnimatedStyle(() => ({
      transform: [{ scale: scaleValues.logout.value }],
    })),
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1B263B', '#2E3B55']}
        style={styles.gradientBackground}
      >
        <Animated.View style={[styles.scrollWrapper, animatedStyles.container]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <LinearGradient
              colors={['#FFD700', '#D4A017']}
              style={styles.headerGradient}
            >
              <Text style={styles.header}>Hồ sơ người dùng</Text>
            </LinearGradient>

            <Shadow distance={10} startColor="#00000020" offset={[0, 4]}>
              <Animated.View style={[styles.profileCard, animatedStyles.profile]}>
                <Pressable
                  onPressIn={() => handlePressIn('profile')}
                  onPressOut={() => handlePressOut('profile')}
                  style={styles.profilePressable}
                >
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                      style={styles.avatar}
                    />
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.name}>{infor?.fullName}</Text>
                    <Text style={styles.subtitle}>{infor?.role}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={28} color="#FFD700" />
                </Pressable>
              </Animated.View>
            </Shadow>

            <Shadow distance={8} startColor="#00000020" offset={[0, 3]}>
              <Animated.View style={[styles.menuItem, animatedStyles.account]}>
                <Pressable
                  onPressIn={() => handlePressIn('account')}
                  onPressOut={() => handlePressOut('account')}
                  onPress={() => navigation.navigate('EditPassword')}
                  style={styles.menuPressable}
                >
                  <MaterialIcons name="person" size={28} color="#FFD700" />
                  <Text style={styles.menuText}>Tài khoản</Text>
                  <MaterialIcons name="chevron-right" size={28} color="#FFD700" />
                </Pressable>
              </Animated.View>
            </Shadow>

            <Shadow distance={8} startColor="#00000020" offset={[0, 3]}>
              <Animated.View style={[styles.menuItem, animatedStyles.notification]}>
                <Pressable
                  onPressIn={() => handlePressIn('notification')}
                  onPressOut={() => handlePressOut('notification')}
                  style={styles.menuPressable}
                >
                  <MaterialCommunityIcons name="bell-ring" size={28} color="#FFD700" />
                  <Text style={styles.menuText}>Thông báo</Text>
                  <MaterialIcons name="chevron-right" size={28} color="#FFD700" />
                </Pressable>
              </Animated.View>
            </Shadow>

            <Shadow distance={8} startColor="#00000020" offset={[0, 3]}>
              <Animated.View style={[styles.menuItem, animatedStyles.logout]}>
                <Pressable
                  onPressIn={() => handlePressIn('logout')}
                  onPressOut={() => handlePressOut('logout')}
                  onPress={confirmLogout}
                  style={styles.menuPressable}
                >
                  <MaterialCommunityIcons name="power" size={28} color="#FF5252" />
                  <Text style={[styles.menuText, { color: '#FF5252' }]}>Đăng xuất</Text>
                  <MaterialIcons name="chevron-right" size={28} color="#FFD700" />
                </Pressable>
              </Animated.View>
            </Shadow>
          </ScrollView>
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
  scrollWrapper: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  headerGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#00000040',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
  },
  profilePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 40,
    padding: 3,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1B263B',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    width: '100%',
  },
  menuPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1B263B',
    marginLeft: 16,
    flex: 1,
  },
});