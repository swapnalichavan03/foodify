import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";

const CircularProgress = ({ progress = 0, size = 100, strokeWidth = 10, color = "blue", backgroundColor = "lightgray" }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const radius = size / 2;
  const circleCircumference = 2 * Math.PI * radius;
  const halfCircle = size / 2;

  const rotateInterpolation = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background Circle */}
      <View
        style={[
          styles.circle,
          {
            borderColor: backgroundColor,
            borderWidth: strokeWidth,
            width: size,
            height: size,
            borderRadius: radius,
          },
        ]}
      />
      
      {/* Left Half Circle */}
      <View style={[styles.halfCircleContainer, { width: halfCircle, height: size }]}>
        <View
          style={[
            styles.halfCircle,
            { backgroundColor: color, width: halfCircle, height: size, borderTopLeftRadius: radius, borderBottomLeftRadius: radius },
          ]}
        />
      </View>

      {/* Right Half Circle with Rotation */}
      <View style={[styles.halfCircleContainer, { width: halfCircle, height: size, right: 0 }]}>
        <Animated.View
          style={[
            styles.halfCircle,
            {
              backgroundColor: color,
              width: halfCircle,
              height: size,
              borderTopRightRadius: radius,
              borderBottomRightRadius: radius,
              transform: [{ rotate: rotateInterpolation }],
            },
          ]}
        />
      </View>

      {/* Inner Circle for Transparency */}
      <View
        style={[
          styles.innerCircle,
          { width: size - strokeWidth * 2, height: size - strokeWidth * 2, borderRadius: (size - strokeWidth * 2) / 2 },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  circle: {
    position: "absolute",
  },
  halfCircleContainer: {
    position: "absolute",
    overflow: "hidden",
  },
  halfCircle: {
    position: "absolute",
  },
  innerCircle: {
    position: "absolute",
    backgroundColor: "white",
  },
});

export default CircularProgress;
