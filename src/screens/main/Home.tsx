import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../types/navigation';

export default function Home() {
    const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
    const [books, setBooks] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [showPicker, setShowPicker] = useState(false);  // Điều khiển việc hiển thị Picker

    // Fetch the books data from the API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('https://bilogieseducationapp.onrender.com/api/Book/approved', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text(); // Lấy thông tin lỗi để debug
                    setError(`Server error (${response.status}): ${errorText}`);
                    return;
                }

                const data = await response.json();
                setBooks(data);
            } catch (e) {
                setError('Could not load books. Please try again.');
            }
        };

        fetchBooks();
    }, []);

    // Fetch chapters data from API when book is selected
    useEffect(() => {
        const fetchChapters = async () => {
            if (selectedBook) {
                try {
                    const response = await fetch(`https://bilogieseducationapp.onrender.com/api/Chapter/book/${selectedBook.book_id}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        setError(`Server error (${response.status}): ${errorText}`);
                        return;
                    }

                    const data = await response.json();
                    setChapters(data);
                } catch (e) {
                    setError('Could not load chapters. Please try again.');
                }
            }
        };

        fetchChapters();
    }, [selectedBook]);

    // Handle book selection
    const handleBookSelect = (book: any) => {
        setSelectedBook(book);
        setSelectedChapter(null); // Reset selected chapter when book changes
        setShowPicker(false); // Ẩn Picker khi đã chọn sách
    };

    // Toggle Picker visibility
    const togglePicker = () => {
        setShowPicker(!showPicker);
    };

    // Toggle expanded chapter
    const toggleChapter = (chapterId: number) => {
        setSelectedChapter(selectedChapter?.chapter_id === chapterId ? null : { ...selectedChapter, chapter_id: chapterId });
    };

    function showDetails(book_title: any, arg1: string) {
        throw new Error('Function not implemented.');
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* App Title */}
                <Text style={styles.appTitle}>Biology & Plant Sample Learning App</Text>

                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome to Learning Environment</Text>
                    <Text style={styles.subText}>Explore the Biology of Plants and Animals</Text>
                </View>

                {/* Book Categories Section */}
                <Text style={styles.sectionHeader}>Book Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {books.length > 0 ? (
                        books.map((book) => (
                            <View key={book.book_id} style={styles.card}>
                                <TouchableOpacity
                                    style={styles.learnMoreBtn}
                                    onPress={() => showDetails(book.book_title, 'Click to explore more about this book')}
                                >
                                    <Text style={styles.learnMoreText}>Learn more</Text>
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: book.cover_img }}
                                    style={styles.cardImage}
                                />
                                <Text style={styles.cardTitle}>{book.book_title}</Text> {/* Title of the book */}
                                <Text style={styles.cardSubtitle}>Explore various plants and their features.</Text>
                            </View>
                        ))
                    ) : (
                        <Text>{error || 'Loading books...'}</Text>
                    )}
                </ScrollView>

                {/* Select a Book Section */}
                <Text style={styles.sectionHeader}>Select a Book to Continue</Text>
                {/* Add TouchableOpacity for showing Picker */}
                <View style={styles.selectBookContainer}>
                    <Text style={styles.selectBookText}>
                        {selectedBook ? selectedBook.book_title : 'Tap to select a book'}
                    </Text>
                    <TouchableOpacity
                        style={styles.selectBookBtn}
                        onPress={togglePicker}
                    >
                        <Text style={styles.selectBookBtnText}>Select a book</Text>
                    </TouchableOpacity>
                </View>

                {/* Display Picker when showPicker is true */}
                {showPicker && (
                    <Picker
                        selectedValue={selectedBook ? selectedBook.book_id : null}
                        onValueChange={(itemValue) => {
                            const book = books.find((b) => b.book_id === itemValue);
                            handleBookSelect(book);
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a book" value={null} />
                        {books.map((book) => (
                            <Picker.Item key={book.book_id} label={book.book_title} value={book.book_id} />
                        ))}
                    </Picker>
                )}

                {/* Chapters Section */}
                {selectedBook && (
                    <View>
                        <Text style={styles.sectionHeader}>Chapters</Text>
                        {chapters.length > 0 ? (
                            chapters.map((chapter: any) => (
                                <View key={chapter.chapter_id}>
                                    <TouchableOpacity
                                        style={styles.chapterBtn}
                                        onPress={() => toggleChapter(chapter.chapter_id)}
                                    >
                                        <Text style={styles.chapterText}>
                                            {selectedChapter?.chapter_id === chapter.chapter_id ? '▼' : '►'} {chapter.chapter_title}
                                        </Text>
                                    </TouchableOpacity>

                                    {selectedChapter?.chapter_id === chapter.chapter_id && (
                                        <View style={styles.lessonContainer}>
                                            {chapter.lessons.map((lesson: any) => (
                                                <Text key={lesson.lesson_id} style={styles.lesson}>
                                                    {lesson.lesson_title}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <Text>{error || 'Loading chapters...'}</Text>
                        )}
                    </View>
                )}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContainer: { padding: 16 },
    appTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        alignSelf: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1e90ff',
        padding: 10,
        borderRadius: 6,
    },
    header: { marginBottom: 20, alignItems: 'center' },
    welcomeText: { fontSize: 18, fontWeight: '600', color: '#333' },
    subText: { fontSize: 14, color: '#777', marginTop: 6 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#333' },
    categoryScroll: { flexDirection: 'row', marginTop: 16 },
    card: {
        width: 200,
        backgroundColor: '#eee',
        borderRadius: 16,
        marginRight: 16,
        padding: 10,
        alignItems: 'center',
        position: 'relative',
    },
    cardImage: { width: '100%', height: 120, borderRadius: 8 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 8, textAlign: 'center' }, // Center title
    cardSubtitle: { fontSize: 14, color: '#555', marginTop: 4 },
    learnMoreBtn: {
        position: 'absolute',
        top: 6,
        left: 6,
        backgroundColor: '#000',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        zIndex: 1,
    },
    learnMoreText: { color: '#fff', fontSize: 11 },
    selectBookContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
    selectBookText: { fontSize: 16, color: '#333', flex: 1 },
    selectBookBtn: {
        padding: 10,
        backgroundColor: '#1e90ff',
        borderRadius: 8,
        marginLeft: 10,
    },
    selectBookBtnText: { fontSize: 16, color: '#fff' },
    picker: { height: 50, width: '100%', marginTop: 12 },
    chapterBtn: { padding: 10, backgroundColor: '#ddd', borderRadius: 8, marginTop: 8 },
    chapterText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    lessonContainer: { marginLeft: 20, marginTop: 10 },
    lesson: { fontSize: 14, color: '#777' },
});
