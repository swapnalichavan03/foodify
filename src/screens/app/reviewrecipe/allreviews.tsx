import React, { Fragment, useEffect, Dispatch, SetStateAction, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Typography from '../../../components/typography'
import { colors } from '../../../theme/colors'
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import moment from 'moment'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../../utils/linking'
import { deletereview, getreviews, } from '../../../service'
import { QueryString } from '../../../utils/querystring'
import { IReviewrecipe } from './reviewrecipe'
import Avatar from '../../../components/avatar'
import { ToasterProps } from '../../../components/toastmessage'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import BottomSheet from '../../../components/bottomsheet'
import ReviewAction from './reviewaction'
import ReviewLike from './reviewlike'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { removeDuplicateObject } from '../../../utils/removeduplicate'
import ImagePreview from '../../../components/imagepreview'
import { setReviewImage, setUpdateImage } from '../../../store/reducers/recipereview'
import { Image } from 'react-native'
import { useAppDispatch } from '../../../hooks/useAppDispatch'

interface IAllReviews {
    reviews: IReviewrecipe[],
    setReviews: Dispatch<SetStateAction<IReviewrecipe[]>>,
    toaster: ToasterProps,
    setToaster: Dispatch<SetStateAction<ToasterProps>>,
    openMenu: { review: string, _recipe: string, _review: string, images: { url: string, _id: string }[] } | null,
    setInputValue: Dispatch<SetStateAction<string>>,
    setOpenMenu: Dispatch<SetStateAction<{ review: string, _recipe: string, _review: string, images: { url: string, _id: string }[] } | null>>,
    setSelectedReview: Dispatch<SetStateAction<{ _recipe: string, _review: string, } | null>>,
}
type navigationProps = NativeStackNavigationProp<RootStackParamList, "review/recipe">;
type RouteProps = RouteProp<RootStackParamList, "review/recipe">;
const AllReviews = ({ reviews = [], setReviews, toaster, setToaster, openMenu, setOpenMenu, setInputValue, setSelectedReview, }: IAllReviews) => {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<navigationProps>();
    const params = useRoute<RouteProps>();
    const { profile } = useSelector((state: RootState) => state.userprofile);
    const [isLoading, setIsLoading] = useState<true | false>(false);
    const [totalPage, setTotalPage] = useState(0);
    const [isPreview, setIsPreview] = useState<IReviewrecipe | null>(null);
    const [pagination, setPagination] = useState<{ currentPage: number, pageSize: number, }>({
        currentPage: 1,
        pageSize: 7,
    });

    const _query = QueryString({
        ...pagination
    });

    useEffect(() => {
        (async () => {
            if (isLoading) return;
            setIsLoading(true)
            await getreviews(params.params?._recipe, params.params?._user, _query)
                .then((response) => {
                    if (response?.status === 200) {
                        if (!Array(response?.data?.data)) return
                        setReviews([...reviews, ...response?.data?.data])
                        setTotalPage(response?.data?.totalPage)
                    }
                })
                .catch((error) => {
                    console.log("error.getreviewa", error)
                })
                .finally(() => { setIsLoading(false) })
        })()
    }, [pagination.currentPage]);

    const onDeleteReview = async ({ _recipe, _review }: { _recipe: string, _review: string }) => {
        setIsLoading(true)
        await deletereview(_recipe, _review)
            .then((response) => {
                if (response.status === 200) {
                    setReviews((prev: IReviewrecipe[]) => {
                        prev = prev.filter((item: IReviewrecipe) => item._id !== _review)
                        return [...prev]
                    })
                    setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
                    setOpenMenu(null)
                }
            })
            .catch((error) => {
                setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
            })
            .finally(() => { setIsLoading(false); })
    }

    const parseBoldText = (input: string) => {
        const lines = input.split('\n');
        return lines.map((line, index) => {
            if (line.startsWith('**') && line.endsWith('**')) {
                return (
                    <Typography key={index} variant="SmallerTextBold">
                        {line.replace(/\*\*/g, '')}
                    </Typography>
                );
            }
            // <Text style={{lineHeight:  0 }}></Text>
            return <Typography key={index} variant="SmallerTextRegular">{line}</Typography>;
        });
    };

    const removeduplicate = removeDuplicateObject<IReviewrecipe>(reviews);
    return (
        <Fragment>
            <FlatList
                onEndReached={() => {
                    if (!removeduplicate.length) return
                    if (isLoading) return
                    if (totalPage <= pagination.currentPage) return
                    setIsLoading(true)
                    setPagination({ ...pagination, currentPage: pagination.currentPage + 1, pageSize: pagination.pageSize })
                }}
                data={Array.isArray(removeduplicate) ? removeduplicate : []}
                renderItem={({ item }: { item: IReviewrecipe }) => {

                    return (
                        <View style={{ gap: 10 }}>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 15 }}>
                                <Pressable onPress={() => { navigation.navigate({ name: "user/profile", params: { _user: item?._creator?._id as string } }); }}>
                                    <Avatar source={{ uri: item._creator.assets.profileImage }} alt={item._creator.customerName} resizeMode="cover" height={31} width={31} />
                                </Pressable>
                                <View style={{ flex: 1 }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
                                        <TouchableOpacity onPress={() => navigation.navigate({ name: "user/profile", params: { _user: item?._creator?._id as string } })} activeOpacity={.60} style={{ flex: 1 }}>
                                            <Typography variant="SmallerTextBold">{item._creator.customerName}</Typography>
                                        </TouchableOpacity>
                                        {item._creator._id === profile?._id &&
                                            <ReviewAction
                                                setOpenMenu={setOpenMenu}
                                                item={item}
                                            />
                                        }
                                    </View>
                                    <Typography variant="SmallerTextSemiBold" color={colors.neturalcolour.gray_3}>{moment(item.createdAt).format("MMMM DD, YYYY - hh:mm A")}</Typography>
                                </View>
                            </View>
                            {/* <Typography variant="SmallerTextRegular">{item.review}</Typography> */}
                            {parseBoldText(item.review)}

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ gap: 5 }}
                            >
                                {Array.isArray(item?.images) && item?.images.length !== 0 && item?.images?.map((image, index) => {
                                    return (
                                        <Pressable key={index} onPress={() => { setIsPreview(item) }} style={{ backgroundColor: colors.grey[300], width: 40, height: 40, borderRadius: 8, overflow: "hidden" }}>
                                            <Image source={{ uri: image.url }} resizeMode="cover" style={{ width: "100%", height: "100%" }} />
                                        </Pressable>
                                    )
                                })}
                            </ScrollView>

                            <ReviewLike
                                setReviews={setReviews}
                                item={item}
                                toaster={toaster}
                                setToaster={setToaster}
                            />
                        </View>
                    )
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom || 10, paddingTop: 10 }}
                ItemSeparatorComponent={() => (
                    <View style={{ marginVertical: 20, height: .5, backgroundColor: colors.neturalcolour.gray_3 }} />
                )}
                ListFooterComponent={() => {
                    return (
                        isLoading &&
                        <View style={{ gap: 10, paddingTop: 10 }}>
                            {Array.from({ length: 1 }).map((_, index) => {
                                return (
                                    <View key={index} style={{ paddingVertical: 20, gap: 10, borderTopColor: colors.neturalcolour.gray_3, borderTopWidth: .5, borderStyle: "solid" }}>
                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 15 }}>
                                            <Pressable style={{ backgroundColor: colors.grey[300], width: 31, height: 31, alignItems: "center", justifyContent: "center", borderRadius: (31 / 2) }}>
                                                <ActivityIndicator size={"small"} color={colors.primary.dark} />
                                            </Pressable>
                                            <View style={{ flex: 1, gap: 5 }}>
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                    <View style={{ width: 100, height: 8, borderRadius: 8, backgroundColor: colors.grey[300], }} />
                                                    <View style={{ width: 25, height: 8, borderRadius: 8, backgroundColor: colors.grey[300] }} />
                                                </View>
                                                <View style={{ width: 140, height: 8, borderRadius: 8, backgroundColor: colors.grey[300] }} />
                                            </View>
                                        </View>

                                        <View style={{ height: 10, borderRadius: 3, width: 100 }} />

                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ gap: 5 }}
                                        >
                                            {Array.from({ length: 5 })?.map((_, index) => {
                                                return (
                                                    <Pressable key={index} style={{ backgroundColor: colors.grey[300], width: 40, height: 40, borderRadius: 8, overflow: "hidden" }} />
                                                )
                                            })}
                                        </ScrollView>

                                        <View style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: 10 }}>
                                            <View style={{ width: 55, height: 28, borderRadius: (28/2), backgroundColor: colors.grey[300] }} />
                                            <View style={{ width: 55, height: 28, borderRadius: (28/2), backgroundColor: colors.grey[300] }} />
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    )
                }}
            />

            <BottomSheet title='Action' description='Edit, Delete' visible={Boolean(openMenu)} onCancel={() => setOpenMenu(null)}>
                <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom, paddingTop: 10 }}>
                    <TouchableOpacity
                        onPress={() => {
                            setInputValue(openMenu?.review as string);
                            dispatch(setUpdateImage({
                                images: openMenu?.images || []
                            }))
                            setSelectedReview(openMenu);
                            setOpenMenu(null)
                        }}
                        activeOpacity={0.5} style={{ height: 40, display: "flex", flexDirection: "row", gap: 15, alignItems: "center" }}>
                        <AntDesign name={"edit"} size={20} />
                        <Typography variant="SmallTextRegular">Update Review</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { onDeleteReview({ _recipe: openMenu?._recipe as string, _review: openMenu?._review as string }) }} activeOpacity={0.5} style={{ height: 40, display: "flex", flexDirection: "row", gap: 15, alignItems: "center" }}>
                        {isLoading ?
                            <ActivityIndicator size={"small"} color={colors.error.main} />
                            :
                            <MaterialCommunityIcons name={"delete-outline"} size={20} color={colors.error.main} />
                        }
                        <Typography variant="SmallTextRegular" color={colors.error.main}>Delete Review </Typography>
                    </TouchableOpacity>
                </View>
            </BottomSheet>

            <ImagePreview
                images={isPreview?.images.map((image, _) => ({
                    "url": image.url as string,
                    "_id": ""
                })) || []}
                visible={Boolean(isPreview)}
                onRequestClose={() => {
                    setIsPreview(null);
                }}
            />

        </Fragment>
    );
}

export default AllReviews;
