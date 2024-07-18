import React from "react";
import {Animated} from "react-native";

export const FadeInView = ({ children, ...props }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }
        ).start();
    }, [fadeAnim]);

    return (
        <Animated.View
            style={{
                ...props.style,
                opacity: fadeAnim,
            }}
        >
            {children}
        </Animated.View>
    );
};