import {Animated, LayoutAnimation, Pressable, Text, View, StyleSheet} from "react-native";
import ArrowActive from "./icons/arrow-icon-active";
import Arrow from "./icons/arrow-icon";
import {useEffect, useRef, useState} from "react";

export function AccordionItem({ title, content }) {
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

    const toggleAccordion = () => {
        setIsExpanded(!isExpanded);
        Animated.parallel([
            Animated.timing(animatedHeight, {
                toValue: isExpanded ? 0 : 1,
                duration: 150,
                useNativeDriver: false,
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
            styles.accordionItem,
            isExpanded && styles.accordionItemActive,
            { height: maxHeight }
        ]}>
            <Pressable onPress={toggleAccordion}>
                <View
                    style={styles.accordionInner}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setHeaderHeight(height);
                    }}
                >
                    <Text style={[styles.mainText, { color: isExpanded ? 'white' : '#207FBF' }]}>{title}</Text>
                    <View style={styles.arrowContainer}>
                        <Animated.View style={[styles.arrowWrapper, { opacity: animatedOpacity }]}>
                            <ArrowActive color='white' />
                        </Animated.View>
                        <Animated.View style={[styles.arrowWrapper, { opacity: animatedOpacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }) }]}>
                            <Arrow color={isExpanded ? 'white' : '#207FBF'} />
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
                    <View style={styles.separatorAccordion} />
                    <Text style={{color: isExpanded ? 'white' : '#207FBF', padding: 15}}>{content}</Text>
                </View>
            </View>
        </Animated.View>
    );
}

export function generateAccordionItems(faqTitles) {
    return faqTitles.map((title, index) => (
        <AccordionItem
            key={index}
            title={title}
            content='Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
            Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
            Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
            aliquet nec, vulputate eget. '
        />
    ));
}

const styles = StyleSheet.create({
    mainText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: 'white'
    },
    faqText: {
        fontFamily: 'Montserrat-Bold',
        marginBottom: 15,
        fontSize: 30,
        color: '#207FBF',
        textAlign: 'center'
    },
    faqFlexbox: {
        padding: 14
    },
    accordionItem: {
        height: 51,
        borderWidth: 1,
        borderColor: '#207FBF',
        borderRadius: 10,
        marginBottom: 12
    },
    accordionItemActive: {
        height: 'auto',
        backgroundColor: '#207FBF',
    },
    accordionInner: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 15
    },
    separatorAccordion: {
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