import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    BiologySearch: undefined;
    BiologyDetail: { biology: Biology };
};

type Biology = {
    id: string;
    commonName: string;
    scientificName: string;
    specieType: string;
    description: string;
    habitat: string;
    imageUrl: string;
    discoveredAt: string;
    averageLifeSpan: string;
    isExtinct: boolean;
    status: string;
};

export default function BiologySearch() {
    const [biologies, setBiologies] = useState<Biology[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pressedId, setPressedId] = useState<string | null>(null);

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const fetchBiologyData = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setError('Token not found. Please login again.');
                setLoading(false);
                return;
            }

            const url = `https://bilogieseducationapp.onrender.com/api/Biologies/search?input=${encodeURIComponent(searchTerm)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            setBiologies(data);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchBiologyData();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    return (
        <ScrollView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search by common name or scientific name..."
                placeholderTextColor="#888"
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Loading data...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : biologies.length === 0 ? (
                <Text style={styles.noResult}>No records found.</Text>
            ) : (
                biologies.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        activeOpacity={0.9}
                        style={[styles.card, pressedId === item.id && styles.cardPressed]}
                        onPressIn={() => setPressedId(item.id)}
                        onPressOut={() => setPressedId(null)}
                        onPress={() => navigation.navigate('BiologyDetail', { biology: item })}
                    >
                        <Text style={styles.title}>{item.commonName}</Text>
                        <Text style={styles.specieText}>
                            <Text style={styles.label}>Loài:</Text> {item.specieType}
                        </Text>
                        <Image source={{ uri: item.imageUrl }} style={styles.image} />
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f7fa',
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        transform: [{ scale: 1 }],
    },
    cardPressed: {
        transform: [{ scale: 0.98 }],
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    label: {
        fontWeight: '600',
        color: '#4CAF50',
    },
    specieText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginTop: 8,
        resizeMode: 'cover',
        backgroundColor: '#e0e0e0',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 16,
        textAlign: 'center',
    },
    noResult: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 30,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
});
