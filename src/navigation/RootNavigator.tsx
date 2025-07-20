import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AuthStack from './AuthStack';
import MainTab from './MainTab';
import BiologyDetail from '../screens/main/BiologyDetail'; // Import màn hình BiologyDetail
import { useAuth } from '../contexts/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UpdateUserScreen from '../screens/main/UpdateUserScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn } = useAuth(); // ✅ Sửa lại đúng key

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

<<<<<<< HEAD
  return isLoggedIn ? <MainTab /> : <AuthStack />;
=======
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {loggedIn ? (
                <>
                    <Stack.Screen name="MainTab" component={MainTab} />
                    <Stack.Screen name="BiologyDetail" component={BiologyDetail} />
                    <Stack.Screen name="UpdateUserScreen" component={UpdateUserScreen} />
                </>
            ) : (
                <Stack.Screen name="AuthStack" component={AuthStack} />
            )}
        </Stack.Navigator>
    );
>>>>>>> 3f25396 (Update Profile, Biology details)
}
