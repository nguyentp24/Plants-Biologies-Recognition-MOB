import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";
import React, { useEffect } from "react";

export default function App() {
    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log("Authorization status:", authStatus);
        }
    };
    useEffect(() => {
        if (requestUserPermission()) {
            messaging()
                .getToken()
                .then((token) => {
                    console.log(token);
                });
        } else {
            console.log("Permission not granted", authStatus);
        }

        messaging()
            .getInitialNotification()
            .then(async (remoteMessage) => {
                if (remoteMessage) {
                    console.log(
                        "Notification caused app to open from quit state:",
                        remoteMessage.notification
                    );
                }
            });

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log(
                "Notification caused app to open from background state:",
                remoteMessage.notification
            );
        });

        //register background handler 
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log("Message handled in the background!", remoteMessage);
        });

        const unsubcribe = messaging().onMessage(async (remoteMessage) => {
            Alert.alert("A new FCM message arrived!", JSON.stringify(remoteMessage));
        });

        return unsubcribe;
    }, []);
    return (
        <View style={styles.containter}>
            <text>FCM Tutoral</text>
            <StatusBar style="auto" />
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});