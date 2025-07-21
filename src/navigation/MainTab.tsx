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
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { borderTopLeftRadius: 18, borderTopRightRadius: 18, height: 60 },
            }}
        >
            <Tab.Screen name="Home" component={Home} options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <MaterialIcons name="home" size={size} color={focused ? '#888' : '#bbb'} />
                )
            }} />
            <Tab.Screen name="Recognition" component={Recognition} options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <MaterialIcons name="camera-alt" size={size} color={focused ? '#888' : '#bbb'} />
                )
            }} />
            <Tab.Screen name="Resources" component={Resources} options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <MaterialIcons name="info-outline" size={size} color={focused ? '#888' : '#bbb'} />
                )
            }} />
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <MaterialIcons name="person" size={size} color={focused ? '#6c2eb5' : '#bbb'} />
                )
            }} />
        </Tab.Navigator>
    );
}
