import React, { Fragment, useState, useRef, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Easing
} from 'react-native';
import { colors } from '../../theme/colors';
import { Fonts, FontWeight } from '../../theme/fonts';

interface ISwitchButton {
    isSwitch?: true | false,
    onSwitch?: (value: true | false) => void
}
const SwitchButton = ({ isSwitch = true, onSwitch }: ISwitchButton) => {
    const positionButton = useRef(new Animated.Value(0)).current;

    const startAnimToOff = () => {
        Animated.timing(positionButton, {
            toValue: 0,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true
        }).start()
    };

    const startAnimToOn = () => {
        Animated.timing(positionButton, {
            toValue: 1,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: true
        }).start()

    };
    const positionInterPol = positionButton.interpolate({ inputRange: [0, 1], outputRange: [0, 30] })
    const backgroundColorAnim = positionButton.interpolate({ inputRange: [0, 1], outputRange: [colors.grey[400], colors.primary.main] })
    const initialOpacityOn = positionButton.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })
    const initialOpacityOff = positionButton.interpolate({ inputRange: [0, 1], outputRange: [1, 0] })

    const onPress = () => {
        if (onSwitch) {
            onSwitch(!isSwitch)
        }
        // if (isSwitch) {
        //     startAnimToOff();
        //     if (onSwitch) {
        //         onSwitch(false);
        //     }
        // } else {
        //     startAnimToOn();
        //     if (onSwitch) {
        //         onSwitch(true);
        //     }
        // }
    };

    useEffect(() => {
        if (isSwitch === true) {
            startAnimToOn();
        } else {
            startAnimToOff();
        }
    }, [isSwitch])

    return (
        <Fragment>
            <TouchableOpacity style={{ height: 30, width: 60 }} activeOpacity={0.9} onPress={onPress} >
                <Animated.View style={[styles.mainStyes, {
                    backgroundColor: backgroundColorAnim
                }]} >
                    <Animated.Text
                        style={[
                            styles.eahcStyles,
                            {
                                opacity: initialOpacityOn,
                            },
                        ]}>
                        ON
                    </Animated.Text>
                    <Animated.Text
                        style={[
                            styles.eahcStylesOf,
                            {
                                opacity: initialOpacityOff,
                            },
                        ]}>
                        OFF
                    </Animated.Text>
                    <Animated.View style={[styles.basicStyle, {
                        transform: [{
                            translateX: positionInterPol
                        }]
                    }]} />
                </Animated.View>
            </TouchableOpacity>
        </Fragment>
    );
}

export default SwitchButton;

const styles = StyleSheet.create({
    basicStyle: {
        height: 20,
        width: 20,
        borderRadius: 20,
        backgroundColor: colors.common.white,
        marginTop: 5,
        marginLeft: 5,
    },
    eahcStyles: {
        fontSize: 10,
        color: colors.common.white,
        fontFamily: Fonts.PoppinsRegular,
        fontWeight: FontWeight.PoppinsRegular,
        position: 'absolute',
        top: 8,
        left: 8,
    },

    eahcStylesOf: {
        fontSize: 10,
        color: colors.common.white,
        fontFamily: Fonts.PoppinsRegular,
        fontWeight: FontWeight.PoppinsRegular,
        position: 'absolute',
        top: 8,
        right: 8,
    },
    mainStyes: {
        borderRadius: 30,
        backgroundColor: '#81b0ff',
        height: 30,
        width: 60,
    },

    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
