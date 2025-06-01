import MaskedView from '@react-native-masked-view/masked-view';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, View, TextInputProps } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface IAnimatedTextInput extends TextInputProps {}
const AnimatedTextInput = (props: IAnimatedTextInput) => {
    const animation = useRef(new Animated.Value(0)).current;
    const [isFocused, setIsFocused] = useState<Boolean>(false)

    useEffect(() => {
        Animated.loop(
            Animated.timing(animation, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-150, 150],
    });

    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                value={props.value}
                onChangeText={props.onChangeText}
                placeholder=""
                placeholderTextColor="transparent"
                onFocus={(event) => {
                    setIsFocused(true)
                    if (props.onFocus) {
                        props.onFocus(event)
                    }
                }}
                onBlur={(event) => {
                    setIsFocused(false)
                    if (props.onBlur) {
                        props.onBlur(event)
                    }
                }}
                {...props}
            />

            {!isFocused && (props?.value === undefined || props?.value?.length === 0) && (
                <View pointerEvents="none" style={styles.placeholderWrapper}>
                    <Text style={styles.placeholderTextDim}>
                        Enter your text...
                    </Text>

                    <MaskedView
                        style={styles.maskedShimmer}
                        maskElement={
                            <View style={styles.centered}>
                                <Text style={styles.placeholderText}>
                                    Enter your text...
                                </Text>
                            </View>
                        }
                    >
                        <Animated.View
                            style={[
                                styles.shimmerView,
                                { transform: [{ translateX }] },
                            ]}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0.1)',]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.fullSize}
                            />
                        </Animated.View>
                    </MaskedView>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 150,
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 10,
        overflow: 'hidden',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    placeholderWrapper: {
        position: 'absolute',
        left: 10,
        right: 10,
        justifyContent: 'center',
    },
    maskedShimmer: {
        ...StyleSheet.absoluteFillObject,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: 'black',
    },
    placeholderTextDim: {
        fontSize: 16,
        color: '#000000', // dim base color
    },
    shimmerView: {
        width: 200,
        height: '100%',
    },
    fullSize: {
        flex: 1,
    },
});
export default AnimatedTextInput;
