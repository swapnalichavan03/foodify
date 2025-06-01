import React, { Fragment, useEffect, useState, Fragment as Tabs } from 'react'
import { ActivityIndicator, RefreshControl, FlatList, Pressable, TouchableOpacity, View, NativeSyntheticEvent, TextLayoutEventData, ScrollView, Alert } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import Octicons from "react-native-vector-icons/Octicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Feather from "react-native-vector-icons/Feather"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from '../../../theme/colors'
import Typography from '../../../components/typography'
import Button from '../../../components/button'
import { RootStackParamList } from '../../../utils/linking'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import BottomNavigation from '../../../components/bottomnavigation'
import { useAppSelector } from '../../../hooks/useAppSelector'
import Avatar from '../../../components/avatar'
import { deleterecipe, FollowUser, getrecipes, getuserprofile } from '../../../service'
import RNOverlay from '../../../components/rnoverlay'
import TostMessage, { ToasterProps } from '../../../components/toastmessage'
import { IFollowing, IProfile } from '../../../store/reducers/userprofile'
import { QueryString } from '../../../utils/querystring'
import { IRecipes } from './profile'
import { removeDuplicateObject } from '../../../utils/removeduplicate'
import RNImage from '../../../components/rnimage'
import { hexToRgb } from '../../../utils/hexToRgb'
import LinearGradient from 'react-native-linear-gradient'
import BottomSheet from '../../../components/bottomsheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "user/profile">;
type RouteProps = RouteProp<RootStackParamList, "user/profile">;
const Profile = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
  const [activeTab, setActoveTab] = useState<"Recipe" | "Videos" | "favourite">("Recipe");
  const [filterTab, setFilterTab] = useState<"all" | "draft" | "schedule">("all");
  const [refreshing, setRefreshing] = useState<true | false>(false);
  const { profile } = useAppSelector((state) => state.userprofile);
  const [user, setUser] = useState<IProfile | null>(profile);
  const [isLoading, setIsLoading] = useState<true | false>(true)
  const [onFollowing, setOnFollowing] = useState<true | false>(false);
  const [totalPage, setTotalPage] = useState(0);
  const [moreLoading, setMoreLoading] = useState<true | false>(false);
  const [recipes, setRecipes] = useState<IRecipes[]>([]);
  const [recipe, setRecipe] = useState<IRecipes | null>(null);
  const [deleteRecipe, setDeleteRecipe] = useState<{ name: string, _recipe: string, _creator: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState<true | false>(false)
  const [isExpanded, setIsExpanded] = useState<true | false>(false);
  const [showSeeMore, setShowSeeMore] = useState<true | false>(false);
  const [recipeSummary, setRecipeSummary] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPage: 0,
    numberOfData: 0,
    from: 0,
    to: 0
  });

  const onGetProfile = async () => {
    await getuserprofile(route?.params?._user)
      .then((response) => {
        if (response.status === 200) {
          setUser(response?.data?.profile)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => setIsLoading(false))
  }
  useEffect(() => {
    if (route?.params?._user) {
      onGetProfile()
    }
  }, [route])

  const onFollow = async () => {
    setOnFollowing(true)
    await FollowUser(user?._id as string)
      .then((response) => {
        if (response.status === 200) {
          setUser((prev: IProfile | null) => {
            if (!prev) return prev
            const findIndex = prev.followers.findIndex((item: IFollowing) => item._user === profile?._id)
            if (findIndex === -1) {
              prev.followers.push({ _id: "" as string, _user: profile?._id as string })
              prev.totalfollowers += 1
            } else {
              prev.followers = prev.followers.filter((item: IFollowing) => item._user !== profile?._id)
              prev.totalfollowers -= 1
            }
            return { ...prev }
          })
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        console.log(error)
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => {
        setOnFollowing(false)
      })
  }

  const _query = QueryString({
    currentPage: recipeSummary.currentPage,
    pageSize: recipeSummary.pageSize,
    _user: route?.params?._user,
    ...(activeTab === "favourite" ?
      { isLiked: true }
      :
      filterTab === "schedule" ? {
        isScheduleed: true
      } : {
        status: filterTab === "draft" ? "DRAFT" : "ALL"
      })
  });

  const onGetrecipe = async () => {
    if (route?.params?._user) {
      if (moreLoading) return
      setMoreLoading(true);
      await getrecipes(_query)
        .then((response) => {
          if (response?.status === 200) {
            if (!Array(response?.data?.data)) return
            setRecipes([...recipes, ...response?.data?.data]);
            setTotalPage(response?.data?.totalPage);
            setRecipeSummary({
              ...recipeSummary,
              currentPage: response?.data?.currentPage,
              pageSize: recipeSummary?.pageSize,
              totalPage: response?.data?.totalPage,
              numberOfData: response?.data?.numberOfData,
              from: response?.data?.from,
              to: response?.data?.to,
            })
          }
        })
        .catch((error) => {
          console.log("error.getreviewa", error)
        })
        .finally(() => { setMoreLoading(false) });
    }
  }

  useEffect(() => {
    if (route?.params?._user) {
      onGetrecipe()
    }
  }, [filterTab, activeTab, recipeSummary.currentPage, route?.params?._user]);

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {

    if (e.nativeEvent.lines.length > 3) {
      setShowSeeMore(true);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setIsLoading(true)
      onGetProfile()
      onGetrecipe()
      setRefreshing(false);
    }, 2000);
  }, []);


  const onDeleteRecipe = async () => {
    setIsDeleting(true)
    await deleterecipe(deleteRecipe?._recipe as string, deleteRecipe?._creator as string)
      .then((response) => {
        if (response.status === 200) {
          setUser((prev: IProfile | null) => {
            if (!prev) return prev
            prev.totalrecipes -= 1
            return { ...prev }
          })
          setRecipes((prev: IRecipes[]) => {
            const data = prev.filter((item: IRecipes) => item._id !== deleteRecipe?._recipe)
            prev = data
            return [...prev]
          })
          setDeleteRecipe(null)
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        console.log(error)
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => {
        setIsDeleting(false)
      })
  }

  const removeduplicate = removeDuplicateObject<IRecipes>(recipes)
  return (
    <Fragment>
      <FlatList
        refreshControl={
          <RefreshControl
            progressBackgroundColor={colors.grey[400]}
            tintColor={colors.grey[400]}
            colors={[colors.primary.main, colors.secondary.main, colors.success.main, colors.warning.main]}
            refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (!removeduplicate.length) return
          if (isLoading) return
          if (recipeSummary.currentPage === recipeSummary.totalPage) return
          setRecipeSummary({
            ...recipeSummary,
            currentPage: recipeSummary?.currentPage + 1,
            pageSize: recipeSummary?.pageSize,
            totalPage: recipeSummary?.totalPage,
            numberOfData: recipeSummary?.numberOfData,
            from: recipeSummary?.from,
            to: recipeSummary?.to,
          });
        }}
        ListHeaderComponent={() => {
          return (
            <Fragment>
              <View style={{ paddingVertical: 10, gap: 10 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
                  <Typography variant="MediumTextBold">{profile?.customerName}</Typography>
                  <TouchableOpacity onPress={() => { navigation.navigate("app/settings") }} activeOpacity={0.50}>
                    <Feather name='more-horizontal' size={25} color={colors.grey[800]} />
                  </TouchableOpacity>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20, justifyContent: "space-between" }}>
                  <Avatar source={{ uri: user?.assets?.profileImage }} alt={user?.customerName} resizeMode="cover" />

                  <View style={{ alignItems: "center" }}>
                    <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>Recipe</Typography>
                    <Typography variant="LargeTextBold">{user?.totalrecipes}</Typography>
                  </View>
                  <Pressable
                    onPress={() => { navigation.navigate({ name: "profile/user/followers", params: { totalfollowers: user?.totalfollowers as number, totalfollowing: user?.totalfollowing as number, tab: "followers", _user: user?._id as string, name: user?.customerName as string } }) }}
                    style={{ alignItems: "center" }}>
                    <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>Followers</Typography>
                    <Typography variant="LargeTextBold">{user?.totalfollowers}</Typography>
                  </Pressable>
                  <Pressable
                    onPress={() => { navigation.navigate({ name: "profile/user/followers", params: { totalfollowers: user?.totalfollowers as number, totalfollowing: user?.totalfollowing as number, tab: "following", _user: user?._id as string, name: user?.customerName as string } }) }}
                    style={{ alignItems: "center" }}>
                    <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>Following</Typography>
                    <Typography variant="LargeTextBold">{user?.totalfollowing}</Typography>
                  </Pressable>
                </View>
                <View style={{ gap: 10 }}>
                  <View>
                    <Typography variant="NormalTextBold">{user?.customerName}</Typography>
                    {user?.basic_info?.header && <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>{user?.basic_info.header}</Typography>}
                  </View>

                  {user?.basic_info?.description &&
                    <Typography onTextLayout={handleTextLayout} ellipsizeMode="clip" variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>
                      {user?.basic_info.description}
                      {/* <TouchableOpacity>
                        <Typography variant="SmallerTextRegular" color={colors.primary.main}>
                          more......
                        </Typography>
                      </TouchableOpacity> */}
                    </Typography>
                  }

                </View>

                {profile?._id !== user?._id &&
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20 }}>
                    <View style={{ flex: 1 }}>
                      <Button onPress={() => { onFollow() }} isLoading={onFollowing} size="tab" variant="contain">
                        {user?.followers?.find((item: IFollowing) => item._user === profile?._id) ?
                          "Following"
                          :
                          "Follow"
                        }
                      </Button>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button onPress={() => { navigation.navigate({ name: "people/conversation/room", params: { _people: "user" } }) }} size="tab" variant="outline">Message</Button>
                    </View>
                  </View>
                }

                {profile?._id === user?._id &&
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20 }}>
                    <View style={{ flex: 1 }}>
                      <Button onPress={() => { navigation.navigate({ name: "profile/details/update", params: { _user: user?._id as string, name: user?.customerName as string } }) }} isLoading={onFollowing} size="tab" variant="contain">
                        Edit Profile
                      </Button>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button onPress={() => { navigation.navigate({ name: "profile/share", params: { _user: user?._id as string, name: user?.customerName as string } }) }} size="tab" variant="outline">Share Profile</Button>
                    </View>
                  </View>
                }

                <Tabs>
                  <View style={{ marginVertical: 10, display: "flex", flexDirection: "row", alignItems: "center", }}>
                    <TouchableOpacity activeOpacity={.7} onPress={() => { setRecipes([]); setActoveTab("Recipe") }} style={{
                      height: 30,
                      flex: 1,
                      borderBottomWidth: 1.5,
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottomColor: activeTab === "Recipe" ? colors.primary.main : colors.common.transparent,
                    }}>
                      <Typography variant="SmallerTextBold" color={activeTab === "Recipe" ? colors.primary.main : colors.neturalcolour.gray_1}>Recipe's</Typography>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.7} onPress={() => { setRecipes([]); setActoveTab("Videos") }} style={{
                      height: 30,
                      flex: 1,
                      borderBottomWidth: 1.5,
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottomColor: activeTab === "Videos" ? colors.primary.main : colors.common.transparent,
                    }}>
                      <Typography variant="SmallerTextBold" color={activeTab === "Videos" ? colors.primary.main : colors.neturalcolour.gray_1}>Video's</Typography>
                    </TouchableOpacity>
                  </View>
                </Tabs>
              </View>
            </Fragment>
          )
        }}
        data={removeduplicate} //
        renderItem={({ item }: { item: IRecipes }) => {

          return (
            <Fragment>
              <TouchableOpacity
                onPress={() => {
                  if (activeTab === "Videos") return navigation.navigate({ name: "recipe/video/player", params: { _url: item?.video as string, _recipe: item?.recipename as string } })
                  else return navigation.navigate({ name: "recipe/details", params: { _recipe: item._id, _user: user?._id as string } })
                }}
                activeOpacity={0.90}
                style={{
                  height: 200,
                  backgroundColor: colors.grey[100],
                  borderRadius: 10,
                  overflow: "hidden"
                }}
              >
                {item.isScheduleed === true ?
                  <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 100, borderRadius: 20, height: 23, backgroundColor: colors.warning.light, right: 10, top: 10, position: "absolute" }}>
                    <Ionicons name={"time"} color={colors.warning.dark} size={12} />
                    <Typography variant="SmallerTextRegular" color={colors.text.primary}>
                      Scheduleed
                    </Typography>
                  </View>
                  :
                  item.status === "DRAFT" ?
                    <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 68, borderRadius: 20, height: 23, backgroundColor: colors.warning.light, right: 10, top: 10, position: "absolute" }}>
                      <AntDesign name={"copy1"} color={colors.warning.dark} size={12} />
                      <Typography variant="SmallerTextRegular" color={colors.text.primary}>
                        DRAFT
                      </Typography>
                    </View>
                    :
                    <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 45, borderRadius: 20, height: 23, backgroundColor: colors.warning.light, right: 10, top: 10, position: "absolute" }}>
                      <AntDesign name={"star"} color={colors.warning.dark} size={12} />
                      <Typography variant="SmallerTextRegular" color={colors.text.primary}>
                        {item.avgRating}
                      </Typography>
                    </View>
                }

                {activeTab === "Videos" &&
                  <Pressable onPress={() => { navigation.navigate({ name: "recipe/video/player", params: { _url: item?.video as string, _recipe: item?.recipename as string } }) }} style={{ alignSelf: "center", top: (130 / 2), alignItems: "center", justifyContent: "center", height: 48, width: 48, borderRadius: (48 / 2), backgroundColor: colors.common.white }}>
                    <FontAwesome6 name='play' color={colors.primary.main} size={20} />
                  </Pressable>
                }

                <RNImage source={{ uri: item.images[0].url }} resizeMode="cover" style={{ width: "100%", height: "100%" }} />

                <LinearGradient
                  colors={[hexToRgb(colors.common.black, .6), hexToRgb(colors.common.black, .4), hexToRgb(colors.common.black, .2), hexToRgb(colors.common.black, .1)]}
                  useAngle={true}
                  angle={0}
                  style={{ width: "100%", height: 200, position: "absolute", zIndex: 0 }}
                />
                <View style={{ width: "100%", bottom: 10, position: "absolute", paddingHorizontal: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <View style={{ gap: 5, flex: 1 }}>
                    <Typography numberOfLines={1} variant="SmallTextBold" color={colors.common.white}>
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
                  {item._creator._id === profile?._id &&
                    <Pressable onPress={() => { setRecipe(item) }} style={{ /* borderWidth: 1, borderStyle: "solid", borderColor: colors.common.white, */ width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" }}>
                      <Feather name='more-vertical' color={colors.common.white} size={18} />
                    </Pressable>
                  }
                </View>
              </TouchableOpacity>
            </Fragment>
          )
        }}
        ListFooterComponent={() => {
          return (
            moreLoading &&
            <View style={{ gap: 20 }}>
              {Array.from({ length: 1 }).map((_, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={.4}
                    style={{
                      height: 200,
                      backgroundColor: colors.grey[100],
                      borderRadius: 10,
                      overflow: "hidden"
                    }}
                  >
                    <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 45, borderRadius: 20, height: 23, backgroundColor: colors.grey[400], right: 10, top: 10, position: "absolute" }} />

                    <LinearGradient
                      colors={[hexToRgb(colors.common.black, .4), hexToRgb(colors.common.black, .2), hexToRgb(colors.common.black, .1), hexToRgb(colors.common.black, .1)]}
                      useAngle={true}
                      angle={0}
                      style={{ width: "100%", height: 200, position: "absolute", zIndex: 0 }}
                    />
                    <View style={{ width: "100%", bottom: 10, position: "absolute", paddingHorizontal: 10, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <View style={{ gap: 5, flex: 1 }}>
                        <View style={{ height: 8, backgroundColor: colors.grey[300], width: 100, borderRadius: 8 }} />
                        <View style={{ height: 7, backgroundColor: colors.grey[300], width: 70, borderRadius: 8 }} />
                      </View>
                      <Pressable style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.grey[300], alignItems: "center", justifyContent: "center" }}>

                      </Pressable>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          )
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20, gap: 20 }}
      />

      <RNOverlay open={isLoading}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size={"large"} color={colors.primary.main} />
        </View>
      </RNOverlay>

      <BottomNavigation isUser={profile?._id === user?._id} />
      <BottomSheet
        visible={Boolean(deleteRecipe)}
        onCancel={() => { setDeleteRecipe(null) }}
        title='Delete Recipe'
      >
        <View style={{ gap: 20, paddingHorizontal: 20, paddingTop: 10, paddingBottom: insets.bottom || 10, }}>
          <View>
            <Typography variant="MediumTextSemiBold">Are you sure?</Typography>
            <Typography variant="SmallTextRegular">You want to delete <Typography variant="SmallTextRegular" color={colors.error.main}>{deleteRecipe?.name}</Typography></Typography>
          </View>
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={{ flex: 1 / 2 }}>
              <Button onPress={() => { setDeleteRecipe(null) }} variant="text" size="small" color={colors.error.main}>No, Keep it.</Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button onPress={() => { onDeleteRecipe() }} isLoading={isDeleting} variant="contain" size="small" color={colors.error.main}>Yes, Delete</Button>
            </View>
          </View>
        </View>
      </BottomSheet>

      <BottomSheet
        visible={Boolean(recipe)}
        onCancel={() => { setRecipe(null) }}
        title='Recipe Actions'
      >
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingBottom: insets.bottom || 10, paddingTop: 10 }}>
          <TouchableOpacity
            onPress={() => { setDeleteRecipe({ name: recipe?.recipename as string, _recipe: recipe?._id as string, _creator: profile?._id as string }); setRecipe(null) }}
            style={{ paddingVertical: 10, display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <MaterialCommunityIcons name={"delete-empty"} size={20} color={colors.error.main} />
            <Typography variant="SmallTextSemiBold" color={colors.error.main}>Delete Recipe</Typography>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: colors.grey[300] }} />
          <TouchableOpacity
            onPress={() => { navigation.navigate({ name: "recipe/create", params: { _recipe: recipe?._id as string, _creator: profile?._id as string } }); setRecipe(null) }}
            style={{ paddingVertical: 10, display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}
          >
            <MaterialCommunityIcons name={"playlist-edit"} size={20} color={colors.primary.main} />
            <Typography variant="SmallTextSemiBold" color={colors.primary.main}>Edit Recipe</Typography>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>
      <TostMessage
        message={toaster.message}
        visible={toaster.visible}
        variant={toaster.variant}
        // position={isKeyboardOpen ? "top" : "bottom"}
        onHide={setToaster}
      />
    </Fragment>
  )
}

export default Profile