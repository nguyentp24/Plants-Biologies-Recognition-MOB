import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/main/Home';
import Profile from '../screens/main/Profile';
import Recognition from '../screens/main/Recognition';
import Resources from '../screens/main/Resources';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function MainTab() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Home} options={{
                tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />
            }} />
            <Tab.Screen name="Recognition" component={Recognition} options={{
                tabBarIcon: ({ color, size }) => <MaterialIcons name="camera-alt" size={size} color={color} />
            }} />
            <Tab.Screen name="Resources" component={Resources} options={{
                tabBarIcon: ({ color, size }) => <MaterialIcons name="library-books" size={size} color={color} />
            }} />
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />
            }} />
        </Tab.Navigator>
    );
}
