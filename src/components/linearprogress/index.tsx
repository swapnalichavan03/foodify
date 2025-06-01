import React, { Fragment, useEffect, useRef } from "react";
import { View, Animated, Easing, Dimensions } from "react-native";
import { colors } from "../../theme/colors";

const { width, height } = Dimensions.get("screen")
const LinearProgress = ({ progress = 0 }: { progress: number }) => {
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress, // Animate to the new progress value
            duration: 500, // Animation duration (adjust as needed)
            easing: Easing.linear, // Smooth transition
            useNativeDriver: false, // Required for width animation
        }).start();
    }, [progress]);

    const animatedStyle = {
        width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"], // Converts the value to a percentage
        }),
    };

    return (
        <Fragment>
            <View style={{ height: 5, width: width, backgroundColor: colors.grey[300] }}>
                <Animated.View
                    style={[{ height: "100%", backgroundColor: colors.primary.main }, animatedStyle]}
                />
            </View>
        </Fragment>
    );
}

export default LinearProgress;
