import React, { Fragment } from 'react'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { RootStackParamList } from '../../utils/linking'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation, useRoute } from '@react-navigation/native'
import { colors } from '../../theme/colors'
import { homeactive, homeinactive, savedactive, savedinactive, notificationactive, notificationinactive, profileactive, profileinactive, } from "../../assets/icons/bottomtab"
import { SvgXml } from 'react-native-svg'
import { useAppSelector } from '../../hooks/useAppSelector'
import { RootState } from '../../store'

interface IBottomNavigation {
    isSaved?: false | true,
    isFavorite?: false | true,
    isUser?: false | true,
}
type navigationProps = NativeStackNavigationProp<RootStackParamList, "app/home">
const BottomNavigation = ({ isSaved, isFavorite, isUser }: IBottomNavigation) => {
    const route = useRoute();
    const navigation = useNavigation<navigationProps>();
    const insets = useSafeAreaInsets();
    const { profile } = useAppSelector((state: RootState) => state.userprofile)

    return (
        <Fragment>
            <View style={{ height: 60, backgroundColor: colors.common.white, display: "flex", flexDirection: "row", paddingHorizontal: 20, alignItems: "center", justifyContent: "space-between", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>
                <Pressable onPress={() => { navigation.navigate("app/home"); }} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", gap: 2 }} >
                    <SvgXml xml={route.name === "app/home" ? homeactive : homeinactive} />
                    <View style={{ alignItems: "center", justifyContent: "center", height: 4, width: 4, borderRadius: (4 / 2), backgroundColor: colors.common.transparent, }} />
                </Pressable>
                <Pressable onPress={() => { navigation.navigate("app/saved"); }} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", gap: 2 }} >
                    <SvgXml xml={route.name === "app/saved" ? savedactive : savedinactive} />
                    <View style={{ alignItems: "center", justifyContent: "center", height: 4, width: 4, borderRadius: (4 / 2), backgroundColor: !isSaved ? colors.common.transparent : colors.primary.main, }} />
                </Pressable>

                <Pressable onPress={() => { navigation.navigate({ name: "recipe/create", params: { _recipe: "new", _creator: profile?._id as string } }) }} style={{
                    height: 48,
                    width: 48,
                    borderRadius: (48 / 2),
                    backgroundColor: colors.primary.main,
                    alignItems: "center",
                    justifyContent: 'center',
                    position: "relative",
                    top: -24
                }} >
                    <AntDesign name='plus' size={20} color={colors.common.white} />
                </Pressable>

                {/* <Pressable onPress={() => { navigation.navigate("app/notification"); }} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", }} >
                    <SvgXml xml={route.name === "app/notification" ? notificationactive : notificationinactive} />
                </Pressable> */}

                <Pressable onPress={() => { navigation.navigate({ name: "app/favorite", params: { _user: profile?._id as string } }); }} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", gap: 2 }} >
                    <MaterialIcons name='favorite-border' size={24} color={route.name === "app/favorite" ? colors.primary.main : colors.neturalcolour.gray_4} />
                    <View style={{ alignItems: "center", justifyContent: "center", height: 4, width: 4, borderRadius: (4 / 2), backgroundColor: !isFavorite ? colors.common.transparent : colors.primary.main, }} />
                </Pressable>

                <Pressable onPress={() => { navigation.navigate({ name: "user/profile", params: { _user: profile?._id as string } }); }} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", gap: 2 }} >
                    <SvgXml xml={route.name === "user/profile" ? profileactive : profileinactive} />
                    <View style={{ alignItems: "center", justifyContent: "center", height: 4, width: 4, borderRadius: (4 / 2), backgroundColor: !isUser ? colors.common.transparent : colors.primary.main, }} />
                </Pressable>
            </View>
            <View style={{ height: insets.bottom || 0, backgroundColor: colors.common.white, }} />
        </Fragment>
    )
}

export default BottomNavigation
