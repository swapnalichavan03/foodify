import React, { Fragment, useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { SvgXml } from 'react-native-svg';
import { readnotificationicon, unreadnotificationicon } from '../../../assets/icons/notification';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../utils/linking';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../components/header';
import { INotification } from './notification';
import { QueryString } from '../../../utils/querystring';
import { getnotifications, readnotification } from '../../../service';
import { removeDuplicateObject } from '../../../utils/removeduplicate';
import { colors } from '../../../theme/colors';
import Typography from '../../../components/typography';
import Button from '../../../components/button';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "app/notification">
const Notification = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProps>();
  const [activeTab, setActiveTab] = useState<"All" | "Read" | "Unread">("All");
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [isLoading, setIsLoading] = useState<true | false>(false)
  const [totalPage, setTotalPage] = useState(0);
  const [pagination, setPagination] = useState<{ currentPage: number, pageSize: number, }>({
    currentPage: 1,
    pageSize: 20,
  });

  const _query = QueryString({
    ...pagination,
    ...(activeTab !== "All" && {
      type: activeTab === "Read" ? "READ" : "UNREAD"
    })
  });

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await getnotifications(_query)
        .then((response) => {
          if (response?.status === 200) {
            if (!Array(response?.data?.data)) return
            const removeduplicate = removeDuplicateObject<INotification>(notifications)
            setNotifications([...removeduplicate, ...response?.data?.data])
            setTotalPage(response?.data?.totalPage)
          }
        })
        .catch((error) => {
          console.log("error.getreviewa", error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    })()
  }, [pagination.currentPage, activeTab]);

  const setTab = (tab: "All" | "Read" | "Unread") => {
    setActiveTab(tab);
    setIsLoading(true)
    setNotifications([])
    setPagination({ ...pagination, currentPage: 1, pageSize: pagination.pageSize })
  }

  const readNotificationv = async (_notification: string) => {
    await readnotification(_notification)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const removeduplicate = removeDuplicateObject<INotification>(notifications)
  return (
    <Fragment>
      <Header
        isBack
        title='Notifications'
      />
      <View style={{ paddingHorizontal: 20, paddingVertical: 10, display: "flex", alignItems: "center", flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <Button onPress={() => { setTab("All"); setPagination({ ...pagination, currentPage: 1, pageSize: 20 }) }} variant={activeTab === "All" ? "contain" : "text"} size="tab">All</Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button onPress={() => { setTab("Read"); setPagination({ ...pagination, currentPage: 1, pageSize: 20 }) }} variant={activeTab === "Read" ? "contain" : "text"} size="tab">Read</Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button onPress={() => { setTab("Unread"); setPagination({ ...pagination, currentPage: 1, pageSize: 20 }) }} variant={activeTab === "Unread" ? "contain" : "text"} size="tab">Unread</Button>
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
        data={removeduplicate}
        renderItem={({ item }: { item: INotification }) => {
          return (
            <Fragment>
              <TouchableOpacity onPress={() => {
                if (item.category === "NEWFOLLOWER") {
                  navigation.navigate({ name: "user/profile", params: { _user: item?._sender?._id as string } })
                } else if (item.category === "NEWRECIPE") {
                  navigation.navigate({ name: "recipe/details", params: { _recipe: item._recipe._id as string, _user: item._recipe._creator as string } })
                } else if (item.category === "SAVEDRECIPE") {
                  navigation.navigate({ name: "recipe/details", params: { _recipe: item._recipe._id as string, _user: item._recipe._creator as string } })
                }
                readNotificationv(item?._id)
              }}
                activeOpacity={.7} style={{ padding: 15, display: "flex", flexDirection: "row", gap: 15, borderRadius: 12, backgroundColor: colors.neturalcolour.gray_4 }}>
                <View style={{ flex: 1, gap: 10 }}>
                  <Typography variant="SmallerTextBold">{item.title}</Typography>
                  <Typography numberOfLines={2} variant="SmallerTextRegular" color={colors.neturalcolour.gray_2}>
                    {item.category === "NEWFOLLOWER" && `${item._sender.customerName} is following you.`}
                    {item.category === "NEWRECIPE" && `${item._sender.customerName} posted new recipe.`}
                  </Typography>
                  <Typography numberOfLines={1} variant="SmallerTextRegular" color={colors.neturalcolour.gray_2}>{moment(item.createdAt).fromNow()}</Typography>
                </View>
                <View style={{}}>
                  <SvgXml xml={item.isRead ? readnotificationicon : unreadnotificationicon} />
                </View>
              </TouchableOpacity>
            </Fragment>
          )
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 15, paddingTop: 10, paddingBottom: insets.bottom || 10 }}
        ListFooterComponent={() => {
          return (
            isLoading && (
              <View style={{ gap: 10 }}>
                {Array.from({ length: 1 }).map((_, index) => {
                  return (
                    <TouchableOpacity key={index} activeOpacity={.7} style={{ padding: 15, display: "flex", flexDirection: "row", gap: 15, borderRadius: 12, backgroundColor: colors.neturalcolour.gray_4 }}>
                      <View style={{ flex: 1, gap: 10 }}>
                        <View style={{ height: 10, width: 150, borderRadius: 8, backgroundColor: colors.grey[400] }} />
                        <View style={{ height: 8, width: 140, borderRadius: 8, backgroundColor: colors.grey[400] }} />
                        <View style={{ height: 8, width: 80, borderRadius: 8, backgroundColor: colors.grey[400] }} />
                      </View>
                      <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.grey[400] }} />
                    </TouchableOpacity>
                  )
                })}
              </View>
            )
          )
        }}
      />
      {/* <BottomNavigation /> */}
    </Fragment>
  )
}

export default Notification


