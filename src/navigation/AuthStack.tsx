import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/auth/SignIn';
import SignUp from '../screens/auth/SignUp';
import ForgetPassword from '../screens/auth/ForgetPassword';
import ConfirmPassword from '../screens/auth/ConfirmPassword';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgetPass" component={ForgetPassword} />
            <Stack.Screen name="ConfirmPassword" component={ConfirmPassword} />
        </Stack.Navigator>
    );
}
