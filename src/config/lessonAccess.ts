import AsyncStorage from '@react-native-async-storage/async-storage';

export async function recordLessonAccess(lessonId: string) {
    try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        if (!token || !userId) {
            console.warn('No token or userId found');
            return;
        }

        const response = await fetch(`https://bilogieseducationapp.onrender.com/api/AccessLesson/record`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                user_Id: userId,
                lesson_Id: lessonId
            })
        });

        if (!response.ok) {
            console.error('Failed to record lesson access:', await response.text());
        }
    } catch (error) {
        console.error('Error recording lesson access:', error);
    }
}