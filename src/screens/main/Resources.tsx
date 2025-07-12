import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ResourcesScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    const resources = [
        {
            title: 'Encyclopedia of Plants',
            link: 'https://en.wikipedia.org/wiki/Plant',
            icon: 'book',
            iconColor: '#4CAF50',
        },
        {
            title: 'Plant Biology Online',
            link: 'https://www.botany.org',
            icon: 'language',
            iconColor: '#2196F3',
        },
        {
            title: 'Botanical Research Institute',
            link: 'https://www.br-it.org',
            icon: 'school',
            iconColor: '#9C27B0',
        }
    ];

    const openLink = (url: string) => {
        Linking.openURL(url);
    };

    const filteredResources = resources.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={24} color="#aaa" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#aaa"  // Màu chữ nhạt khi chưa nhập
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredResources}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <MaterialIcons name={item.icon} size={28} color={item.iconColor} />
                        <View style={styles.textContent}>
                            <Text style={styles.title}>{item.title}</Text>
                            <TouchableOpacity onPress={() => openLink(item.link)}>
                                <Text style={styles.link}>{item.link}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noResults}>No results found</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingLeft: 16,
        borderColor: '#ccc',
        borderWidth: 1,
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
    noResults: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
    },
});
