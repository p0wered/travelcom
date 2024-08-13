import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Animated, ScrollView, ActivityIndicator} from 'react-native';
import Arrow from "../components/icons/arrow-icon";
import ArrowActive from "../components/icons/arrow-icon-active";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";

const Notification = ({ title, content, date, seen }) => {
    const [expanded, setExpanded] = useState(false);
    const animatedOpacity = useRef(new Animated.Value(0)).current;
    const animatedScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(animatedOpacity, {
                toValue: expanded ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(animatedScale, {
                toValue: expanded ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    }, [expanded]);

    const textStyle = seen === 0 ? styles.unreadText : styles.readText;

    return (
        <Pressable onPress={() => setExpanded(!expanded)} style={styles.notification}>
            <View style={styles.notificationHeader}>
                <View>
                    <Text style={styles.smallText}>{date}</Text>
                    <Text style={[styles.title, textStyle]}>{title}</Text>
                </View>
                {expanded ? (<ArrowActive color='#207FBF'/>) : (<Arrow color='#207FBF'/>)}
            </View>
            <Animated.View style={{
                opacity: animatedOpacity,
                height: expanded ? 'auto' : 0,
                overflow: 'hidden'
            }}>
                <Text style={styles.content}>{content}</Text>
            </Animated.View>
        </Pressable>
    );
};

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem('@token');

            const response = await axios.get('https://travelcom.online/api/notifications/get', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setNotifications(response.data);
            console.log('Notifications updated:', response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    return (
        <ScrollView style={styles.container}>
            <View style={{paddingBottom: 40}}>
                <Text style={styles.titleText}>Notifications</Text>
                <View>
                    {notifications.map((notification) => (
                        <Notification
                            key={notification.id}
                            title={notification.title}
                            content={notification.desc}
                            date={new Date(notification.created_at).toLocaleDateString()}
                            seen={notification.seen}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        paddingBottom: 60
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF',
        marginBottom: 15
    },
    notification: {
        backgroundColor: 'white',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold'
    },
    content: {
        marginTop: 10,
        fontSize: 14,
        fontFamily: 'Montserrat-Regular'
    },
    smallText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: 'grey',
        marginBottom: 3
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        fontFamily: 'Montserrat-Bold',
    },
    readText: {
        fontFamily: 'Montserrat-Medium',
    },
});
