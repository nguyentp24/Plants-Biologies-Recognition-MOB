import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AuthStack from './AuthStack';
import MainTab from './MainTab';
import { useAuth } from '../contexts/AuthContext';

export default function RootNavigator() {
  const { isLoggedIn } = useAuth(); // ✅ Sửa lại đúng key

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return isLoggedIn ? <MainTab /> : <AuthStack />;
}
