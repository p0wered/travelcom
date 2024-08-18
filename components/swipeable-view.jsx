import React, {useRef} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';

const SwipeableView = ({children, maxSwipeDistance = 53, style, isOpen, setIsOpen}) => {
    const translateX = useRef(new Animated.Value(0)).current;

    const onGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX } }],
        {
            useNativeDriver: true,
            listener: (event) => {
                const { translationX } = event.nativeEvent;
                if (isOpen) {
                    if (translationX > 0) {
                        translateX.setValue(translationX - maxSwipeDistance);
                    } else {
                        translateX.setValue(-maxSwipeDistance);
                    }
                } else {
                    if (translationX < 0) {
                        translateX.setValue(translationX);
                    } else {
                        translateX.setValue(0);
                    }
                }
            }
        }
    );

    const onHandlerStateChange = event => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            const { translationX, velocityX } = event.nativeEvent;

            if (isOpen) {
                if (translationX > maxSwipeDistance / 2 || velocityX > 500) {
                    close();
                } else {
                    open();
                }
            } else {
                if (translationX < -maxSwipeDistance / 2 || velocityX < -500) {
                    open();
                } else {
                    close();
                }
            }
        }
    };

    const open = () => {
        setIsOpen(true);
        Animated.spring(translateX, {
            toValue: -maxSwipeDistance,
            useNativeDriver: true,
        }).start();
    };

    const close = () => {
        setIsOpen(false);
        Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            activeOffsetX={[-10, 10]}
        >
            <Animated.View
                style={[
                    styles.swipeableView,
                    style,
                    {
                        transform: [{ translateX: translateX }],
                    },
                ]}
            >
                {children}
            </Animated.View>
        </PanGestureHandler>
    );
};

const styles = StyleSheet.create({
    swipeableView: {
        width: '100%',
    },
});

export default SwipeableView;
