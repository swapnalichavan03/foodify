import React, { Fragment, useEffect, useState } from 'react';
import BottomNavigation from '../../../components/bottomnavigation';
import { ActivityIndicator, FlatList, ImageBackground, RefreshControl, TouchableOpacity, View } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign"
import Octicons from "react-native-vector-icons/Octicons"
import { QueryString } from '../../../utils/querystring';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import { removeDuplicateObject } from '../../../utils/removeduplicate';
import { IRecipes } from './favorite';
import { getlikedrecipe, getrecipes } from '../../../service';
import { colors } from '../../../theme/colors';
import Typography from '../../../components/typography';
import { hexToRgb } from '../../../utils/hexToRgb';
import LinearGradient from 'react-native-linear-gradient';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "user/profile">;
type RouteProps = RouteProp<RootStackParamList, "user/profile">;
const Favorite = () => {
    const navigation = useNavigation<NavigationProps>();
    const { params } = useRoute<RouteProps>();
    const [refreshing, setRefreshing] = useState<true | false>(false);
    const [totalPage, setTotalPage] = useState(0);
    const [recipes, setRecipes] = useState<IRecipes[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState<{ currentPage: number, pageSize: number, }>({
        currentPage: 1,
        pageSize: 20,
    });

    const _query = QueryString({
        ...pagination,
    });

    const onGetrecipe = async () => {
        if (params?._user) {
            if (isLoading) return
            setIsLoading(true)
            await getlikedrecipe(_query)
                .then((response) => {
                    if (response?.status === 200) {
                        if (!Array(response?.data?.data)) return
                        setRecipes([...recipes, ...response?.data?.data])
                        setTotalPage(response?.data?.totalPage)
                    }
                })
                .catch((error) => {
                    console.log("error.getreviewa", error)
                })
                .finally(() => {
                    setIsLoading(false)
                });
        }
    }

    useEffect(() => {
        if (params?._user) {
            onGetrecipe()
        }
    }, [pagination.currentPage, params?._user]);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            onGetrecipe()
            setRefreshing(false);
        }, 2000);
    }, []);

    const removeduplicate = removeDuplicateObject<IRecipes>(recipes)
    return (
        <Fragment>
            <View style={{ paddingVertical: 10 }}>
                <Typography variant="MediumTextSemiBold" styles={{ textAlign: "center" }}>
                    Favorite
                </Typography>
            </View>

            <FlatList
                refreshControl={
                    <RefreshControl
                        progressBackgroundColor={colors.grey[400]}
                        tintColor={colors.grey[400]}
                        colors={[colors.primary.main, colors.secondary.main, colors.success.main, colors.warning.main]}
                        refreshing={refreshing} onRefresh={onRefresh} />
                }
                onEndReached={() => {
                    if (!recipes.length) return
                    if (isLoading) return
                    if (totalPage <= pagination.currentPage) return
                    setIsLoading(true)
                    setPagination({ ...pagination, currentPage: pagination.currentPage + 1, pageSize: pagination.pageSize })
                }}
                data={removeduplicate}
                renderItem={({ item }: { item: IRecipes }) => {

                    return (
                        <Fragment>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate({ name: "recipe/details", params: { _recipe: item._id, _user: item._creator._id as string } })
                            }}
                                activeOpacity={.4} style={{ height: 180, borderRadius: 10, overflow: "hidden" }}>
                                <ImageBackground source={{ uri: item.images[0].url }} resizeMode="cover" style={{ height: 180 }} >
                                    <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 45, borderRadius: 20, height: 23, backgroundColor: colors.warning.light, right: 10, top: 10, position: "absolute" }}>
                                        <AntDesign name={"star"} color={colors.warning.dark} size={12} />
                                        <Typography variant="SmallerTextRegular" color={colors.text.primary}>
                                            {item.avgRating}
                                        </Typography>
                                    </View>

                                    <LinearGradient
                                        colors={[hexToRgb(colors.common.black, .6), hexToRgb(colors.common.black, .4), hexToRgb(colors.common.black, .2), hexToRgb(colors.common.black, .1)]}
                                        useAngle={true}
                                        angle={0}
                                        style={{ width: "100%", height: 200, position: "absolute", zIndex: 0 }}
                                    />
                                    <View style={{ gap: 5, bottom: 10, position: "absolute", paddingHorizontal: 10 }}>
                                        <Typography numberOfLines={2} variant="SmallTextBold" color={colors.common.white}>
                                            {item?.recipename}
                                        </Typography>
                                        <View style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                <Octicons name='stopwatch' color={colors.common.white} />
                                                <Typography variant="SmallerTextRegular" color={colors.common.white}>
                                                    {item?.preparingTime?.HH !== 0 && `${item?.preparingTime?.HH}:`}{item?.preparingTime?.MM} {item?.preparingTime?.MM as number > 9 ? "mins" : "min"}
                                                </Typography>
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </Fragment>
                    )
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20, gap: 20 }}
                ListFooterComponent={() => {
                    return (
                        isLoading &&
                        <View style={{ gap: 20 }}>
                            {Array.from({ length: 1 }).map((_, index) => {
                                return (
                                    <TouchableOpacity key={index} activeOpacity={.4} style={{ height: 180, borderRadius: 10, overflow: "hidden", alignItems: "center", justifyContent: "center", backgroundColor: colors.grey[100] }}>
                                        <ActivityIndicator size={"large"} color={colors.primary.dark} />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    )
                }}
            />
            <BottomNavigation />
        </Fragment>
    );
}

export default Favorite;
