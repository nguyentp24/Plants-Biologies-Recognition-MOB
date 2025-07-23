import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AuthStack from './AuthStack';
import MainTab from './MainTab';
import BiologyDetail from '../screens/main/BiologyDetail';
import { useAuth } from '../contexts/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UpdateUserScreen from '../screens/main/UpdateUserScreen';
import LessonDetail from '../screens/main/LessonDetail';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn } = useAuth();  // Sửa về đúng biến loggedIn nếu context là loggedIn

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="MainTab" component={MainTab} />
          <Stack.Screen name="BiologyDetail" component={BiologyDetail} />
          <Stack.Screen name="UpdateUserScreen" component={UpdateUserScreen} />
          <Stack.Screen name="LessonDetail" component={LessonDetail} />
        </>
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
