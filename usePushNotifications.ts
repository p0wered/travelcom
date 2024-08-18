import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNotification} from "./contextNotifications";

export interface PushNotificationState {
    expoPushToken?: Notifications.ExpoPushToken;
    notification?: Notifications.Notification;
}

const PUSH_TOKEN_STORAGE_KEY = '@PushToken';

export const usePushNotifications = (): PushNotificationState => {
    const { notificationsEnabled } = useNotification();

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: notificationsEnabled,
            shouldShowAlert: notificationsEnabled,
            shouldSetBadge: notificationsEnabled,
            sound: 'default'
        }),
    });

    const [expoPushToken, setExpoPushToken] = useState<
        Notifications.ExpoPushToken | undefined
    >();

    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >();

    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                console.log("Failed to get push token for push notification");
                return;
            }

            token = await Notifications.getExpoPushTokenAsync({
                projectId: 'e4df6cb8-b629-4ea9-80f0-ba9c2c4d8abd',
            });
        } else {
            console.log("Must be using a physical device for Push notifications");
        }

        if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
                name: "default",
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#FF231F7C",
            });
        }

        return token;
    }

    async function savePushTokenToStorage(token: Notifications.ExpoPushToken) {
        try {
            await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, JSON.stringify(token));
            console.log('Push token saved to AsyncStorage');
        } catch (error) {
            console.error('Error saving push token to AsyncStorage:', error);
        }
    }

    async function getPushTokenFromStorage(): Promise<Notifications.ExpoPushToken | null> {
        try {
            const tokenString = await AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
            if (tokenString) {
                return JSON.parse(tokenString);
            }
        } catch (error) {
            console.error('Error getting push token from AsyncStorage:', error);
        }
        return null;
    }

    async function savePushTokenToServer(token: Notifications.ExpoPushToken) {
        try {
            const response = await fetch('https://travelcom.online/api/push/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token.data }),
            });
            if (!response.ok) {
                throw new Error('Failed to save push token');
            }
            console.log('Push token saved successfully to server');
        } catch (error) {
            console.error('Error saving push token to server:', error);
        }
    }

    useEffect(() => {
        async function setupPushNotifications() {
            const storedToken = await getPushTokenFromStorage();
            if (storedToken) {
                setExpoPushToken(storedToken);
                savePushTokenToServer(storedToken);
            } else {
                const newToken = await registerForPushNotificationsAsync();
                if (newToken) {
                    setExpoPushToken(newToken);
                    savePushTokenToStorage(newToken);
                    savePushTokenToServer(newToken);
                }
            }
        }

        setupPushNotifications();

        if (notificationsEnabled) {
            notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

            responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(response);
            });
        } else {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        }

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, [notificationsEnabled]);

    return {
        expoPushToken,
        notification,
    };
};
