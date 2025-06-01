import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/MaterialIcons" // error
import FontAwesome6 from "react-native-vector-icons/FontAwesome6" // circle-check // circle-info
import Octicons from "react-native-vector-icons/Octicons" // circle-check // circle-info
import Ionicons from "react-native-vector-icons/Ionicons" // warning
import { colors } from '../../theme/colors';
import Typography from '../typography';
import { hexToRgb } from '../../utils/hexToRgb';


type variantType = "success" | "error" | "warning" | "info"
type positionType = "top" | "bottom"
export interface ToasterProps {
    message?: string,
    duration?: number,
    variant?: variantType,
    position?: positionType,
    visible: true | false,
}
export interface TostMessageProps {
    message?: string,
    duration?: number,
    variant?: variantType,
    position?: positionType,
    visible: true | false,
    onHide: React.Dispatch<React.SetStateAction<ToasterProps>>,
}
const TostMessage = ({ message = "Can't process your request. Please try again later", variant = "success", position = "bottom", visible, duration = 4000, onHide }: TostMessageProps) => {
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(position === "bottom" ? 100 : -100)).current;

    const onToastHide = () => onHide((toaster) => ({ ...toaster, visible: false, variant: "success", message: "" }))
    useEffect(() => {
        if (visible) {
            // Slide-in animation
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Set a timer to hide the toast after the specified duration
            const hideTimeout = setTimeout(() => {
                // Slide-out animation
                Animated.timing(translateY, {
                    toValue: position === "bottom" ? -0 : -100, // -100
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    // Reset position after animation completes
                    translateY.setValue(position === "bottom" ? 100 : -100);
                    if (onToastHide) onToastHide();
                });
            }, duration);

            return () => clearTimeout(hideTimeout);
        }
    }, [visible, translateY, duration, onToastHide]);

    const iconcolor = {
        "success": colors.success.main,
        "error": colors.error.main,
        "warning": colors.warning.main,
        "info": colors.info.main,
    }
    const bgcolor = {
        "success": hexToRgb(colors.success.main, 0.30),
        "error": hexToRgb(colors.error.main, 0.30),
        "warning": hexToRgb(colors.warning.main, 0.30),
        "info": hexToRgb(colors.info.main, 0.30),
    }
    const messageicon = {
        "success": <Octicons name='check-circle-fill' size={20} color={iconcolor[variant]} />,
        "error": <MaterialIcons name='error' size={20} color={iconcolor[variant]} />,
        "warning": <Ionicons name='warning' size={20} color={iconcolor[variant]} />,
        "info": <FontAwesome6 name='circle-check' size={20} color={iconcolor[variant]} />,
    }

    if (!visible) {
        return null;
    }

    return (
        <Animated.View style={[{ backgroundColor: colors.grey[200] }, styles.toastContainer, { ...(position === "bottom" ? { bottom: insets.bottom || 20 } : { top: insets.top || 20 }), transform: [{ translateY }] }]}>
            <TouchableOpacity
                onPress={() => { if (onToastHide) onToastHide(); }}
                activeOpacity={0.90}
                style={[
                    { backgroundColor: bgcolor[variant], borderColor: bgcolor[variant], borderWidth: 1, borderStyle: "solid" },
                    { display: "flex", borderRadius: 10, paddingVertical: 10, paddingHorizontal: 15, flexDirection: "row", }
                ]}>
                <View style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                    {messageicon[variant]}
                    <Typography numberOfLines={3} variant="SmallTextRegular" color={iconcolor[variant]} styles={{ flex: 1 }}>{message || "Can't process your request. Please try again later"}</Typography>
                </View>
                {/* <TouchableOpacity activeOpacity={0.50}>
                    <AntDesign name='closecircleo' size={22} color={colors.common.white} />
                </TouchableOpacity> */}
            </TouchableOpacity>
        </Animated.View>
    );
}

export default memo(TostMessage, (prevProps, nextProps) =>
    prevProps.message === nextProps.message &&
    prevProps.duration === nextProps.duration &&
    prevProps.variant === nextProps.variant &&
    prevProps.position === nextProps.position &&
    prevProps.visible === nextProps.visible &&
    prevProps.onHide === nextProps.onHide
);

const styles = StyleSheet.create({
    toastContainer: {
        marginHorizontal: 20,
        position: 'absolute',
        borderRadius: 10,
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "row",
        gap: 20
    },
})
