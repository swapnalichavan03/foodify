// import React, { Fragment, useState } from 'react';
// import AnimatedTextInput from './src/components/animatedtextinput';
// import { View } from 'react-native';

// const App = () => {
//   const [input, setInput] = useState("");

//   console.log("input", input)
//   return (
//     <Fragment>
//       <View style={{ flex: 1, alignItems: "center", width: "100%", justifyContent: "center" }}>
//         <AnimatedTextInput
//           value={input}
//           onChangeText={setInput}
//         />
//       </View>
//     </Fragment>
//   );
// }

// export default App;


// import React, { useRef, useState } from 'react';
// import {
//   FlatList,
//   Text,
//   View,
//   NativeScrollEvent,
//   NativeSyntheticEvent,
//   FlatListProps,
// } from 'react-native';

// interface Item {
//   id: string;
//   title: string;
// }

// export default function App(): JSX.Element {
//   const [data, setData] = useState<Item[]>(
//     Array.from({ length: 10 }).map((_, i) => ({
//       id: i.toString(),
//       title: `Item ${i}`,
//     }))
//   );
//   const [loading, setLoading] = useState<boolean>(false);

//   const listRef = useRef<FlatList<Item>>(null);
//   const scrollOffsetRef = useRef<number>(0);

//   const handleLoadMore = () => {
//     if (loading) return; // prevent multiple triggers
//     setLoading(true);

//     // Simulate loading delay
//     setTimeout(() => {
//       const newItems: Item[] = Array.from({ length: 5 }).map((_, i) => ({
//         id: (data.length + i).toString(),
//         title: `Item ${data.length + i}`,
//       }));

//       listRef.current?.scrollToOffset({ offset: scrollOffsetRef.current, animated: false });

//       setData((prevData) => [...prevData, ...newItems]);
//       setLoading(false);
//     }, 500);
//   };

//   const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
//   };

//   const onEndReached = () => {
//     handleLoadMore();
//   };

//   const renderItem: FlatListProps<Item>['renderItem'] = ({ item }) => (
//     <View
//       style={{
//         width: 100,
//         height: 100,
//         marginHorizontal: 10,
//         backgroundColor: 'lightblue',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       <Text>{item.title}</Text>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, paddingTop: 100 }}>
//       <FlatList
//         ref={listRef}
//         data={data}
//         horizontal
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         onScroll={onScroll}
//         scrollEventThrottle={16}
//         showsHorizontalScrollIndicator={false}
//         onEndReached={onEndReached}
//         onEndReachedThreshold={0.5} // 0.5 = Load when scrolled 50% near end
//       />
//     </View>
//   );
// }



import React, { Fragment, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, TouchableOpacity, View } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import Octicons from "react-native-vector-icons/Octicons"
import Typography from './src/components/typography'
import { colors } from './src/theme/colors'
import { SvgXml } from 'react-native-svg'
import { savedinactive, savedactive, notificationactive } from './src/assets/icons/bottomtab'
import TextField from './src/components/textfield'
import { filtericon } from './src/assets/icons/outline'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from './src/utils/linking'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomNavigation from './src/components/bottomnavigation'
import { getcategories, getrecipes, saverecipe, unsaverecipe } from './src/service'
import { useAppSelector } from './src/hooks/useAppSelector'
import BottomSheet from './src/components/bottomsheet'
import RNImage from './src/components/rnimage'
import { IRatings, ISaves, IRecipesProps } from './src/screens/app/dashboard/dashboard'
import Button from './src/components/button'
import TostMessage, { ToasterProps } from './src/components/toastmessage'
import { QueryString } from './src/utils/querystring'
import { hexToRgb } from './src/utils/hexToRgb'
import { removeDuplicateObject } from './src/utils/removeduplicate'

const App = () => {
  const FlatListRef = useRef<FlatList>(null);
  const scrollOffsetRef = useRef(0);
  const [toaster, setToaster] = useState<ToasterProps>({ message: "", variant: "success", visible: false });
  const [activeFilter, setActiveFilter] = useState("All");
  const [visible, setVisible] = useState<true | false>(false);
  const [recipes, setRecipes] = useState<IRecipesProps[]>([]);
  const [filter, setFilter] = useState<{ time: string, rate: string, category: string }>({ time: "All", rate: "All", category: "All" });
  const [onSaving, seOnSaving] = useState<string>("");
  const [isLoading, setIsLoading] = useState<true | false>(false);
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
  })

  const _query = QueryString({
    ...(filter.time !== "All" && {
      filter: filter.time
    }),
    ...(filter.rate !== "All" && {
      ratingFilter: filter.rate
    }),
    currentPage: recipeSummary.currentPage,
    pageSize: recipeSummary.pageSize,
  });

  useEffect(() => {
    (async () => {
      if (isLoading) return
      setIsLoading(true)
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
          FlatListRef.current?.scrollToOffset({ offset: scrollOffsetRef.current, animated: false });
        })
    })()
  }, [_query]);

  const removeduplicate = removeDuplicateObject<IRecipesProps>(recipes);
  return (
    <FlatList
      ref={FlatListRef}
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
                    4
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

                    }} activeOpacity={.5} style={{ backgroundColor: colors.common.white, width: 32, height: 32, borderRadius: (32 / 2), alignItems: "center", justifyContent: "center" }}>
                      {onSaving === item._id ?
                        <ActivityIndicator size={"small"} color={colors.primary.main} />
                        :
                        <SvgXml xml={savedactive} />
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
      scrollEventThrottle={10}
      onEndReached={() => {
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
        })
      }}
      onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.x;
      }}
    />
  );
}

export default App;
