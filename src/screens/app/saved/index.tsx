import React, { Fragment, useEffect, useState } from 'react'
import { FlatList, ImageBackground, Image, ScrollView, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import Octicons from "react-native-vector-icons/Octicons"
import Ionicons from "react-native-vector-icons/Ionicons"
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Typography from '../../../components/typography'
import { colors } from '../../../theme/colors'
import { SvgXml } from 'react-native-svg'
import { savedinactive, savedactive } from '../../../assets/icons/bottomtab'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../../utils/linking'
import BottomNavigation from '../../../components/bottomnavigation'
import { ISaves, IRecipesProps } from './saved'
import { QueryString } from '../../../utils/querystring'
import { getsavedrecipe, saverecipe, unsaverecipe } from '../../../service'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { RootState } from '../../../store'
import TostMessage, { ToasterProps } from '../../../components/toastmessage'
import LinearGradient from 'react-native-linear-gradient'
import { hexToRgb } from '../../../utils/hexToRgb'

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "app/saved">;
const Saved = () => {
  const navigation = useNavigation<NavigationProps>();
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
  const { profile } = useAppSelector((state: RootState) => state.userprofile)
  const [onSaving, seOnSaving] = useState<string>("")
  const [recipes, setRecipes] = useState<IRecipesProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [refreshing, setRefreshing] = useState<true | false>(false);
  const [pagination, setPagination] = useState<{ currentPage: number, pageSize: number, }>({
    currentPage: 1,
    pageSize: 20,
  });

  const _query = QueryString({
    ...pagination
  });

  useEffect(() => {
    (async () => {
      if (isLoading) return
      setIsLoading(true)
      await getsavedrecipe(_query)
        .then((response) => {
          if (response.status === 200) {
            if (!Array.isArray(response.data.data) && response.data.data.length === 0) return
            setRecipes(response.data.data)
            setTotalPage(response?.data?.totalPage)
          }
        })
        .catch((error) => {
          console.log("getrecipe.all.error", error?.response?.data)
        })
        .finally(() => {
          setIsLoading(false)
        })

    })();
  }, [pagination.currentPage, pagination.pageSize]);

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setPagination({ ...pagination, currentPage: 1, pageSize: 25, })
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <Fragment>
      <View style={{ paddingVertical: 10 }}>
        <Typography variant="MediumTextSemiBold" styles={{ textAlign: "center" }}>
          Saved
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
        showsVerticalScrollIndicator={false}
        data={Array.isArray(recipes) && recipes.length !== 0 ? recipes : []}
        renderItem={({ item }: { item: IRecipesProps }) => {

          return (
            <TouchableOpacity onPress={() => { navigation.navigate({ name: "recipe/details", params: { _recipe: item._id, _user: item._creator._id } }) }} activeOpacity={.4} style={{ height: 180, borderRadius: 10, overflow: "hidden", backgroundColor: colors.grey[100] }}>
              <ImageBackground source={{ uri: item?.images[0]?.url }} resizeMode="cover" style={{ height: 180 }} >
                <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 45, borderRadius: 20, height: 23, backgroundColor: colors.warning.light, right: 10, top: 10, position: "absolute" }}>
                  <AntDesign name="star" color={colors.warning.dark} size={12} />
                  <Typography variant="SmallerTextRegular" color={colors.text.primary}>{item?.avgRating}</Typography>
                </View>

                <LinearGradient
                  colors={[hexToRgb(colors.common.black, .6), hexToRgb(colors.common.black, .4), hexToRgb(colors.common.black, .2), hexToRgb(colors.common.black, .1)]}
                  useAngle={true}
                  angle={0}
                  style={{ width: "100%", height: 200, position: "absolute", zIndex: 0 }}
                />
                <View style={{ gap: 0, bottom: 10, position: "absolute", paddingHorizontal: 10 }}>
                  <Typography numberOfLines={2} variant="SmallTextBold" color={colors.common.white}>
                    {item?.recipename}
                  </Typography>
                  <View style={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="SmallerTextRegular" color={colors.common.white}>
                      By {item?._creator?.customerName}
                    </Typography>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 5 }}>
                      <Octicons name='stopwatch' color={colors.common.white} />
                      <Typography variant="SmallerTextRegular" color={colors.common.white}>
                        {item?.preparingTime?.HH !== 0 && `${item?.preparingTime?.HH}:`}{item?.preparingTime?.MM} {item?.preparingTime?.MM as number > 9 ? "mins" : "min"}
                      </Typography>
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
                </View>
              </ImageBackground>
            </TouchableOpacity>
          )
        }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10, gap: 20 }}
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

export default Saved
