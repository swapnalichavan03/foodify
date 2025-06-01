import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, TouchableOpacity, View } from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../../../theme/colors';
import Typography from '../../../../../components/typography';
import { usersearch } from '../../../../../service';
import { IUsers } from '../../searchrecipe';
import { QueryString } from '../../../../../utils/querystring';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { RootState } from '../../../../../store';
import { useDebounce } from '../../../../../hooks/useDebounce';
import { removeDuplicateObject } from '../../../../../utils/removeduplicate';
import { RootStackParamList } from '../../../../../utils/linking';
import TextField from '../../../../../components/textfield';
import Avatar from '../../../../../components/avatar';
import moment from 'moment';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "recipe/search">

const Peoples = () => {
  const { debounce } = useDebounce();
  const insets = useSafeAreaInsets();
  const { profile } = useAppSelector((state: RootState) => state.userprofile);
  const navigation = useNavigation<NavigationProps>();
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<IUsers[]>([]);
  const [isLoading, setIsLoading] = useState<true | false>(true)
  const [totalPage, setTotalPage] = useState(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [pagination, setPagination] = useState<{ currentPage: number, pageSize: number, }>({
    currentPage: 1,
    pageSize: 20,
  });

  const _query = QueryString({
    ...pagination,
    ...(search && { query: search })
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await usersearch(_query)
        .then((response) => {
          if (response.status === 200) {
            if (!Array.isArray(response.data.data) && response.data.data.length === 0) return
            setUsers([...users, ...response.data.data]);
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

  const handleSearch = useCallback(debounce(inputVal => { setIsLoading(true); setUsers([]); setSearch(inputVal) }, 500), []);

  const removeduplicate = removeDuplicateObject<IUsers>(users)
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
                <Pressable onPress={() => { setUsers([]), setInputValue(""), handleSearch("") }}>
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
        renderItem={({ item, index }: { item: IUsers, index: number }) => {

          return (
            <Fragment>
              <TouchableOpacity onPress={() => { navigation.navigate({ name: "user/profile", params: { _user: item._id } }) }} activeOpacity={.7} style={{ overflow: "hidden", flex: 1, borderRadius: 12, display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                <Avatar
                  source={{ uri: item.assets.profileImage }}
                  width={55}
                  height={55}
                  alt={item.customerName}
                />
                <View>
                  <Typography variant="MediumTextRegular">{item.customerName}</Typography>
                  <Typography variant="SmallTextRegular" color={colors.grey[400]}>
                    {item.basic_info?.header ?
                      item.basic_info?.header
                      :
                      item.basic_info?.location ?
                        item.basic_info?.location
                        :
                        moment(item.createdAt).format("ddd, DD MMM YYYY")
                    }
                  </Typography>
                </View>
              </TouchableOpacity>
            </Fragment>
          )
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom || 20, gap: 0 }}
        ItemSeparatorComponent={() => {
          return (
            <View style={{ height: 1, backgroundColor: colors.grey[300], marginVertical: 10 }} />
          )
        }}
        ListFooterComponent={() => {
          return isLoading && (
            <View style={{paddingTop: 10}}>
              {Array.from({ length: 1 }).map((_, index) => {
                return (
                  <View key={index} style={{ borderTopColor: colors.grey[300], borderTopWidth: 1, borderStyle: "solid", }}>
                    <View style={{ paddingVertical: 10, overflow: "hidden", flex: 1, borderRadius: 12, display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
                      <View style={{ backgroundColor: colors.grey[300], alignItems: "center", justifyContent: "center", width: 55, height: 55, borderRadius: (55 / 2) }}>
                        <ActivityIndicator size={"small"} color={colors.primary.dark} />
                      </View>
                      <View style={{gap: 5}}>
                        <View style={{ height: 15, width: 180, borderRadius: (15 /2), backgroundColor: colors.grey[300] }} />
                        <View style={{ height: 10, width: 150, borderRadius: (10 /2), backgroundColor: colors.grey[300] }} />
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>
          )
        }}
      />
    </Fragment>
  );
}

export default Peoples;
