import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ResourcesScreen() {
    const openLink = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Plant Biology Resources</Text>

            <View style={styles.item}>
                <MaterialIcons name="book" size={28} color="#4CAF50" />
                <View style={styles.textContent}>
                    <Text style={styles.title}>Encyclopedia of Plants</Text>
                    <TouchableOpacity onPress={() => openLink('https://en.wikipedia.org/wiki/Plant')}>
                        <Text style={styles.link}>https://en.wikipedia.org/wiki/Plant</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.item}>
                <MaterialIcons name="language" size={28} color="#2196F3" />
                <View style={styles.textContent}>
                    <Text style={styles.title}>Plant Biology Online</Text>
                    <TouchableOpacity onPress={() => openLink('https://www.botany.org')}>
                        <Text style={styles.link}>https://www.botany.org</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.item}>
                <MaterialIcons name="school" size={28} color="#9C27B0" />
                <View style={styles.textContent}>
                    <Text style={styles.title}>Botanical Research Institute</Text>
                    <TouchableOpacity onPress={() => openLink('https://www.br-it.org')}>
                        <Text style={styles.link}>https://www.br-it.org</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        elevation: 1,
    },
    textContent: {
        marginLeft: 12,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    link: {
        color: '#2196F3',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
});
