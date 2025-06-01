import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { FlatList, ImageBackground, Pressable, TouchableOpacity, View } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../../../theme/colors';
import Typography from '../../../../../components/typography';
import { getrecipes } from '../../../../../service';
import { IRatings, IIRecipesProps } from '../../searchrecipe';
import { QueryString } from '../../../../../utils/querystring';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { RootState } from '../../../../../store';
import { useDebounce } from '../../../../../hooks/useDebounce';
import { removeDuplicateObject } from '../../../../../utils/removeduplicate';
import { RootStackParamList } from '../../../../../utils/linking';
import TextField from '../../../../../components/textfield';
import LinearGradient from 'react-native-linear-gradient';
import { hexToRgb } from '../../../../../utils/hexToRgb';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/search">
const Recipes = memo(() => {
  const { debounce } = useDebounce();
  const insets = useSafeAreaInsets();
  const { profile } = useAppSelector((state: RootState) => state.userprofile);
  const navigation = useNavigation<NavigationProps>();
  const [search, setSearch] = useState<string>("");
  const [recipes, setRecipes] = useState<IIRecipesProps[]>([]);
  const [isLoading, setIsLoading] = useState<true | false>(true)
  const [totalPage, setTotalPage] = useState(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [pagination, setPagination] = useState<{ currentPage: number, pageSize: number, }>({
    currentPage: 1,
    pageSize: 7,
  });

  const _query = QueryString({
    ...pagination,
    ...(search && { search: search })
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await getrecipes(_query)
        .then((response) => {
          if (response.status === 200) {
            if (!Array.isArray(response.data.data) && response.data.data.length === 0) return
            setRecipes([...recipes, ...response.data.data]);
            setTotalPage(response?.data?.totalPage)
          }
        })
        .catch((error) => {
          console.log("getrecipe.all.error", error.response)
        })
        .finally(() => {
          setIsLoading(false)
        })
    })()
  }, [pagination.currentPage, search]);

  const handleSearch = useCallback(debounce(inputVal => { setIsLoading(true); setRecipes([]); setSearch(inputVal) }, 500), []);

  const removeduplicate = removeDuplicateObject<IIRecipesProps>(recipes)
  return (
    <Fragment>
      <View style={{ paddingVertical: 20, paddingHorizontal: 20, width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <TextField
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);
              handleSearch(text)
              // setTimeout(() => {
              //   setRecipes([])
              //   setSearch(inputValue)
              // }, 1000);
            }}
            startIcon={() => (
              <AntDesign name='search1' color={colors.neturalcolour.gray_4} size={20} />
            )}
            endIcon={() => {
              return (
                search &&
                <Pressable onPress={() => { setRecipes([]), setInputValue(""), handleSearch("") }}>
                  <AntDesign name='close' size={20} />
                </Pressable>
              )
            }}
            size="small"
            placeholder='Search'
            autoFocus={true}
          />
        </View>
      </View>

      <FlatList
        onEndReached={() => {
          if (!removeduplicate.length) return
          if (isLoading) return
          if (totalPage <= pagination.currentPage) return
          setIsLoading(true)
          setPagination({ ...pagination, currentPage: pagination.currentPage + 1, pageSize: pagination.pageSize })
        }}
        data={Array.isArray(removeduplicate) ? removeduplicate : []}
        renderItem={({ item, index }) => {

          return (
            <Fragment>
              <TouchableOpacity onPress={() => { navigation.navigate({ name: "recipe/details", params: { _recipe: item._id, _user: item._creator._id } }) }} activeOpacity={.7} style={{ height: 150, width: 150, overflow: "hidden", flex: 1, borderRadius: 12 }}>
                <ImageBackground source={{ uri: item.images[0].url }} resizeMode="cover" style={{ backgroundColor: colors.common.white, height: "100%", width: "100%", }} >
                  <View style={{ zIndex: 999, alignItems: "center", justifyContent: "center", display: "flex", gap: 5, flexDirection: "row", width: 45, borderRadius: 20, height: 23, backgroundColor: colors.warning.light, right: 10, top: 10, position: "absolute" }}>
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

                  <LinearGradient
                    colors={[hexToRgb(colors.common.black, .6), hexToRgb(colors.common.black, .4), hexToRgb(colors.common.black, .2), hexToRgb(colors.common.black, .1)]}
                    useAngle={true}
                    angle={0}
                    style={{ width: "100%", height: 200, position: "absolute", zIndex: 0 }}
                  />
                  <View style={{ gap: 5, bottom: 10, position: "absolute", paddingHorizontal: 10 }}>
                    <Typography numberOfLines={2} variant="SmallTextBold" color={colors.common.white}>
                      {item.recipename}
                    </Typography>
                    <Typography numberOfLines={1} variant="SmallerTextRegular" color={colors.neturalcolour.gray_3}>
                      By {item._creator.customerName}
                    </Typography>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </Fragment>
          )
        }}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom, gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </Fragment>
  );
})

export default Recipes;
