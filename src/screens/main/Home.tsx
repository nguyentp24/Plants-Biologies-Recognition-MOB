import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    LessonDetail: { lessonId: string };
};

export default function Home() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [books, setBooks] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [viewBookModal, setViewBookModal] = useState(false);
    const [loadingBooks, setLoadingBooks] = useState(false);

    const fetchBooks = async () => {
        setLoadingBooks(true);
        setError(null);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setError('Token not found. Please login again.');
                setLoadingBooks(false);
                return;
            }

            const url = 'https://bilogieseducationapp.onrender.com/api/Book/search';
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
            const approvedBooks = data.filter((book: any) => book.status === 'Approved');
            setBooks(approvedBooks);
        } catch (err) {
            setError('Unable to load data. Please try again later.');
        } finally {
            setLoadingBooks(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (selectedBook) {
            setChapters(selectedBook.chapters || []);
        } else {
            setChapters([]);
        }
    }, [selectedBook]);

    const handleBookSelect = (book: any) => {
        setSelectedBook(book);
        setShowModal(false);
        setViewBookModal(true);
    };

    const handleLessonSelect = (lessonId: string) => {
        navigation.navigate('LessonDetail', { lessonId });
    };
    const toggleChapter = (chapterId: string) => {
        setSelectedChapter(selectedChapter?.chapter_Id === chapterId ? null : { ...selectedChapter, chapter_Id: chapterId });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <LinearGradient colors={["#a8e063", "#56ab2f"]} style={styles.gradientCard}>
                    <View style={[styles.bubble, { top: 10, left: 10, width: 50, height: 50, opacity: 0.18 }]} />
                    <View style={[styles.bubble, { top: 30, right: 30, width: 40, height: 40, opacity: 0.13 }]} />
                    <View style={[styles.bubble, { bottom: 10, left: 60, width: 30, height: 30, opacity: 0.10 }]} />
                    <Text style={styles.visualGreenTitle}>Biologie & Plant Samples <Text style={{ color: '#fff', fontWeight: 'bold' }}>Learning App</Text></Text>
                    <Text style={styles.visualGreenSubtitle}>Explore the biology plants and animals.</Text>
                </LinearGradient>

                <Text style={styles.sectionHeader}>Book Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {loadingBooks ? (
                        <ActivityIndicator size="large" color="#56ab2f" />
                    ) : books.length > 0 ? (
                        books.map((book) => (
                            <View key={book.book_Id} style={styles.card}>
                                <TouchableOpacity
                                    style={styles.learnMoreBtn}
                                    onPress={() => handleBookSelect(book)}
                                >
                                    <Text style={styles.learnMoreText}>View Book</Text>
                                </TouchableOpacity>
                                <Image
                                    source={{ uri: book.cover_img }}
                                    style={styles.cardImage}
                                />
                                <Text style={styles.cardTitle}>{book.book_Title}</Text>
                                <Text style={styles.cardSubtitle}>Explore various plants and their features.</Text>
                            </View>
                        ))
                    ) : (
                        <Text>{error || 'Loading books...'}</Text>
                    )}
                </ScrollView>

                <Modal
                    visible={viewBookModal}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setViewBookModal(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            {selectedBook && (
                                <Image
                                    source={{ uri: selectedBook.cover_img }}
                                    style={styles.fullImage}
                                />
                            )}
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setViewBookModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <Text style={styles.sectionHeader}>Select a Book to Continue</Text>
                <View style={styles.selectBookContainer}>
                    <TouchableOpacity
                        style={styles.selectBookBtn}
                        onPress={() => setShowModal(true)}
                    >
                        <Text style={styles.selectBookBtnText}>Select a book</Text>
                    </TouchableOpacity>
                    <Text style={styles.selectBookText}>
                        {selectedBook ? selectedBook.book_Title : 'No book selected'}
                    </Text>
                </View>

                <Modal
                    visible={showModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Select a Book</Text>
                            {loadingBooks ? (
                                <ActivityIndicator size="large" color="#56ab2f" />
                            ) : books.length > 0 ? (
                                <View style={styles.pickerContainer}>
                                    {books.map((book) => (
                                        <TouchableOpacity
                                            key={book.book_Id}
                                            style={styles.pickerItem}
                                            onPress={() => handleBookSelect(book)}
                                        >
                                            <Text style={styles.pickerItemText}>{book.book_Title}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <Text style={{ color: "red", textAlign: "center", marginVertical: 20 }}>
                                    No books available or data could not be retrieved!
                                </Text>
                            )}
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {selectedBook && (
                    <View>
                        <Text style={styles.sectionHeader}>Chapters</Text>
                        {chapters.length > 0 ? (
                            chapters.map((chapter: any) => (
                                <View key={chapter.chapter_Id}>
                                    <TouchableOpacity
                                        style={styles.chapterBtn}
                                        onPress={() => toggleChapter(chapter.chapter_Id)}
                                    >
                                        <Text style={styles.chapterText}>
                                            {selectedChapter?.chapter_Id === chapter.chapter_Id ? '▼' : '►'} {chapter.chapter_Title}
                                        </Text>
                                    </TouchableOpacity>

                                    {selectedChapter?.chapter_Id === chapter.chapter_Id && (
                                        <View style={styles.lessonContainer}>
                                            {chapter.lessons.map((lesson: any) => (
                                                <TouchableOpacity
                                                    key={lesson.lesson_Id}
                                                    onPress={() => handleLessonSelect(lesson.lesson_Id)}
                                                >
                                                    <Text style={styles.lesson}>{lesson.lesson_Title}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <Text>{error || 'No chapters available for this book.'}</Text>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContainer: { padding: 0, paddingBottom: 16 },
    gradientCard: {
        margin: 16,
        marginBottom: 18,
        borderRadius: 18,
        padding: 22,
        paddingTop: 30,
        paddingBottom: 36,
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    bubble: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 9999,
    },
    visualGreenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 6,
        marginTop: 8,
    },
    visualGreenSubtitle: {
        fontSize: 15,
        color: '#fff',
        opacity: 0.9,
        marginBottom: 2,
    },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#333', marginLeft: 16, marginBottom: 8 },
    categoryScroll: { flexDirection: 'row', marginTop: 0, paddingLeft: 16, paddingBottom: 8 },
    card: { width: 160, backgroundColor: '#eafbe7', borderRadius: 16, marginRight: 16, padding: 10, alignItems: 'center', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    cardImage: { width: '100%', height: 80, borderRadius: 8 },
    cardTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 8, textAlign: 'center', color: '#222' },
    cardSubtitle: { fontSize: 13, color: '#555', marginTop: 4, textAlign: 'center' },
    learnMoreBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#56ab2f', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, zIndex: 1 },
    learnMoreText: { color: '#fff', fontSize: 12 },
    selectBookContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, justifyContent: 'flex-start', paddingHorizontal: 16 },
    selectBookBtn: { padding: 10, backgroundColor: '#56ab2f', borderRadius: 8, marginRight: 10 },
    selectBookBtnText: { fontSize: 16, color: '#fff' },
    selectBookText: { fontSize: 16, color: '#333', flex: 1, textAlign: 'right' },
    pickerContainer: { padding: 10 },
    pickerItem: { padding: 12, backgroundColor: '#eafbe7', borderRadius: 8, marginTop: 8 },
    pickerItemText: { fontSize: 16, color: '#333' },
    chapterBtn: { padding: 10, backgroundColor: '#eafbe7', borderRadius: 8, marginTop: 8, marginHorizontal: 16 },
    chapterText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    lessonContainer: { marginLeft: 36, marginTop: 10 },
    lesson: { fontSize: 14, color: '#777' },
    modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    closeButton: { marginTop: 20, backgroundColor: '#56ab2f', paddingVertical: 10, borderRadius: 8 },
    closeButtonText: { color: '#fff', textAlign: 'center' },
    fullImage: { width: '100%', height: 300, resizeMode: 'contain', marginBottom: 20 },
});
