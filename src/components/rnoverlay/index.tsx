import { BlurView } from '@react-native-community/blur';
import React, { Fragment, useEffect, ReactNode } from 'react';
import { StyleSheet, View, BackHandler, StatusBar, Modal, } from 'react-native';
import { colors } from '../../theme/colors';

interface IRNOverlay {
    open: true | false,
    onRequestClose?: () => void,
    children?: ReactNode
}
const RNOverlay = ({ open, onRequestClose, children }: IRNOverlay) => {

    const backButtonHandler = React.useCallback(() => {
        if (open) {
            if (onRequestClose) {
                onRequestClose();
            }
            return true;
        }
        return false;
    }, [open, onRequestClose]);

    useEffect(() => {
        // BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
        // return () => {
        //     BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
        // };

        const subscription = BackHandler.addEventListener("hardwareBackPress", backButtonHandler);

        return () => {
            subscription.remove(); // ✅ Correct way to remove the listener
        };

    }, [backButtonHandler]);

    // useEffect(() => {
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    //         if (open) {
    //             if (onRequestClose) {
    //                 onRequestClose();
    //             } else {
    //                 navigation.goBack()
    //             }
    //         } else {
    //             navigation.goBack()
    //         }
    //         return true;
    //     });

    //     return () => backHandler.remove();
    // }, [onRequestClose]);

    if (!open) return
    return (
        <Fragment>
            <View
                style={[StyleSheet.absoluteFill]}
            >
                <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={1} />
                {children}
            </View>
        </Fragment>
    );
}

export default RNOverlay;
