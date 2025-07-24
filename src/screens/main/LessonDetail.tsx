import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';

// Định nghĩa kiểu cho route params
type RootStackParamList = {
    LessonDetail: { lessonId: string };
};

type RouteParams = RouteProp<RootStackParamList, 'LessonDetail'>;

export default function LessonDetail() {
    const route = useRoute<RouteParams>();
    const { lessonId } = route.params;  // Lấy lessonId từ tham số điều hướng

    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch lesson data from API
    const fetchLesson = async () => {
        setLoading(true);
        setError('');
        try {
            const url = 'https://bilogieseducationapp.onrender.com/api/Lesson/search';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            // Tìm bài học trong dữ liệu trả về từ API
            const lessonData = data.find((lesson: any) => lesson.lesson_Id === lessonId);

            if (lessonData) {
                setLesson(lessonData);
            } else {
                setError('Lesson not found');
            }
        } catch (err) {
            setError('Error fetching lesson data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLesson();
    }, [lessonId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#56ab2f" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={styles.container}>
                {lesson && (
                    <View style={styles.lessonDetailContainer}>
                        <Text style={styles.lessonTitle}>{lesson.lesson_Title}</Text>
                        <Text style={styles.lessonContent}>{lesson.content}</Text>
                        {lesson.plant_Biology_Animal && lesson.plant_Biology_Animal.length > 0 ? (
                            lesson.plant_Biology_Animal.map((item: any) => (
                                <View key={item.id} style={styles.biologyContainer}>
                                    <Text style={styles.commonName}>Common Name: {item.commonName}</Text>
                                    <Text style={styles.scientificName}>Scientific Name: {item.scientificName}</Text>
                                    <Text style={styles.specieType}>Specie Type: {item.specieType}</Text>
                                    <Text style={styles.description}>Description: {item.description}</Text>
                                    <Text style={styles.habitat}>Habitat: {item.habitat}</Text>
                                    <Text style={styles.lifeSpan}>Average Life Span: {item.averageLifeSpan}</Text>
                                    <Text style={styles.status}>Status: {item.status}</Text>
                                    {item.imageUrl && (
                                        <Image source={{ uri: item.imageUrl }} style={styles.image} />
                                    )}
                                </View>
                            ))
                        ) : (
                            <Text>*No plant biology animal data available*</Text>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    container: { padding: 16 }, // KHÔNG có flex: 1 ở đây!
    lessonDetailContainer: { marginBottom: 20 },
    lessonTitle: { fontSize: 24, fontWeight: 'bold' },
    lessonContent: { fontSize: 16, marginTop: 10 },
    biologyContainer: { marginTop: 20 },
    commonName: { fontSize: 18, fontWeight: 'bold' },
    scientificName: { fontSize: 16, color: '#555' },
    specieType: { fontSize: 16, color: '#555' },
    description: { fontSize: 14, marginTop: 5 },
    habitat: { fontSize: 14, marginTop: 5 },
    lifeSpan: { fontSize: 14, marginTop: 5 },
    status: { fontSize: 14, marginTop: 5 },
    image: { width: '100%', height: 200, borderRadius: 8, marginTop: 10, resizeMode: 'contain' },
});
