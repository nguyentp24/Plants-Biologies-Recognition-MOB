import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AuthStack from './AuthStack';
import MainTab from './MainTab';
import { useAuth } from '../contexts/AuthContext';

export default function RootNavigator() {
    const { loggedIn } = useAuth();

    if (loggedIn === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return loggedIn ? <MainTab /> : <AuthStack />;
}
