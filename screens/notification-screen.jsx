import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    TouchableOpacity, FlatList
} from 'react-native';
import Arrow from "../components/icons/arrow-icon";
import ArrowActive from "../components/icons/arrow-icon-active";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import SwipeableView from "../components/swipeable-view";
import {BasketIcon} from "../components/icons/basket-icon";

const Notification = ({id, title, content, date, seen, onDelete, scrollViewRef}) => {
    const [expanded, setExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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
        <View style={{position: 'relative', paddingHorizontal: 15}}>
            <TouchableOpacity style={styles.basketIcon} onPress={() => onDelete(id)}>
                <BasketIcon/>
            </TouchableOpacity >
            <SwipeableView style={{zIndex: 2}} scrollViewRef={scrollViewRef} isOpen={isOpen} setIsOpen={setIsOpen}>
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
            </SwipeableView>
        </View>

    );
};

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState([]);
    const flatListRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const token = await AsyncStorage.getItem('@token');
            const response = await axios.get('https://travelcom.online/api/notifications/get', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
            console.log('Notifications updated:', response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = await AsyncStorage.getItem('@token');
            await axios.post('https://travelcom.online/api/notifications/delete',
                { id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.id !== id)
            );
            fetchNotifications();
            console.log('Notification deleted:', id);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const renderItem = ({ item }) => (
        <Notification
            id={item.id}
            title={item.title}
            content={item.desc}
            date={new Date(item.created_at).toLocaleDateString()}
            seen={item.seen}
            onDelete={deleteNotification}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Notifications</Text>
            <FlatList
                ref={flatListRef}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                data={notifications}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 78
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF',
        margin: 15,
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
    basketIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        position: 'absolute',
        top: 13,
        right: 18,
        zIndex: 1,
    }
});
