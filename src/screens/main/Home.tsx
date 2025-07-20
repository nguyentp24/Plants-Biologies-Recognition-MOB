import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
    const navigation = useNavigation();
    const [books, setBooks] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [selectedBook, setSelectedBook] = useState<any | null>(null);
    const [chapters, setChapters] = useState<any[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [loadingBooks, setLoadingBooks] = useState(false);

    // Fetch books data from the API
    const fetchBooks = async () => {
        setLoadingBooks(true);
        setError(null);
        try {
            // Lấy token từ AsyncStorage
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
                setLoadingBooks(false);
                return;
            }

            console.log('Token:', token);  // Kiểm tra token trong console

            // API URL để lấy tất cả sách với tiêu đề "Đắc Nhân Tâm nè nè"
            const url = 'https://bilogieseducationapp.onrender.com/api/Book/search';

            // Gửi yêu cầu với token trong header
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Gửi token trong Authorization header
                    'Content-Type': 'application/json',
                },
            });

            // Kiểm tra mã trạng thái HTTP
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // Lọc tất cả các sách đã được phê duyệt (status: 'approved')
            const approvedBooks = data.filter((book: any) => book.status === 'Approved');
            setBooks(approvedBooks); // Lưu tất cả sách đã được phê duyệt vào state
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoadingBooks(false);
        }
    };

    useEffect(() => {
        fetchBooks(); // Gọi hàm fetchBooks khi component được render
    }, []);

    // Fetch chapters for selected book
    useEffect(() => {
        if (selectedBook) {
            setChapters(selectedBook.chapters || []);
        } else {
            setChapters([]);
        }
    }, [selectedBook]);

    // Handle book selection
    const handleBookSelect = (book: any) => {
        setSelectedBook(book);
        setShowModal(false); // Close modal when book is selected
    };

    // Toggle expanded chapter
    const toggleChapter = (chapterId: string) => {
        setSelectedChapter(selectedChapter?.chapter_Id === chapterId ? null : { ...selectedChapter, chapter_Id: chapterId });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.appTitle}>Biology & Plant Sample Learning App</Text>

                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome to Learning Environment</Text>
                    <Text style={styles.subText}>Explore the Biology of Plants and Animals</Text>
                </View>

                <Text style={styles.sectionHeader}>Book Categories</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {loadingBooks ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : books.length > 0 ? (
                        books.map((book) => (
                            <View key={book.book_Id} style={styles.card}>
                                <TouchableOpacity
                                    style={styles.learnMoreBtn}
                                    onPress={() => { }}
                                >
                                    <Text style={styles.learnMoreText}>Learn more</Text>
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

                <Text style={styles.sectionHeader}>Select a Book to Continue</Text>
                <View style={styles.selectBookContainer}>
                    <TouchableOpacity
                        style={styles.selectBookBtn}
                        onPress={() => setShowModal(true)}
                    >
                        <Text style={styles.selectBookBtnText}>Select a book</Text>
                    </TouchableOpacity>
                    <Text style={styles.selectBookText}>
                        {selectedBook ? selectedBook.book_Title : 'Chưa chọn sách'}
                    </Text>
                </View>

                {/* Modal for Book Selection */}
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
                                <ActivityIndicator size="large" color="#0000ff" />
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
                                    Không có sách nào hoặc chưa lấy được dữ liệu!
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
                                                <Text key={lesson.lesson_Id} style={styles.lesson}>
                                                    {lesson.lesson_Title}
                                                </Text>
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
    scrollContainer: { padding: 16 },
    appTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', alignSelf: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#1e90ff', padding: 10, borderRadius: 6 },
    header: { marginBottom: 20, alignItems: 'center' },
    welcomeText: { fontSize: 18, fontWeight: '600', color: '#333' },
    subText: { fontSize: 14, color: '#777', marginTop: 6 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#333' },
    categoryScroll: { flexDirection: 'row', marginTop: 16 },
    card: { width: 200, backgroundColor: '#eee', borderRadius: 16, marginRight: 16, padding: 10, alignItems: 'center', position: 'relative' },
    cardImage: { width: '100%', height: 120, borderRadius: 8 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
    cardSubtitle: { fontSize: 14, color: '#555', marginTop: 4 },
    selectBookContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, justifyContent: 'flex-start' },
    selectBookBtn: { padding: 10, backgroundColor: '#1e90ff', borderRadius: 8, marginRight: 10, },
    selectBookBtnText: { fontSize: 16, color: '#fff' },
    selectBookText: { fontSize: 16, color: '#333', flex: 1, textAlign: 'right', },
    pickerContainer: { padding: 10 },
    pickerItem: { padding: 12, backgroundColor: '#ddd', borderRadius: 8, marginTop: 8 },
    pickerItemText: { fontSize: 16, color: '#333' },
    chapterBtn: { padding: 10, backgroundColor: '#ddd', borderRadius: 8, marginTop: 8 },
    chapterText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    lessonContainer: { marginLeft: 20, marginTop: 10 },
    lesson: { fontSize: 14, color: '#777' },
    modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    closeButton: { marginTop: 20, backgroundColor: '#1e90ff', paddingVertical: 10, borderRadius: 8 },
    closeButtonText: { color: '#fff', textAlign: 'center' },
});
