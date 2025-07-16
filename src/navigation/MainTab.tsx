import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/main/Home';
import ProfileStack from '../navigation/ProfileStack';
import Resources from '../screens/main/Resources';
import SearchStack from '../navigation/SearchStack';
import { MaterialIcons } from '@expo/vector-icons';

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
  Resources: undefined;
  LessonSearch: undefined; // Giữ tên này để tab hiển thị đúng
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="Resources"
        component={Resources}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="library-books" size={size} color={color} />
        }}
      />
      <Tab.Screen
        name="LessonSearch"
        component={SearchStack} // Sử dụng SearchStack thay vì LessonSearch
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="camera-alt" size={size} color={color} />,
          tabBarLabel: 'SearchBio', // Đổi tên tab nếu muốn
        }}
      />
    </Tab.Navigator>
  );
}