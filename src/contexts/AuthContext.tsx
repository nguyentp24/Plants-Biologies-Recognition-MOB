import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
    loggedIn: boolean;
    setLoggedIn: (val: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
    loggedIn: false,
    setLoggedIn: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const check = async () => {
            const token = await AsyncStorage.getItem('userToken');
            setLoggedIn(!!token);
        };
        check();
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
