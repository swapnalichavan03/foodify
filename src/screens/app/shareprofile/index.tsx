import { BlurView } from '@react-native-community/blur';
import React, { Fragment } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign"
import LinearGradient from 'react-native-linear-gradient';
import { hexToRgb } from '../../../utils/hexToRgb';
import { colors } from '../../../theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../utils/linking';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "profile/share">;
type RouteProps = RouteProp<RootStackParamList, "profile/share">;
const ShareProfile = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<RouteProps>();
    const insets = useSafeAreaInsets();

    return (
        <Fragment >
            <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
                <BlurView blurAmount={1} blurType="dark" style={StyleSheet.absoluteFill} />
                <LinearGradient colors={[hexToRgb('#000000', .3), hexToRgb('#000000', .9)]} style={StyleSheet.absoluteFill} />
                <View
                    style={{ display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 }}
                >
                    <TouchableOpacity onPress={() => { navigation.goBack() }} activeOpacity={0.60}>
                        <AntDesign name='close' color={colors.common.white} size={22} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.60}>
                        <AntDesign name='edit' color={colors.common.white} size={22} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginVertical: 10 }}>

                </View>


                <View style={{ height: 70, marginBottom: 10, }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={[1, 2, 3, 4, 5, 6, 6, 7, 89]}
                        renderItem={() => {
                            return (
                                <View style={{ width: 70, height: 70, borderRadius: (70 / 2), backgroundColor: colors.common.white }} />
                            )
                        }}
                        contentContainerStyle={{ height: 70, gap: 15, paddingHorizontal: 20, }}
                    />
                </View>
            </View>
        </Fragment>
    );
}

export default ShareProfile;
