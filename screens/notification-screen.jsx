import {Animated, LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import ArrowActive from "../components/icons/arrow-icon-active";
import Arrow from "../components/icons/arrow-icon";
import {useEffect, useRef, useState} from "react";

export default function NotificationScreen(){
    return(
        <ScrollView style={{padding: 15}}>
            <Text style={styles.titleText}>Notifications</Text>
            <NotificationItem
                title='Lorem ipsum dolor sit amet'
                content='Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
                Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
                aliquet nec, vulputate eget. '
            />
            <NotificationItem
                title='Lorem ipsum dolor sit amet'
                content='Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
                Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
                aliquet nec, vulputate eget. '
            />
            <NotificationItem
                title='Lorem ipsum dolor sit amet'
                content='Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
                Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
                aliquet nec, vulputate eget. '
            />
            <NotificationItem
                title='Lorem ipsum dolor sit amet'
                content='Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
                Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
                aliquet nec, vulputate eget. '
            />
        </ScrollView>
    )
}

function NotificationItem({ title, content }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const animatedOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [isExpanded]);

    useEffect(() => {
        if (headerHeight > 0) {
            animatedHeight.setValue(isExpanded ? 1 : 0);
        }
    }, [headerHeight]);

    const toggleNotification = () => {
        setIsExpanded(!isExpanded);
        Animated.parallel([
            Animated.timing(animatedHeight, {
                toValue: isExpanded ? 0 : 1,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(animatedOpacity, {
                toValue: isExpanded ? 0 : 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    };

    const maxHeight = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [headerHeight + 33, headerHeight + contentHeight + 33],
    });

    return (
        <Animated.View style={[
            styles.notificationItem,
            isExpanded && styles.notificationItemActive,
            { height: maxHeight }
        ]}>
            <Pressable onPress={toggleNotification}>
                <View
                    style={styles.notificationInner}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setHeaderHeight(height);
                    }}
                >
                    <Text style={[styles.mainText, {color: 'black'}]}>{title}</Text>
                    <View style={styles.arrowContainer}>
                        <Animated.View style={[styles.arrowWrapper, { opacity: animatedOpacity }]}>
                            <ArrowActive color='#207FBF'/>
                        </Animated.View>
                        <Animated.View style={[styles.arrowWrapper, { opacity: animatedOpacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }) }]}>
                            <Arrow color='#207FBF' />
                        </Animated.View>
                    </View>
                </View>
            </Pressable>
            <View style={{ height: isExpanded ? 'auto' : 0, overflow: 'hidden' }}>
                <View
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setContentHeight(height);
                    }}
                >
                    <Text style={{color: 'black', paddingHorizontal: 15, paddingBottom: 15}}>{content}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    titleText: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: '#207FBF',
        marginBottom: 15
    },
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: 'white'
    },
    notificationItem: {
        height: 51,
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    notificationItemActive: {
        height: 'auto'
    },
    notificationInner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 15
    },
    separatorNotification: {
        width: '100%',
        height: 1,
        backgroundColor: 'white'
    },
    arrowContainer: {
        position: 'relative',
        width: 15,
        height: 15,
    },
    arrowWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
})