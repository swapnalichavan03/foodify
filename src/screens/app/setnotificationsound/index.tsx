import React, { Fragment, useEffect, useState } from 'react';
import Header from '../../../components/header';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { playSampleSound, getDefaultNotificationSound, getNotificationSound, SOUNDTYPE } from "../../../modules/notificationsound"
import { type Sound } from "../../../modules/notificationsound/notificationsound"
import Typography from '../../../components/typography';
import { colors } from '../../../theme/colors';
import { hexToRgb } from '../../../utils/hexToRgb';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { RootState } from '../../../store';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../utils/linking';
import { setNotificationSound } from '../../../store/reducers/notificationsound';
import { StorageManager } from '../../../helpers/localstorage/StorageManager';

type routeProp = RouteProp<RootStackParamList, "aap/notification/sound">
const SetNotificationSound = () => {
  const route = useRoute<routeProp>()
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { notification } = useAppSelector((state: RootState) => state.notificationsound)
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isSelected, setIsSelected] = useState<Sound | null>(null)


  const getAllSound = async () => {
    await getNotificationSound()
      .then((response) => {
        if (Array.isArray(response)) {
          setSounds(response)
        }
      })
      .catch((error) => {
        console.log("error.getsound", error)
      })
      .finally(() => {

      })
  }
  const getDeafultSound = async () => {
    await getDefaultNotificationSound()
      .then((response) => {
        setIsSelected({ title: "", soundID: "", url: response as string })
      })
      .catch((error) => {
        console.log("error.getsound", error)
      })
      .finally(() => {

      })
  }

  useEffect(() => {
    getAllSound();
    getDeafultSound();
  }, []);

  const onSetSound = (sound: Sound) => {
    setIsSelected(sound);
    playSampleSound(sound);
    const data = {
      notification: {
        notification: notification.notification,
        sound: {
          recipe: {
            notification: notification.sound.recipe.notification,
            vibrate: notification.sound.recipe.vibrate,
            sound: route.params.notification === "Recipe" ? sound.url : notification.sound.recipe.sound,
          },
          follower: {
            notification: notification.sound.follower.notification,
            vibrate: notification.sound.follower.notification,
            sound: route.params.notification === "Follower" ? sound.url : notification.sound.recipe.sound,
          }
        }
      }
    }
    dispatch(setNotificationSound({
      sound: data
    }))
    StorageManager.setNotificationSetting(data)
  }

  return (
    <Fragment>
      <Header
        isBack
        title='Notification Sound'
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: hexToRgb(colors.grey[300], .3)
        }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom || 10,
          paddingTop: 10,
        }}
        data={sounds}
        renderItem={({ item: sound, }: { item: Sound }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onSetSound(sound)
              }} activeOpacity={.60} style={{ gap: 10, flex: 1, display: "flex", flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
              <Ionicons name={isSelected?.url === sound.url ? 'radio-button-on' : 'radio-button-off'} size={25} color={isSelected?.url === sound.url ? colors.primary.main : colors.grey[800]} />
              <Typography variant="MediumTextSemiBold" color={isSelected?.url === sound.url ? colors.primary.main : colors.grey[800]} >
                {sound.title}
              </Typography>
            </TouchableOpacity>
          )
        }}
        ItemSeparatorComponent={() => {
          return (
            <View style={{ height: 1, width: '100%', backgroundColor: colors.grey[400] }} />
          )
        }}
      />
    </Fragment>
  );
}

export default SetNotificationSound;
