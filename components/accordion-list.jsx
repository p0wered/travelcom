import {Animated, LayoutAnimation, Pressable, Text, View, StyleSheet} from "react-native";
import ArrowActive from "./icons/arrow-icon-active";
import Arrow from "./icons/arrow-icon";
import {useEffect, useRef, useState} from "react";

export function AccordionItem({title, content}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const animatedHeight = useRef(new Animated.Value(0)).current;

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
        Animated.timing(animatedHeight, {
            toValue: isExpanded ? 0 : 1,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };

    const maxHeight = animatedHeight.interpolate({
        inputRange: [0, 1],
        outputRange: [headerHeight + 33, headerHeight + contentHeight + 33],
    });

    return (
        <Animated.View style={[
            styles.accordionItem,
            isExpanded && styles.accordionItemActive,
            {height: maxHeight, width: '100%', maxWidth: 600, marginHorizontal: 'auto'},
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
                        {isExpanded ? (
                            <ArrowActive color='white'/>
                        ) : (
                            <Arrow color='white'/>
                        )}
                    </View>
                </View>
            </Pressable>
            <View style={{height: isExpanded ? 'auto' : 0, overflow: 'hidden'}}>
                {isExpanded && (
                    <View
                        onLayout={(event) => {
                            const { height } = event.nativeEvent.layout;
                            setContentHeight(height);
                        }}
                    >
                        <View style={styles.separatorAccordion} />
                        <Text style={{color: 'white', padding: 15}}>{content}</Text>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}

export function generateAccordionItems(faqData) {
    return faqData.map((item) => (
        <AccordionItem
            key={item.id}
            title={item.title}
            content={item.answer}
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
        gap: 5,
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
