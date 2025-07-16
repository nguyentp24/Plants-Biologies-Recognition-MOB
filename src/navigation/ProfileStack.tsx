import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../screens/main/Profile';
import EditPassword from '../../src/components/profilescreen/EditPassword';

// Định nghĩa kiểu cho ProfileStack
export type ProfileStackParamList = {
  Profile: undefined;
  EditPassword: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8f8f8',
        },
        headerTintColor: '#4CAF50',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerTitle: 'Hồ sơ người dùng' }}
      />
      <Stack.Screen
        name="EditPassword"
        component={EditPassword}
        options={{ headerTitle: 'Đổi mật khẩu' }}
      />
      
    </Stack.Navigator>
  );
}