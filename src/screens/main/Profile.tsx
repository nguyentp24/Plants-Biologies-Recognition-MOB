import React from 'react';
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
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
    const { setLoggedIn } = useAuth();

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
                        setLoggedIn(false); // ✅ Quay về AuthStack
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Cài đặt tài khoản</Text>

                <TouchableOpacity style={styles.profileCard}>
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                        style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.name}>Sabohiddin</Text>
                        <Text style={styles.subtitle}>Digital goodies designer - Pixsellz</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                </TouchableOpacity>

                <View style={styles.menuItem}>
                    <MaterialIcons name="person" size={20} color="#1976D2" />
                    <Text style={styles.menuText}>Tài khoản</Text>
                    <MaterialIcons name="chevron-right" size={20} color="#ccc" style={styles.rightIcon} />
                </View>

                <View style={styles.menuItem}>
                    <MaterialCommunityIcons name="bell-ring" size={20} color="#F44336" />
                    <Text style={styles.menuText}>Thông báo</Text>
                    <MaterialIcons name="chevron-right" size={20} color="#ccc" style={styles.rightIcon} />
                </View>

                <TouchableOpacity style={styles.menuItem} onPress={confirmLogout}>
                    <MaterialCommunityIcons name="power" size={20} color="#D32F2F" />
                    <Text style={[styles.menuText, { color: '#D32F2F' }]}>Đăng xuất</Text>
                    <MaterialIcons name="chevron-right" size={20} color="#ccc" style={styles.rightIcon} />
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContainer: { padding: 16 },
    header: { fontSize: 20, fontWeight: '600', alignSelf: 'center', marginBottom: 16 },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
    userInfo: { flex: 1 },
    name: { fontWeight: 'bold', fontSize: 16 },
    subtitle: { color: '#777', fontSize: 13 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    menuText: { fontSize: 15, marginLeft: 12, flex: 1 },
    rightIcon: { marginLeft: 'auto' },
});
