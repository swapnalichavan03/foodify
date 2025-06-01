import React, { Fragment, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import Octicons from "react-native-vector-icons/Octicons"
import Ionicons from "react-native-vector-icons/Ionicons"
import Typography from '../../../components/typography'
import { colors } from '../../../theme/colors'
import { SvgXml } from 'react-native-svg'
import { savedinactive, savedactive, notificationactive } from '../../../assets/icons/bottomtab'
import TextField from '../../../components/textfield'
import { filtericon } from '../../../assets/icons/outline'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../utils/linking'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomNavigation from '../../../components/bottomnavigation'
import { getcategories, getrecipes, saverecipe, unsaverecipe } from '../../../service'
import { useAppSelector } from '../../../hooks/useAppSelector'
import BottomSheet from '../../../components/bottomsheet'
import RNImage from '../../../components/rnimage'
import { IRatings, ISaves, IRecipesProps } from './dashboard'
import Button from '../../../components/button'
import TostMessage, { ToasterProps } from '../../../components/toastmessage'
import { QueryString } from '../../../utils/querystring'
import { ICategories } from '../create/create'
import { hexToRgb } from '../../../utils/hexToRgb'
import { removeDuplicateObject } from '../../../utils/removeduplicate'
import axios from 'axios'

type navigationProps = NativeStackNavigationProp<RootStackParamList, "app/home">
const Dashboard = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<navigationProps>();
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
  const [activeFilter, setActiveFilter] = useState("All");
  const { profile } = useAppSelector((state) => state.userprofile);
  const [visible, setVisible] = useState<true | false>(false);
  const [recipes, setRecipes] = useState<IRecipesProps[]>([]);
  const [filter, setFilter] = useState<{ time: string, rate: string, category: string }>({ time: "All", rate: "All", category: "All" });
  const [category, setCategory] = useState<ICategories[]>([])
  const [onSaving, seOnSaving] = useState<string>("");
  const [isLoading, setIsLoading] = useState<true | false>(false);
  const [categories, setCategories] = useState<ICategories[]>([])
  const [categorySummary, setCategorySummary] = useState({
    "currentPage": 0,
    "totalPage": 0,
    "numberOfData": 0
  })
  const [recipeSummary, setRecipeSummary] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPage: 0,
    numberOfData: 0,
    from: 0,
    to: 0
  });

  const _query = QueryString({
    ...(filter.time !== "All" && {
      filter: filter.time
    }),
    ...(filter.rate !== "All" && {
      ratingFilter: filter.rate
    }),
    ...(Array.isArray(category.map((item) => item._id)) && category.map((item) => item._id).length > 0 && {
      categorie: category.map((item) => item._id)
    }),
    currentPage: recipeSummary.currentPage,
    pageSize: recipeSummary.pageSize,
  });

  useEffect(() => {
    (async () => {
      if (isLoading) return
      setIsLoading(true);
      await getrecipes(_query)
        .then((response) => {
          if (response.status === 200) {
            if (!Array.isArray(response.data.data) && response.data.data.length === 0) return
            setRecipes((prev) => [...prev, ...response.data.data]);
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
          console.log("getrecipe.all.error", error.response)
        })
        .finally(() => {
          setIsLoading(false);
        })
    })()
  }, [_query]);

  const onChangeFilter = ({ value, key }: { value: string, key: "time" | "rate" | "category" }) => {
    setFilter({ ...filter, [key]: value });
    setRecipeSummary((prev) => ({ ...prev, currentPage: 1, pageSize: 10, totalPage: 0, numberOfData: 0, from: 0, to: 0 }));
  };

  const onSave = async ({ _recipe, _user }: { _recipe: string, _user: string }) => {
    saverecipe(_recipe, _user)
      .then((response) => {
        if (response.status === 200) {
          setRecipes((prev: IRecipesProps[]) => {
            const findIndex = prev.findIndex((item: IRecipesProps) => item._id === _recipe)
            prev[findIndex].saves.push({ _user: profile?._id as string })
            return [...prev]
          })
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.save", error)
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => seOnSaving(""))
  };

  const onUnSave = ({ _recipe, _user }: { _recipe: string, _user: string }) => {
    unsaverecipe(_recipe, _user)
      .then((response) => {
        if (response.status === 200) {
          setRecipes((prev: IRecipesProps[]) => {
            const findIndex = prev.findIndex((item: IRecipesProps) => item._id === _recipe)
            prev[findIndex].saves = prev[findIndex].saves.filter((item: ISaves) => item._user !== profile?._id);
            return [...prev]
          })
          setToaster({ ...toaster, variant: "success", message: response?.data?.message, visible: true })
        }
      })
      .catch((error) => {
        console.log("error.unsave", error?.response?.data)
        setToaster({ ...toaster, variant: "error", message: error?.response?.data?.message, visible: true })
      })
      .finally(() => seOnSaving(""))
  };

  const onChangeCategories = (categorie: ICategories) => {
    setCategory((prev: ICategories[]) => {
      const findIndex = prev.findIndex((item: ICategories) => item._id === categorie._id);
      if (findIndex === -1) {
        prev.push(categorie)
      } else {
        prev = prev.filter((item) => item._id !== categorie._id)
      }
      return [...prev]
    });
    setRecipeSummary((prev) => ({ ...prev, currentPage: 1, pageSize: 10, totalPage: 0, numberOfData: 0, from: 0, to: 0 }));
  }

  useEffect(() => {
    (async () => {
      await getcategories()
        .then((response) => {
          if (response.status === 200) {
            setCategories(response?.data?.data)
            setCategorySummary({
              ...categorySummary,
              currentPage: response?.data?.currentPage,
              totalPage: response?.data?.totalPage,
              numberOfData: response?.data?.numberOfData,
            })
          }
        })
        .catch((error) => {
          console.log("object", error)
        })
    })()
  }, []);

  const removeduplicate = removeDuplicateObject<IRecipesProps>(recipes);
  return (
    <Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, gap: 30 }}
      >

        <View style={{ gap: 30 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 10, display: "flex", flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Typography variant="LargeTextBold">
                {profile?.customerName}
              </Typography>
              <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>
                What are you cooking today?
              </Typography>
            </View>

            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              {/* <TouchableOpacity onPress={() => { navigation.navigate("people/conversation") }} activeOpacity={.5}>
                <Ionicons name='chatbubble-ellipses-outline' color={colors.primary.main} size={22} />
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => { navigation.navigate("app/notification") }} activeOpacity={.5}>
                <SvgXml xml={notificationactive} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <TextField
                startIcon={() => (
                  <AntDesign name='search1' color={colors.neturalcolour.gray_4} size={20} />
                )}
                size="small"
                placeholder='Search'
                editable={false}
                readOnly={true}
                onPress={() => { navigation.navigate("recipe/search") }}
              />
            </View>
            <TouchableOpacity onPress={() => { setVisible(!visible) }} activeOpacity={.5} style={{ height: 40, width: 40, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary.main, borderRadius: 10 }}>
              <SvgXml xml={filtericon} />
            </TouchableOpacity>
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={["All", "Indian", "Italian", "Asian", "Chinese"]}
            renderItem={(({ item }) => {
              return (
                <Fragment>
                  <TouchableOpacity onPress={() => { setActiveFilter(item) }}
                    activeOpacity={.5} style={{
                      ...(activeFilter === item && {
                        backgroundColor: colors.primary.main,
                      }),
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 30,
                      borderRadius: 10
                    }}>
                    <Typography color={activeFilter === item ? colors.common.white : colors.text.primary} variant="SmallerTextSemiBold">
                      {item}
                    </Typography>
                  </TouchableOpacity>
                </Fragment>
              )
            })}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
          />

          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={removeduplicate}
            renderItem={(({ item }) => {

              return (
                <Fragment>
                  <View style={{ position: "relative" }}>
                    <View style={{ alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: (100 / 2), backgroundColor: colors.neturalcolour.gray_4, zIndex: 999, alignSelf: "center", position: "absolute", top: -50 }}>
                      <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 45, borderRadius: 20, height: 23, backgroundColor: colors.warning.light, right: -15, top: 15, position: "absolute" }}>
                        <AntDesign name="star" color={colors.warning.dark} size={12} />
                        <Typography variant="SmallerTextRegular" color={colors.text.primary}>
                          {
                            item?.ratings?.find((rating: IRatings) => rating?._user === profile?._id) ?
                              item?.ratings?.find((rating: IRatings) => rating?._user === profile?._id)?._ratings
                              :
                              item?.avgRating?.toFixed(1)
                          }
                        </Typography>
                      </View>

                      <RNImage
                        source={{
                          uri: item.images[0].url
                        }}
                        resizeMode="cover"
                        style={{ width: 95, height: 95, borderRadius: (95 / 2) }}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => { navigation.navigate({ name: "recipe/details", params: { _recipe: item._id, _user: item._creator._id } }) }}
                      activeOpacity={0.5}
                      style={{
                        backgroundColor: colors.neturalcolour.gray_4,
                        width: 160,
                        padding: 15,
                        borderRadius: 12,
                        gap: 10,
                      }}
                    >
                      <View style={{ height: 40 }} />
                      <View style={{ height: 110, justifyContent: "space-between" }}>
                        <Typography numberOfLines={3} color={colors.neturalcolour.gray_1} variant="SmallTextBold" styles={{ textAlign: "center", letterSpacing: .1 }}>
                          {item.recipename}
                        </Typography>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <View>
                            <Typography color={colors.neturalcolour.gray_3} variant="SmallerTextRegular" styles={{ letterSpacing: .1 }}>
                              Time
                            </Typography>
                            <Typography color={colors.neturalcolour.gray_1} variant="SmallerTextBold">
                              {item?.preparingTime?.HH !== 0 && `${item?.preparingTime?.HH}:`}{item?.preparingTime?.MM} {item?.preparingTime?.MM as number > 9 ? "mins" : "min"}
                            </Typography>
                          </View>
                          <TouchableOpacity onPress={() => {
                            seOnSaving(item._id)
                            item.saves.find((item) => item._user === profile?._id) ?
                              onUnSave({ _recipe: item._id, _user: item._creator._id })
                              :
                              onSave({ _recipe: item._id, _user: item._creator._id })
                          }} activeOpacity={.5} style={{ backgroundColor: colors.common.white, width: 32, height: 32, borderRadius: (32 / 2), alignItems: "center", justifyContent: "center" }}>
                            {onSaving === item._id ?
                              <ActivityIndicator size={"small"} color={colors.primary.main} />
                              :
                              <SvgXml xml={
                                item.saves.find((item) => item._user === profile?._id) ?
                                  savedactive
                                  :
                                  savedinactive
                              } />
                            }
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Fragment>
              )
            })}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingTop: 50 }}
            style={{ overflow: "visible" }}
            ListFooterComponent={() => {
              return (
                isLoading &&
                <View style={{ display: "flex", flexDirection: "row", gap: 10, }}>
                  {Array.from({ length: 10 }).map((_, index) => {
                    return (
                      <View key={index} style={{ position: "relative" }}>
                        <View style={{ alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: (100 / 2), backgroundColor: hexToRgb(colors.grey[400], .7), zIndex: 999, alignSelf: "center", position: "absolute", top: -50 }}>
                          <ActivityIndicator size={"small"} color={colors.primary.dark} />
                        </View>

                        <TouchableOpacity
                          activeOpacity={0.5}
                          style={{
                            backgroundColor: colors.neturalcolour.gray_4,
                            width: 160,
                            padding: 15,
                            borderRadius: 12,
                            gap: 10,
                          }}
                        >
                          <View style={{ height: 40 }} />
                          <View style={{ height: 110, justifyContent: "space-between" }}>
                            <View style={{ gap: 1 }}>
                              <View style={{ height: 8, width: "100%", backgroundColor: hexToRgb(colors.grey[400], .5), borderRadius: 3 }} />
                              <View style={{ height: 8, width: "100%", backgroundColor: hexToRgb(colors.grey[400], .5), borderRadius: 3 }} />
                            </View>

                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                              <View style={{ gap: 1 }}>
                                <View style={{ height: 6, width: 40, backgroundColor: hexToRgb(colors.grey[400], .5), borderRadius: 3 }} />
                                <View style={{ height: 6, width: 50, backgroundColor: hexToRgb(colors.grey[400], .5), borderRadius: 3 }} />
                              </View>
                              <TouchableOpacity activeOpacity={.5} style={{ backgroundColor: colors.common.white, width: 32, height: 32, borderRadius: (32 / 2), alignItems: "center", justifyContent: "center", }}>
                                <ActivityIndicator size={"small"} color={colors.primary.dark} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  })}
                </View>
              )
            }}
            scrollEventThrottle={0.8}
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
          />

          <View style={{ paddingHorizontal: 20 }}>
            <Typography variant={"NormalTextBold"}>New Recipes</Typography>
          </View>

          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={["All", "Indian", "Italian", "Asian", "Chinese"]}
            renderItem={(({ item }) => {
              return (
                <Fragment>
                  <View style={{ position: "relative" }}>
                    <View style={{ alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: (100 / 2), backgroundColor: colors.neturalcolour.gray_4, zIndex: 999, alignSelf: "flex-end", position: "absolute", right: 10, top: -50 }}>
                      <Image source={{ uri: "https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg" }} resizeMode="contain" style={{ width: 95, height: 95, borderRadius: (95 / 2) }} />
                    </View>

                    <TouchableOpacity
                      onPress={() => { navigation.navigate({ name: "recipe/details", params: { _recipe: "_recipe", _user: "" } }) }}
                      activeOpacity={0.5}
                      style={{
                        backgroundColor: colors.neturalcolour.gray_4,
                        width: 280,
                        padding: 15,
                        borderRadius: 12,
                        gap: 10,
                      }}
                    >
                      <View style={{ height: 90, justifyContent: "space-between" }}>
                        <View style={{ width: "60%" }}>
                          <Typography numberOfLines={1} color={colors.neturalcolour.gray_1} variant="SmallTextBold" styles={{ letterSpacing: .1 }}>
                            Classic Greek Salad
                          </Typography>
                          <View style={{ paddingVertical: 5, display: "flex", gap: 5, flexDirection: "row", }}>
                            <AntDesign name="star" color={colors.warning.dark} size={12} />
                            <Typography variant="SmallerTextRegular" color={colors.text.primary}>4.5 | 1900</Typography>
                          </View>
                        </View>

                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Image source={{ uri: "https://img.freepik.com/photos-premium/profile-du-client-gestion-actifs_1104763-33440.jpg" }} resizeMode="cover" style={{ width: 25, height: 25, borderRadius: (25 / 2) }} />
                            <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>
                              By James Milner
                            </Typography>
                          </View>
                          <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <Octicons name='stopwatch' color={colors.neturalcolour.gray_2} />
                            <Typography variant="SmallerTextRegular" color={colors.neturalcolour.gray_2}>
                              20 mins
                            </Typography>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Fragment>
              )
            })}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingTop: 40 }}
            style={{ overflow: "visible" }}
          />

          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={["All", "Indian", "Italian", "Asian", "Chinese"]}
            renderItem={(({ item }) => {
              return (
                <Fragment>
                  <View style={{ position: "relative" }}>
                    <View style={{ alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: (100 / 2), backgroundColor: colors.neturalcolour.gray_4, zIndex: 999, alignSelf: "center", position: "absolute", top: -50 }}>
                      <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 45, borderRadius: 20, height: 23, backgroundColor: colors.warning.light, right: -15, top: 15, position: "absolute" }}>
                        <AntDesign name="star" color={colors.warning.dark} size={12} />
                        <Typography variant="SmallerTextRegular" color={colors.text.primary}>4.5</Typography>
                      </View>

                      <Image source={{ uri: "https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg" }} resizeMode="contain" style={{ width: 95, height: 95, borderRadius: (95 / 2) }} />
                    </View>

                    <TouchableOpacity
                      onPress={() => { navigation.navigate({ name: "recipe/details", params: { _recipe: "_recipe", _user: "" } }) }}
                      activeOpacity={0.5}
                      style={{
                        backgroundColor: colors.neturalcolour.gray_4,
                        width: 160,
                        padding: 15,
                        borderRadius: 12,
                        gap: 10,
                      }}
                    >
                      <View style={{ height: 40 }} />
                      <View style={{ height: 110, justifyContent: "space-between" }}>
                        <Typography numberOfLines={3} color={colors.neturalcolour.gray_1} variant="SmallTextBold" styles={{ textAlign: "center", letterSpacing: .1 }}>
                          Classic Greek Salad
                        </Typography>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                          <View>
                            <Typography color={colors.neturalcolour.gray_3} variant="SmallerTextRegular" styles={{ letterSpacing: .1 }}>
                              Time
                            </Typography>
                            <Typography color={colors.neturalcolour.gray_1} variant="SmallerTextBold">
                              15 Mins
                            </Typography>
                          </View>
                          <TouchableOpacity activeOpacity={.5} style={{ backgroundColor: colors.common.white, width: 32, height: 32, borderRadius: (32 / 2), alignItems: "center", justifyContent: "center" }}>
                            <SvgXml xml={savedinactive} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Fragment>
              )
            })}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingTop: 50 }}
            style={{ overflow: "visible" }}
          />
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Typography variant="HeaderTextBold" color={colors.grey[400]}>FoodiFy</Typography>
          <Typography variant="SmallerTextBold" color={colors.grey[400]}>Explore | Cook | Eat</Typography>
        </View>
      </ScrollView>


      <BottomNavigation />

      <BottomSheet
        title='Filter'
        visible={visible}
        onCancel={() => { setVisible(false) }}
      >
        <ScrollView
          style={{}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
          contentContainerStyle={{ gap: 20, paddingHorizontal: 20, paddingBottom: insets.bottom || 20 }}
        >
          <View style={{ gap: 10 }}>
            <Typography variant="SmallTextBold">Time</Typography>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 15 }}>
              {["All", "Newest", "Relevant", "Top"].map((value: string, index: number) => {
                return (
                  <Button onPress={() => { onChangeFilter({ value: value, key: "time" }) }} key={index} variant={filter.time === value ? "contain" : "outline"} size="tab">
                    {value}
                  </Button>
                )
              })}
            </View>
          </View>

          <View style={{ gap: 10 }}>
            <Typography variant="SmallTextBold">Rate</Typography>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 15 }}>
              {["All", "1", "2", "3", "4", "5"].map((value: string, index: number) => {
                return (
                  <Button onPress={() => { onChangeFilter({ value: value, key: "rate" }) }} key={index} variant={filter.rate === value ? "contain" : "outline"} size="tab">
                    {value} {" "} <AntDesign name="star" color={filter.rate === value ? colors.common.white : colors.primary.main} size={13} />
                  </Button>
                )
              })}
            </View>
          </View>

          {categories.length > 0 &&
            <View style={{ gap: 10 }}>
              <Typography variant="SmallTextBold">Category</Typography>
              <View style={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 15 }}>
                {categories.map((value: ICategories, index: number) => {
                  const ids = category.map((item: ICategories) => item._id)
                  return (
                    <Fragment key={index}>
                      {index === 0 &&
                        <Pressable onPress={() => { setCategory([]) }} style={{ padding: 8, borderRadius: 8, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: category.length === 0 ? colors.primary.main : colors.common.transparent, borderWidth: 1, borderStyle: "solid", borderColor: colors.primary.main }}>
                          <Typography variant="SmallerTextBold" color={category.length === 0 ? colors.common.white : colors.grey[900]}>All</Typography>
                        </Pressable>
                      }
                      <Pressable onPress={() => { onChangeCategories(value) }} style={{ padding: 8, borderRadius: 8, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: ids.includes(value._id) ? colors.primary.main : colors.common.transparent, borderWidth: 1, borderStyle: "solid", borderColor: colors.primary.main }}>
                        <Typography variant="SmallerTextBold" color={ids.includes(value._id) ? colors.common.white : colors.grey[900]}>{value?.type}</Typography>
                      </Pressable>
                    </Fragment>
                  )
                })}
              </View>
            </View>
          }
        </ScrollView>
      </BottomSheet>

      <TostMessage
        message={toaster.message}
        visible={toaster.visible}
        variant={toaster.variant}
        // position={isKeyboardOpen ? "top" : "bottom"}
        onHide={setToaster}
      />
    </Fragment >
  )
}

export default Dashboard;