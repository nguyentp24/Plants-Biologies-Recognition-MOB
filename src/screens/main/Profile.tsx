import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function Profile() {
    const { setLoggedIn } = useAuth();
    const navigation = useNavigation<any>();
    const [user, setUser] = useState<{ account: string; fullName: string } | null>(null);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userInfoStr = await AsyncStorage.getItem('userInfo');
                if (userInfoStr) {
                    const userInfo = JSON.parse(userInfoStr);
                    setUser({
                        account: userInfo.account ?? '',
                        fullName: userInfo.fullName ?? '',
                    });
                }
            } catch (error) {
                setUser(null);
            }
        };
        getUserInfo();
    }, []);

    const confirmLogout = () => {
        Alert.alert(
            'Confirm',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Agree',
                    onPress: async () => {
                        await AsyncStorage.removeItem('userToken');
                        await AsyncStorage.removeItem('userInfo');
                        setLoggedIn(false);
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Avatar + Edit */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('UpdateUserScreen')}>
                        <Feather name="edit-2" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
                {/* Name */}
                <Text style={styles.name}>{user && user.fullName ? user.fullName : 'No name!'}</Text>
                {/* Email chip */}
                <View style={styles.emailChip}>
                    <Text style={styles.emailText}>{user && user.account ? user.account : 'No email!'}</Text>
                </View>
                {/* Card menu */}
                <View style={styles.menuCard}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('UpdateUserScreen')}
                    >
                        <Feather name="user" size={20} color="#1976D2" />
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <MaterialIcons name="chevron-right" size={20} color="#ccc" style={styles.rightIcon} />
                    </TouchableOpacity>
                    <View style={styles.menuItem}>
                        <Feather name="bell" size={20} color="#1976D2" />
                        <Text style={styles.menuText}>Notification</Text>
                        <MaterialIcons name="chevron-right" size={20} color="#ccc" style={styles.rightIcon} />
                    </View>
                    <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
                        <MaterialCommunityIcons name="logout" size={20} color="#D32F2F" />
                        <Text style={[styles.menuText, { color: '#D32F2F' }]}>Logout</Text>
                        <MaterialIcons name="chevron-right" size={20} color="#ccc" style={styles.rightIcon} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa' },
    scrollContainer: { alignItems: 'center', padding: 16 },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        marginBottom: 12,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: '#fff',
        backgroundColor: '#eee',
    },
    editIcon: {
        position: 'absolute',
        bottom: 0,
        right: (96 - 32) / 2 * -1 + 8, // center right edge
        backgroundColor: '#1976D2',
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 2,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 8,
        marginBottom: 4,
        color: '#222',
        textAlign: 'center',
    },
    emailChip: {
        backgroundColor: '#e3f0fa',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 6,
        alignSelf: 'center',
        marginBottom: 18,
    },
    emailText: {
        color: '#1976D2',
        fontSize: 14,
        fontWeight: '500',
    },
    menuCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingVertical: 8,
        paddingHorizontal: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        marginTop: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 1,
    },
    menuText: { fontSize: 15, marginLeft: 14, flex: 1, color: '#222' },
    rightIcon: { marginLeft: 'auto' },
});
