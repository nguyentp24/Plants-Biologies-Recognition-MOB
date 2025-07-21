import AsyncStorage from '@react-native-async-storage/async-storage';

export async function recordBookAccess(bookId: string) {
  try {
    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');

    if (!token || !userId) {
      console.warn('No token or userId found');
      return;
    }

    const response = await fetch(`https://bilogieseducationapp.onrender.com/api/AccessBook/record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user_Id: userId,
        book_Id: bookId
      })
    });

    if (!response.ok) {
      console.error('Failed to record book access:', await response.text());
    }
  } catch (error) {
    console.error('Error recording book access:', error);
  }
}
