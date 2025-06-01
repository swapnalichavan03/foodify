import React, { useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    BackHandler,
    ViewStyle,
    StyleProp,
    StyleSheet,
    Modal,
    Dimensions,
    Pressable,
} from 'react-native';
import Overlay from '../overlay';
import Sheet from '../sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import AntDesign from "react-native-vector-icons/AntDesign"
import { colors } from '../../theme/colors';
import Typography from '../typography';

export interface ShareSheetProps {
    visible: boolean;
    onCancel: () => void;
    style?: StyleProp<ViewStyle>;
    overlayStyle?: StyleProp<ViewStyle>;
    title?: string,
    description?: string
}

const BottomSheet: React.FC<React.PropsWithChildren<ShareSheetProps>> = ({
    style = {},
    overlayStyle = {},
    visible,
    onCancel,
    children,
    title,
    description
}) => {
    const insets = useSafeAreaInsets();
    const backButtonHandler = React.useCallback(() => {
        if (visible) {
            onCancel();
            return true;
        }
        return false;
    }, [visible, onCancel]);

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

    if (!visible) return

    return (
        <React.Fragment>
            <Modal
                visible={visible}
                transparent
                statusBarTranslucent
            >
                <Overlay visible={visible}>
                    <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={1} />
                    <TouchableOpacity style={[styles.button]} onPress={onCancel} />
                    <Sheet visible={visible} onClose={onCancel}>
                        <View style={[styles.buttonContainer, style, { maxHeight: Dimensions.get("screen").height - insets.top - 40, }]}>
                            <View style={{ borderBottomColor: colors.grey[300], marginVertical: 5, borderBottomWidth: 1, borderStyle: "solid", paddingVertical: 1, paddingHorizontal: 15, justifyContent: "space-between", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <View>
                                    <Typography variant="MediumTextSemiBold">{title}</Typography>
                                    {description && <Typography variant="SmallTextRegular" color={colors.grey[400]}>{description}</Typography>}
                                </View>
                                <TouchableOpacity onPress={onCancel} activeOpacity={0.70} style={{ alignSelf: "center", alignItems: "center", justifyContent: "center", width: 35, height: 35, borderRadius: (35 / 2), marginVertical: 10, backgroundColor: colors.common.white }}>
                                    <AntDesign name="close" size={20} color={colors.grey[900]} />
                                </TouchableOpacity>
                            </View>
                            {children}
                        </View>
                    </Sheet>
                </Overlay>
            </Modal>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    actionSheetContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 0,
    },
    buttonContainer: {
        backgroundColor: colors.common.white,
        overflow: 'hidden',
        // paddingBottom: 40,
        // paddingTop: 5,
    },
    button: {
        flex: 1,
    },
});

export default BottomSheet;


// example-1
// import React, { useEffect, useCallback, useState } from 'react';
// import { View, TouchableOpacity, BackHandler, ViewStyle, StyleProp, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { BlurView } from '@react-native-community/blur';
// import Typography from '../typography';

// const DEFAULT_ANIMATE_TIME = 300;
// const DEFAULT_BOTTOM = -300; // Ensure this value matches the height of the bottom sheet

// export interface ShareSheetProps {
//     visible: boolean;
//     onCancel: () => void;
//     style?: StyleProp<ViewStyle>;
//     overlayStyle?: StyleProp<ViewStyle>;
// }

// const BottomSheet: React.FC<React.PropsWithChildren<ShareSheetProps>> = ({
//     style = {},
//     visible,
//     onCancel,
//     children,
// }) => {
//     const insets = useSafeAreaInsets();
//     const [fadeAnim] = useState(new Animated.Value(0));
//     const [bottom] = useState(new Animated.Value(DEFAULT_BOTTOM));
//     const [isRendered, setIsRendered] = useState(visible);

//     // Update overlay and bottom sheet animations
//     useEffect(() => {
//         if (visible) {
//             setIsRendered(true); // Ensure the bottom sheet is rendered before the animation starts
//             Animated.parallel([
//                 Animated.timing(fadeAnim, {
//                     toValue: 1,
//                     duration: DEFAULT_ANIMATE_TIME,
//                     useNativeDriver: false,
//                 }),
//                 Animated.timing(bottom, {
//                     toValue: 0,
//                     duration: DEFAULT_ANIMATE_TIME,
//                     useNativeDriver: false,
//                 }),
//             ]).start();
//         } else {
//             Animated.parallel([
//                 Animated.timing(fadeAnim, {
//                     toValue: 0,
//                     duration: DEFAULT_ANIMATE_TIME,
//                     useNativeDriver: false,
//                 }),
//                 Animated.timing(bottom, {
//                     toValue: DEFAULT_BOTTOM,
//                     duration: DEFAULT_ANIMATE_TIME,
//                     useNativeDriver: false,
//                 }),
//             ]).start(() => {
//                 setIsRendered(false); // Unmount the bottom sheet after the animation ends
//             });
//         }
//     }, [visible, fadeAnim, bottom]);

//     // Handle back button press
//     const backButtonHandler = useCallback(() => {
//         if (visible) {
//             onCancel();
//             return true;
//         }
//         return false;
//     }, [visible, onCancel]);

//     useEffect(() => {
//         BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
//         return () => {
//             BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
//         };
//     }, [backButtonHandler]);

//     if (!isRendered) {
//         return null; // Do not render anything if the bottom sheet is not visible
//     }

//     return (
//         <>
//             {/* Overlay */}
//             <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
//                 <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={1} />
//                 <TouchableOpacity style={styles.overlayTouchable} onPress={onCancel} />
//                 <Animated.View style={[styles.bottomSheet, { bottom }]}>
//                     <View style={{ maxHeight: Dimensions.get("screen").height - insets.top, }}>
//                         <View style={{backgroundColor: "#FFFFFF"}}>
//                         <ScrollView

//                         >
//                             <View>
//                                 <Typography variant="MediumTextRegular">
//                                     Prem Biswas
//                                 </Typography>
//                                 {Array.from({ length: 10 }).map((_, index) => {
//                                     return (
//                                         <Typography key={index} variant="MediumTextRegular">
//                                             Kapil Biswas
//                                         </Typography>
//                                     )
//                                 })}
//                                 <Typography variant="MediumTextRegular">
//                                     Govinda Biswas
//                                 </Typography>

//                             </View>
//                         </ScrollView>
//                         </View>
//                     </View>
//                 </Animated.View>
//             </Animated.View>

//             {/* Bottom Sheet */}
//             {/* <Animated.View style={[styles.bottomSheet, { bottom }]}>
//                 <View style={[styles.content, { marginTop: insets.top }, style]}>{children}</View>
//             </Animated.View> */}
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     overlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     },
//     overlayTouchable: {
//         flex: 1,
//     },
//     bottomSheet: {
//         position: 'absolute',
//         left: 0,
//         right: 0,
//     },
//     content: {
//         backgroundColor: 'white',
//         borderTopLeftRadius: 15,
//         borderTopRightRadius: 15,
//         overflow: 'hidden',
//     },
// });

// export default BottomSheet;


/// example 2
// import React, { useEffect, useCallback, useState } from 'react';
// import { View, TouchableOpacity, BackHandler, ViewStyle, StyleProp, StyleSheet, Animated } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { BlurView } from '@react-native-community/blur';

// const DEFAULT_ANIMATE_TIME = 300;
// const DEFAULT_BOTTOM = -300; // Ensure this value matches the height of the bottom sheet

// export interface ShareSheetProps {
//     visible: boolean;
//     onCancel: () => void;
//     style?: StyleProp<ViewStyle>;
//     overlayStyle?: StyleProp<ViewStyle>;
// }

// const BottomSheet: React.FC<React.PropsWithChildren<ShareSheetProps>> = ({
//     style = {},
//     visible,
//     onCancel,
//     children,
// }) => {
//     const insets = useSafeAreaInsets();
//     const [fadeAnim] = useState(new Animated.Value(0));
//     const [bottom] = useState(new Animated.Value(DEFAULT_BOTTOM));
//     const [isVisible, setIsVisible] = useState(visible);

//     // Synchronize `isVisible` with `visible`
//     useEffect(() => {
//         if (visible) {
//             setIsVisible(true);
//             Animated.parallel([
//                 Animated.timing(fadeAnim, {
//                     toValue: 1,
//                     duration: DEFAULT_ANIMATE_TIME,
//                     useNativeDriver: false,
//                 }),
//                 Animated.timing(bottom, {
//                     toValue: 0,
//                     duration: DEFAULT_ANIMATE_TIME,
//                     useNativeDriver: false,
//                 }),
//             ]).start();
//         } else {
//             Animated.parallel([
//                 Animated.timing(fadeAnim, {
//                     toValue: 0,
//                     duration: DEFAULT_ANIMATE_TIME,
//                     useNativeDriver: false,
//                 }),
//                 Animated.timing(bottom, {
//                     toValue: DEFAULT_BOTTOM,
//                     duration: DEFAULT_ANIMATE_TIME,
//                     useNativeDriver: false,
//                 }),
//             ]).start(() => setIsVisible(false)); // Hide after animation ends
//         }
//     }, [visible, fadeAnim, bottom]);

//     // Handle back button press
//     const backButtonHandler = useCallback(() => {
//         if (visible) {
//             onCancel();
//             return true;
//         }
//         return false;
//     }, [visible, onCancel]);

//     useEffect(() => {
//         BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
//         return () => {
//             BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
//         };
//     }, [backButtonHandler]);

//     // Render only when `isVisible` is true
//     if (!isVisible) return null;

//     return (
//         <>
//             {/* Overlay */}
//             <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
//                 <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />
//                 <TouchableOpacity style={styles.overlayTouchable} onPress={onCancel} />
//             </Animated.View>

//             {/* Bottom Sheet */}
//             <Animated.View style={[styles.bottomSheet, { bottom }]}>
//                 <View style={[styles.content, { marginTop: insets.top }, style]}>
//                     {children}
//                 </View>
//             </Animated.View>
//         </>
//     );
// };

// const styles = StyleSheet.create({
//     overlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//     },
//     overlayTouchable: {
//         flex: 1,
//     },
//     bottomSheet: {
//         position: 'absolute',
//         left: 0,
//         right: 0,
//     },
//     content: {
//         backgroundColor: 'white',
//         borderTopLeftRadius: 15,
//         borderTopRightRadius: 15,
//         overflow: 'hidden',
//     },
// });

// export default BottomSheet;

