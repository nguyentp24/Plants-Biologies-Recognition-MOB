import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../types/navigation';

export default function Home() {
    const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <MaterialIcons name="eco" size={24} color="#333" />
                        <Text style={styles.logoText}>Plant & Bio Recognition</Text>
                    </View>
                    <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Profile')}>
                        <Text style={styles.menuText}>Go to Profile</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Welcome to Plant & Bio Recognition!</Text>
                <Text style={styles.subtitle}>
                    Discover and learn about various plants and biology samples with ease. Our system offers a comprehensive suite of tools to enhance your knowledge and recognition skills.
                </Text>

                <Text style={styles.sectionHeader}>Featured Content</Text>
                <View style={styles.card}>
                    <Image
                        source={{
                            uri: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Codiaeum_variegatum_%28variegated_croton%29.jpg',
                        }}
                        style={styles.cardImage}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Rare Plant Species Discovery</Text>
                        <Text style={styles.cardSubtitle}>
                            Learn about the newly discovered plant species with unique characteristics and ecological significance.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    logoSection: { flexDirection: 'row', alignItems: 'center' },
    logoText: { marginLeft: 8, fontSize: 16, fontWeight: 'bold' },
    menuButton: { backgroundColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
    menuText: { fontSize: 14, fontWeight: '600' },
    title: { fontSize: 22, fontWeight: 'bold', marginHorizontal: 16, marginTop: 8 },
    subtitle: { fontSize: 14, color: '#444', marginHorizontal: 16, marginTop: 8 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginTop: 24, marginBottom: 8 },
    card: { marginHorizontal: 16, backgroundColor: '#eee', borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
    cardImage: { width: '100%', height: 160 },
    cardContent: { padding: 12 },
    cardTitle: { fontSize: 16, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 13, color: '#444', marginTop: 4 },
});
