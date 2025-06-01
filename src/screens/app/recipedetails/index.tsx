import React, { Fragment, useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Octicons from "react-native-vector-icons/Octicons"
import Feather from "react-native-vector-icons/Feather"
import FontAwesome6 from "react-native-vector-icons/FontAwesome6"
import { colors } from '../../../theme/colors'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { RootStackParamList } from '../../../utils/linking'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Typography from '../../../components/typography'
import { SvgXml } from 'react-native-svg'
import { savedactive, savedinactive } from '../../../assets/icons/bottomtab'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../../../components/button';
import { BlurView } from '@react-native-community/blur'
import { ratingstaricon, reviewicon, shareicon, unsaveicon } from '../../../assets/icons/recipedetails'
import { dislikerecipe, FollowUser, getrecipe, likerecipe, saverecipe, unsaverecipe } from '../../../service'
import { IAppliances, IFollowing, IImagesProps, ILikes, ingredientsProps, instructionsProps, IRatings, ISaves, recipedetailsProps } from './recipedetails'
import Avatar from '../../../components/avatar'
import { useAppSelector } from '../../../hooks/useAppSelector'
import TostMessage, { ToasterProps } from '../../../components/toastmessage'
import { hexToRgb } from '../../../utils/hexToRgb'
import RNImage from '../../../components/rnimage'
import { RootState } from '../../../store'
import LinearGradient from 'react-native-linear-gradient'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { setRecipeDetails } from '../../../store/reducers/recipe'
import branch, { BranchEvent, BranchParams } from 'react-native-branch';
import EncryptedStorage from 'react-native-encrypted-storage';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/details">;
type RouteProps = RouteProp<RootStackParamList, "recipe/details">;
const RecipeDetails = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProps>();
  const params = useRoute<RouteProps>();
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"Ingrident" | "Procedure">("Ingrident")
  const [onMenu, setOnMenu] = useState<true | false>(false);
  const [recipe, setRecipe] = useState<recipedetailsProps | null>(null)
  const { profile } = useAppSelector((state: RootState) => state.userprofile);
  const [onSaving, setOnSaving] = useState<string>("");
  const [isLike, setIsLike] = useState<string>("");
  const [onFollowing, setOnFollowing] = useState<true | false>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true)

  // const onShare = async () => {
  //   try {
  //     // setOnMenu(!onMenu)
  //     const result = await Share.share({
  //       title: "Share",
  //       message:
  //         'React Native | A framework for building native apps using React',
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //       } else {
  //         // shared
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //     }
  //   } catch (error: any) {
  //     Alert.alert(error.message);
  //   }
  // }

  const onShare = async ({ _recipe, _creator }) => {
    try {
      const linkProperties = { feature: "sharing" };
      const controlParams = { $desktop_url: "https://foodify-server-kappa.vercel.app/" };
      const shareOptions = { messageHeader: "Delicious Recipe", messageBody: "Try out this amazing recipe!", };

      const branchUniversalObject = await branch.createBranchUniversalObject(`/recipe/details/${_recipe}/${_creator}`,
        {
          // title: "Delicious Recipe",
          // contentDescription: "Try out this amazing recipe!",
          // contentMetadata: {
          //   customMetadata: {
          //     recipeId: "67b73342dde19c8aa60928af",
          //     userId: "67b72d77d6994c02f236825a",
          //   },
          // },
        }
      )

      try {
        let { channel, completed, error } = await branchUniversalObject.showShareSheet(
          shareOptions,
          linkProperties,
          controlParams,
        );
        if (error) {
          console.error('Error sharing via Branch: ' + error);
          return;
        }
        console.log('Share to ' + channel + ' completed: ' + completed);
        await EncryptedStorage.getItem("BranchError")
      } catch (error) {
        console.error('Error sharing via Branch: ' + error);
      }

      // const { url } = await branchUniversalObject.generateShortUrl(linkProperties, controlParams);
      // console.log("Generated Branch URL:", url); // ✅ Check if you get a URL

      // const params = {
      //   transaction_id: 'tras_Id_1232343434',
      //   currency: 'USD',
      //   revenue: 180.2,
      //   shipping: 10.5,
      //   tax: 13.5,
      //   coupon: 'promo-1234',
      //   affiliation: 'high_fi',
      //   description: 'Preferred purchase',
      //   purchase_loc: 'Palo Alto',
      //   store_pickup: 'unavailable',
      //   custom_data: {
      //     Custom_Event_Property_Key1: 'Custom_Event_Property_val1',
      //     Custom_Event_Property_Key2: 'Custom_Event_Property_val2',
      //   },
      // };
      // const event = new BranchEvent(BranchEvent.ViewItem, [branchUniversalObject], params);
      // await event.logEvent();
      // console.log('Branch event logged successfully');
    } catch (error) {
      console.log("getrecipe.error", error)
    }




    // await branchUniversalObject.generateShortUrl(linkProperties, controlParams)
    // .then((response) => {
    //   console.log("response.onShare", response)
    // })
    // .catch((error) => {
    //   console.log("error.onShare", error)
    // })
  }

  useEffect(() => {
    (async () => {
      await getrecipe(params?.params?._recipe, params.params._user)
        .then((response) => {
          if (response.status === 200) {
            if (!Array.isArray(response.data.recipe) && response.data.recipe.lenght === 0) return
            setRecipe(response.data.recipe)
          }
        })
        .catch((error) => {
          console.log("getrecipe.error", error)
        })
        .finally(() => { setIsLoading(false) })
    })()
  }, []);

  const onSave = async ({ _recipe, _user }: { _recipe: string, _user: string }) => {
    await saverecipe(_recipe, _user)
      .then((response) => {
        if (response.status === 200) {
          setRecipe((prev: recipedetailsProps | null) => {
            if (!prev) return prev;
            return {
              ...prev,
              saves: [...prev.saves, { _user: response?.data?.data?._user as string }]
            };
          })
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.save", error)
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => setOnSaving(""))
  };

  const onUnSave = async ({ _recipe, _user }: { _recipe: string, _user: string }) => {
    await unsaverecipe(_recipe, _user)
      .then((response) => {
        if (response.status === 200) {
          setRecipe((prev: recipedetailsProps | null) => {
            if (!prev) return prev;
            return {
              ...prev,
              saves: prev.saves.filter((item: ISaves) => item?._user !== response?.data?.data?._user)
            };
          })
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.unsave", error?.response?.data)
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => setOnSaving(""))
  };

  const onScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get("screen").width);
    setCurrentPage(page); // Update the current page
  };

  const onFollow = async () => {
    setOnFollowing(true)
    await FollowUser(recipe?._creator._id as string)
      .then((response) => {
        if (response.status === 200) {
          setRecipe((prev: recipedetailsProps | null) => {
            if (!prev) return prev
            const findIndex = prev?._creator.followers.findIndex((item: IFollowing) => item._user === profile?._id)
            if (findIndex === -1) {
              prev?._creator.followers.push({ _id: "" as string, _user: profile?._id as string })
              prev._creator.totalfollowers += 1
            } else {
              prev._creator.followers = prev?._creator.followers.filter((item: IFollowing) => item._user !== profile?._id)
              prev._creator.totalfollowers -= 1
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

  const onLike = async ({ _recipe, _user }: { _recipe: string, _user: string }) => {
    await likerecipe(_recipe, _user)
      .then((response) => {
        if (response.status === 200) {
          setRecipe((prev: recipedetailsProps | null) => {
            if (!prev) return prev;
            return {
              ...prev,
              likes: [...prev.likes, { _user: response?.data?.data?._user as string }]
            };
          })
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.save", error)
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => setIsLike(""))
  }

  const onDislike = async ({ _recipe, _user }: { _recipe: string, _user: string }) => {
    await dislikerecipe(_recipe, _user)
      .then((response) => {
        if (response.status === 200) {
          setRecipe((prev: recipedetailsProps | null) => {
            if (!prev) return prev;
            return {
              ...prev,
              likes: prev.saves.filter((item: ISaves) => item?._user !== response?.data?.data?._user)
            };
          })
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.unsave", error?.response?.data)
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => setIsLike(""))
  }

  return (
    <Fragment>
      <View style={{ paddingVertical: 0, paddingHorizontal: 20, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.5}>
          <Ionicons name='arrow-back' color={colors.text.primary} size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setOnMenu(!onMenu) }} activeOpacity={0.5}>
          <Feather name='more-horizontal' color={colors.text.primary} size={25} />
        </TouchableOpacity>
      </View>

      {isLoading ?
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
          <ActivityIndicator size={"large"} color={colors.primary.dark} />
        </View>
        :
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, /* paddingHorizontal: 20, */ paddingTop: 10, paddingBottom: insets.bottom || 10 }}>
          <View>
            <View style={{ width: Dimensions.get("screen").width, height: 220, }}>
              <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 45, borderRadius: 20, height: 23, backgroundColor: hexToRgb(colors.warning.light, .8), right: 10, top: 10, position: "absolute" }}>
                <AntDesign name="star" color={colors.warning.dark} size={12} />
                <Typography variant="SmallerTextRegular" color={colors.text.primary}>
                  {
                    recipe?.ratings?.find((item: IRatings) => item?._user === profile?._id) ?
                      recipe?.ratings?.find((item: IRatings) => item?._user === profile?._id)?._ratings
                      :
                      recipe?.avgRating?.toFixed(1)
                  }
                </Typography>
              </View>

              {activeTab === "Procedure" &&
                <Pressable onPress={() => { navigation.navigate({ name: "recipe/video/player", params: { _url: recipe?.video as string, _recipe: recipe?.recipename as string } }) }} style={{ position: 'absolute', zIndex: 999, alignSelf: "center", top: (130 / 2), alignItems: "center", justifyContent: "center", height: 48, width: 48, borderRadius: (48 / 2), backgroundColor: colors.common.white }}>
                  <FontAwesome6 name='play' color={colors.primary.main} size={20} />
                </Pressable>
              }

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={recipe?.images.length !== 1}
                pagingEnabled={true}
                onScroll={onScroll}
                scrollEventThrottle={16}
              >
                {recipe?.images?.map((value: IImagesProps, index: number) => {
                  return (
                    <View key={index} style={{ width: Dimensions.get("screen").width, height: 220, borderRadius: 0, overflow: "hidden" }}>
                      <RNImage source={{ uri: value.url }} />
                    </View>
                  )
                })}
              </ScrollView>

              <LinearGradient
                pointerEvents="none"
                // colors={[hexToRgb(colors.common.black, .8), hexToRgb(colors.common.black, 0), hexToRgb(colors.common.black, 0), hexToRgb(colors.common.black, 0)]}
                colors={[hexToRgb(colors.common.black, .4), hexToRgb(colors.common.black, .2), hexToRgb(colors.common.black, .1), hexToRgb(colors.common.black, .1)]}
                useAngle={true}
                angle={0}
                style={{ width: Dimensions.get("screen").width, height: 220, position: "absolute", zIndex: 0 }}
              />
              <View style={{ width: '100%', display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5, bottom: 10, position: "absolute", zIndex: -0, paddingHorizontal: 10 }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <TouchableOpacity onPress={() => {
                    setOnSaving(recipe?._id as string)
                    recipe?.saves?.find((item: ISaves) => item?._user === profile?._id) ?
                      onUnSave({ _recipe: recipe?._id as string, _user: recipe?._creator._id as string })
                      :
                      onSave({ _recipe: recipe?._id as string, _user: recipe?._creator._id as string })
                  }}

                    activeOpacity={.5} style={{ backgroundColor: colors.common.white, width: 32, height: 32, borderRadius: (32 / 2), alignItems: "center", justifyContent: "center" }}>
                    {Boolean(onSaving) ?
                      <ActivityIndicator size={"small"} color={colors.primary.main} />
                      :
                      <SvgXml xml={
                        recipe?.saves?.find((item: ISaves) => item?._user === profile?._id) ?
                          savedactive
                          :
                          savedinactive
                      } />
                    }
                  </TouchableOpacity>

                  <Octicons name='stopwatch' color={colors.common.white} />
                  <Typography variant="SmallerTextRegular" color={colors.common.white}>
                    {recipe?.preparingTime?.HH !== 0 && `${recipe?.preparingTime?.HH}:`}{recipe?.preparingTime?.MM} {recipe?.preparingTime?.MM as number > 9 ? "mins" : "min"}
                  </Typography>
                </View>

                <TouchableOpacity onPress={() => {
                  setIsLike(recipe?._id as string)
                  recipe?.likes?.find((item: ISaves) => item?._user === profile?._id) ?
                    onDislike({ _recipe: recipe?._id as string, _user: recipe?._creator._id as string })
                    :
                    onLike({ _recipe: recipe?._id as string, _user: recipe?._creator._id as string })
                }}

                  activeOpacity={.5}
                  style={{ backgroundColor: colors.common.white, width: 32, height: 32, borderRadius: (32 / 2), alignItems: "center", justifyContent: "center" }}
                >
                  {Boolean(isLike) ?
                    <ActivityIndicator size={"small"} color={colors.primary.main} />
                    :
                    <AntDesign name={
                      recipe?.likes?.find((item: ILikes) => item._user === profile?._id) ?
                        "heart"
                        :
                        "hearto"
                    }
                      size={20}
                      color={
                        recipe?.likes.find((item: ILikes) => item._user === profile?._id) ?
                          colors.primary.main
                          :
                          colors.grey[400]
                      } />
                  }
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
              {recipe?.images?.length !== 1 && recipe?.images?.map((_, index) => (
                <View
                  key={index}
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    backgroundColor: currentPage === index ? colors.primary.main : colors.grey[400],
                  }}
                />
              ))}
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 20, }}>
            <Typography variant="SmallTextBold" styles={{ flex: 1 }}>
              {recipe?.recipename}
            </Typography>
            {/* <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>
            ({recipe?.totalreviews} Reviews)
          </Typography> */}
          </View>

          <View style={{ paddingHorizontal: 20, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Pressable onPress={() => { navigation.navigate({ name: "user/profile", params: { _user: recipe?._creator?._id as string } }); }} style={{ gap: 10, display: "flex", flexDirection: "row", alignItems: "center", }}>
              <Avatar source={{ uri: recipe?._creator?.assets?.profileImage }} alt={recipe?._creator?.customerName} resizeMode="cover" width={40} height={40} borderRadius={(40 / 2)} />
              <View>
                <Typography variant="SmallTextBold" styles={{ flex: 1 }}>
                  {recipe?._creator?.customerName} {profile?._id === recipe?._creator?._id && `(You)`}
                </Typography>
                {recipe?._creator?.basic_info?.location ?
                  <View style={{ gap: 10, display: "flex", flexDirection: "row", alignItems: "center", }}>
                    <FontAwesome6 name='location-dot' size={12} color={colors.text.primary} />
                    <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>
                      {recipe?._creator?.basic_info?.location}
                    </Typography>
                  </View>
                  :
                  <TouchableOpacity onPress={() => { }} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>
                      {recipe?._creator?.totalfollowers || 0}
                    </Typography>
                    <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3} styles={{ textDecorationColor: hexToRgb(colors.primary.main, .8), textDecorationLine: "underline", textDecorationStyle: "dashed" }}>
                      {recipe?._creator?.totalfollowers as number <= 9 ? "Follower" : "Followers"}
                    </Typography>
                  </TouchableOpacity>
                }
              </View>
            </Pressable>
            {profile?._id !== recipe?._creator?._id &&
              <TouchableOpacity onPress={() => { onFollow() }} style={{ backgroundColor: colors.primary.main, height: 37, width: 85, alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
                <Typography variant='SmallerTextBold' color={colors.common.white}>
                  {onFollowing ?
                    <ActivityIndicator size={"small"} color={colors.common.white} />
                    :
                    recipe?._creator?.followers?.find((item: IFollowing) => item._user === profile?._id) ?
                      "Following"
                      :
                      "Follow"
                  }
                </Typography>
              </TouchableOpacity>
            }
          </View>

          {recipe?.appliances?.length && (
            <View style={{ gap: 10, }}>
              <Typography variant="SmallTextSemiBold" styles={{ paddingHorizontal: 20 }}>Appliances</Typography>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }} >
                {recipe?.appliances?.map((value: IAppliances, index: number) => {
                  return (
                    <View key={index}>
                      <Image source={{ uri: value.image }} resizeMode="cover" style={{ width: 50, height: 50, borderRadius: 10 }} />
                    </View>
                  )
                })}
              </ScrollView>
            </View>
          )}

          <View style={{ gap: 15, paddingHorizontal: 20 }}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Button onPress={() => { setActiveTab("Ingrident") }} size="tab" variant={activeTab === "Ingrident" ? "contain" : "text"}>Ingrident</Button>
              </View>
              <View style={{ flex: 1 }}>
                <Button onPress={() => { setActiveTab("Procedure") }} size="tab" variant={activeTab === "Procedure" ? "contain" : "text"}>Procedure</Button>
              </View>
            </View>

            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                <FontAwesome6 name='bowl-food' color={colors.neturalcolour.gray_3} size={10} />
                <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>{recipe?.serves} serve</Typography>
              </View>
              <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>
                {activeTab === "Ingrident" ? recipe?.totalIngredients || 0 : recipe?.totalInstructions || 0} Items
              </Typography>
            </View>
            <View style={{ gap: 15 }}>
              {activeTab === "Ingrident" ?
                recipe?.ingredients?.map((value: ingredientsProps, index: number) => {
                  return (
                    <View key={index} style={{ paddingHorizontal: 15, paddingVertical: 15, /* height: 76, */ borderRadius: 12, display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "space-between", backgroundColor: colors.neturalcolour.gray_4 }}>
                      <View style={{ display: "flex", alignItems: "center", flexDirection: "row", gap: 10 }}>
                        {value?.images[0]?.url &&
                          <Image source={{ uri: value?.images[0].url }} resizeMode="cover" style={{ width: 52, height: 52, borderRadius: 10 }} />
                        }
                        <Typography variant="NormalTextBold">{value?.ingredient}</Typography>
                      </View>
                      <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>{value?.quantity}{value?.measurementunit}</Typography>
                    </View>
                  )
                })
                :
                Array.isArray(recipe?.instructions) && recipe?.instructions?.map((value: instructionsProps, index: number) => {
                  return (
                    <View key={index} style={{ gap: 10, paddingHorizontal: 15, paddingVertical: 15, /* height: 76, */ borderRadius: 12, backgroundColor: colors.neturalcolour.gray_4, display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                      {value?.images[0]?.url &&
                        <Image source={{ uri: value?.images[0].url }} resizeMode="cover" style={{ width: 52, height: 52, borderRadius: 10 }} />
                      }
                      <View style={{ flex: 1 }}>
                        <Typography variant="SmallerTextBold">
                          {value?.instruction}
                        </Typography>
                        <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>
                          {value?.description}
                        </Typography>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, gap: 20 }}>
            <Typography variant="MediumTextSemiBold">Review</Typography>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 30,
              }}
            >
              <View style={{ flex: .7, alignItems: "center", gap: 5 }}>
                <Typography variant='LargeTextBold'>{recipe?.avgRating}</Typography>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                  <Ionicons name='star' size={22} color={colors.primary.main} />
                  <Ionicons name='star' size={22} color={colors.primary.main} />
                  <Ionicons name='star-half' size={22} color={colors.primary.main} />
                  <Ionicons name='star-outline' size={22} color={colors.primary.main} />
                  <Ionicons name='star-outline' size={22} color={colors.primary.main} />
                </View>
                <Typography variant="SmallerTextSemiBold" color={colors.neturalcolour.gray_3}>
                  ({recipe?.totalreviews} {recipe?.totalreviews as number >= 10 ? "Reviews" : "Review"})
                </Typography>
              </View>
              <View style={{ height: "100%", width: 1, backgroundColor: colors.grey[400] }} />
              <View style={{ flex: 1, gap: 5, alignItems: "center" }}>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                  <View style={{ width: 15, alignItems: "center" }}>
                    <Typography variant="SmallTextBold">5</Typography>
                  </View>
                  <View style={{ height: 7, width: "100%", overflow: "hidden", backgroundColor: hexToRgb(colors.grey[400], .5), borderRadius: 10 / 2 }}>
                    <View style={{ height: 7, width: "90%", backgroundColor: colors.primary.main, borderRadius: 10 / 2 }} />
                  </View>
                </View>

                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                  <View style={{ width: 15, alignItems: "center" }}>
                    <Typography variant="SmallTextBold">4</Typography>
                  </View>
                  <View style={{ height: 7, width: "100%", overflow: "hidden", backgroundColor: hexToRgb(colors.grey[400], .5), borderRadius: 10 / 2 }}>
                    <View style={{ height: 7, width: "70%", backgroundColor: hexToRgb(colors.primary.main, .8), borderRadius: 10 / 2 }} />
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                  <View style={{ width: 15, alignItems: "center" }}>
                    <Typography variant="SmallTextBold">3</Typography>
                  </View>
                  <View style={{ height: 7, width: "100%", overflow: "hidden", backgroundColor: hexToRgb(colors.grey[400], .5), borderRadius: 10 / 2 }}>
                    <View style={{ height: 7, width: "50%", backgroundColor: hexToRgb(colors.primary.main, .6), borderRadius: 10 / 2 }} />
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                  <View style={{ width: 15, alignItems: "center" }}>
                    <Typography variant="SmallTextBold">2</Typography>
                  </View>
                  <View style={{ height: 7, width: "100%", overflow: "hidden", backgroundColor: hexToRgb(colors.grey[400], .5), borderRadius: 10 / 2 }}>
                    <View style={{ height: 7, width: "30%", backgroundColor: colors.error.main, borderRadius: 10 / 2 }} />
                  </View>
                </View>
                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                  <View style={{ width: 15, alignItems: "center" }}>
                    <Typography variant="SmallTextBold">1</Typography>
                  </View>
                  <View style={{ height: 7, width: "100%", overflow: "hidden", backgroundColor: hexToRgb(colors.grey[400], .5), borderRadius: 10 / 2 }}>
                    <View style={{ height: 7, width: "10%", backgroundColor: colors.error.main, borderRadius: 10 / 2 }} />
                  </View>
                </View>
              </View>
            </View>
            <Button onPress={() => { dispatch(setRecipeDetails({ recipe: recipe })); navigation.navigate({ name: 'recipe/review/rating', params: { _recipe: recipe?._id as string, _user: recipe?._creator._id as string } }); }}>
              Write Review
            </Button>
          </View>
        </ScrollView>
      }
      <Modal visible={onMenu} statusBarTranslucent onRequestClose={() => { setOnMenu(!onMenu) }} transparent >
        <BlurView style={[StyleSheet.absoluteFill]} blurType="dark" blurAmount={1} />
        <Pressable onPress={() => { setOnMenu(!onMenu) }} style={StyleSheet.absoluteFill} />
        <View style={{ alignSelf: 'flex-end', width: 164, /* height: 220, */ borderRadius: 10, backgroundColor: colors.common.white, marginTop: insets.top + 10, right: 20, paddingVertical: 10, paddingHorizontal: 20, justifyContent: "center" }}>
          <TouchableOpacity onPress={() => {
            onShare({
              _recipe: recipe?._id,
              _creator: recipe?._creator?._id,
            })
          }} activeOpacity={0.5} style={{ height: 40, display: "flex", flexDirection: "row", gap: 15, alignItems: "center" }}>
            <SvgXml xml={shareicon} />
            <Typography variant="SmallTextRegular">Share</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { dispatch(setRecipeDetails({ recipe: recipe })); navigation.navigate({ name: 'recipe/review/rating', params: { _recipe: recipe?._id as string, _user: recipe?._creator._id as string } }); setOnMenu(!onMenu) }} activeOpacity={0.5} style={{ height: 40, display: "flex", flexDirection: "row", gap: 15, alignItems: "center" }}>
            <SvgXml xml={ratingstaricon} />
            <Typography variant="SmallTextRegular">Rate Recipe </Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate({ name: "review/recipe", params: { ...params?.params /* _recipe: recipe?._id as string, _user: recipe?._creator?._id as string */ } }); setOnMenu(!onMenu) }} activeOpacity={0.5} style={{ height: 40, display: "flex", flexDirection: "row", gap: 15, alignItems: "center" }}>
            <SvgXml xml={reviewicon} />
            <Typography variant="SmallTextRegular">Review</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setOnSaving(recipe?._id as string);
            setOnMenu(false)
            recipe?.saves?.find((item: ISaves) => item?._user === profile?._id) ?
              onUnSave({ _recipe: recipe?._id as string, _user: recipe?._creator._id as string })
              :
              onSave({ _recipe: recipe?._id as string, _user: recipe?._creator._id as string })
          }} activeOpacity={0.5} style={{ height: 40, display: "flex", flexDirection: "row", gap: 15, alignItems: "center" }}>
            <SvgXml xml={
              // recipe?.saves?.find((item: ISaves) => item?._user === profile?._id) ?
              //   savedactive
              //   :
              //   savedinactive
              unsaveicon
            } />
            <Typography variant="SmallTextRegular">
              {recipe?.saves?.find((item: ISaves) => item?._user === profile?._id) ?
                "Unsave"
                :
                "Save"
              }
            </Typography>
          </TouchableOpacity>
          {recipe?._creator?._id === profile?._id &&
            <TouchableOpacity onPress={() => { navigation.navigate({ name: "recipe/create", params: { _recipe: recipe?._id as string, _creator: recipe?._creator?._id as string } }); setOnMenu(!onMenu) }} activeOpacity={0.5} style={{ height: 40, display: "flex", flexDirection: "row", gap: 15, alignItems: "center" }}>
              <MaterialIcons name={"edit-square"} size={20} />
              <Typography variant="SmallTextRegular">Edit Recipe</Typography>
            </TouchableOpacity>
          }
        </View>
      </Modal>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey[300]
  },
  video: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width * 9) / 16, // 16:9 aspect ratio
  },
  fullscreenVideo: {
    width: Dimensions.get('window').height,
    height: Dimensions.get('window').width,
  },
});

export default RecipeDetails
