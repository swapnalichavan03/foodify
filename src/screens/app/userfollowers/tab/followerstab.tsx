import React, { Fragment, memo, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native';
import { FollowUser, getfollowers } from '../../../../service';
import { QueryString } from '../../../../utils/querystring';
import Avatar from '../../../../components/avatar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Typography from '../../../../components/typography';
import { colors } from '../../../../theme/colors';
import moment from 'moment';
import { removeDuplicateObject } from '../../../../utils/removeduplicate';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../utils/linking';
import { useNavigation } from '@react-navigation/native';
import Toastmessage, { ToasterProps } from '../../../../components/toastmessage';
import Button from '../../../../components/button';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { RootState } from '../../../../store';
import { IFollowers, IUserfollowers } from "../userfollowers"

interface FollowersTab {
    _user: string,
}
type navigationProps = NativeStackNavigationProp<RootStackParamList, "profile/user/followers">
const FollowersTab = ({ _user }: FollowersTab) => {
    const navigation = useNavigation<navigationProps>()
    const insets = useSafeAreaInsets();
    const { profile } = useAppSelector((state: RootState) => state.userprofile)
    const [followers, setFollowers] = useState<IUserfollowers[]>([]);
    const [isLoading, setIsLoading] = useState<true | false>(false)
    const [totalPage, setTotalPage] = useState(0);
    const [onFollowing, setOnFollowing] = useState<string>("");
    const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
    const [pagination, setPagination] = useState<{ currentPage: number, pageSize: number, }>({
        currentPage: 1,
        pageSize: 20,
    });

    const _query = QueryString({
        ...pagination
    });

    useEffect(() => {
        if (_user) {
            setIsLoading(true);
            getfollowers(_user, _query)
                .then((response) => {
                    if (response.status === 200) {
                        if (!Array.isArray(response.data.data)) return
                        setFollowers([...removeduplicate, ...response.data.data])
                        setTotalPage(response?.data?.totalPage)
                    }
                })
                .catch((error) => {
                    console.log("error.getfollowers", error)
                })
                .finally(() => { setIsLoading(false); })
        }
    }, [_user, pagination.currentPage]);

    const onFollow = async (_user: string) => {
        setOnFollowing(_user);
        await FollowUser(_user as string)
            .then((response) => {
                if (response.status === 200) {
                    setFollowers((prev: IUserfollowers[] | []) => {
                        if (!prev) return prev
                        const findIndex = prev.findIndex((item: IUserfollowers) => item._id === _user)
                        const followersIndex = prev[findIndex].followers.findIndex((follower: IFollowers) => follower._user === profile?._id)
                        if (followersIndex === -1) {
                            prev[findIndex].followers.push({ _id: "" as string, _user: profile?._id as string })
                        } else {
                            prev[findIndex].followers = prev?.[findIndex].followers.filter((item: IFollowers) => item._user !== profile?._id)
                        }
                        return [...prev]
                    });
                    setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
                }
            })
            .catch((error) => {
                console.log(error)
                setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
            })
            .finally(() => {
                setOnFollowing("")
            })
    }

    const removeduplicate = removeDuplicateObject<IUserfollowers>(followers)
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
                data={Array.isArray([...removeduplicate]) ? [...removeduplicate] : []}
                renderItem={({ item }: { item: IUserfollowers }) => {
                    const isExit = item.followers.find((follower: IFollowers) => follower._user === profile?._id)

                    return (
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                                <Avatar onPress={() => { navigation.navigate({ name: "user/profile", params: { _user: item?._id } }) }} source={{ uri: item.assets.profileImage }} alt={item.customerName} width={45} height={45} />
                                <Pressable onPress={() => { navigation.navigate({ name: "user/profile", params: { _user: item?._id } }) }}>
                                    <Typography variant="SmallTextSemiBold">{item.customerName}</Typography>
                                    <Typography variant="SmallerTextSemiBold" color={colors.grey[400]}>{moment().format("ddd, DD MMM YYYY")}</Typography>
                                </Pressable>
                            </View>
                            {item._id !== profile?._id &&
                                <View style={{ width: 90 }}>
                                    <Button onPress={() => { onFollow(item?._id) }} isLoading={onFollowing === item._id} size="tab">
                                        {isExit ?
                                            "Following"
                                            :
                                            "Follow Back"
                                        }
                                    </Button>
                                </View>
                            }
                        </View>
                    )
                }}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingTop: 10, paddingBottom: insets.bottom || 20, }}
                ListFooterComponent={() => {
                    return (
                        isLoading &&
                        Array.from({ length: 1 }).map((_, index) => {
                            return (
                                <View key={index} style={{ paddingTop: 10, display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                                        <View style={{ height: 45, width: 45, backgroundColor: colors.grey[300], borderRadius: (45 / 2), alignItems: "center", justifyContent: "center" }}>
                                            <ActivityIndicator size={"small"} color={colors.primary.dark} />
                                        </View>
                                        <Pressable style={{ gap: 8 }}>
                                            <View style={{ height: 15, width: 100, borderRadius: (150 / 2), backgroundColor: colors.grey[300], }} />
                                            <View style={{ height: 10, width: 100, borderRadius: (150 / 2), backgroundColor: colors.grey[300], }} />
                                        </Pressable>
                                    </View>
                                    <View style={{ height: 33, width: 90, backgroundColor: colors.grey[300], borderRadius: 12 }} />
                                </View>
                            )
                        })
                    )
                }}
            />

            <Toastmessage
                message={toaster.message}
                visible={toaster.visible}
                variant={toaster.variant}
                // position={isKeyboardOpen ? "top" : "bottom"}
                onHide={setToaster}
            />
        </Fragment>
    );
}

export default memo(FollowersTab, (prevState, nextState) =>
    prevState._user === nextState._user
);
