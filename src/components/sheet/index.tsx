import React, { useEffect, useState, useRef, FC, PropsWithChildren } from 'react';
import { Animated, PanResponder, StyleSheet } from 'react-native';

const DEFAULT_BOTTOM = -300;
const DEFAULT_ANIMATE_TIME = 300;
const MAX_DRAG_DISTANCE = 500; //

export interface SheetProps {
    visible: boolean;
    onClose?: () => void;
}

const Sheet: FC<PropsWithChildren<SheetProps>> = ({ visible, children, onClose }) => {
    const [bottom] = useState(new Animated.Value(DEFAULT_BOTTOM));

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dy) > 5, // Start responding to vertical drag
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    bottom.setValue(-gestureState.dy); // Move the sheet down
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > MAX_DRAG_DISTANCE) {
                    // // Close the sheet if dragged down far enough
                    // Animated.timing(bottom, {
                    //     toValue: DEFAULT_BOTTOM,
                    //     duration: DEFAULT_ANIMATE_TIME,
                    //     useNativeDriver: false,
                    // }).start(() => {
                    //     if (onClose) {
                    //         onClose();
                    //     }
                    // });
                    if (onClose) {
                        onClose();
                    }
                } else {
                    // Snap back to original position
                    Animated.timing(bottom, {
                        toValue: 0,
                        duration: DEFAULT_ANIMATE_TIME,
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        return Animated.timing(bottom, {
            toValue: visible ? 0 : DEFAULT_BOTTOM,
            duration: DEFAULT_ANIMATE_TIME,
            useNativeDriver: false,
        }).start();
    }, [visible, bottom]);

    return (

        <Animated.View
            style={[{ bottom, }]}
        // {...panResponder.panHandlers}
        >
            {children}
        </Animated.View>
    )
};

const styles = StyleSheet.create({
    sheet: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
});


export default Sheet;