import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Animated, ScrollView} from 'react-native';
import Arrow from "../components/icons/arrow-icon";
import ArrowActive from "../components/icons/arrow-icon-active";

const Notification = ({title, content, date}) => {
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

    return (
        <Pressable onPress={() => setExpanded(!expanded)} style={styles.notification}>
            <View style={styles.notificationHeader}>
                <View>
                    <Text style={styles.smallText}>{date}</Text>
                    <Text style={styles.title}>{title}</Text>
                </View>
                {expanded ? (<ArrowActive color='#207FBF'/>) : (<Arrow/>)}
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

export default function NotificationsScreen(){
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titleText}>Notifications</Text>
            <View>
                <Notification
                    title='New notification'
                    content='Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.'
                    date='19/07/2024'
                />
                <Notification
                    title='New notification'
                    content='Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.'
                    date='19/07/2024'
                />
                <Notification
                    title='New notification'
                    content='Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.'
                    date='19/07/2024'
                />
                <Notification
                    title='New notification'
                    content='Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.'
                    date='19/07/2024'
                />
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
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
});