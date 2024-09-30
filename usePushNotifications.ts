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

export const usePushNotifications = (isAuthenticated: boolean): PushNotificationState => {
    const { notificationsEnabled } = useNotification();

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: notificationsEnabled && isAuthenticated,
            shouldShowAlert: notificationsEnabled && isAuthenticated,
            shouldSetBadge: notificationsEnabled && isAuthenticated,
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

    const registerForPushNotificationsAsync = async () => {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            console.log('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    };

    const savePushTokenToStorage = async (token: Notifications.ExpoPushToken) => {
        try {
            await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, JSON.stringify(token));
        } catch (e) {
            console.error('Failed to save push token to AsyncStorage', e);
        }
    };

    const getPushTokenFromStorage = async (): Promise<Notifications.ExpoPushToken | null> => {
        try {
            const value = await AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('Failed to get push token from AsyncStorage', e);
            return null;
        }
    };

    async function savePushTokenToServer(token: Notifications.ExpoPushToken, userId: string, authToken: string) {
        const maxRetries = 3;
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch('https://travelcom.online/api/push/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        push_token: token.data,
                        user_id: userId
                    }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to save push token: ${errorData.message}`);
                }
                console.log('Push token saved successfully to server');
                return;
            } catch (error) {
                console.error(`Error saving push token to server (attempt ${i + 1}):`, error);
                if (i === maxRetries - 1) {
                    console.error('Failed to save push token after multiple attempts');
                }
            }
        }
    }

    useEffect(() => {
        async function setupPushNotifications() {
            if (isAuthenticated) {
                const authToken = await AsyncStorage.getItem('@token');
                if (!authToken) {
                    console.error('No authentication token found');
                    return;
                }

                const userDataString = await AsyncStorage.getItem('@user');
                if (!userDataString) {
                    console.error('No user data found');
                    return;
                }

                const userData = JSON.parse(userDataString);
                const userId = userData.id;

                if (!userId) {
                    console.error('User ID not found in stored user data');
                    return;
                }

                const storedToken = await getPushTokenFromStorage();
                if (storedToken) {
                    setExpoPushToken(storedToken);
                    await savePushTokenToServer(storedToken, userId, authToken);
                } else {
                    const newToken = await registerForPushNotificationsAsync();
                    if (newToken) {
                        setExpoPushToken(newToken);
                        await savePushTokenToStorage(newToken);
                        await savePushTokenToServer(newToken, userId, authToken);
                    }
                }
            }
        }

        setupPushNotifications();

        if (notificationsEnabled && isAuthenticated) {
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
    }, [notificationsEnabled, isAuthenticated]);

    return {
        expoPushToken,
        notification,
    };
};
