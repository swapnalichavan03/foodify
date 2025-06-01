import React, { Fragment, useState } from 'react';
import { BlurView } from '@react-native-community/blur';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign"
import LinearGradient from 'react-native-linear-gradient';
import { hexToRgb } from '../../../utils/hexToRgb';
import { colors } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, } from '@react-navigation/native';
import { RootStackParamList } from '../../../utils/linking';
import Button from '../../../components/button';
import Typography from '../../../components/typography';
import { StorageManager } from '../../../helpers/localstorage/StorageManager';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setIsSignIn } from '../../../store/reducers/appauth';
import Toastmessage, { ToasterProps } from '../../../components/toastmessage';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "profile/share">;
const Logout = () => {
    const insets = useSafeAreaInsets();
    const dispatch = useAppDispatch()
    const navigation = useNavigation<NavigationProps>();
    const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
    const [isLoading, setIsLoading] = useState(false)

    const onLogout = async () => {
        await StorageManager.appLogout()
            .then((response) => {
                setToaster({ ...toaster, visible: true, variant: "success", message: response.message, })
                setTimeout(() => {
                    dispatch(setIsSignIn({ isSignIn: false }))
                }, 1000);
            })
            .catch((error) => {
                setToaster({ ...toaster, visible: true, variant: "success", message: error.message, })
            })
            .finally(() => {
                setIsLoading(true)
            });
    }

    return (
        <Fragment >
            <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
                <BlurView blurAmount={1} blurType="dark" style={StyleSheet.absoluteFill} />
                <LinearGradient colors={[hexToRgb('#000000', .3), hexToRgb('#000000', .7)]} style={StyleSheet.absoluteFill} />
                <View
                    style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}
                >
                    <TouchableOpacity onPress={() => { navigation.goBack() }} activeOpacity={0.60}>
                        <AntDesign name='close' color={colors.common.white} size={22} />
                    </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: 20, flex: 1, marginVertical: 10, justifyContent: "space-between" }}>
                    <View style={{ paddingVertical: 10 }}>
                        <Typography variant="LargeTextSemiBold" color={colors.common.white}>Are you sure ?</Typography>
                        <Typography variant="MediumTextRegular" color={hexToRgb(colors.common.white, .9)}>You want to logout from foodify ?</Typography>
                    </View>

                    <View style={{ display: "flex", flexDirection: "row", gap: 10, }}>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => { navigation.goBack() }} variant="contain" size="medium" >
                                No, Stay login
                            </Button>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button onPress={() => { onLogout() }} isLoading={isLoading} variant="contain" size="medium" buttonColor={colors.error.main}>
                                Yes, Logout
                            </Button>
                        </View>
                    </View>
                </View>
            </View>

            <Toastmessage
                message={toaster.message}
                visible={toaster.visible}
                variant={toaster.variant}
                onHide={setToaster}
            />
        </Fragment>
    );
}

export default Logout;
