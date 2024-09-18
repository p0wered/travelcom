import {Animated, Easing, Image, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {FavoriteIcon} from "./icons/favorite-icon";
import Arrow from "./icons/arrow-icon";
import {useRef, useState} from "react";

export function FlightDirection({image, direction}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;
    const rotateAnimation = useRef(new Animated.Value(0)).current;

    const toggleExpand = () => {
        const initialValue = isExpanded ? 1 : 0;
        const finalValue = isExpanded ? 0 : 1;

        setIsExpanded(!isExpanded);

        Animated.timing(animation, {
            toValue: finalValue,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        Animated.timing(rotateAnimation, {
            toValue: finalValue,
            duration: 150,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    const heightInterpolation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 80],
    });

    const rotateInterpolation = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    return (
        <View style={styles.directionItem}>
            <View style={styles.imageWrap}>
                <Image source={image} style={styles.image} />
                <Pressable style={styles.iconPos}>
                    <FavoriteIcon color='white' stroke='black' />
                </Pressable>
            </View>
            <View style={[styles.infoMerger, { paddingHorizontal: 15, paddingTop: 8 }]}>
                <Text style={styles.hotelName}>{direction}</Text>
                <Text style={[styles.smallText, { color: 'black' }]}>5 h 11 min</Text>
            </View>
            <View style={{ padding: 15, gap: 10 }}>
                <TouchableOpacity style={styles.infoMerger} onPress={toggleExpand}>
                    <View style={styles.merger}>
                        <Image source={require('../assets/airlines.png')} style={{ width: 30, height: 30 }} />
                        <View>
                            <Text style={styles.mainText}>11:10 - 19:30</Text>
                            <Text style={styles.smallText}>Luton Airport, LTN</Text>
                        </View>
                    </View>
                    <Animated.View style={{transform: [{rotate: rotateInterpolation }]}}>
                        <Arrow />
                    </Animated.View>
                </TouchableOpacity>
                <Animated.View style={{height: heightInterpolation, overflow: 'hidden', gap: 10}}>
                    <View style={styles.merger}>
                        <Image source={require('../assets/airlines.png')} style={{ width: 30, height: 30 }} />
                        <View>
                            <Text style={styles.mainText}>12:15 - 20:25</Text>
                            <Text style={styles.smallText}>Luton Airport, LTN</Text>
                        </View>
                    </View>
                    <View style={styles.merger}>
                        <Image source={require('../assets/airlines.png')} style={{ width: 30, height: 30 }} />
                        <View>
                            <Text style={styles.mainText}>12:15 - 20:25</Text>
                            <Text style={styles.smallText}>Luton Airport, LTN</Text>
                        </View>
                    </View>
                </Animated.View>
                <View style={styles.separator}/>
                <View style={styles.infoMerger}>
                    <Text style={styles.smallText}>1 Adults, Business Class</Text>
                    <Text style={styles.mainText}>2/03/2024</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 13
    },
    smallText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 11,
        color: 'grey',
        marginBottom: 3
    },
    flexCenter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    directionItem: {
        width: '100%',
        display: "flex",
        flexDirection: "column",
        justifyContent: 'space-between',
        backgroundColor: 'white',
        overflow: "hidden",
        borderRadius: 10,
        marginBottom: 20
    },
    imageWrap: {
        position: 'relative',
        width: '100%',
        padding: 5
    },
    image: {
        width: '100%',
        height: undefined,
        borderRadius: 8,
        aspectRatio: 4/3,
    },
    priceMerger: {
        position: 'absolute',
        bottom: 0,
        margin: 12,
        display: 'flex',
        flexDirection: 'row',
        alignItems: "flex-end",
        gap: 5
    },
    iconPos: {
        position: 'absolute',
        margin: 12,
        right: 0
    },
    infoMerger: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        gap: 16,
    },
    merger: {
      display: 'flex',
      flexDirection: 'row',
      gap: 12
    },
    hotelName: {
        fontFamily: 'Montserrat-Bold',
        maxWidth: 150
    },
    separator: {
        height: 1,
        backgroundColor: '#c5c5c5'
    }
});
