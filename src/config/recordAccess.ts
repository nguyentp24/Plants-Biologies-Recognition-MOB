
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function recordAccess(biologyId: string) {
    try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        if (!token || !userId) {
            console.warn('No token or userId found');
            return;
        }

        const response = await fetch(`https://bilogieseducationapp.onrender.com/api/AccessBiology/record`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                user_Id: userId,
                bio_Id: biologyId  
            })
        });

        if (!response.ok) {
            console.error('Failed to record access:', await response.text());
        }
    } catch (error) {
        console.error('Error recording access:', error);
    }
}

