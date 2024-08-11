import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js/react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePusherNotification = (isReady: boolean) => {
    const pusherRef = useRef<Pusher | null>(null);

    useEffect(() => {
        const initializePusher = async () => {
            if (!isReady) return;

            const token = await AsyncStorage.getItem('@token');
            if (!token) return;

            const userDataString = await AsyncStorage.getItem('@user');
            if (!userDataString) return;

            const userData = JSON.parse(userDataString);
            if (!userData || !userData.id) return;

            pusherRef.current = new Pusher('9e6dd00ba6c994e5ebfe', {
                cluster: 'eu'
            });

            const channel = pusherRef.current.subscribe(`chat_${userData.id}`);
            channel.bind('new-message', (data) => {
                console.log(data)
                sendNotification('New chat message', data.text);
            });
        };

        initializePusher();

        return () => {
            if (pusherRef.current) {
                pusherRef.current.disconnect();
            }
        };
    }, [isReady]);

    const sendNotification = async (title: string, body: string) => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title,
                    body: body,
                },
                trigger: null,
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    return null;
};
