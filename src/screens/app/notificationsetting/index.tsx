import React, { useRef, Fragment, useState, useEffect } from 'react';
import { Animated, ScrollView, View } from 'react-native';
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import Header from '../../../components/header';
import SwitchButton from '../../../components/switchbutton';
import Typography from '../../../components/typography';
import { colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import { hexToRgb } from '../../../utils/hexToRgb';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setNotificationSound } from '../../../store/reducers/notificationsound';
import { RootState } from '../../../store';
import { StorageManager } from '../../../helpers/localstorage/StorageManager';

type navigationProp = NativeStackNavigationProp<RootStackParamList, "app/setting/notification">
const NotificationSetting = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<navigationProp>();
    const { notification } = useAppSelector((state: RootState) => state.notificationsound)
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();
    const [isOn, setIsOn] = useState<true | false>(true);


    useEffect(() => {
        if (isOn) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start()
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }
    }, [isOn]);

    const onNotification = () => {
        const data = {
            notification: {
                notification: !notification.notification,
                sound: {
                    recipe: {
                        notification: notification.sound.recipe.notification,
                        vibrate: notification.sound.recipe.vibrate,
                        sound: notification.sound.recipe.sound,
                    },
                    follower: {
                        notification: notification.sound.follower.notification,
                        vibrate: notification.sound.follower.notification,
                        sound: notification.sound.follower.sound,
                    }
                }
            }
        }
        dispatch(setNotificationSound({
            sound: data
        }))
        StorageManager.setNotificationSetting(data)
    };
    const onRecipeNotification = (isNotification: boolean, vibrate: boolean) => {
        const data = {
            notification: {
                notification: notification.notification,
                sound: {
                    recipe: {
                        notification: isNotification,
                        vibrate: vibrate,
                        sound: notification.sound.recipe.sound,
                    },
                    follower: {
                        notification: notification.sound.follower.notification,
                        vibrate: notification.sound.follower.notification,
                        sound: notification.sound.follower.sound,
                    }
                }
            }
        }
        dispatch(setNotificationSound({
            sound: data
        }))
        StorageManager.setNotificationSetting(data)
    };
    const onFolloerNotification = (isNotification: boolean, vibrate: boolean) => {
        const data = {
            notification: {
                notification: notification.notification,
                sound: {
                    recipe: {
                        notification: notification.sound.recipe.notification,
                        vibrate: notification.sound.recipe.notification,
                        sound: notification.sound.recipe.sound,
                    },
                    follower: {
                        notification: isNotification,
                        vibrate: vibrate,
                        sound: notification.sound.follower.sound,
                    }
                }
            }
        }
        dispatch(setNotificationSound({
            sound: data
        }))
        StorageManager.setNotificationSetting(data)
    };

    return (
        <Fragment>
            <Header
                isBack
                title='Notification Setting'
            />
            <ScrollView
                showsHorizontalScrollIndicator={false}
                style={{ backgroundColor: hexToRgb(colors.grey[300], .3) }}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: insets.bottom || 15, paddingHorizontal: 20 }}
            >
                <View style={{ gap: 10 }}>
                    <View style={{ alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row", gap: 10, borderRadius: 12, padding: 13, borderWidth: 1, borderStyle: "solid", borderColor: colors.grey[400], backgroundColor: colors.grey[100] }}>
                        <View style={{ alignItems: "flex-start", display: "flex", flexDirection: "row", gap: 8, }}>
                            <Entypo name='notification' size={22} color={colors.grey[700]} />
                            <Typography variant="SmallTextSemiBold">Notification</Typography>
                        </View>
                        <SwitchButton
                            isSwitch={notification?.notification}
                            onSwitch={() => { onNotification() }}
                        />
                    </View>

                    {notification.notification &&
                        <Animated.View style={[{ opacity: fadeAnim }, { gap: 15, borderRadius: 12, padding: 13, borderWidth: 1, borderStyle: "solid", borderColor: colors.grey[400], backgroundColor: colors.grey[100] }]}>
                            <View style={{ alignItems: "flex-start", justifyContent: "space-between", display: "flex", flexDirection: "row", gap: 10, }}>
                                <View style={{ flex: 1 }}>
                                    <Typography variant="SmallTextSemiBold">New Recipe</Typography>
                                    <Typography variant="SmallerTextRegular" color={colors.grey[500]}>Get notification from your followers and following.</Typography>
                                </View>
                                <SwitchButton
                                    isSwitch={notification.sound.recipe.notification}
                                    onSwitch={() => { onRecipeNotification(!notification.sound.recipe.notification, notification.sound.recipe.vibrate) }}
                                />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row", gap: 10, }}>
                                <View style={{ flex: 1 }}>
                                    <Typography variant="SmallTextSemiBold">Vibrate on notification</Typography>
                                </View>
                                <SwitchButton
                                    isSwitch={notification.sound.recipe.vibrate}
                                    onSwitch={() => { onRecipeNotification(notification.sound.recipe.notification, !notification.sound.recipe.vibrate) }}
                                />
                            </View>
                            <TouchableOpacity onPress={() => { navigation.navigate({ name: "aap/notification/sound", params: { notification: "Recipe" } }) }} activeOpacity={.50} style={{ alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row", gap: 10, }}>
                                <View style={{ flex: 1 }}>
                                    <Typography variant="SmallTextSemiBold">Notification Sound</Typography>
                                    <Typography variant="SmallerTextRegular" color={colors.grey[500]}>Playback</Typography>
                                </View>
                                <AntDesign name={"arrowright"} size={20} color={colors.grey[700]} />
                            </TouchableOpacity>

                            <View style={{}}>
                                <Typography variant="SmallerTextRegular" ellipsizeMode="clip" numberOfLines={1} color={colors.grey[400]}>
                                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                                    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                                </Typography>
                            </View>

                            <View style={{ alignItems: "flex-start", justifyContent: "space-between", display: "flex", flexDirection: "row", gap: 10, }}>
                                <View style={{ flex: 1 }}>
                                    <Typography variant="SmallTextSemiBold">New Follower</Typography>
                                    <Typography variant="SmallerTextRegular" color={colors.grey[500]}>Get notification from your followers and following.</Typography>
                                </View>
                                <SwitchButton
                                    isSwitch={notification.sound.follower.notification}
                                    onSwitch={() => { onFolloerNotification(!notification.sound.follower.notification, notification.sound.follower.vibrate) }}
                                />
                            </View>
                            <View style={{ alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row", gap: 10, }}>
                                <View style={{ flex: 1 }}>
                                    <Typography variant="SmallTextSemiBold">Vibrate on notification</Typography>
                                </View>
                                <SwitchButton
                                    isSwitch={notification.sound.follower.vibrate}
                                    onSwitch={() => { onFolloerNotification(notification.sound.follower.notification, !notification.sound.follower.vibrate) }}
                                />
                            </View>
                            <TouchableOpacity onPress={() => { navigation.navigate({ name: "aap/notification/sound", params: { notification: "Follower" } }) }} activeOpacity={.50} style={{ alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row", gap: 10, }}>
                                <View style={{ flex: 1 }}>
                                    <Typography variant="SmallTextSemiBold">Notification Sound</Typography>
                                    <Typography variant="SmallerTextRegular" color={colors.grey[500]}>Playback</Typography>
                                </View>
                                <AntDesign name={"arrowright"} size={20} color={colors.grey[700]} />
                            </TouchableOpacity>
                        </Animated.View>
                    }
                </View>
            </ScrollView>
        </Fragment>
    );
}

export default NotificationSetting;
