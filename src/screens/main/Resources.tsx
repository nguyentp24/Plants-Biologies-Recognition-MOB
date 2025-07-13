import React, { useState, useEffect } from 'react';
import { FlatList, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

export default function ResourcesScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Hàm gọi API để tìm kiếm sách
    const fetchBookSuggestions = async (query) => {
        try {
            const response = await axios.get('https://biggleseducationapp.onrender.com/api/Book/search', {
                params: {
                    title: query
                }
            });

            // Giả sử API trả về danh sách sách dưới dạng `title`, bạn có thể điều chỉnh theo cấu trúc dữ liệu
            const bookTitles = response.data.map(item => item.title);
            setSuggestions(bookTitles);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    // Hàm xử lý thay đổi tìm kiếm
    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (query.length > 2) { // Chỉ gọi API khi người dùng nhập hơn 2 ký tự
            fetchBookSuggestions(query);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                />
            </View>

            {/* Hiển thị gợi ý tìm kiếm */}
            <FlatList
                data={suggestions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => alert(`Selected book: ${item}`)}>
                        <Text style={styles.suggestion}>{item}</Text>
                    </TouchableOpacity>
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
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingLeft: 16,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    suggestion: {
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    noResults: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
    },
});
